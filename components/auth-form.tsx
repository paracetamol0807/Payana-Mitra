"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const isSignup = mode === "signup";
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("Authentication will be connected in the next setup step.");
    setTimeout(() => router.push("/dashboard"), 900);
  }
  return (
    <main className="auth-shell">
      <section className="auth-art">
        <Link href="/" className="brand">
          <img
            className="auth-emblem"
            src="/brand/payana-mitra-emblem.png"
            alt="Payana"
          />
          <span>payana</span>
        </Link>
        <div>
          <div className="eyebrow" style={{ color: "#a7c5b6" }}>
            A better trip is a conversation
          </div>
          <h1>Leave room for the places that stay with you.</h1>
          <p>
            Personalized journeys, shaped around your pace, your people, and
            your curiosity.
          </p>
        </div>
        <small style={{ color: "#a7c5b6", fontSize: "11px" }}>
          © 2026 Payana Mitra
        </small>
      </section>
      <section className="auth-form-wrap">
        <div className="auth-card">
          <Link href="/" className="brand">
            <img
              className="brand-logo brand-logo-small"
              src="/brand/payana-mitra-logo.png"
              alt="Payana"
            />
          </Link>
          <h2>{isSignup ? "Let’s make a trip." : "Welcome back."}</h2>
          <p>
            {isSignup
              ? "Create your account and we’ll start with the way you travel."
              : "Pick up where your next journey left off."}
          </p>
          <form onSubmit={submit}>
            <label className="form-field">
              Your name
              <input required name="name" placeholder="Aarav Sharma" />
            </label>
            <label className="form-field">
              Email address
              <input
                required
                type="email"
                name="email"
                placeholder="you@example.com"
              />
            </label>
            <label className="form-field">
              Password
              <input
                required
                type="password"
                name="password"
                placeholder="At least 8 characters"
                minLength={8}
              />
            </label>
            {!isSignup && (
              <div className="form-row">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#">Forgot password?</a>
              </div>
            )}
            {error && (
              <p
                style={{
                  color: "var(--sun)",
                  fontSize: "12px",
                  marginTop: "18px",
                }}
              >
                {error}
              </p>
            )}
            <button className="btn btn-primary auth-submit" type="submit">
              {isSignup ? "Create account" : "Log in"}
            </button>
          </form>
          <div className="auth-switch">
            {isSignup ? "Already have an account? " : "New to Payana? "}
            <Link href={isSignup ? "/login" : "/signup"}>
              {isSignup ? "Log in" : "Create an account"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
