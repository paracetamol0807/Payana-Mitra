"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const prompts = [
  ["A weekend in the hills", "Plan a quiet 3-day getaway to Coorg with good food and gentle walks."],
  ["A food-first escape", "Find a 4-day Jaipur itinerary for two people who love local food."],
  ["Something completely new", "I have 7 days in Kerala. I want nature, slow mornings, and no resorts."],
  ["Plan around my budget", "A 5-day trip to Goa for a couple under ₹50,000, including transport ideas."],
];

type ChatMessage = { id: string; role: "user" | "assistant"; content: string };
type TripSummary = { id: string; title: string; lastMessage: string | null; updatedAt: string };

export default function Dashboard({ userName, userImage }: { userName: string; userImage?: string | null }) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const conversationId = useRef<string | undefined>(undefined);
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const firstName = userName.split(" ")[0];

  useEffect(() => {
    fetch("/api/chat")
      .then((response) => (response.ok ? response.json() : { conversations: [] }))
      .then((data) => setTrips(data.conversations ?? []))
      .catch(() => setTrips([]));
  }, []);

  async function openTrip(trip: TripSummary) {
    const response = await fetch(`/api/chat?conversationId=${trip.id}`);
    if (!response.ok) return;
    const data = await response.json();
    conversationId.current = trip.id;
    setMessages(
      (data.messages ?? [])
        .filter((m: { role: string }) => m.role === "user" || m.role === "assistant")
        .map((m: ChatMessage) => ({ id: m.id, role: m.role, content: m.content })),
    );
  }

  function newTrip() {
    conversationId.current = undefined;
    setMessages([]);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const text = value.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    const assistantId = crypto.randomUUID();
    setMessages((current) => [...current, userMessage, { id: assistantId, role: "assistant", content: "" }]);
    setValue("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, conversationId: conversationId.current }),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => null);
        throw new Error(detail?.error ?? "We could not reach the travel assistant.");
      }
      conversationId.current = response.headers.get("X-Conversation-Id") ?? undefined;

      const reader = response.body?.getReader();
      if (!reader) throw new Error("The assistant sent an empty reply.");
      const decoder = new TextDecoder();
      let reply = "";
      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        reply += decoder.decode(chunk, { stream: true });
        const snapshot = reply;
        setMessages((current) => current.map((m) => (m.id === assistantId ? { ...m, content: snapshot } : m)));
      }
    } catch (caught) {
      setMessages((current) => current.filter((m) => m.id !== assistantId));
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="dashboard">
      <aside className="sidebar">
        <a className="brand" href="/"><img className="brand-logo-sidebar" src="/brand/payana-mitra-logo.png" alt="Payana" /></a>
        <div className="side-label">Workspace</div>
        <a className="side-link active" href="#chat" onClick={newTrip}>New trip</a>
        <a className="side-link" href="#trips">My trips{trips.length > 0 && <span style={{ float: "right", opacity: 0.6 }}>{trips.length}</span>}</a>
        {trips.length > 0 && <div className="trip-list">{trips.map((trip) => <button key={trip.id} className="trip-item" onClick={() => openTrip(trip)}>{trip.title}</button>)}</div>}
        <a className="side-link" href="#saved">Saved places</a>
        <div className="side-label">Your account</div>
        <a className="side-link" href="#preferences">Travel preferences</a>
        <a className="side-link" href="#profile">Profile</a>
        <div className="side-bottom">
          <p>Good day, {firstName}</p>
          <button className="side-link side-logout" onClick={logout}>Log out</button>
        </div>
      </aside>

      <section className="main">
        <header className="topbar">
          <div><h1>New trip</h1><small>Let’s find somewhere worth going.</small></div>
          <div className="profile">
            <img className="avatar" src={userImage || "/avatars/default-avatar.png"} alt={userName} />
            <span>{userName}</span>
          </div>
        </header>

        <div className="chat-wrap" id="chat">
          {messages.length === 0 ? (
            <>
              <div className="chat-intro">
                <div className="eyebrow">Your travel desk</div>
                <h2>Where will you go next?</h2>
                <p>Tell us a little about the trip on your mind. We’ll take care of the shape of it.</p>
              </div>
              <div className="suggestions">
                {prompts.map(([label, prompt]) => (
                  <button className="suggestion" key={label} onClick={() => setValue(prompt)}>
                    <span>{label}</span>{prompt}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="messages">
              {messages.map((message) => (
                <article className={`bubble ${message.role}`} key={message.id}>
                  <div className="bubble-role">{message.role === "user" ? "You" : "Payana Mitra"}</div>
                  {message.content ? <div className="bubble-text">{message.content}</div> : <div className="typing"><i /><i /><i /></div>}
                </article>
              ))}
              {error && <p className="form-error" role="alert">{error}</p>}
            </div>
          )}

          <form className="composer" onSubmit={submit}>
            <div className="composer-inner">
              <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Describe your next trip..." aria-label="Describe your next trip" />
              <button aria-label="Send prompt" type="submit" disabled={loading || !value.trim()}>{loading ? "…" : "↑"}</button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
