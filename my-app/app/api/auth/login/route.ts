import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/dbWrapper";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return Response.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") },
    });

    if (!user || !verifyPassword(password, user.password)) {
      return Response.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Set session cookie
    await setSessionCookie({
      userId: user._id.toString(),
      username: user.username,
    });

    return Response.json({ success: true, username: user.username });
  } catch (error: any) {
    console.error("Login error:", error);
    return Response.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
