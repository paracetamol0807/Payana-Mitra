"use client";
import { FormEvent, useState } from "react";

const prompts = [
  [
    "A weekend in the hills",
    "Plan a quiet 3-day getaway to Coorg with good food and gentle walks.",
  ],
  [
    "A food-first escape",
    "Find a 4-day Jaipur itinerary for two people who love local food.",
  ],
  [
    "Something completely new",
    "I have 7 days in Kerala. I want nature, slow mornings, and no resorts.",
  ],
  [
    "Plan around my budget",
    "A 5-day trip to Goa for a couple under ₹50,000, including transport ideas.",
  ],
];

export default function Dashboard() {
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);
  function submit(e: FormEvent) {
    e.preventDefault();
    if (value.trim()) setSent(true);
  }
  return (
    <main className="dashboard">
      <aside className="sidebar">
        <a className="brand" href="/">
          <img
            className="brand-logo-sidebar"
            src="/brand/payana-mitra-logo.png"
            alt="Payana"
          />
        </a>
        <div className="side-label">Workspace</div>
        <a className="side-link active" href="#chat">
          New trip
        </a>
        <a className="side-link" href="#trips">
          My trips <span style={{ float: "right", opacity: 0.6 }}>3</span>
        </a>
        <a className="side-link" href="#saved">
          Saved places
        </a>
        <div className="side-label">Your account</div>
        <a className="side-link" href="#preferences">
          Travel preferences
        </a>
        <a className="side-link" href="#profile">
          Profile
        </a>
        <div className="side-bottom">
          <p>Good morning, Aarav</p>
        </div>
      </aside>
      <section className="main">
        <header className="topbar">
          <div>
            <h1>New trip</h1>
            <small>Let’s find somewhere worth going.</small>
          </div>
          <div className="profile">
            <img
              className="avatar"
              src="/avatars/default-avatar.png"
              alt="Aarav Sharma"
            />
            <span>Aarav Sharma</span>
          </div>
        </header>
        <div className="chat-wrap" id="chat">
          {!sent ? (
            <>
              <div className="chat-intro">
                <div className="eyebrow">Your travel desk</div>
                <h2>Where will you go next?</h2>
                <p>
                  Tell us a little about the trip on your mind. We’ll take care
                  of the shape of it.
                </p>
              </div>
              <div className="suggestions">
                {prompts.map(([label, prompt]) => (
                  <button
                    className="suggestion"
                    key={label}
                    onClick={() => setValue(prompt)}
                  >
                    <span>{label}</span>
                    {prompt}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="chat-intro">
              <img
                className="chat-illustration"
                src="/illustrations/fallback-state.png"
                alt="A travel map ready for planning"
              />
              <div className="eyebrow">Your trip is taking shape</div>
              <h2>That sounds like a good one.</h2>
              <p>
                Your assistant is ready to turn this into a day-by-day plan.
                This preview will become your live conversation once the AI
                connection is enabled.
              </p>
            </div>
          )}
          <form className="composer" onSubmit={submit}>
            <div className="composer-inner">
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Describe your next trip..."
                aria-label="Describe your next trip"
              />
              <button aria-label="Send prompt" type="submit">
                ↑
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
