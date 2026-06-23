import { connectDB } from "@/lib/mongodb";
import Question from "@/models/Questions";

export async function GET() {
  await connectDB();

  const questions = await Question.find();

  return Response.json(questions);
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const question = await Question.create({
    title: body.title,
  });

  return Response.json(question);
}