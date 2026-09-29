"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={hidden ? "M3 3l18 18" : "M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"} />
      <circle cx="12" cy="12" r="2.5" />
      {hidden && <path d="M9.9 5.2A10.6 10.6 0 0112 5c6 0 9.5 7 9.5 7a17 17 0 01-3.2 3.9M6.3 6.8C3.9 8.4 2.5 12 2.5 12s3.5 7 9.5 7c1.1 0 2.1-.2 3-.5" />}
    </svg>
  );
}

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isSignup = mode === "signup";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    const result = isSignup
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password });

    if (result.error) {
      setError(result.error.message ?? "We could not complete that request.");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="auth-shell">
      <section className="auth-art">
        <Link href="/" className="brand">
          <img className="auth-emblem" src="/brand/payana-mitra-emblem.png" alt="Payana" />
          <span>payana</span>
        </Link>
        <div>
          <div className="eyebrow" style={{ color: "#C9A87E" }}>A better trip is a conversation</div>
          <h1>Leave room for the places that stay with you.</h1>
          <p>Personalized journeys, shaped around your pace, your people, and your curiosity.</p>
        </div>
        <small style={{ color: "#C9A87E", fontSize: "11px" }}>© 2026 Payana Mitra</small>
      </section>
      <section className="auth-form-wrap">
        <div className="auth-card">
          <Link href="/" className="brand">
            <img className="brand-logo brand-logo-small" src="/brand/payana-mitra-logo.png" alt="Payana" />
          </Link>
          <h2>{isSignup ? "Let’s make a trip." : "Welcome back."}</h2>
          <p>{isSignup ? "Create your account and we’ll start with the way you travel." : "Pick up where your next journey left off."}</p>
          <form onSubmit={submit}>
            {isSignup && (
              <label className="form-field">
                Your name
                <input required name="name" placeholder="Aarav Sharma" autoComplete="name" />
              </label>
            )}
            <label className="form-field">
              Email address
              <input required type="email" name="email" placeholder="you@example.com" autoComplete="email" />
            </label>
            <label className="form-field">
              Password
              <span className="password-input">
                <input required type={showPassword ? "text" : "password"} name="password" placeholder="At least 8 characters" minLength={8} autoComplete={isSignup ? "new-password" : "current-password"} />
                <button type="button" className="password-toggle" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>
                  <EyeIcon hidden={showPassword} />
                </button>
              </span>
            </label>
            {!isSignup && (
              <div className="form-row">
                <label><input type="checkbox" name="remember" /> Remember me</label>
                <a href="#">Forgot password?</a>
              </div>
            )}
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
              {loading ? "Please wait…" : isSignup ? "Create account" : "Log in"}
            </button>
          </form>
          <div className="auth-switch">
            {isSignup ? "Already have an account? " : "New to Payana? "}
            <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "Log in" : "Create an account"}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
