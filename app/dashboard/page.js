"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()

  const [donations, setDonations] = useState([])
  const [volunteers, setVolunteers] = useState([])
  const [contacts, setContacts] = useState([])
  const [womenApplications, setWomenApplications] = useState([])
  const [womenDocuments, setWomenDocuments] = useState([])

  const [loading, setLoading] = useState(true)
  const [expandedApplication, setExpandedApplication] = useState(null)

  const [paymentDates, setPaymentDates] = useState({})
  const [paymentReferences, setPaymentReferences] = useState({})
  const [remarks, setRemarks] = useState({})

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin")

    if (isAdmin !== "true") {
      router.push("/admin")
      return
    }

    fetchData()
  }, [router])

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

    const { data: womenData, error: womenError } = await supabase
      .from("women_applications")
      .select("*")
      .order("created_at", { ascending: false })

    const { data: documentData, error: documentError } = await supabase
      .from("women_documents")
      .select("*")
      .order("created_at", { ascending: false })

    if (womenError) {
      console.error("Women applications error:", womenError)
    }

    if (documentError) {
      console.error("Women documents error:", documentError)
    }

    setDonations(donationData || [])
    setVolunteers(volunteerData || [])
    setContacts(contactData || [])
    setWomenApplications(womenData || [])
    setWomenDocuments(documentData || [])

    setLoading(false)
  }

  async function deleteDonation(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this donation?"
    )

    if (!confirmDelete) return

    await supabase
      .from("donation")
      .delete()
      .eq("id", id)

    fetchData()
  }

  async function deleteVolunteer(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this volunteer?"
    )

    if (!confirmDelete) return

    await supabase
      .from("volunteer")
      .delete()
      .eq("id", id)

    fetchData()
  }

  async function deleteContact(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    )

    if (!confirmDelete) return

    await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id)

    fetchData()
  }

  async function markMembershipPaid(application) {
    const paymentDate =
      paymentDates[application.id] ||
      application.membership_paid_date ||
      new Date().toISOString().split("T")[0]

    const paymentReference =
      paymentReferences[application.id] ||
      application.membership_payment_reference ||
      ""

    const { error } = await supabase
      .from("women_applications")
      .update({
        membership_paid: true,
        membership_paid_date: paymentDate,
        membership_payment_reference:
          paymentReference || null,
      })
      .eq("id", application.id)

    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    alert("Membership marked as paid.")

    fetchData()
  }

  async function updateApplicationStatus(
    applicationId,
    status
  ) {
    const { error } = await supabase
      .from("women_applications")
      .update({
        status: status,
      })
      .eq("id", applicationId)

    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    fetchData()
  }

  async function saveRemarks(applicationId) {
    const { error } = await supabase
      .from("women_applications")
      .update({
        admin_remarks:
          remarks[applicationId] || "",
      })
      .eq("id", applicationId)

    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    alert("Admin remarks saved.")

    fetchData()
  }

  async function downloadDocument(filePath, fileName) {
    try {
      const { data, error } = await supabase.storage
        .from("women-documents")
        .createSignedUrl(filePath, 60 * 10)

      if (error) {
        throw error
      }

      const link = document.createElement("a")

      link.href = data.signedUrl
      link.target = "_blank"
      link.rel = "noopener noreferrer"

      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)
    } catch (error) {
      console.error(error)
      alert("Unable to open document.")
    }
  }

  function getApplicationDocuments(applicationId) {
    return womenDocuments.filter(
      (document) =>
        document.application_id === applicationId
    )
  }

  function getStatusStyle(status) {
    if (status === "approved") {
      return {
        backgroundColor: "#dcfce7",
        color: "#166534",
      }
    }

    if (status === "rejected") {
      return {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
      }
    }

    return {
      backgroundColor: "#fef3c7",
      color: "#92400e",
    }
  }

  function getDocumentName(type) {
    const names = {
      "passport-photo": "Passport Photo",
      "aadhaar-pan": "Aadhaar / PAN Card",
      "ration-card": "Ration Card",
      "bank-passbook": "Bank Passbook",
      "pratidnya-patra": "प्रतिज्ञापत्र / Affidavit",
    }

    return names[type] || type
  }

  if (loading) {
    return (
      <section style={loadingStyle}>
        <h2>Loading Admin Dashboard...</h2>
      </section>
    )
  }

  return (
    <section style={sectionStyle}>

      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>
            Admin Dashboard
          </h1>

          <p style={subtitleStyle}>
            Ojal Micro Service Foundation
          </p>
        </div>

        <button
          style={logoutButton}
          onClick={() => {
            localStorage.removeItem("isAdmin")
            router.push("/admin")
          }}
        >
          Logout
        </button>
      </div>

      {/* =========================================
          DONATIONS
      ========================================= */}

      <div style={cardStyle}>
        <h2 style={subTitleStyle}>
          Donations
        </h2>

        {donations.length === 0 ? (
          <p>No donations yet.</p>
        ) : (
          donations.map((d) => (
            <div
              key={d.id}
              style={itemStyle}
            >
              <div>
                <strong>{d.name}</strong>
                {" — "}
                ₹{d.donation_amount}

                <br />

                <small>
                  {d.phone}
                </small>
              </div>

              <button
                style={deleteBtn}
                onClick={() =>
                  deleteDonation(d.id)
                }
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* =========================================
          VOLUNTEERS
      ========================================= */}

      <div style={cardStyle}>
        <h2 style={subTitleStyle}>
          Volunteers
        </h2>

        {volunteers.length === 0 ? (
          <p>No volunteers yet.</p>
        ) : (
          volunteers.map((v) => (
            <div
              key={v.id}
              style={itemStyle}
            >
              <div>
                <strong>{v.name}</strong>
                {" — "}
                {v.skills}

                <br />

                <small>
                  {v.phone}
                </small>
              </div>

              <button
                style={deleteBtn}
                onClick={() =>
                  deleteVolunteer(v.id)
                }
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* =========================================
          CONTACT MESSAGES
      ========================================= */}

      <div style={cardStyle}>
        <h2 style={subTitleStyle}>
          Contact Messages
        </h2>

        {contacts.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          contacts.map((c) => (
            <div
              key={c.id}
              style={itemStyle}
            >
              <div>
                <strong>
                  {c.name}
                </strong>
                {" — "}
                {c.email}

                <br />

                <small>
                  {c.phone}
                </small>

                <p>
                  {c.message}
                </p>
              </div>

              <button
                style={deleteBtn}
                onClick={() =>
                  deleteContact(c.id)
                }
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* =========================================
          WOMEN ENTREPRENEURSHIP
      ========================================= */}

      <div style={womenSectionStyle}>

        <div style={womenHeaderStyle}>
          <div>
            <h2 style={womenTitleStyle}>
              जिजामाता ऐकल महिला उद्योजक उजाण
            </h2>

            <p style={womenSubtitleStyle}>
              Women Entrepreneurship Applications
            </p>
          </div>

          <div style={applicationCountStyle}>
            {womenApplications.length}
            <span>Applications</span>
          </div>
        </div>

        {womenApplications.length === 0 ? (
          <div style={emptyStyle}>
            <h3>No applications yet</h3>
            <p>
              Women Entrepreneurship applications
              will appear here.
            </p>
          </div>
        ) : (
          womenApplications.map((application) => {

            const appDocuments =
              getApplicationDocuments(
                application.id
              )

            const isExpanded =
              expandedApplication ===
              application.id

            return (
              <div
                key={application.id}
                style={applicationCardStyle}
              >

                {/* APPLICATION HEADER */}

                <div
                  style={
                    applicationHeaderStyle
                  }
                >
                  <div>
                    <h3
                      style={
                        applicantNameStyle
                      }
                    >
                      {application.name}
                    </h3>

                    <p
                      style={
                        applicationNumberStyle
                      }
                    >
                      Application No:
                      {" "}
                      <strong>
                        {application.application_number ||
                          "N/A"}
                      </strong>
                    </p>

                    <p style={smallTextStyle}>
                      Submitted:
                      {" "}
                      {application.created_at
                        ? new Date(
                            application.created_at
                          ).toLocaleString(
                            "en-IN"
                          )
                        : "N/A"}
                    </p>
                  </div>

                  <div
                    style={
                      applicationHeaderRightStyle
                    }
                  >

                    <span
                      style={{
                        ...statusBadgeStyle,
                        ...getStatusStyle(
                          application.status
                        ),
                      }}
                    >
                      {(
                        application.status ||
                        "pending"
                      ).toUpperCase()}
                    </span>

                    {application.membership_paid ? (
                      <span
                        style={
                          paidBadgeStyle
                        }
                      >
                        ✓ ₹1,500 PAID
                      </span>
                    ) : (
                      <span
                        style={
                          unpaidBadgeStyle
                        }
                      >
                        ✕ ₹1,500 NOT PAID
                      </span>
                    )}

                  </div>
                </div>

                {/* EXPAND BUTTON */}

                <button
                  style={
                    viewButtonStyle
                  }
                  onClick={() =>
                    setExpandedApplication(
                      isExpanded
                        ? null
                        : application.id
                    )
                  }
                >
                  {isExpanded
                    ? "Hide Application"
                    : "View Application"}
                </button>

                {/* FULL APPLICATION */}

                {isExpanded && (
                  <div
                    style={
                      expandedContentStyle
                    }
                  >

                    {/* PERSONAL */}

                    <div
                      style={
                        detailSectionStyle
                      }
                    >
                      <h4
                        style={
                          detailHeadingStyle
                        }
                      >
                        Personal Information
                      </h4>

                      <div
                        style={detailGridStyle}
                      >
                        <Detail
                          label="Full Name"
                          value={
                            application.name
                          }
                        />

                        <Detail
                          label="Date of Birth"
                          value={
                            application.date_of_birth
                          }
                        />

                        <Detail
                          label="Phone"
                          value={
                            application.phone
                          }
                        />

                        <Detail
                          label="Email"
                          value={
                            application.email
                          }
                        />

                        <Detail
                          label="Address"
                          value={
                            application.address
                          }
                        />

                        <Detail
                          label="City"
                          value={
                            application.city
                          }
                        />

                        <Detail
                          label="District"
                          value={
                            application.district
                          }
                        />

                        <Detail
                          label="Pincode"
                          value={
                            application.pincode
                          }
                        />

                        <Detail
                          label="Marital Status"
                          value={
                            application.marital_status
                          }
                        />

                        <Detail
                          label="Family Members"
                          value={
                            application.family_members
                          }
                        />

                        <Detail
                          label="Children"
                          value={
                            application.children_count
                          }
                        />
                      </div>
                    </div>

                    {/* BUSINESS */}

                    <div
                      style={
                        detailSectionStyle
                      }
                    >
                      <h4
                        style={
                          detailHeadingStyle
                        }
                      >
                        Business Information
                      </h4>

                      <div
                        style={detailGridStyle}
                      >

                        <Detail
                          label="Existing Business"
                          value={
                            application.existing_business
                              ? "Yes"
                              : "No"
                          }
                        />

                        {application.existing_business ? (
                          <>
                            <Detail
                              label="Business Name"
                              value={
                                application.business_name
                              }
                            />

                            <Detail
                              label="Business Type"
                              value={
                                application.business_type
                              }
                            />

                            <Detail
                              label="Business Address"
                              value={
                                application.business_address
                              }
                            />

                            <Detail
                              label="Business Duration"
                              value={
                                application.business_duration
                              }
                            />

                            <Detail
                              label="Monthly Income"
                              value={
                                application.monthly_income
                              }
                            />
                          </>
                        ) : (
                          <>
                            <Detail
                              label="Proposed Business"
                              value={
                                application.proposed_business
                              }
                            />

                            <Detail
                              label="Estimated Investment"
                              value={
                                application.investment_required
                              }
                            />
                          </>
                        )}

                      </div>

                      <div
                        style={
                          longDetailStyle
                        }
                      >
                        <strong>
                          Business Plan
                        </strong>

                        <p>
                          {application.business_plan ||
                            "Not provided"}
                        </p>
                      </div>

                      <div
                        style={
                          longDetailStyle
                        }
                      >
                        <strong>
                          Support Required
                        </strong>

                        <p>
                          {application.support_required ||
                            "Not provided"}
                        </p>
                      </div>
                    </div>

                    {/* MEMBERSHIP */}

                    <div
                      style={
                        membershipAdminStyle
                      }
                    >
                      <h4
                        style={
                          detailHeadingStyle
                        }
                      >
                        Membership Fee
                      </h4>

                      <div
                        style={
                          membershipAmountStyle
                        }
                      >
                        <span>
                          Required Membership
                        </span>

                        <strong>
                          ₹1,500
                        </strong>
                      </div>

                      <div
                        style={
                          membershipStatusBox
                        }
                      >
                        <div>
                          <strong>
                            Payment Status
                          </strong>

                          <br />

                          {application.membership_paid ? (
                            <span
                              style={
                                paidTextStyle
                              }
                            >
                              ✓ Paid
                            </span>
                          ) : (
                            <span
                              style={
                                unpaidTextStyle
                              }
                            >
                              ✕ Not Paid
                            </span>
                          )}
                        </div>

                        {application.membership_paid &&
                          application.membership_paid_date && (
                            <div>
                              <strong>
                                Payment Date
                              </strong>

                              <br />

                              {
                                application.membership_paid_date
                              }
                            </div>
                          )}

                        {application.membership_paid &&
                          application.membership_payment_reference && (
                            <div>
                              <strong>
                                Reference
                              </strong>

                              <br />

                              {
                                application.membership_payment_reference
                              }
                            </div>
                          )}
                      </div>

                      {!application.membership_paid && (
                        <div
                          style={
                            paymentFormStyle
                          }
                        >

                          <div>
                            <label
                              style={
                                fieldLabelStyle
                              }
                            >
                              Payment Date
                            </label>

                            <input
                              type="date"
                              value={
                                paymentDates[
                                  application.id
                                ] || ""
                              }
                              onChange={(e) =>
                                setPaymentDates(
                                  (previous) => ({
                                    ...previous,
                                    [application.id]:
                                      e.target.value,
                                  })
                                )
                              }
                              style={
                                adminInputStyle
                              }
                            />
                          </div>

                          <div>
                            <label
                              style={
                                fieldLabelStyle
                              }
                            >
                              Payment Reference
                            </label>

                            <input
                              type="text"
                              placeholder="Example: ABC12345"
                              value={
                                paymentReferences[
                                  application.id
                                ] || ""
                              }
                              onChange={(e) =>
                                setPaymentReferences(
                                  (previous) => ({
                                    ...previous,
                                    [application.id]:
                                      e.target.value,
                                  })
                                )
                              }
                              style={
                                adminInputStyle
                              }
                            />
                          </div>

                          <button
                            type="button"
                            style={
                              paidButtonStyle
                            }
                            onClick={() =>
                              markMembershipPaid(
                                application
                              )
                            }
                          >
                            ✓ Mark as Paid
                          </button>

                        </div>
                      )}
                    </div>

                    {/* DOCUMENTS */}

                    <div
                      style={
                        detailSectionStyle
                      }
                    >
                      <h4
                        style={
                          detailHeadingStyle
                        }
                      >
                        Documents
                      </h4>

                      {appDocuments.length === 0 ? (
                        <p>
                          No documents found.
                        </p>
                      ) : (
                        <div
                          style={
                            documentsGridStyle
                          }
                        >
                          {appDocuments.map(
                            (doc) => (
                              <div
                                key={doc.id}
                                style={
                                  documentCardStyle
                                }
                              >
                                <div
                                  style={
                                    documentIconStyle
                                  }
                                >
                                  📄
                                </div>

                                <div
                                  style={
                                    documentInfoStyle
                                  }
                                >
                                  <strong>
                                    {getDocumentName(
                                      doc.document_type
                                    )}
                                  </strong>

                                  <small>
                                    {doc.file_name}
                                  </small>
                                </div>

                                <button
                                  type="button"
                                  style={
                                    downloadButtonStyle
                                  }
                                  onClick={() =>
                                    downloadDocument(
                                      doc.file_path,
                                      doc.file_name
                                    )
                                  }
                                >
                                  View / Download
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>

                    {/* STATUS */}

                    <div
                      style={
                        detailSectionStyle
                      }
                    >
                      <h4
                        style={
                          detailHeadingStyle
                        }
                      >
                        Application Decision
                      </h4>

                      <div
                        style={
                          statusButtonsStyle
                        }
                      >
                        <button
                          type="button"
                          style={
                            approveButtonStyle
                          }
                          onClick={() =>
                            updateApplicationStatus(
                              application.id,
                              "approved"
                            )
                          }
                        >
                          ✓ Approve Application
                        </button>

                        <button
                          type="button"
                          style={
                            rejectButtonStyle
                          }
                          onClick={() =>
                            updateApplicationStatus(
                              application.id,
                              "rejected"
                            )
                          }
                        >
                          ✕ Reject Application
                        </button>

                        <button
                          type="button"
                          style={
                            pendingButtonStyle
                          }
                          onClick={() =>
                            updateApplicationStatus(
                              application.id,
                              "pending"
                            )
                          }
                        >
                          Set Pending
                        </button>
                      </div>
                    </div>

                    {/* ADMIN REMARKS */}

                    <div
                      style={
                        detailSectionStyle
                      }
                    >
                      <h4
                        style={
                          detailHeadingStyle
                        }
                      >
                        Admin Remarks
                      </h4>

                      <textarea
                        rows={4}
                        placeholder="Enter admin remarks..."
                        value={
                          remarks[
                            application.id
                          ] !== undefined
                            ? remarks[
                                application.id
                              ]
                            : application.admin_remarks ||
                              ""
                        }
                        onChange={(e) =>
                          setRemarks(
                            (previous) => ({
                              ...previous,
                              [application.id]:
                                e.target.value,
                            })
                          )
                        }
                        style={
                          remarksInputStyle
                        }
                      />

                      <button
                        type="button"
                        style={
                          saveRemarksButtonStyle
                        }
                        onClick={() =>
                          saveRemarks(
                            application.id
                          )
                        }
                      >
                        Save Remarks
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

    </section>
  )
}


/* =========================================
   SMALL DETAIL COMPONENT
========================================= */

function Detail({ label, value }) {
  return (
    <div style={detailItemStyle}>
      <strong>{label}</strong>
      <span>
        {value !== null &&
        value !== undefined &&
        value !== ""
          ? value
          : "Not provided"}
      </span>
    </div>
  )
}


/* =========================================
   STYLES
========================================= */

const sectionStyle = {
  padding: "40px",
  backgroundColor: "#f5f8ff",
  minHeight: "100vh",
}

const loadingStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f5f8ff",
  color: "#510a50",
}

const headerStyle = {
  maxWidth: "1200px",
  margin: "0 auto 30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
}

const titleStyle = {
  color: "#510a50",
  margin: 0,
}

const subtitleStyle = {
  color: "#777",
  marginTop: "5px",
}

const logoutButton = {
  backgroundColor: "#510a50",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
}

const subTitleStyle = {
  color: "#510a50",
  marginBottom: "10px",
  fontSize: "20px",
}

const cardStyle = {
  maxWidth: "1200px",
  margin: "0 auto 30px",
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.08)",
}

const itemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  borderBottom: "1px solid #ddd",
  gap: "20px",
}

const deleteBtn = {
  backgroundColor: "#ff8c42",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
}


/* =========================================
   WOMEN SECTION
========================================= */

const womenSectionStyle = {
  maxWidth: "1200px",
  margin: "0 auto 40px",
  backgroundColor: "#ffffff",
  padding: "25px",
  borderRadius: "16px",
  boxShadow:
    "0 10px 35px rgba(81,10,80,0.10)",
  borderTop:
    "5px solid #510a50",
}

const womenHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "25px",
  flexWrap: "wrap",
}

const womenTitleStyle = {
  color: "#510a50",
  margin: 0,
  fontSize: "25px",
}

const womenSubtitleStyle = {
  color: "#777",
  marginTop: "6px",
}

const applicationCountStyle = {
  backgroundColor: "#fff0e8",
  color: "#510a50",
  padding: "12px 18px",
  borderRadius: "12px",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: "22px",
}

const applicationCardStyle = {
  border:
    "1px solid #e4d9e4",
  borderRadius: "14px",
  marginBottom: "20px",
  overflow: "hidden",
  backgroundColor: "#fff",
}

const applicationHeaderStyle = {
  padding: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap",
  backgroundColor: "#fcf8fc",
}

const applicantNameStyle = {
  margin: 0,
  color: "#510a50",
  fontSize: "21px",
}

const applicationNumberStyle = {
  margin:
    "7px 0 3px",
  color: "#555",
}

const smallTextStyle = {
  margin: 0,
  color: "#888",
  fontSize: "13px",
}

const applicationHeaderRightStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  alignItems: "center",
}

const statusBadgeStyle = {
  padding: "7px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold",
}

const paidBadgeStyle = {
  backgroundColor: "#dcfce7",
  color: "#166534",
  padding: "7px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold",
}

const unpaidBadgeStyle = {
  backgroundColor: "#fee2e2",
  color: "#991b1b",
  padding: "7px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold",
}

const viewButtonStyle = {
  width: "100%",
  border: "none",
  borderTop:
    "1px solid #eee",
  borderBottom:
    "1px solid #eee",
  backgroundColor: "#fff",
  color: "#510a50",
  padding: "13px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "15px",
}

const expandedContentStyle = {
  padding: "20px",
}

const detailSectionStyle = {
  padding: "20px 0",
  borderBottom:
    "1px solid #eee",
}

const detailHeadingStyle = {
  color: "#510a50",
  fontSize: "19px",
  marginTop: 0,
  marginBottom: "18px",
}

const detailGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "12px",
}

const detailItemStyle = {
  backgroundColor: "#fafafa",
  padding: "12px",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
}

const longDetailStyle = {
  marginTop: "15px",
  backgroundColor: "#fafafa",
  padding: "15px",
  borderRadius: "8px",
  lineHeight: 1.6,
}

const membershipAdminStyle = {
  padding: "20px 0",
  borderBottom:
    "1px solid #eee",
}

const membershipAmountStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#fff7ed",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "15px",
}

const membershipStatusBox = {
  display: "flex",
  gap: "35px",
  flexWrap: "wrap",
  backgroundColor: "#fafafa",
  padding: "15px",
  borderRadius: "10px",
}

const paidTextStyle = {
  color: "#15803d",
  fontWeight: "bold",
}

const unpaidTextStyle = {
  color: "#dc2626",
  fontWeight: "bold",
}

const paymentFormStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "15px",
  marginTop: "18px",
  alignItems: "end",
}

const fieldLabelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "bold",
  fontSize: "14px",
}

const adminInputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px",
  border:
    "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "14px",
}

const paidButtonStyle = {
  backgroundColor: "#15803d",
  color: "#fff",
  border: "none",
  padding: "12px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
}

const documentsGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "12px",
}

const documentCardStyle = {
  border:
    "1px solid #e5e7eb",
  borderRadius: "10px",
  padding: "14px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
}

const documentIconStyle = {
  fontSize: "25px",
}

const documentInfoStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  minWidth: "140px",
}

const downloadButtonStyle = {
  backgroundColor: "#510a50",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "7px",
  cursor: "pointer",
  fontSize: "12px",
}

const statusButtonsStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
}

const approveButtonStyle = {
  backgroundColor: "#15803d",
  color: "#fff",
  border: "none",
  padding: "11px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
}

const rejectButtonStyle = {
  backgroundColor: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "11px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
}

const pendingButtonStyle = {
  backgroundColor: "#d97706",
  color: "#fff",
  border: "none",
  padding: "11px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
}

const remarksInputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  border:
    "1px solid #ccc",
  borderRadius: "8px",
  resize: "vertical",
  fontFamily:
    "Arial, sans-serif",
  fontSize: "14px",
}

const saveRemarksButtonStyle = {
  marginTop: "10px",
  backgroundColor: "#510a50",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
}

const emptyStyle = {
  textAlign: "center",
  padding: "40px 20px",
  backgroundColor: "#fafafa",
  borderRadius: "12px",
  color: "#777",
}