import { connectDB } from "@/lib/mongodb";
import { Question } from "@/lib/dbWrapper";
import { getAuthSession } from "@/lib/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: Request, { params }: Params) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const question = await Question.findById(id);
    if (!question) {
      return Response.json({ error: "Question not found" }, { status: 404 });
    }

    // Ownership check
    if (!question.authorId || question.authorId.toString() !== session.userId) {
      return Response.json(
        { error: "Forbidden: You are not the author of this question" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, isAnonymous } = body;

    if (title !== undefined) {
      if (!title || !title.trim()) {
        return Response.json(
          { error: "Question title cannot be empty" },
          { status: 400 }
        );
      }
      question.title = title.trim();
    }

    if (isAnonymous !== undefined) {
      question.isAnonymous = !!isAnonymous;
    }

    await question.save();

    return Response.json(question);
  } catch (error: any) {
    console.error("Update question error:", error);
    return Response.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const question = await Question.findById(id);
    if (!question) {
      return Response.json({ error: "Question not found" }, { status: 404 });
    }

    // Ownership check
    if (!question.authorId || question.authorId.toString() !== session.userId) {
      return Response.json(
        { error: "Forbidden: You are not the author of this question" },
        { status: 403 }
      );
    }

    await Question.findByIdAndDelete(id);

    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Delete question error:", error);
    return Response.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
