import "./globals.css"
import Link from "next/link"
import { FaInstagram, FaYoutube, FaFacebook, FaWhatsapp } from "react-icons/fa"
import { MdEmail } from "react-icons/md"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>

        {/* HEADER */}
        <header className="header">
          <div className="container header-wrapper">

            
<div className="logo-section" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
  <img
    src="logo.jpg"
    alt="Helping Hearts Logo"
    style={{
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      objectFit: "cover"
    }}
  />

  <div>
    <h2 style={{ margin: 0 }}>Ojal Micro Service Foundation</h2>
    <p className="tagline">Seva • Support • Empowerment</p>
  </div>
</div>





            <nav className="nav-links">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/gallery">Gallery</Link>
              <Link href="/certificates">Certificates</Link>
              <Link href="/volunteer">Volunteer</Link>
              <Link href="/donate" className="donate-btn">Donate</Link>
              <Link href="/contact">Contact Us</Link>
            </nav>

          </div>
        </header>

        <main>{children}</main>

        {/* FOOTER */}
        <footer className="footer">
          <div className="container footer-wrapper">

            <div className="footer-left">
              <h3>Helping Hearts Foundation</h3>
              <p>Empowering lives through financial assistance and social upliftment.</p>
            </div>

            

            <div className="footer-right">
              <a href="mailto:ojalmicroservicefoundation.obs@gmail.com"><MdEmail /></a>
              <a href="https://www.instagram.com/ojalmicroservicefoundation?igsh=MWx0ZW5kNGs5aDF3aA=="><FaInstagram /></a>
              <a href="https://youtube.com/@amarbaburaoshinde?si=yDPwsHdj4nT2ay-C"><FaYoutube /></a>
              <a href="https://www.facebook.com/profile.php?id=61581498303293"><FaFacebook /></a>
              <a href="91 74995 52539"><FaWhatsapp /></a>
            </div>

          </div>

          <div className="footer-bottom">
            © {new Date().getFullYear()} Helping Hearts Foundation. All rights reserved.
          </div>
        </footer>

      </body>
    </html>
  )
}
