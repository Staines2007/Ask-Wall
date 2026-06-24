import { deleteSessionCookie } from "@/lib/auth";

export async function POST() {
  try {
    await deleteSessionCookie();
    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Logout error:", error);
    return Response.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
