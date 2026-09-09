"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()

  const [donations, setDonations] = useState([])
  const [volunteers, setVolunteers] = useState([])
  const [contacts, setContacts] = useState([])
  const [womenApplications, setWomenApplications] = useState([])
  const [womenDocuments, setWomenDocuments] = useState([])
  const [womenBenefits, setWomenBenefits] = useState([])

  const [loading, setLoading] = useState(true)
  const [expandedApplication, setExpandedApplication] = useState(null)

  const [activeSection, setActiveSection] = useState("women")

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [districtFilter, setDistrictFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")

  const [paymentDates, setPaymentDates] = useState({})
  const [paymentReferences, setPaymentReferences] = useState({})
  const [remarks, setRemarks] = useState({})

  const [benefitForm, setBenefitForm] = useState({})
  const [savingBenefit, setSavingBenefit] = useState({})

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

    const [
      donationResult,
      volunteerResult,
      contactResult,
      womenResult,
      documentResult,
      benefitResult,
    ] = await Promise.all([
      supabase
        .from("donation")
        .select("*")
        .order("created_at", { ascending: false }),

      supabase
        .from("volunteer")
        .select("*")
        .order("created_at", { ascending: false }),

      supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false }),

      supabase
        .from("women_applications")
        .select("*")
        .order("created_at", { ascending: false }),

      supabase
        .from("women_documents")
        .select("*")
        .order("created_at", { ascending: false }),

      supabase
        .from("women_benefits")
        .select("*")
        .order("created_at", { ascending: false }),
    ])

    if (donationResult.error) {
      console.error("Donation error:", donationResult.error)
    }

    if (volunteerResult.error) {
      console.error("Volunteer error:", volunteerResult.error)
    }

    if (contactResult.error) {
      console.error("Contact error:", contactResult.error)
    }

    if (womenResult.error) {
      console.error("Women applications error:", womenResult.error)
    }

    if (documentResult.error) {
      console.error("Women documents error:", documentResult.error)
    }

    if (benefitResult.error) {
      console.error("Women benefits error:", benefitResult.error)
    }

    setDonations(donationResult.data || [])
    setVolunteers(volunteerResult.data || [])
    setContacts(contactResult.data || [])
    setWomenApplications(womenResult.data || [])
    setWomenDocuments(documentResult.data || [])
    setWomenBenefits(benefitResult.data || [])

    setLoading(false)
  }

  /* =====================================================
     DONATIONS
  ===================================================== */

  async function deleteDonation(id) {
    if (!window.confirm("Delete this donation?")) return

    const { error } = await supabase
      .from("donation")
      .delete()
      .eq("id", id)

    if (error) {
      alert(error.message)
      return
    }

    fetchData()
  }

  /* =====================================================
     VOLUNTEERS
  ===================================================== */

  async function deleteVolunteer(id) {
    if (!window.confirm("Delete this volunteer?")) return

    const { error } = await supabase
      .from("volunteer")
      .delete()
      .eq("id", id)

    if (error) {
      alert(error.message)
      return
    }

    fetchData()
  }

  /* =====================================================
     CONTACTS
  ===================================================== */

  async function deleteContact(id) {
    if (!window.confirm("Delete this message?")) return

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id)

    if (error) {
      alert(error.message)
      return
    }

    fetchData()
  }

  /* =====================================================
     WOMEN APPLICATION DELETE
  ===================================================== */

  async function deleteWomenApplication(application) {
    const confirmDelete = window.confirm(
      `Delete application ${application.application_number || ""} for ${application.name}?\n\nThis will permanently delete the application and its related records.`
    )

    if (!confirmDelete) return

    try {
      const documents = getApplicationDocuments(application.id)

      /*
       * Delete files from Supabase Storage first.
       */
      if (documents.length > 0) {
        const filePaths = documents
          .map((doc) => doc.file_path)
          .filter(Boolean)

        if (filePaths.length > 0) {
          const { error: storageError } = await supabase.storage
            .from("women-documents")
            .remove(filePaths)

          if (storageError) {
            console.error("Storage deletion error:", storageError)
          }
        }
      }

      /*
       * Database ON DELETE CASCADE removes:
       * women_documents
       * women_benefits
       */
      const { error } = await supabase
        .from("women_applications")
        .delete()
        .eq("id", application.id)

      if (error) {
        throw error
      }

      if (expandedApplication === application.id) {
        setExpandedApplication(null)
      }

      alert("Application deleted successfully.")
      fetchData()
    } catch (error) {
      console.error(error)
      alert(error.message || "Unable to delete application.")
    }
  }

  /* =====================================================
     MEMBERSHIP
  ===================================================== */

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
      alert(error.message)
      return
    }

    alert("Membership marked as paid.")
    fetchData()
  }

  async function markMembershipUnpaid(application) {
    if (
      !window.confirm(
        "Are you sure you want to mark this membership as unpaid?"
      )
    ) {
      return
    }

    const { error } = await supabase
      .from("women_applications")
      .update({
        membership_paid: false,
        membership_paid_date: null,
        membership_payment_reference: null,
      })
      .eq("id", application.id)

    if (error) {
      alert(error.message)
      return
    }

    fetchData()
  }

  /* =====================================================
     STATUS
  ===================================================== */

  async function updateApplicationStatus(
    applicationId,
    status
  ) {
    const { error } = await supabase
      .from("women_applications")
      .update({ status })
      .eq("id", applicationId)

    if (error) {
      alert(error.message)
      return
    }

    fetchData()
  }

  /* =====================================================
     REMARKS
  ===================================================== */

  async function saveRemarks(applicationId) {
    const { error } = await supabase
      .from("women_applications")
      .update({
        admin_remarks: remarks[applicationId] || "",
      })
      .eq("id", applicationId)

    if (error) {
      alert(error.message)
      return
    }

    alert("Admin remarks saved.")
    fetchData()
  }

  /* =====================================================
     DOCUMENTS
  ===================================================== */

  async function downloadDocument(filePath) {
    try {
      const { data, error } = await supabase.storage
        .from("women-documents")
        .createSignedUrl(filePath, 60 * 10)

      if (error) {
        throw error
      }

      window.open(
        data.signedUrl,
        "_blank",
        "noopener,noreferrer"
      )
    } catch (error) {
      console.error(error)
      alert("Unable to open document.")
    }
  }

  function getApplicationDocuments(applicationId) {
    return womenDocuments.filter(
      (doc) => doc.application_id === applicationId
    )
  }

  function getApplicationBenefits(applicationId) {
    return womenBenefits.filter(
      (benefit) => benefit.application_id === applicationId
    )
  }

  /* =====================================================
     BENEFITS
  ===================================================== */

  async function addBenefit(applicationId) {
    const form = benefitForm[applicationId] || {}

    if (!form.benefit_type) {
      alert("Please enter benefit type.")
      return
    }

    setSavingBenefit((previous) => ({
      ...previous,
      [applicationId]: true,
    }))

    const { error } = await supabase
      .from("women_benefits")
      .insert({
        application_id: applicationId,
        benefit_type: form.benefit_type,
        amount: form.amount
          ? Number(form.amount)
          : null,
        provided_date:
          form.provided_date || null,
        status: form.status || "provided",
        remarks: form.remarks || null,
      })

    setSavingBenefit((previous) => ({
      ...previous,
      [applicationId]: false,
    }))

    if (error) {
      alert(error.message)
      return
    }

    setBenefitForm((previous) => ({
      ...previous,
      [applicationId]: {},
    }))

    fetchData()
  }

  async function deleteBenefit(id) {
    if (!window.confirm("Delete this benefit record?")) {
      return
    }

    const { error } = await supabase
      .from("women_benefits")
      .delete()
      .eq("id", id)

    if (error) {
      alert(error.message)
      return
    }

    fetchData()
  }

  /* =====================================================
     FILTERS
  ===================================================== */

  const districts = useMemo(() => {
    return [
      ...new Set(
        womenApplications
          .map((item) => item.district)
          .filter(Boolean)
      ),
    ].sort()
  }, [womenApplications])

  const filteredApplications = useMemo(() => {
    let result = [...womenApplications]

    const query = search.trim().toLowerCase()

    if (query) {
      result = result.filter((application) => {
        const values = [
          application.name,
          application.application_number,
          application.phone,
          application.email,
          application.aadhaar_number,
          application.registration_number,
          application.proof_document_number,
          application.district,
          application.city,
          application.business_name,
          application.proposed_business,
        ]

        return values.some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query)
        )
      })
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (application) =>
          (application.status || "pending") === statusFilter
      )
    }

    if (districtFilter !== "all") {
      result = result.filter(
        (application) =>
          application.district === districtFilter
      )
    }

    if (paymentFilter === "paid") {
      result = result.filter(
        (application) => application.membership_paid
      )
    }

    if (paymentFilter === "unpaid") {
      result = result.filter(
        (application) => !application.membership_paid
      )
    }

    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()

      return sortOrder === "newest"
        ? dateB - dateA
        : dateA - dateB
    })

    return result
  }, [
    womenApplications,
    search,
    statusFilter,
    districtFilter,
    paymentFilter,
    sortOrder,
  ])

  /* =====================================================
     COUNTS
  ===================================================== */

  const totalApplications = womenApplications.length

  const pendingCount = womenApplications.filter(
    (a) => !a.status || a.status === "pending"
  ).length

  const reviewCount = womenApplications.filter(
    (a) => a.status === "under_review"
  ).length

  const approvedCount = womenApplications.filter(
    (a) => a.status === "approved"
  ).length

  const rejectedCount = womenApplications.filter(
    (a) => a.status === "rejected"
  ).length

  const paidCount = womenApplications.filter(
    (a) => a.membership_paid
  ).length

  const unpaidCount = womenApplications.filter(
    (a) => !a.membership_paid
  ).length

  /* =====================================================
     STATUS
  ===================================================== */

  function getStatusStyle(status) {
    switch (status) {
      case "approved":
        return {
          backgroundColor: "#dcfce7",
          color: "#166534",
        }

      case "rejected":
        return {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
        }

      case "under_review":
        return {
          backgroundColor: "#dbeafe",
          color: "#1d4ed8",
        }

      default:
        return {
          backgroundColor: "#fef3c7",
          color: "#92400e",
        }
    }
  }

  function statusLabel(status) {
    if (status === "under_review") return "UNDER REVIEW"
    return (status || "pending").toUpperCase()
  }

  function getDocumentName(type) {
    const names = {
      "passport-photo": "Passport Photo",
      "single-woman-proof": "Single Woman Proof",
      "aadhaar-card": "Aadhaar Card",
      "aadhaar-pan": "Aadhaar / PAN Card",
      "pan-card": "PAN Card",
      "ration-card": "Ration Card",
      "voter-id": "Voter ID",
      "bank-passbook": "Bank Passbook",
      "income-certificate": "Income Certificate",
      "disability-certificate": "Disability Certificate",
      "pratidnya-patra": "प्रतिज्ञापत्र",
      other: "Other Document",
    }

    return names[type] || type
  }

  if (loading) {
    return (
      <section style={loadingStyle}>
        <div style={loadingBoxStyle}>
          <div style={spinnerStyle}></div>
          <h2>Loading Admin Dashboard...</h2>
          <p>Please wait...</p>
        </div>
      </section>
    )
  }

  return (
    <section style={sectionStyle}>

      {/* =================================================
          HEADER
      ================================================= */}

      <header style={headerStyle}>
        <div>
          <div style={brandTagStyle}>
            OMSF ADMIN
          </div>

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
      </header>

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <div style={navigationStyle}>
        <button
          style={
            activeSection === "women"
              ? activeNavButtonStyle
              : navButtonStyle
          }
          onClick={() => setActiveSection("women")}
        >
          👩 Women Applications
        </button>

        <button
          style={
            activeSection === "donations"
              ? activeNavButtonStyle
              : navButtonStyle
          }
          onClick={() => setActiveSection("donations")}
        >
          💰 Donations
        </button>

        <button
          style={
            activeSection === "volunteers"
              ? activeNavButtonStyle
              : navButtonStyle
          }
          onClick={() => setActiveSection("volunteers")}
        >
          🤝 Volunteers
        </button>

        <button
          style={
            activeSection === "contacts"
              ? activeNavButtonStyle
              : navButtonStyle
          }
          onClick={() => setActiveSection("contacts")}
        >
          ✉️ Messages
        </button>
      </div>

      {/* =================================================
          WOMEN APPLICATIONS
      ================================================= */}

      {activeSection === "women" && (
        <div style={womenSectionStyle}>

          <div style={womenHeaderStyle}>
            <div>
              <div style={sectionEyebrowStyle}>
                WOMEN ENTREPRENEURSHIP PROGRAM
              </div>

              <h2 style={womenTitleStyle}>
                जिजामाता एकल महिला उद्योजक योजना
              </h2>

              <p style={womenSubtitleStyle}>
                महिला अर्ज व्यवस्थापन
              </p>
            </div>

            <button
              style={refreshButtonStyle}
              onClick={fetchData}
            >
              ↻ Refresh
            </button>
          </div>

          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <div style={statsGridStyle}>

            <StatCard
              title="Total"
              value={totalApplications}
              icon="👩"
              onClick={() => {
                setStatusFilter("all")
                setPaymentFilter("all")
              }}
            />

            <StatCard
              title="Pending"
              value={pendingCount}
              icon="⏳"
              onClick={() => {
                setStatusFilter("pending")
                setPaymentFilter("all")
              }}
            />

            <StatCard
              title="Under Review"
              value={reviewCount}
              icon="🔎"
              onClick={() => {
                setStatusFilter("under_review")
                setPaymentFilter("all")
              }}
            />

            <StatCard
              title="Approved"
              value={approvedCount}
              icon="✓"
              onClick={() => {
                setStatusFilter("approved")
                setPaymentFilter("all")
              }}
            />

            <StatCard
              title="Rejected"
              value={rejectedCount}
              icon="✕"
              onClick={() => {
                setStatusFilter("rejected")
                setPaymentFilter("all")
              }}
            />

            <StatCard
              title="Membership Paid"
              value={paidCount}
              icon="₹"
              onClick={() => {
                setPaymentFilter("paid")
                setStatusFilter("all")
              }}
            />

            <StatCard
              title="Membership Unpaid"
              value={unpaidCount}
              icon="!"
              onClick={() => {
                setPaymentFilter("unpaid")
                setStatusFilter("all")
              }}
            />

          </div>

          {/* =================================================
              SEARCH + FILTERS
          ================================================= */}

          <div style={filterPanelStyle}>

            <div style={searchWrapperStyle}>
              <span style={searchIconStyle}>
                🔎
              </span>

              <input
                type="text"
                placeholder="Search name, application no., phone, Aadhaar, PAN..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                style={searchInputStyle}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              style={filterSelectStyle}
            >
              <option value="all">
                All Status
              </option>
              <option value="pending">
                Pending
              </option>
              <option value="under_review">
                Under Review
              </option>
              <option value="approved">
                Approved
              </option>
              <option value="rejected">
                Rejected
              </option>
            </select>

            <select
              value={districtFilter}
              onChange={(e) =>
                setDistrictFilter(e.target.value)
              }
              style={filterSelectStyle}
            >
              <option value="all">
                All Districts
              </option>

              {districts.map((district) => (
                <option
                  key={district}
                  value={district}
                >
                  {district}
                </option>
              ))}
            </select>

            <select
              value={paymentFilter}
              onChange={(e) =>
                setPaymentFilter(e.target.value)
              }
              style={filterSelectStyle}
            >
              <option value="all">
                All Payments
              </option>
              <option value="paid">
                Membership Paid
              </option>
              <option value="unpaid">
                Membership Unpaid
              </option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value)
              }
              style={filterSelectStyle}
            >
              <option value="newest">
                Newest First
              </option>
              <option value="oldest">
                Oldest First
              </option>
            </select>

            <button
              style={clearFilterButtonStyle}
              onClick={() => {
                setSearch("")
                setStatusFilter("all")
                setDistrictFilter("all")
                setPaymentFilter("all")
                setSortOrder("newest")
              }}
            >
              Clear
            </button>

          </div>

          <div style={resultInfoStyle}>
            Showing{" "}
            <strong>
              {filteredApplications.length}
            </strong>{" "}
            of{" "}
            <strong>
              {womenApplications.length}
            </strong>{" "}
            applications
          </div>

          {/* =================================================
              APPLICATION LIST
          ================================================= */}

          {filteredApplications.length === 0 ? (
            <div style={emptyStyle}>
              <div style={emptyIconStyle}>
                🔍
              </div>

              <h3>
                No applications found
              </h3>

              <p>
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            filteredApplications.map(
              (application) => {

                const appDocuments =
                  getApplicationDocuments(
                    application.id
                  )

                const appBenefits =
                  getApplicationBenefits(
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

                      <div
                        style={
                          applicantIdentityStyle
                        }
                      >
                        <div
                          style={
                            applicantAvatarStyle
                          }
                        >
                          {application.name
                            ?.charAt(0)
                            ?.toUpperCase() || "W"}
                        </div>

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
                            Application No:{" "}
                            <strong>
                              {application.application_number ||
                                "N/A"}
                            </strong>
                          </p>

                          <p
                            style={
                              smallTextStyle
                            }
                          >
                            📞 {application.phone ||
                              "No phone"}{" "}
                            •{" "}
                            {application.district ||
                              "District not provided"}
                          </p>
                        </div>
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
                          {statusLabel(
                            application.status
                          )}
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
                            ₹1,500 UNPAID
                          </span>
                        )}
                      </div>

                    </div>

                    {/* QUICK INFO */}

                    <div
                      style={
                        quickInfoGridStyle
                      }
                    >
                      <QuickInfo
                        label="Submitted"
                        value={
                          application.created_at
                            ? new Date(
                                application.created_at
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "N/A"
                        }
                      />

                      <QuickInfo
                        label="City"
                        value={
                          application.city ||
                          "Not provided"
                        }
                      />

                      <QuickInfo
                        label="Education"
                        value={
                          application.educational_qualification ||
                          application.education ||
                          "Not provided"
                        }
                      />

                      <QuickInfo
                        label="Business"
                        value={
                          application.business_name ||
                          application.proposed_business ||
                          "Not provided"
                        }
                      />

                      <QuickInfo
                        label="PAN"
                        value={
                          application.application_details
                            ?.pan_number ||
                          "Uploaded document"
                        }
                      />
                    </div>

                    {/* ACTION BAR */}

                    <div
                      style={
                        applicationActionBarStyle
                      }
                    >

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
                          ? "▲ Hide Application"
                          : "▼ View Full Application"}
                      </button>

                      <button
                        style={
                          deleteApplicationButtonStyle
                        }
                        onClick={() =>
                          deleteWomenApplication(
                            application
                          )
                        }
                      >
                        🗑 Delete
                      </button>

                    </div>

                    {/* =================================================
                        FULL APPLICATION
                    ================================================= */}

                    {isExpanded && (
                      <div
                        style={
                          expandedContentStyle
                        }
                      >

                        {/* PERSONAL */}

                        <DetailSection title="Personal Information">
                          <div
                            style={
                              detailGridStyle
                            }
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
                                application.full_address ||
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
                              label="Area / Ward"
                              value={
                                application.city_area_ward
                              }
                            />

                            <Detail
                              label="District"
                              value={
                                application.district
                              }
                            />

                            <Detail
                              label="Zone"
                              value={
                                application.zone
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
                              label="Residence Type"
                              value={
                                application.residence_type
                              }
                            />
                          </div>
                        </DetailSection>

                        {/* IDENTITY */}

                        <DetailSection title="Identity & Documents Information">
                          <div
                            style={
                              detailGridStyle
                            }
                          >
                            <Detail
                              label="Aadhaar Number"
                              value={
                                application.aadhaar_number
                              }
                            />

                            <Detail
                              label="PAN Number"
                              value={
                                application.application_details
                                  ?.pan_number ||
                                application.pan_number
                              }
                            />

                            <Detail
                              label="Registration Number"
                              value={
                                application.registration_number
                              }
                            />

                            <Detail
                              label="Ration Card Number"
                              value={
                                application.ration_card_number
                              }
                            />

                            <Detail
                              label="Ration Card Type"
                              value={
                                application.ration_card_type
                              }
                            />

                            <Detail
                              label="Voter ID"
                              value={
                                application.voter_id_number
                              }
                            />

                            <Detail
                              label="Proof Document Number"
                              value={
                                application.proof_document_number
                              }
                            />
                          </div>
                        </DetailSection>

                        {/* SINGLE WOMAN */}

                        <DetailSection title="Single Woman Information">
                          <div
                            style={
                              detailGridStyle
                            }
                          >
                            <Detail
                              label="Single Woman Type"
                              value={
                                application.single_woman_type
                              }
                            />

                            <Detail
                              label="Disabled Single Woman"
                              value={
                                application.is_disabled_single_woman
                              }
                            />

                            <Detail
                              label="Proof Name"
                              value={
                                application.single_woman_proof_name
                              }
                            />

                            <Detail
                              label="Proof Date"
                              value={
                                application.proof_document_date
                              }
                            />

                            <Detail
                              label="Livelihood Source"
                              value={
                                application.livelihood_source
                              }
                            />

                            <Detail
                              label="Government Scheme"
                              value={
                                application.receiving_government_scheme
                              }
                            />
                          </div>
                        </DetailSection>

                        {/* FAMILY */}

                        <DetailSection title="Family & Children">
                          <div
                            style={
                              detailGridStyle
                            }
                          >
                            <Detail
                              label="Total Family Members"
                              value={
                                application.total_family_members ||
                                application.family_members
                              }
                            />

                            <Detail
                              label="Total Children"
                              value={
                                application.total_children ||
                                application.children_count
                              }
                            />

                            <Detail
                              label="Sons"
                              value={
                                application.sons
                              }
                            />

                            <Detail
                              label="Daughters"
                              value={
                                application.daughters
                              }
                            />

                            <Detail
                              label="Children Below 18"
                              value={
                                application.children_below_18
                              }
                            />

                            <Detail
                              label="Children Education"
                              value={
                                application.children_education
                              }
                            />

                            <Detail
                              label="Child Care / Scholarship"
                              value={
                                application.child_care_scholarship
                              }
                            />
                          </div>

                          <LongDetail
                            label="Child Details"
                            value={
                              application.child_details
                            }
                          />
                        </DetailSection>

                        {/* EDUCATION + SKILLS */}

                        <DetailSection title="Education & Skills">
                          <div
                            style={
                              detailGridStyle
                            }
                          >
                            <Detail
                              label="Educational Qualification"
                              value={
                                application.educational_qualification ||
                                application.education
                              }
                            />

                            <Detail
                              label="Skills"
                              value={
                                Array.isArray(
                                  application.skills
                                )
                                  ? application.skills.join(
                                      ", "
                                    )
                                  : application.skills
                              }
                            />

                            <Detail
                              label="Other Skill"
                              value={
                                application.other_skill
                              }
                            />

                            <Detail
                              label="Wants Self Employment"
                              value={
                                application.wants_self_employment
                              }
                            />

                            <Detail
                              label="Saving Group Member"
                              value={
                                application.saving_group_member
                              }
                            />
                          </div>
                        </DetailSection>

                        {/* BUSINESS */}

                        <DetailSection title="Business & Income">
                          <div
                            style={
                              detailGridStyle
                            }
                          >
                            <Detail
                              label="Existing Business"
                              value={
                                application.existing_business
                                  ? "Yes"
                                  : "No"
                              }
                            />

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

                            <Detail
                              label="Woman Monthly Income"
                              value={
                                application.woman_monthly_income
                              }
                            />

                            <Detail
                              label="Family Annual Income"
                              value={
                                application.family_annual_income
                              }
                            />

                            <Detail
                              label="Proposed Business"
                              value={
                                application.proposed_business
                              }
                            />

                            <Detail
                              label="Investment Required"
                              value={
                                application.investment_required
                              }
                            />
                          </div>

                          <LongDetail
                            label="Business Plan"
                            value={
                              application.business_plan
                            }
                          />

                          <LongDetail
                            label="Support Required"
                            value={
                              application.support_required
                            }
                          />

                          <LongDetail
                            label="Major Need"
                            value={
                              application.major_need
                            }
                          />

                          <LongDetail
                            label="Land Details"
                            value={
                              application.land_details
                            }
                          />
                        </DetailSection>

                        {/* BANK */}

                        <DetailSection title="Bank Details">
                          <div
                            style={
                              sensitiveWarningStyle
                            }
                          >
                            ⚠️ Bank information is sensitive.
                            Handle applicant information securely.
                          </div>

                          <div
                            style={
                              detailGridStyle
                            }
                          >
                            <Detail
                              label="Bank Name"
                              value={
                                application.bank_name
                              }
                            />

                            <Detail
                              label="Branch"
                              value={
                                application.branch_name
                              }
                            />

                            <Detail
                              label="Account Holder"
                              value={
                                application.account_holder_name
                              }
                            />

                            <Detail
                              label="Account Number"
                              value={
                                application.account_number
                              }
                            />

                            <Detail
                              label="IFSC"
                              value={
                                application.ifsc_code
                              }
                            />
                          </div>
                        </DetailSection>

                        {/* MEMBERSHIP */}

                        <DetailSection title="Membership Payment">
                          <div
                            style={
                              membershipAmountStyle
                            }
                          >
                            <span>
                              Annual Membership
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
                                Status
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

                            <div>
                              <strong>
                                Payment Date
                              </strong>

                              <br />

                              {application.membership_paid_date ||
                                "Not provided"}
                            </div>

                            <div>
                              <strong>
                                Reference
                              </strong>

                              <br />

                              {application.membership_payment_reference ||
                                "Not provided"}
                            </div>
                          </div>

                          {!application.membership_paid ? (
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
                                  placeholder="ABC12345"
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
                                style={
                                  paidButtonStyle
                                }
                                onClick={() =>
                                  markMembershipPaid(
                                    application
                                  )
                                }
                              >
                                ✓ Mark Paid
                              </button>
                            </div>
                          ) : (
                            <button
                              style={
                                markUnpaidButtonStyle
                              }
                              onClick={() =>
                                markMembershipUnpaid(
                                  application
                                )
                              }
                            >
                              Mark as Unpaid
                            </button>
                          )}
                        </DetailSection>

                        {/* DOCUMENTS */}

                        <DetailSection title="Uploaded Documents">
                          {appDocuments.length === 0 ? (
                            <div
                              style={
                                noDocumentsStyle
                              }
                            >
                              No documents uploaded.
                            </div>
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
                                      style={
                                        downloadButtonStyle
                                      }
                                      onClick={() =>
                                        downloadDocument(
                                          doc.file_path
                                        )
                                      }
                                    >
                                      View
                                    </button>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </DetailSection>

                        {/* BENEFITS */}

                        <DetailSection title="Benefits Provided">
                          {appBenefits.length > 0 && (
                            <div
                              style={
                                benefitsListStyle
                              }
                            >
                              {appBenefits.map(
                                (benefit) => (
                                  <div
                                    key={
                                      benefit.id
                                    }
                                    style={
                                      benefitItemStyle
                                    }
                                  >
                                    <div>
                                      <strong>
                                        {
                                          benefit.benefit_type
                                        }
                                      </strong>

                                      <br />

                                      <small>
                                        Amount: ₹
                                        {benefit.amount ||
                                          0}{" "}
                                        • Date:{" "}
                                        {benefit.provided_date ||
                                          "N/A"}
                                      </small>

                                      {benefit.remarks && (
                                        <p>
                                          {
                                            benefit.remarks
                                          }
                                        </p>
                                      )}
                                    </div>

                                    <button
                                      style={
                                        smallDeleteButtonStyle
                                      }
                                      onClick={() =>
                                        deleteBenefit(
                                          benefit.id
                                        )
                                      }
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                          <div
                            style={
                              benefitFormStyle
                            }
                          >
                            <input
                              placeholder="Benefit type"
                              value={
                                benefitForm[
                                  application.id
                                ]?.benefit_type ||
                                ""
                              }
                              onChange={(e) =>
                                setBenefitForm(
                                  (previous) => ({
                                    ...previous,
                                    [application.id]: {
                                      ...previous[
                                        application.id
                                      ],
                                      benefit_type:
                                        e.target
                                          .value,
                                    },
                                  })
                                )
                              }
                              style={
                                adminInputStyle
                              }
                            />

                            <input
                              type="number"
                              placeholder="Amount"
                              value={
                                benefitForm[
                                  application.id
                                ]?.amount || ""
                              }
                              onChange={(e) =>
                                setBenefitForm(
                                  (previous) => ({
                                    ...previous,
                                    [application.id]: {
                                      ...previous[
                                        application.id
                                      ],
                                      amount:
                                        e.target
                                          .value,
                                    },
                                  })
                                )
                              }
                              style={
                                adminInputStyle
                              }
                            />

                            <input
                              type="date"
                              value={
                                benefitForm[
                                  application.id
                                ]?.provided_date ||
                                ""
                              }
                              onChange={(e) =>
                                setBenefitForm(
                                  (previous) => ({
                                    ...previous,
                                    [application.id]: {
                                      ...previous[
                                        application.id
                                      ],
                                      provided_date:
                                        e.target
                                          .value,
                                    },
                                  })
                                )
                              }
                              style={
                                adminInputStyle
                              }
                            />

                            <input
                              placeholder="Remarks"
                              value={
                                benefitForm[
                                  application.id
                                ]?.remarks || ""
                              }
                              onChange={(e) =>
                                setBenefitForm(
                                  (previous) => ({
                                    ...previous,
                                    [application.id]: {
                                      ...previous[
                                        application.id
                                      ],
                                      remarks:
                                        e.target
                                          .value,
                                    },
                                  })
                                )
                              }
                              style={
                                adminInputStyle
                              }
                            />

                            <button
                              style={
                                addBenefitButtonStyle
                              }
                              disabled={
                                savingBenefit[
                                  application.id
                                ]
                              }
                              onClick={() =>
                                addBenefit(
                                  application.id
                                )
                              }
                            >
                              {savingBenefit[
                                application.id
                              ]
                                ? "Saving..."
                                : "+ Add Benefit"}
                            </button>
                          </div>
                        </DetailSection>

                        {/* DECISION */}

                        <DetailSection title="Application Decision">
                          <div
                            style={
                              statusButtonsStyle
                            }
                          >
                            <button
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
                              ✓ Approve
                            </button>

                            <button
                              style={
                                reviewButtonStyle
                              }
                              onClick={() =>
                                updateApplicationStatus(
                                  application.id,
                                  "under_review"
                                )
                              }
                            >
                              🔎 Under Review
                            </button>

                            <button
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
                              ✕ Reject
                            </button>

                            <button
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
                              ⏳ Pending
                            </button>
                          </div>
                        </DetailSection>

                        {/* REMARKS */}

                        <DetailSection title="Admin Remarks">
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
                        </DetailSection>

                      </div>
                    )}
                  </div>
                )
              }
            )
          )}
        </div>
      )}

      {/* =================================================
          DONATIONS
      ================================================= */}

      {activeSection === "donations" && (
        <SimpleSection
          title="Donations"
          subtitle="Manage donation records"
        >
          {donations.length === 0 ? (
            <EmptyText text="No donations yet." />
          ) : (
            donations.map((d) => (
              <div
                key={d.id}
                style={itemStyle}
              >
                <div>
                  <strong>
                    {d.name}
                  </strong>

                  {" — ₹"}

                  {d.donation_amount}

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
        </SimpleSection>
      )}

      {/* =================================================
          VOLUNTEERS
      ================================================= */}

      {activeSection === "volunteers" && (
        <SimpleSection
          title="Volunteers"
          subtitle="Manage volunteer registrations"
        >
          {volunteers.length === 0 ? (
            <EmptyText text="No volunteers yet." />
          ) : (
            volunteers.map((v) => (
              <div
                key={v.id}
                style={itemStyle}
              >
                <div>
                  <strong>
                    {v.name}
                  </strong>

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
        </SimpleSection>
      )}

      {/* =================================================
          CONTACTS
      ================================================= */}

      {activeSection === "contacts" && (
        <SimpleSection
          title="Contact Messages"
          subtitle="Messages received from the website"
        >
          {contacts.length === 0 ? (
            <EmptyText text="No messages yet." />
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
        </SimpleSection>
      )}

    </section>
  )
}


/* =====================================================
   COMPONENTS
===================================================== */

function StatCard({
  title,
  value,
  icon,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={statCardStyle}
    >
      <div style={statIconStyle}>
        {icon}
      </div>

      <div style={statTextStyle}>
        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>
      </div>
    </button>
  )
}


function QuickInfo({
  label,
  value,
}) {
  return (
    <div style={quickInfoStyle}>
      <small>
        {label}
      </small>

      <strong>
        {value || "Not provided"}
      </strong>
    </div>
  )
}


function Detail({
  label,
  value,
}) {
  let displayValue = value

  if (
    typeof value === "object" &&
    value !== null
  ) {
    displayValue = JSON.stringify(
      value,
      null,
      2
    )
  }

  return (
    <div style={detailItemStyle}>
      <strong>
        {label}
      </strong>

      <span>
        {displayValue !== null &&
        displayValue !== undefined &&
        displayValue !== ""
          ? String(displayValue)
          : "Not provided"}
      </span>
    </div>
  )
}


function LongDetail({
  label,
  value,
}) {
  let displayValue = value

  if (
    typeof value === "object" &&
    value !== null
  ) {
    displayValue = JSON.stringify(
      value,
      null,
      2
    )
  }

  return (
    <div style={longDetailStyle}>
      <strong>
        {label}
      </strong>

      <p>
        {displayValue
          ? String(displayValue)
          : "Not provided"}
      </p>
    </div>
  )
}


function DetailSection({
  title,
  children,
}) {
  return (
    <div style={detailSectionStyle}>
      <h4 style={detailHeadingStyle}>
        {title}
      </h4>

      {children}
    </div>
  )
}


function SimpleSection({
  title,
  subtitle,
  children,
}) {
  return (
    <div style={cardStyle}>
      <h2 style={subTitleStyle}>
        {title}
      </h2>

      <p style={sectionDescriptionStyle}>
        {subtitle}
      </p>

      {children}
    </div>
  )
}


function EmptyText({
  text,
}) {
  return (
    <div style={emptyStyle}>
      {text}
    </div>
  )
}


/* =====================================================
   STYLES
===================================================== */

const sectionStyle = {
  minHeight: "100vh",
  padding: "32px 24px 60px",
  background:
    "linear-gradient(135deg,#faf7fc 0%,#f5f8ff 100%)",
  fontFamily:
    "Arial, Helvetica, sans-serif",
  color: "#29232d",
}

const loadingStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f7f4f9",
  color: "#510a50",
}

const loadingBoxStyle = {
  textAlign: "center",
}

const spinnerStyle = {
  width: "36px",
  height: "36px",
  border: "4px solid #eadbea",
  borderTop: "4px solid #510a50",
  borderRadius: "50%",
  margin: "0 auto 15px",
  animation:
    "spin 1s linear infinite",
}

const headerStyle = {
  maxWidth: "1250px",
  margin: "0 auto 22px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
}

const brandTagStyle = {
  display: "inline-block",
  fontSize: "11px",
  fontWeight: "800",
  letterSpacing: "1.5px",
  color: "#8a428a",
  marginBottom: "5px",
}

const titleStyle = {
  color: "#510a50",
  margin: 0,
  fontSize: "30px",
}

const subtitleStyle = {
  color: "#777",
  marginTop: "5px",
  marginBottom: 0,
}

const logoutButton = {
  backgroundColor: "#510a50",
  color: "#fff",
  border: "none",
  padding: "11px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
}

const navigationStyle = {
  maxWidth: "1250px",
  margin: "0 auto 25px",
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  backgroundColor: "#fff",
  padding: "8px",
  borderRadius: "13px",
  boxShadow:
    "0 5px 20px rgba(81,10,80,0.06)",
}

const navButtonStyle = {
  border: "none",
  backgroundColor: "transparent",
  padding: "11px 15px",
  borderRadius: "9px",
  cursor: "pointer",
  color: "#555",
  fontWeight: "600",
}

const activeNavButtonStyle = {
  ...navButtonStyle,
  backgroundColor: "#510a50",
  color: "#fff",
}

const refreshButtonStyle = {
  border: "1px solid #ddd",
  backgroundColor: "#fff",
  color: "#510a50",
  padding: "10px 15px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "bold",
}

const cardStyle = {
  maxWidth: "1250px",
  margin: "0 auto 30px",
  backgroundColor: "#fff",
  padding: "25px",
  borderRadius: "16px",
  boxShadow:
    "0 10px 35px rgba(81,10,80,0.08)",
}

const subTitleStyle = {
  color: "#510a50",
  marginBottom: "5px",
  fontSize: "22px",
}

const sectionDescriptionStyle = {
  color: "#777",
  marginTop: 0,
  marginBottom: "20px",
}

const sectionEyebrowStyle = {
  color: "#a15ca1",
  fontSize: "11px",
  fontWeight: "800",
  letterSpacing: "1.3px",
  marginBottom: "5px",
}

const womenSectionStyle = {
  maxWidth: "1250px",
  margin: "0 auto 40px",
}

const womenHeaderStyle = {
  backgroundColor: "#fff",
  padding: "25px",
  borderRadius: "16px",
  boxShadow:
    "0 10px 35px rgba(81,10,80,0.08)",
  marginBottom: "18px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap",
  borderTop:
    "4px solid #510a50",
}

const womenTitleStyle = {
  color: "#510a50",
  margin: 0,
  fontSize: "25px",
}

const womenSubtitleStyle = {
  color: "#777",
  marginTop: "6px",
  marginBottom: 0,
}

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(145px,1fr))",
  gap: "12px",
  marginBottom: "18px",
}

const statCardStyle = {
  border: "1px solid #eee",
  backgroundColor: "#fff",
  padding: "15px",
  borderRadius: "13px",
  cursor: "pointer",
  textAlign: "left",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  boxShadow:
    "0 5px 18px rgba(0,0,0,0.04)",
}

const statIconStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "11px",
  backgroundColor: "#f7edf7",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#510a50",
  fontWeight: "bold",
}

const statTextStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
}

const filterPanelStyle = {
  backgroundColor: "#fff",
  padding: "15px",
  borderRadius: "14px",
  boxShadow:
    "0 5px 20px rgba(0,0,0,0.05)",
  display: "grid",
  gridTemplateColumns:
    "minmax(260px,2fr) repeat(4,minmax(130px,1fr)) auto",
  gap: "10px",
  alignItems: "center",
  marginBottom: "10px",
}

const searchWrapperStyle = {
  position: "relative",
}

const searchIconStyle = {
  position: "absolute",
  left: "12px",
  top: "50%",
  transform: "translateY(-50%)",
}

const searchInputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px 11px 38px",
  border: "1px solid #ddd",
  borderRadius: "9px",
  fontSize: "13px",
  outline: "none",
}

const filterSelectStyle = {
  width: "100%",
  padding: "11px",
  border: "1px solid #ddd",
  borderRadius: "9px",
  backgroundColor: "#fff",
  fontSize: "13px",
}

const clearFilterButtonStyle = {
  border: "none",
  backgroundColor: "#f3e8f3",
  color: "#510a50",
  padding: "11px 14px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "bold",
}

const resultInfoStyle = {
  color: "#777",
  fontSize: "13px",
  padding: "8px 3px 13px",
}

const applicationCardStyle = {
  border:
    "1px solid #e7dfe8",
  borderRadius: "15px",
  marginBottom: "15px",
  overflow: "hidden",
  backgroundColor: "#fff",
  boxShadow:
    "0 5px 20px rgba(81,10,80,0.04)",
}

const applicationHeaderStyle = {
  padding: "18px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap",
  backgroundColor: "#fcf9fc",
}

const applicantIdentityStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
}

const applicantAvatarStyle = {
  width: "46px",
  height: "46px",
  borderRadius: "50%",
  backgroundColor: "#510a50",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "19px",
  fontWeight: "bold",
}

const applicantNameStyle = {
  margin: 0,
  color: "#510a50",
  fontSize: "19px",
}

const applicationNumberStyle = {
  margin: "5px 0 3px",
  color: "#555",
  fontSize: "13px",
}

const smallTextStyle = {
  margin: 0,
  color: "#888",
  fontSize: "12px",
}

const applicationHeaderRightStyle = {
  display: "flex",
  gap: "7px",
  flexWrap: "wrap",
  alignItems: "center",
}

const statusBadgeStyle = {
  padding: "7px 11px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: "800",
}

const paidBadgeStyle = {
  backgroundColor: "#dcfce7",
  color: "#166534",
  padding: "7px 11px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: "800",
}

const unpaidBadgeStyle = {
  backgroundColor: "#fff1f2",
  color: "#be123c",
  padding: "7px 11px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: "800",
}

const quickInfoGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(160px,1fr))",
  gap: "1px",
  backgroundColor: "#eee",
  borderTop: "1px solid #eee",
  borderBottom: "1px solid #eee",
}

const quickInfoStyle = {
  backgroundColor: "#fff",
  padding: "12px 15px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
}

const applicationActionBarStyle = {
  display: "flex",
  gap: "8px",
  padding: "10px",
  backgroundColor: "#fff",
}

const viewButtonStyle = {
  flex: 1,
  border: "none",
  backgroundColor: "#f7f0f7",
  color: "#510a50",
  padding: "11px",
  fontWeight: "bold",
  cursor: "pointer",
  borderRadius: "8px",
}

const deleteApplicationButtonStyle = {
  border: "none",
  backgroundColor: "#fff1f2",
  color: "#be123c",
  padding: "11px 15px",
  fontWeight: "bold",
  cursor: "pointer",
  borderRadius: "8px",
}

const expandedContentStyle = {
  padding: "20px",
  backgroundColor: "#fff",
}

const detailSectionStyle = {
  padding: "20px 0",
  borderBottom: "1px solid #eee",
}

const detailHeadingStyle = {
  color: "#510a50",
  fontSize: "18px",
  marginTop: 0,
  marginBottom: "15px",
}

const detailGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "10px",
}

const detailItemStyle = {
  backgroundColor: "#fafafa",
  padding: "11px",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  overflowWrap: "anywhere",
}

const longDetailStyle = {
  marginTop: "12px",
  backgroundColor: "#fafafa",
  padding: "14px",
  borderRadius: "8px",
  lineHeight: 1.6,
  overflowWrap: "anywhere",
}

const membershipAmountStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#fff7ed",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "12px",
}

const membershipStatusBox = {
  display: "flex",
  gap: "30px",
  flexWrap: "wrap",
  backgroundColor: "#fafafa",
  padding: "14px",
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
    "repeat(auto-fit,minmax(200px,1fr))",
  gap: "12px",
  marginTop: "15px",
  alignItems: "end",
}

const fieldLabelStyle = {
  display: "block",
  marginBottom: "5px",
  fontWeight: "bold",
  fontSize: "13px",
}

const adminInputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "13px",
}

const paidButtonStyle = {
  backgroundColor: "#15803d",
  color: "#fff",
  border: "none",
  padding: "11px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
}

const markUnpaidButtonStyle = {
  marginTop: "12px",
  backgroundColor: "#fff1f2",
  color: "#be123c",
  border: "none",
  padding: "10px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
}

const documentsGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(250px,1fr))",
  gap: "10px",
}

const documentCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  padding: "12px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
}

const documentIconStyle = {
  fontSize: "23px",
}

const documentInfoStyle = {
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  overflowWrap: "anywhere",
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

const noDocumentsStyle = {
  backgroundColor: "#fafafa",
  padding: "20px",
  borderRadius: "9px",
  color: "#777",
  textAlign: "center",
}

const benefitsListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  marginBottom: "15px",
}

const benefitItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  backgroundColor: "#f8fafc",
  padding: "12px",
  borderRadius: "9px",
}

const benefitFormStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(170px,1fr))",
  gap: "10px",
}

const addBenefitButtonStyle = {
  border: "none",
  backgroundColor: "#510a50",
  color: "#fff",
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
}

const smallDeleteButtonStyle = {
  border: "none",
  backgroundColor: "#fee2e2",
  color: "#991b1b",
  padding: "7px 10px",
  borderRadius: "7px",
  cursor: "pointer",
}

const sensitiveWarningStyle = {
  backgroundColor: "#fff7ed",
  color: "#9a3412",
  padding: "10px 12px",
  borderRadius: "8px",
  marginBottom: "12px",
  fontSize: "13px",
}

const statusButtonsStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
}

const approveButtonStyle = {
  backgroundColor: "#15803d",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
}

const reviewButtonStyle = {
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
}

const rejectButtonStyle = {
  backgroundColor: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
}

const pendingButtonStyle = {
  backgroundColor: "#d97706",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
}

const remarksInputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  resize: "vertical",
  fontFamily: "Arial,sans-serif",
  fontSize: "14px",
}

const saveRemarksButtonStyle = {
  marginTop: "9px",
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
  padding: "45px 20px",
  backgroundColor: "#fff",
  borderRadius: "14px",
  color: "#777",
  boxShadow:
    "0 5px 20px rgba(0,0,0,0.04)",
}

const emptyIconStyle = {
  fontSize: "35px",
  marginBottom: "8px",
}

const itemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "13px 0",
  borderBottom: "1px solid #eee",
  gap: "20px",
}

const deleteBtn = {
  backgroundColor: "#fff1f2",
  color: "#be123c",
  border: "none",
  padding: "8px 12px",
  borderRadius: "7px",
  cursor: "pointer",
  fontWeight: "bold",
}