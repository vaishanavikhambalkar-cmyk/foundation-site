"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Volunteer() {
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    message: "",
    address: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading) return

    setLoading(true)

    try {
      const volunteerData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        skills: formData.skills.trim(),
        message: formData.message.trim(),
        address: formData.address.trim(),
      }

      console.log("Sending:", volunteerData)

      const { data, error } = await supabase
        .from("volunteer")
        .insert(volunteerData)
        .select()

      console.log("Supabase data:", data)
      console.log("Supabase error:", error)

      if (error) {
        console.error("FULL SUPABASE ERROR:", error)
        alert(`Error: ${error.message}`)
        return
      }

      alert("Thank you for joining our mission ❤️")

      setFormData({
        name: "",
        email: "",
        phone: "",
        skills: "",
        message: "",
        address: "",
      })
    } catch (err) {
      console.error("Unexpected error:", err)
      alert("Something went wrong ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>

        <h2 style={titleStyle}>Become a Volunteer</h2>

        <p style={subtitleStyle}>
          Use your skills to support financially struggling families and
          empower communities.
        </p>

        <form onSubmit={handleSubmit} style={formStyle}>

          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="skills"
            placeholder="Your Skills (Teaching, Fundraising, IT, etc.)"
            value={formData.skills}
            onChange={handleChange}
            style={inputStyle}
          />

          <textarea
            name="message"
            placeholder="Why do you want to volunteer?"
            value={formData.message}
            onChange={handleChange}
            style={textareaStyle}
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            style={textareaStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? "Submitting..." : "Join as Volunteer"}
          </button>

        </form>
      </div>
    </section>
  )
}

const sectionStyle = {
  backgroundColor: "#f5f8ff",
  padding: "60px 20px",
  minHeight: "80vh",
}

const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
}

const titleStyle = {
  color: "#510a50",
  fontSize: "28px",
  marginBottom: "10px",
  textAlign: "center",
}

const subtitleStyle = {
  textAlign: "center",
  marginBottom: "30px",
  color: "#0d1b4c",
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
}

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "14px",
}

const textareaStyle = {
  ...inputStyle,
  minHeight: "100px",
  resize: "vertical",
}

const buttonStyle = {
  backgroundColor: "#ff8c42",
  color: "#ffffff",
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
}