export default function About() {
  return (
    <section className="about-section">
      <div className="about-container">

        {/* Hero */}
        <div className="about-hero">
          <h1>About OJAL Foundation</h1>
          <p>
            Bringing hope, dignity, and financial support to families in need.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="about-mv">
          <div className="mv-box">
            <h2>Our Mission</h2>
            <p>
              To provide financial assistance and essential support to
              underprivileged families and individuals facing hardship.
            </p>
          </div>

          <div className="mv-box">
            <h2>Our Vision</h2>
            <p>
              A society where no family struggles alone and every individual
              has access to basic financial and social support.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="about-story">
          <h2>Our Story</h2>
          <p>
            OJAL Foundation was created with a simple belief — even a small
            contribution can change someone’s life. We work closely with local
            communities to identify families in urgent need and provide them
            with timely financial help.
          </p>
        </div>

        {/* Values */}
        <div className="about-values">
          <h2>Our Core Values</h2>
          <ul>
            <li>✔ Transparency</li>
            <li>✔ Integrity</li>
            <li>✔ Compassion</li>
            <li>✔ Community First</li>
          </ul>
        </div>

        {/* Meet The Team */}
<div className="about-team">
  <h2>Meet Our Team</h2>

  <div className="team-grid">

    <div className="team-card">
      <img src="director.jpg" alt="Founder" />
      <h3>Amar Shinde</h3>
      <p className="role">Founder & Director</p>
      <p>
        Passionate about using technology and compassion to create real-world
        impact for families in need.
      </p>
    </div>

    <div className="team-card">
      <img src="codirector.jpg" alt="Coordinator" />
      <h3>Program Coordinator</h3>
      <p className="role">Co Director</p>
      <p>
        Ensures funds reach the right people and oversees community outreach programs.
      </p>
    </div>

    
  </div>
</div>


        {/* CTA */}
        <div className="about-cta">
          <h3>Be a part of the change</h3>
          <a href="/donate" className="cta-btn">Donate Now</a>
        </div>

      </div>
    </section>
  )
}
