"use client"

import { useState } from "react"

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null)

  const images = [
    "a1.jpg",
    "a2.jpg",
    "a3.jpg",
    "a4.jpg",
    "a5.jpg",
    "a6.jpg",
    "a7.jpg",
    "a8.jpg",
    "a9.jpg",
    "a10.jpg",
    "a11.jpg",
    "a12.jpg",
    "a13.jpg",
    "a14.jpg",
    "a15.jpg",
    "a16.jpg",
    "a17.jpg",
    "a18.jpg",
    "a19.jpg",
    "a20.jpg",
    "a21.jpg",
    

    
  ]

  return (
    <section className="gallery-section">
      <div className="gallery-container">

        <h1>Our Gallery</h1>
        <p className="subtitle">
          Moments of hope, support, and community impact.
        </p>

        <div className="gallery-grid">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Gallery"
              onClick={() => setSelectedImage(img)}
            />
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
