import { connectDB } from "@/lib/mongodb";
import { Question } from "@/lib/dbWrapper";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    // Fetch all questions, sorted by newest first
    const questions = await Question.find().sort({ createdAt: -1 });

    return Response.json(questions);
  } catch (error: any) {
    console.error("Fetch questions error:", error);
    return Response.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { title, isAnonymous } = body;

    if (!title || !title.trim()) {
      return Response.json(
        { error: "Question title is required" },
        { status: 400 }
      );
    }

    const question = await Question.create({
      title: title.trim(),
      authorId: session.userId,
      authorName: session.username,
      isAnonymous: typeof isAnonymous === "boolean" ? isAnonymous : true,
    });

    return Response.json(question);
  } catch (error: any) {
    console.error("Create question error:", error);
    return Response.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}