"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import jsPDF from "jspdf"

export default function Donate() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    donation_amount: "",
    address: "",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const generateReceipt = () => {
    const doc = new jsPDF()

    const receiptNumber = "REC-" + Math.floor(Math.random() * 1000000)
    const date = new Date().toLocaleDateString()

    doc.setFontSize(18)
    doc.text("Ojal Micro Service Foundation", 20, 20)

    doc.setFontSize(12)
    doc.text(`Receipt No: ${receiptNumber}`, 20, 35)
    doc.text(`Date: ${date}`, 20, 45)

    doc.text(`Donor Name: ${formData.name}`, 20, 60)
    doc.text(`Phone: ${formData.phone}`, 20, 70)
    doc.text(`Email: ${formData.email}`, 20, 80)
    doc.text(`Address: ${formData.address}`, 20, 90)

    doc.setFontSize(14)
    doc.text(`Donation Amount: ₹${formData.donation_amount}`, 20, 110)

    doc.setFontSize(12)
    doc.text("Thank you for supporting our mission.", 20, 130)

    doc.save(`Donation_Receipt_${receiptNumber}.pdf`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from("donation").insert([formData])

    if (error) {
      alert("Error submitting donation")
    } else {
      alert("Thank you for your contribution ❤️")
      generateReceipt()

      setFormData({
        name: "",
        email: "",
        phone: "",
        donation_amount: "",
        address: "",
      })
    }

    setLoading(false)
  }

  return (
    <section className="donate-section">
      <div className="donate-container">

        <h2>Support Our Cause</h2>
        <p className="subtitle">
          Your contribution helps financially support families in need.
        </p>

        <div className="donate-grid">

          {/* Donation Form */}
          <form className="donate-form" onSubmit={handleSubmit}>
            <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
            <input name="donation_amount" placeholder="Donation Amount (₹)" value={formData.donation_amount} onChange={handleChange} required />
            <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange}></textarea>

            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Donate Now"}
            </button>
          </form>

          {/* QR Code Section */}
          <div className="qr-section">
            <h3>Scan & Pay</h3>
            <img src="ojalqr.jpg" alt="UPI QR Code" />
            <p>UPI ID: amarshindepatil2690-2@oksbi </p>
          </div>

        </div>
      </div>
    </section>
  )
}
