"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Save to Supabase table `contact_messages` (create this table in Supabase)
    const { error } = await supabase.from("contact_messages").insert([formData])

    if (error) {
      alert("Error sending message")
    } else {
      alert("Thank you! We will get back to you soon 😊")
      setFormData({ name: "", email: "", phone: "", message: "" })
    }

    setLoading(false)
  }

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Contact Us</h2>
        <p style={subtitleStyle}>Have a question or suggestion? Reach out to us!</p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            style={inputStyle}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            style={textareaStyle}
            required
          />
          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div style={infoStyle}>
          <h3>Our Contact Info</h3>
          <p>Email: ojalmicroservicefoundation.obs@gmail.com</p>
          <p>Phone: +91 8830126738</p>
          <p>Address: Dighi Road, Bhosari, Pune, Maharashtra</p>
        </div>
      </div>
    </section>
  )
}

// ------------------- Styles -------------------

const sectionStyle = {
  backgroundColor: "#f5f8ff",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "60px 20px"
}

const containerStyle = {
  maxWidth: "800px",
  width: "100%",
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
}

const titleStyle = {
  textAlign: "center",
  color: "#510a50",
  marginBottom: "10px"
}

const subtitleStyle = {
  textAlign: "center",
  marginBottom: "30px",
  color: "#0d1b4c"
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  marginBottom: "30px"
}

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ddd"
}

const textareaStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  minHeight: "120px"
}

const buttonStyle = {
  backgroundColor: "#ff8c42",
  color: "#ffffff",
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer"
}

const infoStyle = {
  marginTop: "20px",
  color: "#0d1b4c",
  textAlign: "center"
}
