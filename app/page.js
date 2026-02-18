export default function Home() {
  return (
    <main style={{ backgroundColor: "#f5f8ff" }}>

      {/* HERO SECTION */}
      <section style={heroSection}>
        <div style={overlay}></div>

        <div style={heroContent}>
          <h1 style={heroTitle}>
            Helping Hearts, Changing Lives
          </h1>

          <p style={heroSubtitle}>
            Financial support for families in need. Empowering women. 
            Creating opportunities. Building hope.
          </p>

          <div style={heroButtons}>
            <a href="/volunteer" style={primaryBtn}>Become Volunteer</a>
            <a href="/donate" style={secondaryBtn}>Donate Now</a>
            <a href="/about" style={outlineBtn}>Learn More</a>
          </div>
        </div>
      </section>


      {/* PROGRAMS SECTION */}
      <section style={section}>
  <h2 style={sectionTitle}>Our Key Programs</h2>

  <div style={cardGrid}>

    <div style={card}>
      <h3>💰 Emergency Financial Aid</h3>
      <p>Immediate assistance for families facing medical emergencies, rent crises, and essential living needs.</p>
    </div>

    <div style={card}>
      <h3>👩 Women Empowerment</h3>
      <p>Skill development, entrepreneurship support, and financial literacy training for women.</p>
    </div>

    <div style={card}>
      <h3>🎓 Child Education Support</h3>
      <p>Scholarships, school supplies, and mentoring programs for underprivileged children.</p>
    </div>

    <div style={card}>
      <h3>🏪 Micro-Business Funding</h3>
      <p>Seed funding and mentorship for small vendors and low-income entrepreneurs.</p>
    </div>

    <div style={card}>
      <h3>🏥 Medical Support Programs</h3>
      <p>Helping families with hospital expenses and critical treatment support.</p>
    </div>

    <div style={card}>
      <h3>🤝 Community Welfare Drives</h3>
      <p>Food distribution, awareness campaigns, and social welfare initiatives.</p>
    </div>

  </div>
</section>



      {/* IMPACT SECTION */}
      <section style={impactSection}>
  <h2 style={whiteTitle}>Our Impact So Far</h2>

  <div style={impactGrid}>

    <div>
      <h3 style={impactNumber}>500+</h3>
      <p>Families Supported</p>
    </div>

    <div>
      <h3 style={impactNumber}>100+</h3>
      <p>Women Empowered</p>
    </div>

    <div>
      <h3 style={impactNumber}>20+</h3>
      <p>Community Programs Conducted</p>
    </div>

    <div>
      <h3 style={impactNumber}>₹15L+</h3>
      <p>Funds Distributed</p>
    </div>

    <div>
      <h3 style={impactNumber}>200+</h3>
      <p>Volunteers Engaged</p>
    </div>

  </div>
</section>


      {/* CALL TO ACTION */}
      <section style={ctaSection}>
        <h2 style={sectionTitle}>Be Part of the Change</h2>
        <p style={{ marginBottom: "20px" }}>
          Your support can transform someone's future today.
        </p>

        <a href="/donate" style={primaryBtn}>Support Now</a>
      </section>

    </main>
  )
}


/* ---------------- STYLES ---------------- */

const heroSection = {
  position: "relative",
  height: "90vh",
  backgroundImage: "url('c.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  color: "#fff"
}

const overlay = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(81, 10, 80, 0.7)"
}

const heroContent = {
  position: "relative",
  maxWidth: "800px",
  padding: "20px"
}

const heroTitle = {
  fontSize: "48px",
  fontWeight: "bold",
  marginBottom: "20px"
}

const heroSubtitle = {
  fontSize: "18px",
  marginBottom: "30px"
}

const heroButtons = {
  display: "flex",
  gap: "15px",
  justifyContent: "center",
  flexWrap: "wrap"
}

const primaryBtn = {
  backgroundColor: "#ff8c42",
  color: "#fff",
  padding: "12px 25px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "bold"
}

const secondaryBtn = {
  backgroundColor: "#ffffff",
  color: "#510a50",
  padding: "12px 25px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "bold"
}

const outlineBtn = {
  border: "2px solid #fff",
  color: "#fff",
  padding: "12px 25px",
  borderRadius: "6px",
  textDecoration: "none"
}

const section = {
  padding: "80px 20px",
  textAlign: "center"
}

const sectionTitle = {
  fontSize: "32px",
  color: "#510a50",
  marginBottom: "40px"
}

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "25px",
  maxWidth: "1000px",
  margin: "0 auto"
}

const card = {
  backgroundColor: "#fff",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.05)"
}

const impactSection = {
  backgroundColor: "#510a50",
  color: "#fff",
  padding: "80px 20px",
  textAlign: "center"
}

const whiteTitle = {
  fontSize: "32px",
  marginBottom: "40px"
}

const impactGrid = {
  display: "flex",
  justifyContent: "center",
  gap: "60px",
  flexWrap: "wrap"
}

const impactNumber = {
  fontSize: "40px",
  fontWeight: "bold",
  color: "#ff8c42"
}

const ctaSection = {
  padding: "80px 20px",
  textAlign: "center"
}
