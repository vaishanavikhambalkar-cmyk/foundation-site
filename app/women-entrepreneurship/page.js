"use client";

import { useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { supabase } from "../../lib/supabase";

const REGISTRATION_END = new Date("2026-11-19T23:59:59+05:30");

const initialForm = {
  name: "",
  date_of_birth: "",
  phone: "",
  email: "",
  aadhaar_number: "",
  registration_number: "",
  zone: "",
  ration_card_number: "",
  voter_id_number: "",
  ration_card_type: "",
  education: "",
  livelihood_source: "",

  single_woman_type: "",
  is_disabled_single_woman: "",
  proof_document_number: "",
  proof_document_date: "",
  single_woman_proof_name: "",

  full_address: "",
  city_area_ward: "",
  city: "",
  district: "",
  pincode: "",
  residence_type: "",
  land_details: "",

  total_family_members: "",
  total_children: "",
  sons: "",
  daughters: "",
  children_below_18: "",
  children_education: "",
  child_care_scholarship: "",
  child_details: [
    { name: "", age: "", education: "", disabled: "" },
  ],

  educational_qualification: "",
  current_business_employment: "",
  woman_monthly_income: "",
  family_annual_income: "",
  saving_group_member: "",
  skills: [],
  other_skill: "",
  wants_self_employment: "",
  receiving_government_scheme: "",
  required_support: [],

  existing_business: false,
  business_name: "",
  business_type: "",
  business_address: "",
  business_duration: "",
  monthly_income: "",
  proposed_business: "",
  investment_required: "",
  business_plan: "",
  support_required: "",

  bank_name: "",
  branch_name: "",
  account_number: "",
  ifsc_code: "",
  account_holder_name: "",

  major_need: "",
  place: "",
  declaration_date: "",
};

const initialDocuments = {
  photo: null,
  single_woman_proof: null,
  aadhaar: null,
  pan_card: null,
  ration_card: null,
  voter_id: null,
  bank_passbook: null,
  income_certificate: null,
  disability_certificate: null,
  other: null,
};

const translations = {
  mr: {
    title: "जिजामाता एकल महिला उद्योजक योजना",
    subtitle: "ओजल मायक्रो सर्विस फाऊंडेशनचा महिला सक्षमीकरण उपक्रम",
    language: "भाषा",
    programInfo: "योजनेची माहिती",
    purpose:
      "राज्यातील महिला भगिनींच्या आर्थिक, मानसिक, वैचारिक स्वातंत्र्यासाठी तसेच आरोग्य, पोषण व बाल विकासामध्ये सुधारणा करण्यासाठी आणि कुटुंबातील त्यांची निर्णायक भूमिका मजबूत करण्यासाठी ओजल मायक्रो सर्विस फाऊंडेशन (OMSF) मार्फत एकल महिला उद्योजक तसेच सूक्ष्म व लघु उद्योजक सर्व महिला भगिनींना आत्मनिर्भर व स्वावलंबी करण्याच्या उद्देशाने हा उपक्रम राबविण्यात येत आहे.",
    registration:
      "ओजल मायक्रो सर्विस फाऊंडेशन (OMSF) तर्फे सभासद नोंदणी उपक्रम 01/09/2026 पासून सुरू करण्यात आलेला असून 19/11/2026 पर्यंत या उपक्रमांतर्गत नोंदणी करण्यात येणार आहे.",
    eligibility:
      "महाराष्ट्रातील 18 ते 55 वयोगटातील पात्र महिला भगिनींसाठी हा उपक्रम आहे.",
    benefit:
      "5 वर्षांच्या कालावधीकरिता वार्षिक ₹1,500/- आर्थिक लाभ देण्यात येणार आहे. दिलेल्या माहितीनुसार हा लाभ आंतरराष्ट्रीय महिला उद्योजक दिन, 19 नोव्हेंबर 2027 पासून देण्यात येणार आहे.",
    request:
      "तरी या योजनेचा जास्तीत जास्त महिला भगिनींनी लाभ घ्यावा, ही नम्र विनंती.",
    membership:
      "सभासद नोंदणी शुल्क ₹1,500/- आहे. अर्ज सादरल्यानंतर फाउंडेशनकडून सदस्यत्व व कागदपत्रांची पडताळणी केली जाईल.",
    sectionPersonal: "1. वैयक्तिक माहिती",
    sectionSingle: "2. एकल महिला व पात्रता माहिती",
    sectionAddress: "3. पत्ता व निवासाची माहिती",
    sectionFamily: "4. कुटुंब व अपत्यांची माहिती",
    sectionSkills: "5. शिक्षण, कौशल्य व रोजगार",
    sectionBusiness: "6. व्यवसाय / स्वयंरोजगार माहिती",
    sectionSupport: "7. शासकीय योजना व आवश्यक सहाय्य",
    sectionBank: "8. बँक खात्याची माहिती",
    sectionDocuments: "9. आवश्यक कागदपत्रे",
    sectionDeclaration: "10. घोषणा व प्रतिज्ञा",
    name: "पूर्ण नाव",
    dob: "जन्मतारीख",
    phone: "मोबाईल क्रमांक",
    email: "ई-मेल",
    aadhaar: "आधार क्रमांक",
    registrationNo: "नोंदणी क्रमांक",
    zone: "झोन / क्षेत्र",
    rationNo: "रेशन कार्ड क्रमांक",
    voterId: "मतदार ओळखपत्र क्रमांक",
    rationType: "रेशन कार्ड प्रकार",
    education: "शिक्षण",
    livelihood: "उदरनिर्वाहाचे साधन",
    singleType: "एकल महिलेचा प्रकार",
    disabled: "दिव्यांग एकल महिला?",
    proofNo: "पुरावा क्रमांक",
    proofDate: "पुरावा दिनांक",
    proofName: "एकल महिला पुराव्याचे नाव",
    fullAddress: "संपूर्ण पत्ता",
    cityAreaWard: "शहर / परिसर / प्रभाग",
    city: "शहर",
    district: "जिल्हा",
    pincode: "पिनकोड",
    residence: "निवासाचा प्रकार",
    land: "जमिनीचा तपशील",
    familyTotal: "कुटुंबातील एकूण सदस्य",
    childrenTotal: "एकूण मुले",
    sons: "मुलगे",
    daughters: "मुली",
    below18: "18 वर्षांखालील मुले",
    childrenEducation: "मुले शिक्षण घेत आहेत का?",
    scholarship: "बाल संगोपन शिष्यवृत्ती मिळते का?",
    childDetails: "अपत्यांची माहिती",
    childName: "मुलाचे / मुलीचे नाव",
    childAge: "वय",
    childEducation: "शिक्षण",
    childDisabled: "दिव्यांग?",
    addChild: "अपत्य जोडा",
    remove: "काढा",
    qualification: "शैक्षणिक पात्रता",
    currentWork: "सध्याचा व्यवसाय / रोजगार",
    womanIncome: "महिलेचे मासिक उत्पन्न",
    familyIncome: "कुटुंबाचे वार्षिक उत्पन्न",
    savingGroup: "बचत गट / स्वयं-सहायता गट सदस्य?",
    skills: "कौशल्ये",
    otherSkill: "इतर कौशल्य",
    selfEmployment: "स्वयंरोजगार सुरू करण्याची इच्छा आहे का?",
    govtScheme: "शासकीय योजनेचा लाभ घेत आहे का?",
    existingBusiness: "माझा आधीपासून व्यवसाय आहे",
    businessName: "व्यवसायाचे नाव",
    businessType: "व्यवसायाचा प्रकार",
    businessAddress: "व्यवसायाचा पत्ता",
    businessDuration: "व्यवसायाचा कालावधी",
    monthlyIncome: "मासिक व्यवसाय उत्पन्न",
    proposedBusiness: "प्रस्तावित व्यवसाय",
    investment: "आवश्यक गुंतवणूक",
    businessPlan: "व्यवसाय योजना / वर्णन",
    support: "आवश्यक सहाय्य",
    requiredSupport: "आपल्याला कोणते सहाय्य आवश्यक आहे?",
    bankName: "बँकेचे नाव",
    branchName: "शाखेचे नाव",
    accountNo: "खाते क्रमांक",
    ifsc: "IFSC कोड",
    holder: "खातेदाराचे नाव",
    majorNeed: "प्रमुख गरज / अपेक्षित सहाय्य",
    place: "स्थळ",
    declarationDate: "घोषणा दिनांक",
    photo: "पासपोर्ट आकाराचा फोटो",
    singleProof: "एकल महिला असल्याचा पुरावा",
    aadhaarDoc: "आधार कार्ड",
    panDoc:"पॅन कार्ड",
    rationDoc: "रेशन कार्ड",
    voterDoc: "मतदार ओळखपत्र",
    bankDoc: "बँक पासबुक / रद्द केलेला धनादेश",
    incomeDoc: "उत्पन्नाचा दाखला",
    disabilityDoc: "दिव्यांग प्रमाणपत्र",
    otherDoc: "इतर संबंधित कागदपत्र",
    required: "आवश्यक",
    optional: "ऐच्छिक",
    terms: "अटी व शर्ती",
    termsList: [
      "अर्जातील सर्व माहिती खरी व अचूक असणे आवश्यक आहे.",
      "खोटी किंवा दिशाभूल करणारी माहिती आढळल्यास अर्ज रद्द केला जाऊ शकतो.",
      "सभासद नोंदणी शुल्क ₹1,500/- आहे.",
      "सभासदत्व किंवा अर्ज सादर केल्याने आर्थिक लाभ मिळण्याची हमी होत नाही.",
      "लाभ व सहाय्य फाउंडेशनच्या पडताळणी, नियम व उपलब्ध संसाधनांनुसार दिले जातील.",
      "फाउंडेशन अर्जातील माहिती व कागदपत्रांची पडताळणी करू शकते.",
      "अर्जदाराने फाउंडेशनला आवश्यक सहकार्य करणे अपेक्षित आहे.",
    ],
    acceptTerms: "मी वरील अटी व शर्ती वाचल्या असून मला त्या मान्य आहेत.",
    declaration:
      "मी याद्वारे घोषित करते की या अर्जामध्ये दिलेली सर्व माहिती माझ्या माहितीनुसार खरी व अचूक आहे. मी कोणतीही महत्त्वाची माहिती लपविलेली नाही. मी फाउंडेशनच्या योजनेचे नियम व अटी वाचल्या असून मला मान्य आहेत.",
    acceptDeclaration: "मी वरील घोषणा मान्य करून अर्ज सादर करत आहे.",
    generate: "प्रतिज्ञापत्र तयार / डाउनलोड करा",
    submit: "अर्ज सादर करा",
    submitting: "अर्ज सादर होत आहे...",
    success: "अर्ज यशस्वीरित्या सादर झाला!",
    successText: "आपला अर्ज फाउंडेशनकडे प्राप्त झाला आहे. कृपया अर्ज क्रमांक जतन करा.",
    applicationNo: "आपला अर्ज क्रमांक",
    download: "प्रतिज्ञापत्र डाउनलोड करा",
    home: "मुख्य पृष्ठ",
    fillRequired: "कृपया सर्व आवश्यक माहिती भरा.",
    ageError: "या योजनेसाठी वय 18 ते 55 वर्षे असणे आवश्यक आहे.",
    cutoffError: "नोंदणीची अंतिम तारीख 19/11/2026 आहे.",
    docsRequired: "कृपया आवश्यक कागदपत्रे अपलोड करा.",
    acceptBoth: "कृपया अटी व घोषणा स्वीकारा.",
    submitError: "अर्ज सादर करताना समस्या आली.",
    pdfError: "प्रतिज्ञापत्र तयार करताना समस्या आली.",
    yes: "होय",
    no: "नाही",
    widow: "विधवा",
    deserted: "परित्यक्ता",
    divorced: "घटस्फोटित",
    unmarried35: "अविवाहित (35 वर्षांपेक्षा जास्त)",
    other: "इतर",
    select: "निवडा",
  },
  hi: {
    title: "जिजामाता एकल महिला उद्यमी योजना",
    subtitle: "ओजल माइक्रो सर्विस फाउंडेशन की महिला सशक्तिकरण पहल",
    language: "भाषा",
    programInfo: "योजना की जानकारी",
    purpose: "राज्य की महिलाओं के आर्थिक, मानसिक और वैचारिक स्वावलंबन, स्वास्थ्य, पोषण, बाल विकास तथा परिवार में उनकी निर्णायक भूमिका को मजबूत करने के उद्देश्य से OMSF द्वारा यह पहल चलाई जा रही है।",
    registration: "सदस्य पंजीकरण 01/09/2026 से शुरू है और 19/11/2026 तक किया जाएगा।",
    eligibility: "महाराष्ट्र की 18 से 55 वर्ष आयु की पात्र महिलाएं इस पहल के लिए आवेदन कर सकती हैं।",
    benefit: "5 वर्षों के लिए वार्षिक ₹1,500/- आर्थिक लाभ दिया जाएगा। दी गई जानकारी के अनुसार लाभ 19 नवंबर 2027 से दिया जाना है।",
    request: "अधिक से अधिक महिला बहनें इस योजना का लाभ लें।",
    membership: "सदस्य पंजीकरण शुल्क ₹1,500/- है। आवेदन के बाद फाउंडेशन द्वारा सत्यापन किया जाएगा।",
    sectionPersonal: "1. व्यक्तिगत जानकारी",
    sectionSingle: "2. एकल महिला और पात्रता जानकारी",
    sectionAddress: "3. पता और निवास",
    sectionFamily: "4. परिवार और बच्चों की जानकारी",
    sectionSkills: "5. शिक्षा, कौशल और रोजगार",
    sectionBusiness: "6. व्यवसाय / स्वरोजगार",
    sectionSupport: "7. सरकारी योजना और सहायता",
    sectionBank: "8. बैंक खाते की जानकारी",
    sectionDocuments: "9. आवश्यक दस्तावेज",
    sectionDeclaration: "10. घोषणा और प्रतिज्ञा",
    name: "पूरा नाम", dob: "जन्म तारीख", phone: "मोबाइल नंबर", email: "ई-मेल",
    aadhaar: "आधार नंबर", registrationNo: "पंजीकरण नंबर", zone: "जोन / क्षेत्र",
    rationNo: "राशन कार्ड नंबर", voterId: "मतदाता पहचान पत्र", rationType: "राशन कार्ड प्रकार",
    education: "शिक्षा", livelihood: "आजीविका का साधन", singleType: "एकल महिला का प्रकार",
    disabled: "दिव्यांग एकल महिला?", proofNo: "प्रमाण नंबर", proofDate: "प्रमाण तारीख",
    proofName: "एकल महिला प्रमाण का नाम", fullAddress: "पूरा पता", cityAreaWard: "शहर / क्षेत्र / वार्ड",
    city: "शहर", district: "जिला", pincode: "पिनकोड", residence: "निवास का प्रकार", land: "भूमि विवरण",
    familyTotal: "कुल परिवार सदस्य", childrenTotal: "कुल बच्चे", sons: "बेटे", daughters: "बेटियां",
    below18: "18 वर्ष से कम बच्चे", childrenEducation: "क्या बच्चे पढ़ रहे हैं?", scholarship: "बाल देखभाल छात्रवृत्ति?",
    childDetails: "बच्चों का विवरण", childName: "नाम", childAge: "आयु", childEducation: "शिक्षा", childDisabled: "दिव्यांग?",
    addChild: "बच्चा जोड़ें", remove: "हटाएं", qualification: "शैक्षणिक योग्यता", currentWork: "वर्तमान व्यवसाय / रोजगार",
    womanIncome: "महिला की मासिक आय", familyIncome: "परिवार की वार्षिक आय", savingGroup: "बचत समूह सदस्य?",
    skills: "कौशल", otherSkill: "अन्य कौशल", selfEmployment: "क्या स्वरोजगार शुरू करना चाहती हैं?",
    govtScheme: "क्या सरकारी योजना का लाभ ले रही हैं?", existingBusiness: "मेरा पहले से व्यवसाय है",
    businessName: "व्यवसाय का नाम", businessType: "व्यवसाय का प्रकार", businessAddress: "व्यवसाय का पता",
    businessDuration: "व्यवसाय की अवधि", monthlyIncome: "मासिक व्यवसाय आय", proposedBusiness: "प्रस्तावित व्यवसाय",
    investment: "आवश्यक निवेश", businessPlan: "व्यवसाय योजना / विवरण", support: "आवश्यक सहायता",
    requiredSupport: "किस प्रकार की सहायता चाहिए?", bankName: "बैंक का नाम", branchName: "शाखा",
    accountNo: "खाता नंबर", ifsc: "IFSC कोड", holder: "खाताधारक का नाम", majorNeed: "मुख्य आवश्यकता / सहायता",
    place: "स्थान", declarationDate: "घोषणा तारीख", photo: "पासपोर्ट फोटो", singleProof: "एकल महिला प्रमाण",
    aadhaarDoc: "आधार कार्ड", rationDoc: "राशन कार्ड", voterDoc: "मतदाता पहचान पत्र",
    bankDoc: "बैंक पासबुक / रद्द चेक", incomeDoc: "आय प्रमाण", disabilityDoc: "दिव्यांग प्रमाण",
    panDoc: "पॅन कार्ड", otherDoc: "अन्य दस्तावेज", required: "आवश्यक", optional: "वैकल्पिक", terms: "नियम और शर्तें",
    termsList: [
      "आवेदन में दी गई सभी जानकारी सही होनी चाहिए।",
      "गलत जानकारी मिलने पर आवेदन रद्द किया जा सकता है।",
      "सदस्य पंजीकरण शुल्क ₹1,500/- है।",
      "सदस्यता या आवेदन जमा करने से आर्थिक लाभ की गारंटी नहीं होती।",
      "लाभ फाउंडेशन के सत्यापन, नियम और उपलब्ध संसाधनों के अनुसार दिए जाएंगे।",
      "फाउंडेशन आवेदन और दस्तावेजों का सत्यापन कर सकता है।",
      "आवेदक को फाउंडेशन के साथ आवश्यक सहयोग करना होगा।",
    ],
    acceptTerms: "मैंने नियम और शर्तें पढ़ ली हैं और मुझे स्वीकार हैं।",
    declaration: "मैं घोषित करती हूं कि आवेदन में दी गई सभी जानकारी मेरी जानकारी के अनुसार सही है। मैंने कोई महत्वपूर्ण जानकारी नहीं छिपाई है।",
    acceptDeclaration: "मैं घोषणा स्वीकार करके आवेदन जमा कर रही हूं।",
    generate: "प्रतिज्ञापत्र तैयार / डाउनलोड करें", submit: "आवेदन जमा करें", submitting: "आवेदन जमा हो रहा है...",
    success: "आवेदन सफलतापूर्वक जमा हुआ!", successText: "आपका आवेदन फाउंडेशन को प्राप्त हो गया है। आवेदन नंबर सुरक्षित रखें।",
    applicationNo: "आपका आवेदन नंबर", download: "प्रतिज्ञापत्र डाउनलोड करें", home: "मुख्य पृष्ठ",
    fillRequired: "कृपया सभी आवश्यक जानकारी भरें।", ageError: "इस योजना के लिए आयु 18 से 55 वर्ष होनी चाहिए।",
    cutoffError: "पंजीकरण की अंतिम तारीख 19/11/2026 है।", docsRequired: "कृपया आवश्यक दस्तावेज अपलोड करें।",
    acceptBoth: "कृपया नियम और घोषणा स्वीकार करें।", submitError: "आवेदन जमा करते समय समस्या हुई।", pdfError: "प्रतिज्ञापत्र बनाते समय समस्या हुई।",
    yes: "हां", no: "नहीं", widow: "विधवा", deserted: "परित्यक्ता", divorced: "तलाकशुदा", unmarried35: "अविवाहित (35 वर्ष से अधिक)", other: "अन्य", select: "चुनें",
  },
  en: {
    title: "Jijamata Ekl Mahila Udyogjak Yojana",
    subtitle: "Ojal Micro Service Foundation women empowerment initiative",
    language: "Language",
    programInfo: "Scheme Information",
    purpose: "This initiative is being conducted by OMSF to promote the economic, mental and intellectual independence of women, improve health, nutrition and child development, strengthen women's decision-making role in the family, and make single women entrepreneurs and micro/small women entrepreneurs self-reliant.",
    registration: "OMSF membership registration started on 01/09/2026 and registrations under this initiative will be accepted until 19/11/2026.",
    eligibility: "Eligible women aged 18 to 55 years residing in Maharashtra may apply.",
    benefit: "An annual financial benefit of ₹1,500/- is stated to be provided for 5 years. As provided by the foundation, the benefit will start from 19 November 2027.",
    request: "Women are requested to take maximum benefit of this initiative.",
    membership: "Membership registration fee is ₹1,500/-. Membership and documents will be verified by the foundation after submission.",
    sectionPersonal: "1. Personal Information", sectionSingle: "2. Single Woman & Eligibility",
    sectionAddress: "3. Address & Residence", sectionFamily: "4. Family & Children",
    sectionSkills: "5. Education, Skills & Employment", sectionBusiness: "6. Business / Self Employment",
    sectionSupport: "7. Government Schemes & Support", sectionBank: "8. Bank Account",
    sectionDocuments: "9. Required Documents", sectionDeclaration: "10. Declaration & Undertaking",
    name: "Full Name", dob: "Date of Birth", phone: "Mobile Number", email: "Email",
    aadhaar: "Aadhaar Number", registrationNo: "Registration Number", zone: "Zone / Area",
    rationNo: "Ration Card Number", voterId: "Voter ID Number", rationType: "Ration Card Type",
    education: "Education", livelihood: "Livelihood Source", singleType: "Single Woman Type",
    disabled: "Disabled single woman?", proofNo: "Proof Document Number", proofDate: "Proof Document Date",
    proofName: "Single Woman Proof Name", fullAddress: "Full Address", cityAreaWard: "City / Area / Ward",
    city: "City", district: "District", pincode: "Pincode", residence: "Residence Type", land: "Land Details",
    familyTotal: "Total Family Members", childrenTotal: "Total Children", sons: "Sons", daughters: "Daughters",
    below18: "Children Below 18", childrenEducation: "Are children studying?", scholarship: "Child-care scholarship?",
    childDetails: "Child Details", childName: "Name", childAge: "Age", childEducation: "Education", childDisabled: "Disabled?",
    addChild: "Add Child", remove: "Remove", qualification: "Educational Qualification", currentWork: "Current Business / Employment",
    womanIncome: "Woman's Monthly Income", familyIncome: "Family Annual Income", savingGroup: "Saving Group Member?",
    skills: "Skills", otherSkill: "Other Skill", selfEmployment: "Want to start self-employment?",
    govtScheme: "Receiving a government scheme?", existingBusiness: "I already have a business",
    businessName: "Business Name", businessType: "Business Type", businessAddress: "Business Address",
    businessDuration: "Business Duration", monthlyIncome: "Monthly Business Income", proposedBusiness: "Proposed Business",
    investment: "Required Investment", businessPlan: "Business Plan / Description", support: "Support Required",
    requiredSupport: "What support do you need?", bankName: "Bank Name", branchName: "Branch Name",
    accountNo: "Account Number", ifsc: "IFSC Code", holder: "Account Holder Name", majorNeed: "Major Need / Expected Support",
    place: "Place", declarationDate: "Declaration Date", photo: "Passport-size Photo", singleProof: "Single Woman Proof",
    aadhaarDoc: "Aadhaar Card", panDoc: "PAN Card", rationDoc: "Ration Card", voterDoc: "Voter ID", bankDoc: "Bank Passbook / Cancelled Cheque",
    incomeDoc: "Income Certificate", disabilityDoc: "Disability Certificate", otherDoc: "Other Related Document",
    required: "Required", optional: "Optional", terms: "Terms & Conditions",
    termsList: [
      "All information provided in the application must be true and accurate.",
      "The application may be rejected if false or misleading information is found.",
      "Membership registration fee is ₹1,500/-.", 
      "Membership or application submission does not guarantee financial assistance.",
      "Benefits and support are subject to foundation verification, rules and available resources.",
      "The foundation may verify the application information and documents.",
      "The applicant must cooperate with the foundation team when required.",
    ],
    acceptTerms: "I have read and agree to the above terms and conditions.",
    declaration: "I declare that all information provided in this application is true and accurate to the best of my knowledge. I have not hidden any important information.",
    acceptDeclaration: "I accept the declaration and am submitting this application.",
    generate: "Prepare / Download Pratidnya Patra", submit: "Submit Application", submitting: "Submitting Application...",
    success: "Application Submitted Successfully!", successText: "Your application has been received by the foundation. Please save your application number.",
    applicationNo: "Your Application Number", download: "Download Pratidnya Patra", home: "Home",
    fillRequired: "Please fill all required information.", ageError: "Applicants must be 18 to 55 years old for this scheme.",
    cutoffError: "The registration deadline is 19/11/2026.", docsRequired: "Please upload all required documents.",
    acceptBoth: "Please accept the terms and declaration.", submitError: "There was a problem submitting the application.", pdfError: "There was a problem generating the Pratidnya Patra.",
    yes: "Yes", no: "No", widow: "Widow", deserted: "Deserted", divorced: "Divorced", unmarried35: "Unmarried (above 35)", other: "Other", select: "Select",
  },
};

const skillOptions = {
  mr: ["शिवणकाम", "खाद्यपदार्थ / पाककला", "ब्युटी / पार्लर", "हस्तकला", "शेती / पशुपालन", "डिजिटल / संगणक", "व्यापार / विक्री", "इतर"],
  hi: ["सिलाई", "खाद्य / पाककला", "ब्यूटी / पार्लर", "हस्तकला", "कृषि / पशुपालन", "डिजिटल / कंप्यूटर", "व्यापार / बिक्री", "अन्य"],
  en: ["Tailoring", "Food / Cooking", "Beauty / Parlour", "Handicraft", "Agriculture / Livestock", "Digital / Computer", "Trade / Sales", "Other"],
};

const supportOptions = {
  mr: ["आर्थिक सहाय्य", "घरकुल", "रोजगार / स्वयंरोजगार", "कौशल्य प्रशिक्षण", "शैक्षणिक सहाय्य", "आरोग्य सुविधा", "बचत गट / स्वयं-सहायता गट", "इतर"],
  hi: ["आर्थिक सहायता", "आवास", "रोजगार / स्वरोजगार", "कौशल प्रशिक्षण", "शैक्षणिक सहायता", "स्वास्थ्य सुविधा", "बचत समूह", "अन्य"],
  en: ["Financial assistance", "Housing", "Employment / Self-employment", "Skill training", "Education support", "Health facilities", "Saving / Self-help group", "Other"],
};

export default function WomenEntrepreneurshipPage() {
  const [language, setLanguage] = useState("mr");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");
  const [form, setForm] = useState(initialForm);
  const [documents, setDocuments] = useState(initialDocuments);
  const formRef = useRef(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  const t = translations[language];
  const today = new Date();

  const registrationClosed = today > REGISTRATION_END;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocuments((p) => ({ ...p, [type]: file }));
  };

  const toggleArrayValue = (field, value) => {
    setForm((p) => ({
      ...p,
      [field]: p[field].includes(value)
        ? p[field].filter((x) => x !== value)
        : [...p[field], value],
    }));
  };

  const addChild = () => {
    setForm((p) => ({
      ...p,
      child_details: [...p.child_details, { name: "", age: "", education: "", disabled: "" }],
    }));
  };

  const updateChild = (index, field, value) => {
    setForm((p) => ({
      ...p,
      child_details: p.child_details.map((child, i) =>
        i === index ? { ...child, [field]: value } : child
      ),
    }));
  };

  const removeChild = (index) => {
    setForm((p) => ({
      ...p,
      child_details: p.child_details.filter((_, i) => i !== index),
    }));
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birth = new Date(`${dob}T00:00:00`);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const getApplicationNumber = () => {
    const now = new Date();
    const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `OJAL-JME-${date}-${random}`;
  };

  const getPratidnyaText = (appNumber) => {
    if (language === "mr") {
      return {
        heading: "प्रतिज्ञापत्र",
        program: "जिजामाता एकल महिला उद्योजक योजना",
        declaration: `मी, श्रीमती/कुमारी ${form.name}, याद्वारे घोषित करते की या अर्जामध्ये दिलेली सर्व माहिती माझ्या माहितीनुसार खरी व अचूक आहे.`,
        terms: "मी या योजनेच्या सर्व अटी व शर्ती वाचल्या असून त्या मला मान्य आहेत.",
        incorrect: "माझ्याकडून दिलेली माहिती किंवा कागदपत्रे चुकीची आढळल्यास माझा अर्ज रद्द करण्यात यावा व योजनेचा लाभ थांबविण्यात यावा, यास माझी संमती आहे.",
        support: "योजनेच्या मार्गदर्शक तत्त्वांचे पालन करणे व संस्थेचे सर्व नियम व अटी मला मान्य आहेत.",
        name: "अर्जदाराचे नाव", phone: "मोबाईल क्रमांक", date: "दिनांक", number: "अर्ज क्रमांक",
        address: "पत्ता", district: "जिल्हा",
      };
    }
    if (language === "hi") {
      return {
        heading: "प्रतिज्ञापत्र",
        program: "जिजामाता एकल महिला उद्यमी योजना",
        declaration: `मैं, श्रीमती/कुमारी ${form.name}, घोषित करती हूं कि इस आवेदन में दी गई सभी जानकारी मेरी जानकारी के अनुसार सही और सटीक है।`,
        terms: "मैंने योजना के सभी नियम और शर्तें पढ़ ली हैं और मुझे स्वीकार हैं।",
        incorrect: "यदि मेरे द्वारा दी गई जानकारी या दस्तावेज गलत पाए जाते हैं, तो मेरा आवेदन रद्द किया जा सकता है और लाभ रोका जा सकता है।",
        support: "मैं योजना के दिशानिर्देशों तथा संस्था के सभी नियमों और शर्तों का पालन करने के लिए सहमत हूं।",
        name: "आवेदक का नाम", phone: "मोबाइल नंबर", date: "दिनांक", number: "आवेदन नंबर",
        address: "पता", district: "जिला",
      };
    }
    return {
      heading: "Applicant Undertaking",
      program: "Jijamata Ekl Mahila Udyogjak Yojana",
      declaration: `I, ${form.name}, hereby declare that all information provided in this application is true and accurate to the best of my knowledge.`,
      terms: "I have read and agree to all terms and conditions of the scheme.",
      incorrect: "If the information or documents provided by me are found to be incorrect, my application may be cancelled and benefits may be stopped.",
      support: "I agree to follow the scheme guidelines and all rules and conditions of the foundation.",
      name: "Applicant Name", phone: "Mobile Number", date: "Date", number: "Application Number",
      address: "Address", district: "District",
    };
  };

  const generatePratidnyaBlob = async (appNumber) => {
    const p = getPratidnyaText(appNumber);
    const wrapper = document.createElement("div");
    Object.assign(wrapper.style, {
      position: "fixed",
      left: "-10000px",
      top: "0",
      width: "794px",
      minHeight: "1123px",
      boxSizing: "border-box",
      background: "#fff",
      color: "#171717",
      padding: "48px 55px",
      fontFamily: "Noto Sans Devanagari, Arial, sans-serif",
      fontSize: "17px",
      lineHeight: "1.7",
    });

    wrapper.innerHTML = `
      <div style="border:3px solid #4c1d95;padding:10px;min-height:1010px;box-sizing:border-box;">
        <div style="border:1px solid #d4a72c;padding:22px 28px;min-height:950px;box-sizing:border-box;">
          <div style="text-align:center;font-size:15px;font-weight:700;color:#4c1d95;">OJAL MICRO SERVICE FOUNDATION</div>
          <h1 style="text-align:center;color:#3b176d;font-size:28px;margin:12px 0 6px;">${escapeHtml(p.program)}</h1>
          <div style="text-align:center;color:#7f1d1d;font-size:25px;font-weight:800;margin:18px 0 25px;">${escapeHtml(p.heading)}</div>
          <div style="font-size:16px;margin-bottom:18px;">
            <p><strong>${escapeHtml(p.name)}:</strong> ${escapeHtml(form.name)}</p>
            <p><strong>${escapeHtml(p.phone)}:</strong> ${escapeHtml(form.phone)}</p>
            <p><strong>${escapeHtml(p.number)}:</strong> ${escapeHtml(appNumber)}</p>
            <p><strong>${escapeHtml(p.address)}:</strong> ${escapeHtml(form.full_address || form.address || "")}</p>
            <p><strong>${escapeHtml(p.district)}:</strong> ${escapeHtml(form.district || "")}</p>
          </div>
          <p>${escapeHtml(p.declaration)}</p>
          <p>${escapeHtml(p.terms)}</p>
          <p>${escapeHtml(p.incorrect)}</p>
          <p>${escapeHtml(p.support)}</p>
          <div style="margin-top:65px;display:flex;justify-content:space-between;gap:30px;">
            <div>${escapeHtml(p.date)}: __________________</div>
            <div style="text-align:center;">${escapeHtml(p.name)}<br/><br/>________________________</div>
          </div>
          <div style="margin-top:45px;text-align:center;background:#4c1d95;color:#fff;padding:9px;border-radius:18px;font-size:13px;">
            चुकीची माहिती दिल्यास कायदेशीर कारवाई होऊ शकते.
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(wrapper);
    try {
      const canvas = await html2canvas(wrapper, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageWidth = pageWidth - 12;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;
      let remaining = imageHeight;
      let position = 6;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 6, position, imageWidth, imageHeight);
      remaining -= pageHeight - 12;
      while (remaining > 0) {
        position = remaining - imageHeight + 6;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 6, position, imageWidth, imageHeight);
        remaining -= pageHeight - 12;
      }
      return pdf.output("blob");
    } finally {
      document.body.removeChild(wrapper);
    }
  };

  const downloadForm = async () => {
    if (!formRef.current) return;
    try {
      const canvas = await html2canvas(formRef.current, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: formRef.current.scrollWidth,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 8;
      const usableWidth = pageWidth - margin * 2;
      const pageImageHeight = pageHeight - margin * 2;
      let sourceY = 0;
      let pageIndex = 0;

      while (sourceY < canvas.height) {
        if (pageIndex > 0) pdf.addPage();

        const sliceHeight = Math.min(
          canvas.height - sourceY,
          (pageImageHeight * canvas.width) / usableWidth
        );

        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceHeight;

        const ctx = sliceCanvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        ctx.drawImage(
          canvas,
          0, sourceY, canvas.width, sliceHeight,
          0, 0, canvas.width, sliceHeight
        );

        const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.92);
        const renderedHeight = (sliceHeight * usableWidth) / canvas.width;

        pdf.addImage(sliceData, "JPEG", margin, margin, usableWidth, renderedHeight);

        sourceY += sliceHeight;
        pageIndex += 1;
      }

      const safeName = (form.name || "applicant")
        .replace(/[^a-z0-9\u0900-\u097F]+/gi, "-")
        .replace(/^-+|-+$/g, "");

      pdf.save(`Jijamata-Application-${safeName || "applicant"}.pdf`);
    } catch (error) {
      console.error("Form download error:", error);
      alert("फॉर्म डाउनलोड करताना समस्या झाली. कृपया पुन्हा प्रयत्न करा.");
    }
  };

  const downloadPratidnya = async () => {
    if (!form.name || !termsAccepted || !declarationAccepted) {
      alert(t.acceptBoth);
      return;
    }
    try {
      setLoading(true);
      const number = applicationNumber || "PREVIEW";
      const blob = await generatePratidnyaBlob(number);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Jijamata-Pratidnya-Patra-${number}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert(t.pdfError);
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (applicationId, file, documentType) => {
    if (!file) return null;
    const extension = file.name.split(".").pop()?.toLowerCase() || "file";
    const uniqueId = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
    const filePath = `${applicationId}/${documentType}-${uniqueId}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("women-documents")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) throw uploadError;

    const { error: dbError } = await supabase.from("women_documents").insert({
      application_id: applicationId,
      document_type: documentType,
      file_name: file.name,
      file_path: filePath,
    });

    if (dbError) throw dbError;
    return filePath;
  };

  const validateForm = () => {
    if (registrationClosed) {
      alert(t.cutoffError);
      return false;
    }

    if (!form.name || !form.date_of_birth || !form.phone || !form.full_address || !form.city || !form.district || !form.pincode) {
      alert(t.fillRequired);
      return false;
    }

    const age = calculateAge(form.date_of_birth);
    if (age === null || age < 18 || age > 55) {
      alert(t.ageError);
      return false;
    }

    if (!form.single_woman_type || !form.aadhaar_number || !form.proof_document_number || !documents.photo || !documents.single_woman_proof || !documents.aadhaar) {
      alert(t.docsRequired);
      return false;
    }

    if (!termsAccepted || !declarationAccepted) {
      alert(t.acceptBoth);
      return false;
    }

    if (form.existing_business && !form.business_name) {
      alert(t.fillRequired);
      return false;
    }

    if (!form.existing_business && !form.proposed_business) {
      alert(t.fillRequired);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const appNumber = getApplicationNumber();

      const payload = {
        application_number: appNumber,
        name: form.name,
        date_of_birth: form.date_of_birth || null,
        phone: form.phone,
        email: form.email || null,
        address: form.full_address || null,
        city: form.city || null,
        district: form.district || null,
        pincode: form.pincode || null,
        marital_status: form.single_woman_type || null,
        family_members: form.total_family_members ? Number(form.total_family_members) : null,
        children_count: form.total_children ? Number(form.total_children) : null,
        existing_business: !!form.existing_business,
        business_name: form.business_name || null,
        business_type: form.business_type || null,
        business_address: form.business_address || null,
        business_duration: form.business_duration || null,
        monthly_income: form.monthly_income || null,
        proposed_business: form.proposed_business || null,
        investment_required: form.investment_required || null,
        business_plan: form.business_plan || null,
        support_required: form.support_required || null,

        membership_paid: false,
        membership_paid_date: null,
        membership_payment_reference: null,
        status: "pending",

        aadhaar_number: form.aadhaar_number || null,
        registration_number: form.registration_number || null,
        zone: form.zone || null,
        ration_card_number: form.ration_card_number || null,
        voter_id_number: form.voter_id_number || null,
        ration_card_type: form.ration_card_type || null,
        education: form.education || null,
        livelihood_source: form.livelihood_source || null,
        single_woman_type: form.single_woman_type || null,
        is_disabled_single_woman: form.is_disabled_single_woman || null,
        proof_document_number: form.proof_document_number || null,
        proof_document_date: form.proof_document_date || null,
        single_woman_proof_name: form.single_woman_proof_name || null,
        full_address: form.full_address || null,
        city_area_ward: form.city_area_ward || null,
        residence_type: form.residence_type || null,
        land_details: form.land_details || null,
        total_family_members: form.total_family_members ? Number(form.total_family_members) : null,
        total_children: form.total_children ? Number(form.total_children) : null,
        sons: form.sons ? Number(form.sons) : null,
        daughters: form.daughters ? Number(form.daughters) : null,
        children_below_18: form.children_below_18 ? Number(form.children_below_18) : null,
        children_education: form.children_education || null,
        child_care_scholarship: form.child_care_scholarship || null,
        child_details: form.child_details || [],
        educational_qualification: form.educational_qualification || null,
        current_business_employment: form.current_business_employment || null,
        woman_monthly_income: form.woman_monthly_income ? Number(form.woman_monthly_income) : null,
        family_annual_income: form.family_annual_income ? Number(form.family_annual_income) : null,
        saving_group_member: form.saving_group_member || null,
        skills: form.skills.length ? form.skills : null,
        other_skill: form.other_skill || null,
        wants_self_employment: form.wants_self_employment || null,
        receiving_government_scheme: form.receiving_government_scheme || null,
        required_support: form.required_support.length ? form.required_support : null,
        bank_name: form.bank_name || null,
        branch_name: form.branch_name || null,
        account_number: form.account_number || null,
        ifsc_code: form.ifsc_code || null,
        account_holder_name: form.account_holder_name || null,
        major_need: form.major_need || null,
        place: form.place || null,
        declaration_date: form.declaration_date || new Date().toISOString().slice(0, 10),
        application_details: {
          scheme_name: "जिजामाता एकल महिला उद्योजक योजना",
          registration_start: "2026-09-01",
          registration_end: "2026-11-19",
          benefit_start: "2027-11-19",
          benefit_amount: 1500,
          benefit_years: 5,
          age_limit: "18-55",
          language_submitted: language,
        },
      };

      const { data: application, error } = await supabase
        .from("women_applications")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      const documentMap = [
        ["photo", "passport-photo"],
        ["single_woman_proof", "single-woman-proof"],
        ["aadhaar", "aadhaar"],
        ["pan_card", "pan-card"],
        ["ration_card", "ration-card"],
        ["voter_id", "voter-id"],
        ["bank_passbook", "bank-passbook"],
        ["income_certificate", "income-certificate"],
        ["disability_certificate", "disability-certificate"],
        ["other", "other-document"],
      ];

      for (const [key, type] of documentMap) {
        if (documents[key]) {
          await uploadDocument(application.id, documents[key], type);
        }
      }

      const pratidnyaBlob = await generatePratidnyaBlob(appNumber);
      const pratidnyaPath = `${application.id}/pratidnya-patra-${appNumber}.pdf`;

      const { error: pdfUploadError } = await supabase.storage
        .from("women-documents")
        .upload(pratidnyaPath, pratidnyaBlob, {
          contentType: "application/pdf",
          cacheControl: "3600",
          upsert: false,
        });

      if (pdfUploadError) throw pdfUploadError;

      const { error: pratidnyaDbError } = await supabase.from("women_documents").insert({
        application_id: application.id,
        document_type: "pratidnya-patra",
        file_name: `pratidnya-patra-${appNumber}.pdf`,
        file_path: pratidnyaPath,
      });

      if (pratidnyaDbError) throw pratidnyaDbError;

      setApplicationNumber(appNumber);
      setSuccess(true);
    } catch (error) {
      console.error("Women application error:", error);
      alert(error?.message || t.submitError);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✓</div>
          <h1 style={styles.successH1}>{t.success}</h1>
          <p style={styles.successP}>{t.successText}</p>
          <div style={styles.applicationNumber}>
            <span style={styles.applicationNumberSpan}>{t.applicationNo}</span>
            <strong style={styles.applicationNumberStrong}>{applicationNumber}</strong>
          </div>
          <button type="button" style={styles.primaryButton} onClick={downloadPratidnya}>
            {t.download}
          </button>
          <br />
          <a href="/" style={styles.homeButton}>{t.home}</a>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.languageBox}>
          <span style={styles.languageLabel}>{t.language}</span>
          {[
            ["mr", "मराठी"],
            ["hi", "हिंदी"],
            ["en", "English"],
          ].map(([code, label]) => (
            <button
              key={code}
              type="button"
              onClick={() => setLanguage(code)}
              style={language === code ? styles.languageActive : styles.languageButton}
            >
              {label}
            </button>
          ))}
        </div>

        <section style={styles.hero}>
          <div style={styles.heroBadge}>Ojal Micro Service Foundation</div>
          <h1 style={styles.heroH1}>{t.title}</h1>
          <p style={styles.heroP}>{t.subtitle}</p>
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardH2}>{t.programInfo}</h2>
          <p style={styles.cardP}>{t.purpose}</p>
          <p style={styles.cardP}>{t.registration}</p>
          <p style={styles.cardP}>{t.eligibility}</p>
          <div style={styles.membershipBox}>
            <h3 style={styles.membershipH3}>₹1,500/-</h3>
            <p style={styles.cardP}>{t.membership}</p>
          </div>
          <div style={styles.benefitBox}>
            <p style={styles.cardP}>{t.benefit}</p>
          </div>
          <p style={styles.notice}>{t.request}</p>
          {registrationClosed && <div style={styles.closedBox}>{t.cutoffError}</div>}
        </section>

        <form ref={formRef} onSubmit={handleSubmit}>
          <section style={styles.card}>
            <h2 style={styles.cardH2}>{t.sectionPersonal}</h2>
            <div style={styles.grid}>
              <Field label={t.name} name="name" value={form.name} onChange={handleChange} required />
              <Field label={t.dob} name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} required />
              <Field label={t.phone} name="phone" value={form.phone} onChange={handleChange} required />
              <Field label={t.email} name="email" type="email" value={form.email} onChange={handleChange} />
              <Field label={t.aadhaar} name="aadhaar_number" value={form.aadhaar_number} onChange={handleChange} required />
              <Field label={t.registrationNo} name="registration_number" value={form.registration_number} onChange={handleChange} />
              <Field label={t.zone} name="zone" value={form.zone} onChange={handleChange} />
              <Field label={t.rationNo} name="ration_card_number" value={form.ration_card_number} onChange={handleChange} />
              <Field label={t.voterId} name="voter_id_number" value={form.voter_id_number} onChange={handleChange} />
              <Field label={t.rationType} name="ration_card_type" value={form.ration_card_type} onChange={handleChange} />
              <Field label={t.education} name="education" value={form.education} onChange={handleChange} />
              <Field label={t.livelihood} name="livelihood_source" value={form.livelihood_source} onChange={handleChange} />
            </div>
          </section>

          <section style={styles.card}>
            <h2 style={styles.cardH2}>{t.sectionSingle}</h2>
            <div style={styles.grid}>
              <SelectField label={t.singleType} name="single_woman_type" value={form.single_woman_type} onChange={handleChange} required options={[
                ["widow", t.widow], ["deserted", t.deserted], ["divorced", t.divorced], ["unmarried35", t.unmarried35], ["other", t.other],
              ]} />
              <SelectField label={t.disabled} name="is_disabled_single_woman" value={form.is_disabled_single_woman} onChange={handleChange} options={[
                ["yes", t.yes], ["no", t.no],
              ]} />
              <Field label={t.proofNo} name="proof_document_number" value={form.proof_document_number} onChange={handleChange} required />
              <Field label={t.proofDate} name="proof_document_date" type="date" value={form.proof_document_date} onChange={handleChange} />
              <Field label={t.proofName} name="single_woman_proof_name" value={form.single_woman_proof_name} onChange={handleChange} />
            </div>
          </section>

          <section style={styles.card}>
            <h2 style={styles.cardH2}>{t.sectionAddress}</h2>
            <TextAreaField label={t.fullAddress} name="full_address" value={form.full_address} onChange={handleChange} required />
            <div style={styles.grid}>
              <Field label={t.cityAreaWard} name="city_area_ward" value={form.city_area_ward} onChange={handleChange} />
              <Field label={t.city} name="city" value={form.city} onChange={handleChange} required />
              <Field label={t.district} name="district" value={form.district} onChange={handleChange} required />
              <Field label={t.pincode} name="pincode" value={form.pincode} onChange={handleChange} required />
              <Field label={t.residence} name="residence_type" value={form.residence_type} onChange={handleChange} />
              <Field label={t.land} name="land_details" value={form.land_details} onChange={handleChange} />
            </div>
          </section>

          <section style={styles.card}>
            <h2 style={styles.cardH2}>{t.sectionFamily}</h2>
            <div style={styles.grid}>
              <Field label={t.familyTotal} name="total_family_members" type="number" min="0" value={form.total_family_members} onChange={handleChange} />
              <Field label={t.childrenTotal} name="total_children" type="number" min="0" value={form.total_children} onChange={handleChange} />
              <Field label={t.sons} name="sons" type="number" min="0" value={form.sons} onChange={handleChange} />
              <Field label={t.daughters} name="daughters" type="number" min="0" value={form.daughters} onChange={handleChange} />
              <Field label={t.below18} name="children_below_18" type="number" min="0" value={form.children_below_18} onChange={handleChange} />
              <SelectField label={t.childrenEducation} name="children_education" value={form.children_education} onChange={handleChange} options={[["yes", t.yes], ["no", t.no]]} />
              <SelectField label={t.scholarship} name="child_care_scholarship" value={form.child_care_scholarship} onChange={handleChange} options={[["yes", t.yes], ["no", t.no]]} />
            </div>

            <h3 style={styles.subHeading}>{t.childDetails}</h3>
            {form.child_details.map((child, index) => (
              <div key={index} style={styles.childCard}>
                <div style={styles.childHeader}>
                  <strong>{t.childDetails} {index + 1}</strong>
                  {form.child_details.length > 1 && (
                    <button type="button" style={styles.removeButton} onClick={() => removeChild(index)}>{t.remove}</button>
                  )}
                </div>
                <div style={styles.grid}>
                  <Field label={t.childName} value={child.name} onChange={(e) => updateChild(index, "name", e.target.value)} />
                  <Field label={t.childAge} type="number" min="0" value={child.age} onChange={(e) => updateChild(index, "age", e.target.value)} />
                  <Field label={t.childEducation} value={child.education} onChange={(e) => updateChild(index, "education", e.target.value)} />
                  <SelectField label={t.childDisabled} value={child.disabled} onChange={(e) => updateChild(index, "disabled", e.target.value)} options={[["yes", t.yes], ["no", t.no]]} />
                </div>
              </div>
            ))}
            <button type="button" style={styles.smallButton} onClick={addChild}>{t.addChild}</button>
          </section>

          <section style={styles.card}>
            <h2 style={styles.cardH2}>{t.sectionSkills}</h2>
            <div style={styles.grid}>
              <Field label={t.qualification} name="educational_qualification" value={form.educational_qualification} onChange={handleChange} />
              <Field label={t.currentWork} name="current_business_employment" value={form.current_business_employment} onChange={handleChange} />
              <Field label={t.womanIncome} name="woman_monthly_income" type="number" min="0" value={form.woman_monthly_income} onChange={handleChange} />
              <Field label={t.familyIncome} name="family_annual_income" type="number" min="0" value={form.family_annual_income} onChange={handleChange} />
              <SelectField label={t.savingGroup} name="saving_group_member" value={form.saving_group_member} onChange={handleChange} options={[["yes", t.yes], ["no", t.no]]} />
              <SelectField label={t.selfEmployment} name="wants_self_employment" value={form.wants_self_employment} onChange={handleChange} options={[["yes", t.yes], ["no", t.no]]} />
              <SelectField label={t.govtScheme} name="receiving_government_scheme" value={form.receiving_government_scheme} onChange={handleChange} options={[["yes", t.yes], ["no", t.no]]} />
              <Field label={t.otherSkill} name="other_skill" value={form.other_skill} onChange={handleChange} />
            </div>
            <CheckboxGroup title={t.skills} options={skillOptions[language]} selected={form.skills} onToggle={(v) => toggleArrayValue("skills", v)} />
          </section>

          <section style={styles.card}>
            <h2 style={styles.cardH2}>{t.sectionBusiness}</h2>
            <label style={styles.checkboxRow}>
              <input type="checkbox" name="existing_business" checked={form.existing_business} onChange={handleChange} style={styles.checkbox} />
              <span>{t.existingBusiness}</span>
            </label>

            {form.existing_business ? (
              <>
                <div style={styles.grid}>
                  <Field label={t.businessName} name="business_name" value={form.business_name} onChange={handleChange} required />
                  <Field label={t.businessType} name="business_type" value={form.business_type} onChange={handleChange} />
                  <Field label={t.businessDuration} name="business_duration" value={form.business_duration} onChange={handleChange} />
                  <Field label={t.monthlyIncome} name="monthly_income" value={form.monthly_income} onChange={handleChange} />
                </div>
                <TextAreaField label={t.businessAddress} name="business_address" value={form.business_address} onChange={handleChange} />
              </>
            ) : (
              <div style={styles.grid}>
                <Field label={t.proposedBusiness} name="proposed_business" value={form.proposed_business} onChange={handleChange} required />
                <Field label={t.investment} name="investment_required" value={form.investment_required} onChange={handleChange} />
              </div>
            )}
            <TextAreaField label={t.businessPlan} name="business_plan" value={form.business_plan} onChange={handleChange} />
            <TextAreaField label={t.support} name="support_required" value={form.support_required} onChange={handleChange} />
          </section>

          <section style={styles.card}>
            <h2 style={styles.cardH2}>{t.sectionSupport}</h2>
            <CheckboxGroup title={t.requiredSupport} options={supportOptions[language]} selected={form.required_support} onToggle={(v) => toggleArrayValue("required_support", v)} />
            <TextAreaField label={t.majorNeed} name="major_need" value={form.major_need} onChange={handleChange} />
          </section>

          <section style={styles.card}>
            <h2 style={styles.cardH2}>{t.sectionBank}</h2>
            <div style={styles.grid}>
              <Field label={t.bankName} name="bank_name" value={form.bank_name} onChange={handleChange} />
              <Field label={t.branchName} name="branch_name" value={form.branch_name} onChange={handleChange} />
              <Field label={t.accountNo} name="account_number" value={form.account_number} onChange={handleChange} />
              <Field label={t.ifsc} name="ifsc_code" value={form.ifsc_code} onChange={handleChange} />
              <Field label={t.holder} name="account_holder_name" value={form.account_holder_name} onChange={handleChange} />
              <Field label={t.place} name="place" value={form.place} onChange={handleChange} />
              <Field label={t.declarationDate} name="declaration_date" type="date" value={form.declaration_date} onChange={handleChange} />
            </div>
          </section>

          <section style={styles.card}>
            <h2 style={styles.cardH2}>{t.sectionDocuments}</h2>
            <p style={styles.cardP}><strong>{t.required}:</strong> {t.photo}, {t.singleProof}, {t.aadhaarDoc}</p>
            <FileInput label={t.photo} file={documents.photo} onChange={(e) => handleFileChange(e, "photo")} required />
            <FileInput label={t.singleProof} file={documents.single_woman_proof} onChange={(e) => handleFileChange(e, "single_woman_proof")} required />
            <FileInput label={t.aadhaarDoc} file={documents.aadhaar} onChange={(e) => handleFileChange(e, "aadhaar")} required />
            <FileInput label={t.panDoc} file={documents.pan_card} onChange={(e) => handleFileChange(e, "pan_card")} />
            <FileInput label={t.rationDoc} file={documents.ration_card} onChange={(e) => handleFileChange(e, "ration_card")} />
            <FileInput label={t.voterDoc} file={documents.voter_id} onChange={(e) => handleFileChange(e, "voter_id")} />
            <FileInput label={t.bankDoc} file={documents.bank_passbook} onChange={(e) => handleFileChange(e, "bank_passbook")} />
            <FileInput label={t.incomeDoc} file={documents.income_certificate} onChange={(e) => handleFileChange(e, "income_certificate")} />
            <FileInput label={t.disabilityDoc} file={documents.disability_certificate} onChange={(e) => handleFileChange(e, "disability_certificate")} />
            <FileInput label={t.otherDoc} file={documents.other} onChange={(e) => handleFileChange(e, "other")} />
          </section>

          <section style={styles.card}>
            <h2 style={styles.cardH2}>{t.terms}</h2>
            <div style={styles.termsBox}>
              <ol style={styles.termsList}>
                {t.termsList.map((term, index) => <li key={index} style={styles.termsItem}>{term}</li>)}
              </ol>
            </div>
            <label style={styles.checkboxRow}>
              <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} style={styles.checkbox} />
              <span>{t.acceptTerms}</span>
            </label>
          </section>

          <section style={styles.card}>
            <h2 style={styles.cardH2}>{t.sectionDeclaration}</h2>
            <div style={styles.declarationBox}>{t.declaration}</div>
            <label style={styles.checkboxRow}>
              <input type="checkbox" checked={declarationAccepted} onChange={(e) => setDeclarationAccepted(e.target.checked)} style={styles.checkbox} />
              <span>{t.acceptDeclaration}</span>
            </label>
          </section>

          <section style={styles.card}>
            <h2 style={styles.cardH2}>फॉर्म डाउनलोड</h2>
            <p style={styles.cardP}>
              भरलेली माहिती जतन करण्यासाठी किंवा प्रिंट करण्यासाठी संपूर्ण अर्जाचा PDF डाउनलोड करा.
            </p>
            <button type="button" onClick={downloadForm} disabled={loading} style={loading ? styles.disabledButton : styles.secondaryButton}>
              📄 फॉर्म डाउनलोड करा
            </button>
          </section>

          <section style={styles.card}>
            <h2 style={styles.cardH2}>प्रतिज्ञापत्र</h2>
            <p style={styles.cardP}>अर्ज सादर करण्यापूर्वी प्रतिज्ञापत्र तयार करून डाउनलोड करू शकता. अंतिम अर्ज क्रमांक सबमिट करताना तयार होईल.</p>
            <button type="button" onClick={downloadPratidnya} disabled={!form.name || !termsAccepted || !declarationAccepted || loading} style={(!form.name || !termsAccepted || !declarationAccepted || loading) ? styles.disabledButton : styles.secondaryButton}>
              {t.generate}
            </button>
          </section>

          <button type="submit" disabled={loading || registrationClosed} style={(loading || registrationClosed) ? styles.disabledSubmit : styles.submitButton}>
            {loading ? t.submitting : t.submit}
          </button>
        </form>
      </div>
    </main>
  );
}

function Field({ label, name, value, onChange, type = "text", required = false, min }) {
  return (
    <div>
      <label style={styles.label}>{label}{required ? " *" : ""}</label>
      <input name={name} type={type} value={value ?? ""} onChange={onChange} required={required} min={min} style={styles.input} />
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, required = false }) {
  return (
    <div>
      <label style={styles.label}>{label}{required ? " *" : ""}</label>
      <textarea name={name} value={value ?? ""} onChange={onChange} rows={4} required={required} style={styles.textarea} />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required = false }) {
  return (
    <div>
      <label style={styles.label}>{label}{required ? " *" : ""}</label>
      <select name={name} value={value ?? ""} onChange={onChange} required={required} style={styles.input}>
        <option value="">-- Select --</option>
        {options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
    </div>
  );
}

function CheckboxGroup({ title, options, selected, onToggle }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={styles.label}>{title}</div>
      <div style={styles.optionGrid}>
        {options.map((option) => (
          <label key={option} style={styles.optionCard}>
            <input type="checkbox" checked={selected.includes(option)} onChange={() => onToggle(option)} />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function FileInput({ label, file, onChange, required = false }) {
  return (
    <div style={styles.fileBox}>
      <label style={styles.label}>{label}{required ? " *" : ""}</label>
      <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={onChange} required={required} style={styles.fileInput} />
      {file && <p style={styles.fileName}>✓ {file.name}</p>}
    </div>
  );
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


  

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#FAF7FA",
    backgroundImage:
      "linear-gradient(rgba(250,247,250,0.92), rgba(250,247,250,0.92)), url('/image.png')",
    backgroundSize: "cover",
    backgroundPosition: "center top",
    backgroundAttachment: "fixed",
    padding: "30px 15px 60px",
    fontFamily: "Arial, Noto Sans Devanagari, sans-serif",
    color: "#2D2430",
  },

  container: {
    width: "100%",
    maxWidth: "1050px",
    margin: "auto",
  },

  languageBox: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
    flexWrap: "wrap",
  },

  languageLabel: {
    fontSize: 16,
    fontWeight: 600,
    marginRight: 5,
    color: "#510A50",
  },

  languageButton: {
    border: "1px solid #EADBEA",
    background: "#FFFFFF",
    color: "#510A50",
    borderRadius: 20,
    padding: "8px 15px",
    cursor: "pointer",
    fontSize: 15,
  },

  languageActive: {
    border: "1px solid #510A50",
    background: "#510A50",
    color: "#FFFFFF",
    borderRadius: 20,
    padding: "8px 15px",
    cursor: "pointer",
    fontSize: 15,
  },

  hero: {
    background:
      "linear-gradient(135deg, #510A50 0%, #6D246D 65%, #7A397A 100%)",
    color: "#FFFFFF",
    borderRadius: 25,
    padding: "50px 30px",
    textAlign: "center",
    marginBottom: 25,
    boxShadow: "0 15px 40px rgba(81,10,80,0.20)",
  },

  heroBadge: {
    display: "inline-block",
    background: "rgba(255,255,255,0.16)",
    padding: "8px 16px",
    borderRadius: 30,
    fontSize: 15,
    marginBottom: 15,
  },

  heroH1: {
    fontSize: "clamp(28px, 5vw, 44px)",
    margin: "10px 0",
    lineHeight: 1.25,
  },

  heroP: {
    fontSize: 19,
    lineHeight: 1.7,
    margin: "10px auto 0",
    maxWidth: 700,
  },

  card: {
    background: "rgba(255,255,255,0.97)",
    borderRadius: 20,
    padding: 30,
    marginBottom: 22,
    boxShadow: "0 8px 30px rgba(81,10,80,0.08)",
    border: "1px solid #EADBEA",
  },

  cardH2: {
    marginTop: 0,
    marginBottom: 20,
    fontSize: 26,
    color: "#510A50",
  },

  subHeading: {
    fontSize: 20,
    color: "#0D1B4C",
    margin: "25px 0 15px",
  },

  cardP: {
    fontSize: 17,
    lineHeight: 1.8,
  },

  notice: {
    fontSize: 18,
    fontWeight: 700,
    color: "#D96B27",
    lineHeight: 1.7,
  },

  closedBox: {
    background: "#FFF4EC",
    border: "1px solid #F3C7A5",
    color: "#A94F1E",
    padding: 15,
    borderRadius: 12,
    fontWeight: 700,
  },

  membershipBox: {
    background: "#FFF4EC",
    border: "1px solid #F3C7A5",
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
  },

  membershipH3: {
    fontSize: 32,
    margin: "0 0 8px",
    color: "#D96B27",
  },

  benefitBox: {
    background: "#F5EFF5",
    border: "1px solid #E1CDE1",
    borderRadius: 15,
    padding: 18,
    marginTop: 15,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 20,
    marginBottom: 18,
  },

  label: {
    display: "block",
    fontSize: 17,
    fontWeight: 600,
    marginBottom: 8,
    color: "#0D1B4C",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: 14,
    border: "1px solid #D8C9D8",
    borderRadius: 10,
    fontSize: 16,
    background: "#FFFFFF",
    outline: "none",
    color: "#2D2430",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: 14,
    border: "1px solid #D8C9D8",
    borderRadius: 10,
    fontSize: 16,
    resize: "vertical",
    marginBottom: 20,
    fontFamily: "Arial, Noto Sans Devanagari, sans-serif",
    background: "#FFFFFF",
    color: "#2D2430",
  },

  checkboxRow: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    fontSize: 17,
    lineHeight: 1.6,
    marginTop: 20,
    cursor: "pointer",
  },

  checkbox: {
    width: 20,
    height: 20,
    marginTop: 3,
    flexShrink: 0,
    accentColor: "#510A50",
  },

  optionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
    gap: 10,
  },

  optionCard: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    background: "#FCF9FC",
    border: "1px solid #E2D6E2",
    borderRadius: 10,
    padding: 12,
    cursor: "pointer",
  },

  childCard: {
    border: "1px solid #E1CDE1",
    background: "#F8F3F8",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
  },

  childHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  smallButton: {
    border: "1px solid #510A50",
    background: "#FFFFFF",
    color: "#510A50",
    padding: "10px 15px",
    borderRadius: 10,
    fontWeight: 700,
    cursor: "pointer",
  },

  removeButton: {
    border: "none",
    background: "#FFF1ED",
    color: "#B42318",
    padding: "7px 11px",
    borderRadius: 8,
    cursor: "pointer",
  },

  fileBox: {
    background: "#FCF9FC",
    border: "1px solid #E2D6E2",
    borderRadius: 14,
    padding: 18,
    marginBottom: 15,
  },

  fileInput: {
    width: "100%",
    fontSize: 15,
  },

  fileName: {
    color: "#15803D",
    marginBottom: 0,
    fontSize: 15,
    wordBreak: "break-word",
  },

  termsBox: {
    background: "#FCF9FC",
    border: "1px solid #E2D6E2",
    borderRadius: 14,
    padding: 20,
    maxHeight: 350,
    overflowY: "auto",
  },

  termsList: {
    paddingLeft: 25,
    margin: 0,
  },

  termsItem: {
    marginBottom: 12,
    fontSize: 16,
    lineHeight: 1.7,
  },

  declarationBox: {
    background: "#F5EFF5",
    borderLeft: "5px solid #510A50",
    borderRadius: 10,
    padding: 20,
    fontSize: 17,
    lineHeight: 1.8,
  },

  secondaryButton: {
    border: "none",
    background: "#0D1B4C",
    color: "#FFFFFF",
    padding: "14px 22px",
    borderRadius: 10,
    fontSize: 17,
    fontWeight: 600,
    cursor: "pointer",
  },

  primaryButton: {
    border: "none",
    background: "linear-gradient(135deg, #510A50, #713271)",
    color: "#FFFFFF",
    padding: "15px 25px",
    borderRadius: 10,
    fontSize: 17,
    fontWeight: 600,
    cursor: "pointer",
  },

  disabledButton: {
    border: "none",
    background: "#D8CFD8",
    color: "#756B75",
    padding: "14px 22px",
    borderRadius: 10,
    fontSize: 17,
    fontWeight: 600,
    cursor: "not-allowed",
  },

  submitButton: {
    width: "100%",
    border: "none",
    background: "linear-gradient(135deg, #510A50, #713271)",
    color: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    fontSize: 20,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(81,10,80,0.25)",
  },

  disabledSubmit: {
    width: "100%",
    border: "none",
    background: "#BDB4BD",
    color: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    fontSize: 20,
    fontWeight: 700,
    cursor: "not-allowed",
  },

  successCard: {
    width: "100%",
    maxWidth: 650,
    margin: "80px auto",
    background: "#FFFFFF",
    borderRadius: 25,
    padding: "45px 30px",
    textAlign: "center",
    boxShadow: "0 15px 45px rgba(81,10,80,0.12)",
  },

  successIcon: {
    width: 75,
    height: 75,
    borderRadius: "50%",
    background: "#E8F7ED",
    color: "#16A34A",
    fontSize: 45,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },

  successH1: {
    fontSize: 30,
    color: "#15803D",
  },

  successP: {
    fontSize: 17,
    lineHeight: 1.7,
  },

  applicationNumber: {
    background: "#F5EFF5",
    border: "1px solid #E1CDE1",
    padding: 20,
    borderRadius: 15,
    margin: "25px 0",
  },

  applicationNumberSpan: {
    display: "block",
    fontSize: 15,
    color: "#756B75",
    marginBottom: 8,
  },

  applicationNumberStrong: {
    display: "block",
    fontSize: 23,
    color: "#510A50",
    wordBreak: "break-word",
  },

  homeButton: {
    display: "inline-block",
    marginTop: 15,
    padding: "13px 25px",
    borderRadius: 10,
    background: "#F1EAF1",
    color: "#510A50",
    textDecoration: "none",
    fontSize: 16,
  },
};