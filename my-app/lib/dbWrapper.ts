import UserMongoose from "@/models/User";
import QuestionMongoose from "@/models/Questions";
import { connectDB, shouldUseInMemory } from "./mongodb";

// In-memory data store for sandboxed offline testing
let usersTable: any[] = [];
let questionsTable: any[] = [];

// Helper to generate IDs
const generateId = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

export const User = {
  findOne: async (query: any) => {
    await connectDB();
    if (shouldUseInMemory()) {
      if (query.username && query.username.$regex) {
        const regex = query.username.$regex as RegExp;
        const found = usersTable.find((u) => regex.test(u.username));
        return found || null;
      }
      const usernameLower = String(query.username).toLowerCase();
      const found = usersTable.find(
        (u) => u.username.toLowerCase() === usernameLower
      );
      return found || null;
    }
    return UserMongoose.findOne(query);
  },
  create: async (data: any) => {
    await connectDB();
    if (shouldUseInMemory()) {
      const newUser = {
        _id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      usersTable.push(newUser);
      return newUser;
    }
    return UserMongoose.create(data);
  },
};

export const Question = {
  find: () => {
    const chain = {
      sort: async (sortQuery: any) => {
        await connectDB();
        if (shouldUseInMemory()) {
          const sorted = [...questionsTable];
          // Default sorts by newest first
          sorted.sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
          return sorted;
        }
        return QuestionMongoose.find().sort(sortQuery);
      },
    };
    return chain;
  },
  create: async (data: any) => {
    await connectDB();
    if (shouldUseInMemory()) {
      const newQuestion = {
        _id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      questionsTable.push(newQuestion);
      return newQuestion;
    }
    return QuestionMongoose.create(data);
  },
  findById: async (id: string) => {
    await connectDB();
    if (shouldUseInMemory()) {
      const q = questionsTable.find((item) => item._id === id);
      if (!q) return null;
      return {
        ...q,
        // Make sure fields are accessible directly on return object
        title: q.title,
        authorId: q.authorId,
        authorName: q.authorName,
        isAnonymous: q.isAnonymous,
        save: async function (this: any) {
          const index = questionsTable.findIndex((item) => item._id === id);
          if (index !== -1) {
            questionsTable[index] = {
              ...questionsTable[index],
              title: this.title,
              isAnonymous: this.isAnonymous,
              updatedAt: new Date().toISOString(),
            };
          }
          return questionsTable[index];
        },
      };
    }
    return QuestionMongoose.findById(id);
  },
  findByIdAndDelete: async (id: string) => {
    await connectDB();
    if (shouldUseInMemory()) {
      const index = questionsTable.findIndex((item) => item._id === id);
      if (index !== -1) {
        questionsTable.splice(index, 1);
      }
      return { success: true };
    }
    return QuestionMongoose.findByIdAndDelete(id);
  },
};
