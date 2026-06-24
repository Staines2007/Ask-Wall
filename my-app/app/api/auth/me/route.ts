import { getAuthSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session) {
      return Response.json({ authenticated: false });
    }
    return Response.json({ authenticated: true, user: session });
  } catch (error: any) {
    console.error("Session check error:", error);
    return Response.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
