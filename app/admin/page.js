"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLogin() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()

    // Change these credentials
    const adminEmail = "ojalmicroservicefoundation.obs@gmail.com"
    const adminPassword = "ojal@4848"

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem("isAdmin", "true")
      router.push("/dashboard")
    } else {
      alert("Invalid credentials")
    }
  }

  return (
    <section style={sectionStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Admin Login</h2>

        <form onSubmit={handleLogin} style={formStyle}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>
      </div>
    </section>
  )
}

const sectionStyle = {
  backgroundColor: "#f5f8ff",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
}

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  width: "350px"
}

const titleStyle = {
  textAlign: "center",
  color: "#510a50",
  marginBottom: "20px"
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px"
}

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ddd"
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
