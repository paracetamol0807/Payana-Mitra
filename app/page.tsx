import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="container">
        <nav className="nav">
          <Link href="/" className="brand" aria-label="Payana Mitra home">
            <img
              className="brand-logo"
              src="/brand/payana-mitra-logo.png"
              alt="Payana"
            />
          </Link>
          <div className="navlinks">
            <a href="#how">How it works</a>
            <a href="#why">Why Payana</a>
            <a href="#stories">Stories</a>
          </div>
          <div className="nav-actions">
            <Link href="/login" className="login-link">
              Log in
            </Link>
            <Link href="/signup" className="btn btn-primary">
              Start planning
            </Link>
          </div>
        </nav>
      </div>
      <section className="container hero">
        <div>
          <div className="eyebrow">Your personal travel companion</div>
          <h1 className="serif">
            Go further.
            <br />
            <em>Plan smarter.</em>
          </h1>
          <p className="hero-copy">
            Payana Mitra turns the way you travel into a trip that actually
            feels like yours — thoughtful routes, local textures, and plans that
            leave room for the unexpected.
          </p>
          <div className="hero-actions">
            <Link href="/signup" className="btn btn-primary">
              Create your first trip
            </Link>
            <a href="#how" className="btn btn-secondary">
              See how it works
            </a>
          </div>
          <div className="hero-note">
            <i /> No generic lists. No crowded itineraries.
          </div>
        </div>
        <div
          className="scene"
          aria-label="A folded map and travel backpack illustration"
        >
          <img
            className="scene-illustration"
            src="/illustrations/empty-state.png"
            alt="A folded travel map beside a backpack"
          />
          <span className="route" />
          <span className="pin one" />
          <span className="pin two" />
          <span className="pin three" />
          <div className="scene-label">
            <small>Designed around you</small>
            <strong>Himalayas · 06 days</strong>
          </div>
        </div>
      </section>
      <div className="container trust">
        <span>
          For travellers who prefer <strong>meaning over checklists</strong>
        </span>
        <span>
          Built for <strong>36 curious destinations</strong>
        </span>
        <span>
          <strong>4.9/5</strong> early explorer rating
        </span>
      </div>
      <section className="container section" id="how">
        <div className="section-head">
          <div>
            <div className="eyebrow">A better way to arrive</div>
            <h2 className="serif">
              The trip starts
              <br />
              with a conversation.
            </h2>
          </div>
          <p className="section-intro">
            Tell us how you like to travel. Payana brings the context, care, and
            local knowledge to shape a plan around it.
          </p>
        </div>
        <div className="feature-grid">
          <div className="feature">
            <span className="feature-num">01 / Tell us</span>
            <h3>Your kind of trip</h3>
            <p>
              Share your dates, budget, pace, and the moments you want to
              remember.
            </p>
          </div>
          <div className="feature">
            <span className="feature-num">02 / We shape</span>
            <h3>Plans with perspective</h3>
            <p>
              Get a thoughtful itinerary shaped around your interests, not a
              recycled template.
            </p>
          </div>
          <div className="feature">
            <span className="feature-num">03 / You go</span>
            <h3>More room to wander</h3>
            <p>
              Keep the useful details close and leave the rest open for
              discovery.
            </p>
          </div>
        </div>
      </section>
      <section className="quote" id="why">
        <div className="container">
          <p>
            “The best trips are not collected. They are felt, one small decision
            at a time.”
          </p>
          <span>— The Payana principle</span>
        </div>
      </section>
      <section className="cta" id="stories">
        <div className="container cta-inner">
          <h2>Ready to travel on your terms?</h2>
          <Link href="/signup" className="btn">
            Start your journey
          </Link>
        </div>
      </section>
      <footer
        className="container"
        style={{
          padding: "28px 0",
          color: "var(--muted)",
          fontSize: "12px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>© 2026 Payana Mitra</span>
        <span>Travel thoughtfully.</span>
      </footer>
    </main>
  );
}
