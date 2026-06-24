import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/dbWrapper";
import { hashPassword, setSessionCookie } from "@/lib/auth";

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

    if (username.length < 3) {
      return Response.json(
        { error: "Username must be at least 3 characters long" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") },
    });

    if (existingUser) {
      return Response.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }

    // Create user
    const hashedPassword = hashPassword(password);
    const user = await User.create({
      username,
      password: hashedPassword,
    });

    // Set session cookie
    await setSessionCookie({
      userId: user._id.toString(),
      username: user.username,
    });

    return Response.json({ success: true, username: user.username });
  } catch (error: any) {
    console.error("Registration error:", error);
    return Response.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
