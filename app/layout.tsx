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
          <div
            className="container header-wrapper"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
              flexWrap: "nowrap",
            }}
          >

            {/* LOGO */}
            <div
              className="logo-section"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexShrink: 0,
              }}
            >
              <img
                src="/logo.jpg"
                alt="Ojal Micro Service Foundation Logo"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <div>
                <h2 style={{ margin: 0 }}>
                  Ojal Micro Service Foundation
                </h2>
                <p className="tagline">
                  Seva • Support • Empowerment
                </p>
              </div>
            </div>

            {/* NAVIGATION */}
            <nav
              className="nav-links"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "14px",
                flexWrap: "nowrap",
                whiteSpace: "nowrap",
              }}
            >
              <Link href="/">Home</Link>

              <Link href="/about">About</Link>

              <Link href="/women-entrepreneurship">
                Women Entrepreneurship
              </Link>

              <Link href="/gallery">Gallery</Link>

              <Link href="/certificates">Certificates</Link>

              <Link href="/volunteer">Volunteer</Link>

              <Link href="/donate" className="donate-btn">
                Donate
              </Link>

              <Link href="/contact">Contact Us</Link>
            </nav>

          </div>
        </header>

        <main>{children}</main>

        {/* FOOTER */}
        <footer className="footer">
          <div className="container footer-wrapper">

            <div className="footer-left">
              <h3>Ojal Micro Service Foundation</h3>
              <p>
                Empowering lives through financial assistance and social upliftment.
              </p>
            </div>

            <div className="footer-right">
              <a href="mailto:ojalmicroservicefoundation.obs@gmail.com">
                <MdEmail />
              </a>

              <a
                href="https://www.instagram.com/ojalmicroservicefoundation?igsh=MWx0ZW5kNGs5aDF3aA=="
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>

              <a
                href="https://youtube.com/@amarbaburaoshinde?si=yDPwsHdj4nT2ay-C"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube />
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61581498303293"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook />
              </a>

              <a href="tel:+917499552539">
                <FaWhatsapp />
              </a>
            </div>

          </div>

          <div className="footer-bottom">
            © {new Date().getFullYear()} Ojal Micro Service Foundation.
            All rights reserved.
          </div>
        </footer>

      </body>
    </html>
  )
}