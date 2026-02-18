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
    msg: "",
    address: ""
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from("volunteer")
      .insert([formData])

    if (error) {
      alert("Error submitting form ❌")
      console.log(error)
    } else {
      alert("Thank you for joining our mission ❤️")
      setFormData({
        name: "",
        email: "",
        phone: "",
        skills: "",
        msg: "",
        address: ""
      })
    }

    setLoading(false)
  }

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>

        <h2 style={titleStyle}>Become a Volunteer</h2>
        <p style={subtitleStyle}>
          Use your skills to support financially struggling families and empower communities.
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
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
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
            name="msg"
            placeholder="Why do you want to volunteer?"
            value={formData.msg}
            onChange={handleChange}
            style={inputStyle}
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            style={inputStyle}
          />

          <button type="submit" disabled={loading} style={buttonStyle}>
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
  minHeight: "80vh"
}

const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
}

const titleStyle = {
  color: "#510a50",
  fontSize: "28px",
  marginBottom: "10px",
  textAlign: "center"
}

const subtitleStyle = {
  textAlign: "center",
  marginBottom: "30px",
  color: "#0d1b4c"
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px"
}

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "14px"
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
