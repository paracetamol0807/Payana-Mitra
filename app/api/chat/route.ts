import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { conversations, messages } from "@/lib/schema";
import { streamChatReply } from "@/lib/ai";

const requestSchema = z.object({
  message: z.string().trim().min(1, "Tell us about your trip.").max(4000),
  conversationId: z.string().optional(),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "You need to log in before planning a trip." }, { status: 401 });
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
  }

  const userId = session.user.id;
  const { message, conversationId } = parsed.data;

  let activeConversation = conversationId;
  if (activeConversation) {
    const existing = await db.query.conversations.findFirst({
      where: and(eq(conversations.id, activeConversation), eq(conversations.userId, userId)),
    });
    if (!existing) return NextResponse.json({ error: "Trip not found." }, { status: 404 });
  } else {
    activeConversation = crypto.randomUUID();
    await db.insert(conversations).values({ id: activeConversation, userId, title: message.slice(0, 60) });
  }
  const conversation = activeConversation;

  const history = await db
    .select({ role: messages.role, content: messages.content })
    .from(messages)
    .where(eq(messages.conversationId, conversation))
    .orderBy(messages.createdAt)
    .limit(20);

  const priorTurns = history
    .filter((entry): entry is { role: "user" | "assistant"; content: string } => entry.role === "user" || entry.role === "assistant")
    .map((entry) => ({ role: entry.role, content: entry.content }));

  const userMessage = { id: crypto.randomUUID(), conversationId: conversation, role: "user" as const, content: message };
  await db.insert(messages).values(userMessage);

  let result;
  try {
    result = await streamChatReply([...priorTurns, { role: "user", content: message }]);
  } catch (error) {
    await db.delete(messages).where(eq(messages.id, userMessage.id));
    const message_ = error instanceof Error ? error.message : "The travel assistant is unavailable right now.";
    return NextResponse.json({ error: message_ }, { status: 502 });
  }

  const [forClient, forStore] = result.stream.tee();
  const reader = forStore.getReader();
  let full = "";
  (async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += value;
      }
      if (full.trim()) {
        await db.insert(messages).values({
          id: crypto.randomUUID(),
          conversationId: conversation,
          role: "assistant",
          content: full,
          provider: result.provider,
        });
        await db.update(conversations).set({ updatedAt: new Date() }).where(eq(conversations.id, conversation));
      }
    } catch {
      // The client may disconnect before the reply is fully persisted.
    }
  })();

  return new Response(forClient, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Conversation-Id": conversation,
      "X-AI-Provider": result.provider,
    },
  });
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conversationId = new URL(request.url).searchParams.get("conversationId");
  if (conversationId) {
    const owned = await db.query.conversations.findFirst({
      where: and(eq(conversations.id, conversationId), eq(conversations.userId, session.user.id)),
    });
    if (!owned) return NextResponse.json({ error: "Trip not found." }, { status: 404 });
    const thread = await db
      .select({ id: messages.id, role: messages.role, content: messages.content })
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
    return NextResponse.json({
      conversation: owned,
      messages: thread.filter((m) => m.role !== "system"),
    });
  }

  const rows = await db
    .select({ id: conversations.id, title: conversations.title, updatedAt: conversations.updatedAt })
    .from(conversations)
    .where(eq(conversations.userId, session.user.id))
    .orderBy(desc(conversations.updatedAt))
    .limit(20);

  const list = await Promise.all(
    rows.map(async (row) => {
      const last = await db.query.messages.findFirst({
        where: eq(messages.conversationId, row.id),
        orderBy: (message, { desc: sortDesc }) => [sortDesc(message.createdAt)],
        columns: { content: true },
      });
      return { ...row, lastMessage: last?.content ?? null };
    }),
  );

  return NextResponse.json({ conversations: list });
}
