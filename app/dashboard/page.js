"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {
  const [donations, setDonations] = useState([])
  const [volunteers, setVolunteers] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)

    const { data: donationData } = await supabase
      .from("donation")
      .select("*")
      .order("created_at", { ascending: false })

    const { data: volunteerData } = await supabase
      .from("volunteer")
      .select("*")
      .order("created_at", { ascending: false })

    const { data: contactData } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })

    setDonations(donationData || [])
    setVolunteers(volunteerData || [])
    setContacts(contactData || [])
    setLoading(false)
  }

  async function deleteDonation(id) {
    await supabase.from("donation").delete().eq("id", id)
    fetchData()
  }

  async function deleteVolunteer(id) {
    await supabase.from("volunteer").delete().eq("id", id)
    fetchData()
  }

  async function deleteContact(id) {
    await supabase.from("contact_messages").delete().eq("id", id)
    fetchData()
  }

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>

  return (
    <section style={sectionStyle}>
      <h1 style={titleStyle}>Admin Dashboard</h1>

      {/* Donations Section */}
      <div style={cardStyle}>
        <h2 style={subTitleStyle}>Donations</h2>
        {donations.length === 0 ? (
          <p>No donations yet.</p>
        ) : (
          donations.map((d) => (
            <div key={d.id} style={itemStyle}>
              <div>
                <strong>{d.name}</strong> — ₹{d.donation_amount}
                <br />
                <small>{d.phone}</small>
              </div>
              <button style={deleteBtn} onClick={() => deleteDonation(d.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Volunteers Section */}
      <div style={cardStyle}>
        <h2 style={subTitleStyle}>Volunteers</h2>
        {volunteers.length === 0 ? (
          <p>No volunteers yet.</p>
        ) : (
          volunteers.map((v) => (
            <div key={v.id} style={itemStyle}>
              <div>
                <strong>{v.name}</strong> — {v.skills}
                <br />
                <small>{v.phone}</small>
              </div>
              <button style={deleteBtn} onClick={() => deleteVolunteer(v.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Contact Messages Section */}
      <div style={cardStyle}>
        <h2 style={subTitleStyle}>Contact Messages</h2>
        {contacts.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          contacts.map((c) => (
            <div key={c.id} style={itemStyle}>
              <div>
                <strong>{c.name}</strong> — {c.email}
                <br />
                <small>{c.phone}</small>
                <p>{c.message}</p>
              </div>
              <button style={deleteBtn} onClick={() => deleteContact(c.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

// ------------------- Styles -------------------

const sectionStyle = {
  padding: "40px",
  backgroundColor: "#f5f8ff",
  minHeight: "100vh",
}

const titleStyle = {
  color: "#510a50",
  textAlign: "center",
  marginBottom: "20px",
}

const subTitleStyle = {
  color: "#510a50",
  marginBottom: "10px",
  fontSize: "20px",
}

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  marginBottom: "30px",
}

const itemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  borderBottom: "1px solid #ddd",
}

const deleteBtn = {
  backgroundColor: "#ff8c42",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
}
