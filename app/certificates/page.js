"use client"

import { useState } from "react"

export default function Certificates() {
  const [selectedImage, setSelectedImage] = useState(null)

  const certificates = [
    {
      title: "Income Tax Certificate",
      image: "cert1.jpg",
    },
    {
      title: "e ANUDAN Certificate",
      image: "cert2.jpg",
    },
    {
      title: "Niti Ayog Certificate",
      image: "cert3.jpg",
    },
    {
      title: "CSR Certificate",
      image: "cert4.jpg",
    },
    {
      title: "US Certificate",
      image: "cert5.jpg",
    },
    {
      title: " Pan Certificate",
      image: "cert6.jpg",
    },
     {
      title: "80G Approval Certificate",
      image: "cert7.jpg",
    },
    {
      title: "  Form NO.10AC Certificate",
      image: "cert8.jpg",
    },
  ]

  return (
    <section className="certificate-section">
      <div className="certificate-container">

        <h1>Our Certifications</h1>
        <p className="subtitle">
          Transparency and legal compliance are the foundation of our trust.
        </p>

        <div className="certificate-grid">
          {certificates.map((cert, index) => (
            <div key={index} className="certificate-card">
              <img
                src={cert.image}
                alt={cert.title}
                onClick={() => setSelectedImage(cert.image)}
              />
              <h3>{cert.title}</h3>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div className="lightbox" onClick={() => setSelectedImage(null)}>
            <img src={selectedImage} alt="Preview" />
          </div>
        )}

      </div>
    </section>
  )
}
