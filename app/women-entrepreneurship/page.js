"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { supabase } from "../../lib/supabase";

export default function WomenEntrepreneurshipPage() {
  const [language, setLanguage] = useState("mr");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");

  const [form, setForm] = useState({
    name: "",
    date_of_birth: "",
    phone: "",
    email: "",

    address: "",
    city: "",
    district: "",
    pincode: "",

    marital_status: "",
    family_members: "",
    children_count: "",

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
  });

  const [documents, setDocuments] = useState({
    photo: null,
    aadhaar_pan: null,
    ration_card: null,
    bank_passbook: null,
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [declarationAccepted, setDeclarationAccepted] =
    useState(false);

  const translations = {
    mr: {
      title: "जिजामाता ऐकल महिला उद्योजक योजना ",
      subtitle:
        "महिलांना व्यवसायाच्या माध्यमातून सक्षम करण्याचा फाउंडेशनचा उपक्रम",

      language: "भाषा",

      programInfo: "कार्यक्रमाची माहिती",

      programText:
        "जिजामाता ऐकल महिला उद्योजक योजना हा महिलांना स्वतःचा व्यवसाय सुरू करण्यासाठी किंवा विद्यमान व्यवसाय वाढवण्यासाठी फाउंडेशनकडून सहाय्य व मार्गदर्शन देणारा उपक्रम आहे.",

      membership:
        "या कार्यक्रमात सहभागी होण्यासाठी ₹1,500 फाउंडेशन सदस्यत्व आवश्यक आहे. अर्ज सादरल्यानंतर फाउंडेशनची टीम सदस्यत्व शुल्क भरल्याची पडताळणी करेल.",

      yearlySupport:
        "पात्र महिलांना त्यांच्या व्यवसायासाठी दरवर्षी ₹1,500 पर्यंत सहाय्य तसेच व्यवसायाशी संबंधित इतर मदत दिली जाऊ शकते.",

      personal: "वैयक्तिक माहिती",
      name: "पूर्ण नाव",
      dob: "जन्मतारीख",
      phone: "मोबाईल क्रमांक",
      email: "ई-मेल",

      addressInfo: "पत्त्याची माहिती",
      address: "पूर्ण पत्ता",
      city: "शहर",
      district: "जिल्हा",
      pincode: "पिनकोड",

      familyInfo: "कौटुंबिक माहिती",
      marital: "वैवाहिक स्थिती",
      familyMembers: "कुटुंबातील सदस्य",
      children: "मुले",

      married: "विवाहित",
      unmarried: "अविवाहित",
      widow: "विधवा",
      divorced: "घटस्फोटित",

      businessInfo: "व्यवसायाची माहिती",
      existingBusiness: "माझा आधीपासून व्यवसाय आहे",

      businessName: "व्यवसायाचे नाव",
      businessType: "व्यवसायाचा प्रकार",
      businessAddress: "व्यवसायाचा पत्ता",
      businessDuration: "व्यवसाय सुरू करून किती कालावधी झाला?",
      monthlyIncome: "मासिक उत्पन्न",

      proposedBusiness: "प्रस्तावित व्यवसाय",
      investment: "अंदाजे गुंतवणूक",
      businessPlan: "व्यवसायाचे वर्णन / व्यवसाय योजना",
      support: "आपल्याला कोणत्या प्रकारच्या सहाय्याची आवश्यकता आहे?",

      documents: "आवश्यक कागदपत्रे",
      photo: "पासपोर्ट आकाराचा फोटो",
      aadhaarPan: "आधार कार्ड किंवा PAN कार्ड",
      ration: "रेशन कार्ड",
      bank: "बँक पासबुक",

      affidavit: "प्रतिज्ञापत्र",

      affidavitText:
        "अटी व शर्ती स्वीकारल्यानंतर प्रतिज्ञापत्र आपोआप तयार केले जाईल. ते डाउनलोड करून आपल्या नोंदीसाठी ठेवू शकता. प्रतिज्ञापत्राची प्रत अर्जासोबत आपोआप अपलोड केली जाईल.",

      terms: "अटी व शर्ती",

      termsList: [
        "अर्जदाराने अर्जामध्ये दिलेली सर्व माहिती खरी व अचूक असणे आवश्यक आहे.",
        "चुकीची, खोटी किंवा दिशाभूल करणारी माहिती आढळल्यास अर्ज रद्द केला जाऊ शकतो.",
        "या कार्यक्रमासाठी ₹1,500 फाउंडेशन सदस्यत्व आवश्यक आहे.",
        "सदस्यत्व शुल्क भरल्याने आर्थिक सहाय्य मिळण्याची हमी मिळत नाही.",
        "आर्थिक सहाय्य व इतर लाभ फाउंडेशनच्या नियमांनुसार आणि उपलब्धतेनुसार दिले जातील.",
        "अर्ज सादर केल्याने आर्थिक सहाय्य मिळण्याचा निश्चित हक्क निर्माण होत नाही.",
        "फाउंडेशन अर्जातील माहिती व कागदपत्रांची पडताळणी करू शकते.",
        "आवश्यक कागदपत्रे उपलब्ध नसल्यास किंवा पडताळणी पूर्ण न झाल्यास अर्ज प्रलंबित किंवा नाकारला जाऊ शकतो.",
        "विद्यमान व्यवसाय असलेल्या अर्जदाराने व्यवसायासंबंधी खरी माहिती देणे आवश्यक आहे.",
        "नवीन व्यवसाय सुरू करू इच्छिणाऱ्या अर्जदाराने प्रस्तावित व्यवसायाची योग्य माहिती द्यावी.",
        "फाउंडेशनकडून मिळणाऱ्या सहाय्याचा वापर मंजूर केलेल्या उद्देशासाठी करणे अपेक्षित आहे.",
        "अर्जदाराने फाउंडेशनच्या टीमला आवश्यक माहिती व सहकार्य देणे आवश्यक आहे.",
        "अर्जदाराने फाउंडेशनला अर्जातील माहितीची पडताळणी करण्यास संमती दिली आहे.",
        "अंतिम निर्णय फाउंडेशनच्या पडताळणी, नियम आणि उपलब्ध संसाधनांनुसार घेतला जाईल.",
      ],

      acceptTerms:
        "मी वरील अटी व शर्ती वाचल्या असून मला त्या मान्य आहेत.",

      declaration: "घोषणापत्र",

      declarationText:
        "मी याद्वारे घोषित करते की, या अर्जामध्ये दिलेली सर्व माहिती माझ्या माहितीनुसार खरी व अचूक आहे. मी कोणतीही महत्त्वाची माहिती लपविलेली नाही. फाउंडेशनच्या कार्यक्रमाच्या अटी व नियम मी वाचले असून ते मला मान्य आहेत.",

      acceptDeclaration:
        "मी वरील घोषणापत्रातील माहिती मान्य करून अर्ज सादर करत आहे.",

      generate: "प्रतिज्ञापत्र तयार करा",
      download: "प्रतिज्ञापत्र डाउनलोड करा",

      submit: "अर्ज सादर करा",
      submitting: "अर्ज सादर होत आहे...",

      successTitle: "अर्ज यशस्वीरित्या सादर झाला!",

      applicationNo: "आपला अर्ज क्रमांक",

      successText:
        "आपला अर्ज फाउंडेशनकडे प्राप्त झाला आहे. फाउंडेशनची टीम आपल्या अर्जाची व कागदपत्रांची पडताळणी करेल.",

      fillRequired:
        "कृपया सर्व आवश्यक माहिती भरा.",

      documentsRequired:
        "कृपया सर्व आवश्यक कागदपत्रे अपलोड करा.",

      acceptBoth:
        "कृपया अटी व घोषणापत्र स्वीकारा.",

      pdfError:
        "प्रतिज्ञापत्र तयार करताना समस्या आली.",

      submitError:
        "अर्ज सादर करताना समस्या आली.",
    },

    hi: {
      title: "जिजामाता ऐकल महिला उद्यमी योजना ",

      subtitle:
        "महिलाओं को व्यवसाय के माध्यम से सक्षम बनाने की फाउंडेशन की पहल",

      language: "भाषा",

      programInfo: "कार्यक्रम की जानकारी",

      programText:
        "जिजामाता ऐकल महिला उद्यमी योजना महिलाओं को अपना व्यवसाय शुरू करने या मौजूदा व्यवसाय को बढ़ाने के लिए फाउंडेशन द्वारा सहायता और मार्गदर्शन देने की पहल है।",

      membership:
        "इस कार्यक्रम में भाग लेने के लिए ₹1,500 फाउंडेशन सदस्यता आवश्यक है। आवेदन जमा करने के बाद फाउंडेशन टीम सदस्यता शुल्क भुगतान की पुष्टि करेगी।",

      yearlySupport:
        "पात्र महिलाओं को उनके व्यवसाय के लिए हर वर्ष ₹1,500 तक की सहायता और अन्य व्यावसायिक सहयोग दिया जा सकता है।",

      personal: "व्यक्तिगत जानकारी",
      name: "पूरा नाम",
      dob: "जन्म तारीख",
      phone: "मोबाइल नंबर",
      email: "ई-मेल",

      addressInfo: "पते की जानकारी",
      address: "पूरा पता",
      city: "शहर",
      district: "जिला",
      pincode: "पिनकोड",

      familyInfo: "पारिवारिक जानकारी",
      marital: "वैवाहिक स्थिति",
      familyMembers: "परिवार के सदस्य",
      children: "बच्चे",

      married: "विवाहित",
      unmarried: "अविवाहित",
      widow: "विधवा",
      divorced: "तलाकशुदा",

      businessInfo: "व्यवसाय की जानकारी",
      existingBusiness: "मेरा पहले से व्यवसाय है",

      businessName: "व्यवसाय का नाम",
      businessType: "व्यवसाय का प्रकार",
      businessAddress: "व्यवसाय का पता",
      businessDuration: "व्यवसाय शुरू किए कितना समय हुआ?",
      monthlyIncome: "मासिक आय",

      proposedBusiness: "प्रस्तावित व्यवसाय",
      investment: "अनुमानित निवेश",
      businessPlan: "व्यवसाय का विवरण / व्यवसाय योजना",
      support: "आपको किस प्रकार की सहायता चाहिए?",

      documents: "आवश्यक दस्तावेज",
      photo: "पासपोर्ट आकार का फोटो",
      aadhaarPan: "आधार कार्ड या PAN कार्ड",
      ration: "राशन कार्ड",
      bank: "बैंक पासबुक",

      affidavit: "प्रतिज्ञापत्र",

      affidavitText:
        "शर्तें स्वीकार करने के बाद प्रतिज्ञापत्र अपने आप तैयार किया जाएगा। आप इसे डाउनलोड कर सकते हैं। इसकी प्रति आवेदन के साथ अपने आप अपलोड की जाएगी।",

      terms: "नियम और शर्तें",

      termsList: [
        "आवेदक द्वारा दी गई सभी जानकारी सही और सटीक होनी चाहिए।",
        "गलत या भ्रामक जानकारी मिलने पर आवेदन रद्द किया जा सकता है।",
        "इस कार्यक्रम के लिए ₹1,500 फाउंडेशन सदस्यता आवश्यक है।",
        "सदस्यता शुल्क का भुगतान करने से आर्थिक सहायता की गारंटी नहीं मिलती।",
        "आर्थिक सहायता और अन्य लाभ फाउंडेशन के नियमों और उपलब्धता के अनुसार दिए जाएंगे।",
        "आवेदन जमा करने से आर्थिक सहायता प्राप्त करने का निश्चित अधिकार नहीं बनता।",
        "फाउंडेशन आवेदन और दस्तावेजों की जांच कर सकता है।",
        "आवश्यक दस्तावेज उपलब्ध न होने पर आवेदन लंबित या अस्वीकार किया जा सकता है।",
        "मौजूदा व्यवसाय वाली आवेदक को व्यवसाय की सही जानकारी देनी होगी।",
        "नया व्यवसाय शुरू करने वाली आवेदक को प्रस्तावित व्यवसाय की सही जानकारी देनी होगी।",
        "फाउंडेशन से प्राप्त सहायता का उपयोग स्वीकृत उद्देश्य के लिए करना आवश्यक है।",
        "आवेदक को फाउंडेशन टीम के साथ आवश्यक जानकारी और सहयोग देना होगा।",
        "आवेदक फाउंडेशन को जानकारी की जांच करने की अनुमति देती है।",
        "अंतिम निर्णय फाउंडेशन की जांच, नियम और उपलब्ध संसाधनों के अनुसार होगा।",
      ],

      acceptTerms:
        "मैंने ऊपर दिए गए नियम और शर्तें पढ़ ली हैं और मुझे स्वीकार हैं।",

      declaration: "घोषणापत्र",

      declarationText:
        "मैं घोषित करती हूं कि इस आवेदन में दी गई सभी जानकारी मेरी जानकारी के अनुसार सही है। मैंने कोई महत्वपूर्ण जानकारी छिपाई नहीं है। मैंने फाउंडेशन कार्यक्रम के नियम और शर्तें पढ़ ली हैं और मुझे स्वीकार हैं।",

      acceptDeclaration:
        "मैं ऊपर दिए गए घोषणापत्र को स्वीकार करके आवेदन जमा कर रही हूं।",

      generate: "प्रतिज्ञापत्र तैयार करें",
      download: "प्रतिज्ञापत्र डाउनलोड करें",

      submit: "आवेदन जमा करें",
      submitting: "आवेदन जमा हो रहा है...",

      successTitle:
        "आवेदन सफलतापूर्वक जमा हुआ!",

      applicationNo: "आपका आवेदन नंबर",

      successText:
        "आपका आवेदन फाउंडेशन को प्राप्त हो गया है। फाउंडेशन टीम आपके आवेदन और दस्तावेजों की जांच करेगी।",

      fillRequired:
        "कृपया सभी आवश्यक जानकारी भरें।",

      documentsRequired:
        "कृपया सभी आवश्यक दस्तावेज अपलोड करें।",

      acceptBoth:
        "कृपया नियम और घोषणापत्र स्वीकार करें।",

      pdfError:
        "प्रतिज्ञापत्र तैयार करने में समस्या हुई।",

      submitError:
        "आवेदन जमा करने में समस्या हुई।",
    },

    en: {
      title:
        "Jijamata Aikl Women Entrepreneur Yojana",

      subtitle:
        "A foundation initiative to empower women through entrepreneurship",

      language: "Language",

      programInfo: "Program Information",

      programText:
        "Jijamata Aikl Mahila Udyojak yojana is a foundation initiative that provides support and guidance to women who want to start a new business or grow an existing business.",

      membership:
        "A ₹1,500 foundation membership is required to participate in this program. Our foundation team will verify your membership payment after application submission.",

      yearlySupport:
        "Eligible women may receive up to ₹1,500 yearly business support along with other business-related assistance.",

      personal: "Personal Information",
      name: "Full Name",
      dob: "Date of Birth",
      phone: "Mobile Number",
      email: "Email",

      addressInfo: "Address Information",
      address: "Full Address",
      city: "City",
      district: "District",
      pincode: "Pincode",

      familyInfo: "Family Information",
      marital: "Marital Status",
      familyMembers: "Family Members",
      children: "Children",

      married: "Married",
      unmarried: "Unmarried",
      widow: "Widow",
      divorced: "Divorced",

      businessInfo: "Business Information",
      existingBusiness: "I already have a business",

      businessName: "Business Name",
      businessType: "Business Type",
      businessAddress: "Business Address",
      businessDuration: "Business Duration",
      monthlyIncome: "Monthly Income",

      proposedBusiness: "Proposed Business",
      investment: "Estimated Investment",
      businessPlan:
        "Business Description / Business Plan",
      support: "What type of support do you need?",

      documents: "Required Documents",
      photo: "Passport-size Photo",
      aadhaarPan: "Aadhaar Card or PAN Card",
      ration: "Ration Card",
      bank: "Bank Passbook",

      affidavit: "Affidavit",

      affidavitText:
        "After accepting the terms and declaration, the affidavit will be generated automatically. You can download it for your records. A copy will automatically be uploaded with your application.",

      terms: "Terms & Conditions",

      termsList: [
        "All information provided by the applicant must be true and accurate.",
        "The application may be rejected if false or misleading information is found.",
        "A ₹1,500 foundation membership is required for this program.",
        "Payment of membership does not guarantee financial assistance.",
        "Financial assistance and other benefits will be provided according to foundation rules and availability.",
        "Submitting an application does not create a guaranteed right to financial assistance.",
        "The foundation may verify the information and documents provided.",
        "The application may remain pending or be rejected if required documents are missing or verification is incomplete.",
        "Applicants with an existing business must provide accurate business information.",
        "Applicants starting a new business must provide accurate proposed business information.",
        "Foundation assistance must be used for the approved purpose.",
        "The applicant must cooperate with the foundation team and provide required information.",
        "The applicant gives permission to the foundation to verify the application information.",
        "The final decision will be based on verification, foundation rules and available resources.",
      ],

      acceptTerms:
        "I have read and agree to the above terms and conditions.",

      declaration: "Declaration",

      declarationText:
        "I hereby declare that all information provided in this application is true and accurate to the best of my knowledge. I have not hidden any important information. I have read and agree to the terms and conditions of the foundation program.",

      acceptDeclaration:
        "I accept the above declaration and am submitting this application.",

      generate: "Generate Affidavit",
      download: "Download Affidavit",

      submit: "Submit Application",
      submitting: "Submitting Application...",

      successTitle:
        "Application Submitted Successfully!",

      applicationNo: "Your Application Number",

      successText:
        "Your application has been received by the foundation. The foundation team will verify your application and documents.",

      fillRequired:
        "Please fill all required information.",

      documentsRequired:
        "Please upload all required documents.",

      acceptBoth:
        "Please accept the terms and declaration.",

      pdfError:
        "There was a problem generating the affidavit.",

      submitError:
        "There was a problem submitting the application.",
    },
  };

  const t = translations[language];

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setDocuments((previous) => ({
      ...previous,
      [type]: file,
    }));
  };

  const getApplicationNumber = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      now.getDate()
    ).padStart(2, "0");

    const random =
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    return `OJAL-WE-${year}${month}${day}-${random}`;
  };

  const getPdfText = (appNumber) => {
    if (language === "mr") {
      return {
        heading:
          "अर्जदाराचे प्रतिज्ञापत्र",

        program:
          "जिजामाता ऐकल महिला उद्योजक उजाण",

        declaration:
          `मी, ${form.name}, याद्वारे घोषित करते की या अर्जामध्ये दिलेली सर्व माहिती माझ्या माहितीनुसार खरी व अचूक आहे. मी कोणतीही महत्त्वाची माहिती लपविलेली नाही.`,

        terms:
          "मी फाउंडेशनच्या महिला उद्योजकता सहाय्य कार्यक्रमाच्या अटी व शर्ती वाचल्या असून त्या मला मान्य आहेत.",

        incorrect:
          "माझ्याकडून दिलेली माहिती किंवा कागदपत्रे चुकीची आढळल्यास फाउंडेशनला माझा अर्ज रद्द करण्याचा अधिकार आहे.",

        support:
          "फाउंडेशनकडून मिळणाऱ्या सहाय्याचा वापर मंजूर केलेल्या उद्देशासाठी करण्यास मी सहमत आहे.",

        name: "अर्जदाराचे नाव",
        phone: "मोबाईल क्रमांक",
        date: "दिनांक",
        number: "अर्ज क्रमांक",
      };
    }

    if (language === "hi") {
      return {
        heading:
          "आवेदक का प्रतिज्ञापत्र",

        program:
          "जिजामाता ऐकल महिला उद्योजक उजाण",

        declaration:
          `मैं, ${form.name}, घोषित करती हूं कि इस आवेदन में दी गई सभी जानकारी मेरी जानकारी के अनुसार सही और सटीक है। मैंने कोई महत्वपूर्ण जानकारी छिपाई नहीं है।`,

        terms:
          "मैंने फाउंडेशन के महिला उद्यमिता सहायता कार्यक्रम के नियम और शर्तें पढ़ ली हैं और मुझे स्वीकार हैं।",

        incorrect:
          "यदि मेरे द्वारा दी गई जानकारी या दस्तावेज गलत पाए जाते हैं, तो फाउंडेशन को मेरा आवेदन रद्द करने का अधिकार है।",

        support:
          "मैं फाउंडेशन से प्राप्त सहायता का उपयोग स्वीकृत उद्देश्य के लिए करने के लिए सहमत हूं।",

        name: "आवेदक का नाम",
        phone: "मोबाइल नंबर",
        date: "दिनांक",
        number: "आवेदन नंबर",
      };
    }

    return {
      heading: "Applicant Affidavit",

      program:
        "Jijamata Aikl Mahila Udyojak yojana",

      declaration:
        `I, ${form.name}, hereby declare that all information provided in this application is true and accurate to the best of my knowledge. I have not hidden any important information.`,

      terms:
        "I have read and agree to the terms and conditions of the foundation's women entrepreneurship support program.",

      incorrect:
        "If the information or documents provided by me are found to be incorrect, the foundation has the right to reject my application.",

      support:
        "I agree to use the assistance received from the foundation for the approved purpose.",

      name: "Applicant Name",
      phone: "Mobile Number",
      date: "Date",
      number: "Application Number",
    };
  };

  const createAffidavitElement = (appNumber) => {
    const pdfText = getPdfText(appNumber);

    const wrapper =
      document.createElement("div");

    wrapper.style.position = "fixed";
    wrapper.style.left = "-10000px";
    wrapper.style.top = "0";
    wrapper.style.width = "794px";
    wrapper.style.background = "#ffffff";
    wrapper.style.padding = "60px";
    wrapper.style.boxSizing = "border-box";
    wrapper.style.color = "#111111";
    wrapper.style.fontFamily =
      "Arial, Noto Sans Devanagari, sans-serif";
    wrapper.style.fontSize = "20px";
    wrapper.style.lineHeight = "1.8";

    const title =
      document.createElement("h1");

    title.textContent = pdfText.program;

    title.style.textAlign = "center";
    title.style.fontSize = "30px";
    title.style.marginBottom = "20px";

    const heading =
      document.createElement("h2");

    heading.textContent = pdfText.heading;

    heading.style.textAlign = "center";
    heading.style.fontSize = "25px";
    heading.style.marginBottom = "35px";

    const info =
      document.createElement("div");

    info.innerHTML = `
      <p><strong>${pdfText.name}:</strong> ${escapeHtml(
        form.name
      )}</p>

      <p><strong>${pdfText.phone}:</strong> ${escapeHtml(
        form.phone
      )}</p>

      <p><strong>${pdfText.number}:</strong> ${escapeHtml(
        appNumber
      )}</p>

      <p><strong>${pdfText.date}:</strong> ${new Date().toLocaleDateString(
        "en-IN"
      )}</p>
    `;

    const declaration =
      document.createElement("p");

    declaration.textContent =
      pdfText.declaration;

    const terms =
      document.createElement("p");

    terms.textContent =
      pdfText.terms;

    const incorrect =
      document.createElement("p");

    incorrect.textContent =
      pdfText.incorrect;

    const support =
      document.createElement("p");

    support.textContent =
      pdfText.support;

    const footer =
      document.createElement("div");

    footer.style.marginTop = "50px";
    footer.style.paddingTop = "20px";
    footer.style.borderTop =
      "1px solid #cccccc";

    footer.innerHTML = `
      <p><strong>${pdfText.name}:</strong> ${escapeHtml(
        form.name
      )}</p>

      <p><strong>${pdfText.phone}:</strong> ${escapeHtml(
        form.phone
      )}</p>

      <p><strong>${pdfText.date}:</strong> ${new Date().toLocaleDateString(
        "en-IN"
      )}</p>

      <p><strong>${pdfText.number}:</strong> ${escapeHtml(
        appNumber
      )}</p>
    `;

    wrapper.appendChild(title);
    wrapper.appendChild(heading);
    wrapper.appendChild(info);
    wrapper.appendChild(declaration);
    wrapper.appendChild(terms);
    wrapper.appendChild(incorrect);
    wrapper.appendChild(support);
    wrapper.appendChild(footer);

    document.body.appendChild(wrapper);

    return wrapper;
  };

  const generateAffidavitBlob = async (
    appNumber
  ) => {
    const element =
      createAffidavitElement(appNumber);

    try {
      const canvas =
        await html2canvas(element, {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
        });

      const imageData =
        canvas.toDataURL("image/png");

      const pdf = new jsPDF(
        "p",
        "mm",
        "a4"
      );

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const imageWidth = pageWidth - 20;

      const imageHeight =
        (canvas.height * imageWidth) /
        canvas.width;

      let heightLeft = imageHeight;
      let position = 10;

      pdf.addImage(
        imageData,
        "PNG",
        10,
        position,
        imageWidth,
        imageHeight
      );

      heightLeft -= pageHeight - 20;

      while (heightLeft > 0) {
        position =
          heightLeft - imageHeight + 10;

        pdf.addPage();

        pdf.addImage(
          imageData,
          "PNG",
          10,
          position,
          imageWidth,
          imageHeight
        );

        heightLeft -=
          pageHeight - 20;
      }

      return pdf.output("blob");
    } finally {
      document.body.removeChild(
        element
      );
    }
  };

  const downloadAffidavit = async () => {
    if (
      !form.name ||
      !termsAccepted ||
      !declarationAccepted
    ) {
      alert(t.acceptBoth);
      return;
    }

    try {
      setLoading(true);

      const temporaryNumber =
        applicationNumber ||
        "PREVIEW";

      const blob =
        await generateAffidavitBlob(
          temporaryNumber
        );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `Ojal-Affidavit-${temporaryNumber}.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert(t.pdfError);
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (
    applicationId,
    file,
    documentType
  ) => {
    if (!file) return;

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "file";

    const uniqueId =
      Date.now().toString(36) +
      Math.random()
        .toString(36)
        .substring(2, 10);

    const filePath =
      `${applicationId}/${documentType}-${uniqueId}.${extension}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from("women-documents")
      .upload(
        filePath,
        file,
        {
          cacheControl: "3600",
          upsert: false,
        }
      );

    if (uploadError) {
      throw uploadError;
    }

    const {
      error: dbError,
    } = await supabase
      .from("women_documents")
      .insert({
        application_id:
          applicationId,

        document_type:
          documentType,

        file_name:
          file.name,

        file_path:
          filePath,
      });

    if (dbError) {
      throw dbError;
    }
  };

  const validateForm = () => {
    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.district ||
      !form.pincode
    ) {
      alert(t.fillRequired);
      return false;
    }

    if (
      !documents.photo ||
      !documents.aadhaar_pan ||
      !documents.ration_card ||
      !documents.bank_passbook
    ) {
      alert(t.documentsRequired);
      return false;
    }

    if (
      !termsAccepted ||
      !declarationAccepted
    ) {
      alert(t.acceptBoth);
      return false;
    }

    if (
      form.existing_business &&
      !form.business_name
    ) {
      alert(t.fillRequired);
      return false;
    }

    if (
      !form.existing_business &&
      !form.proposed_business
    ) {
      alert(t.fillRequired);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const appNumber =
        getApplicationNumber();

      const {
        data: application,
        error,
      } = await supabase
        .from("women_applications")
        .insert({
          application_number:
            appNumber,

          name: form.name,

          date_of_birth:
            form.date_of_birth ||
            null,

          phone: form.phone,

          email:
            form.email || null,

          address: form.address,

          city: form.city,

          district:
            form.district,

          pincode:
            form.pincode,

          marital_status:
            form.marital_status ||
            null,

          family_members:
            form.family_members
              ? Number(
                  form.family_members
                )
              : null,

          children_count:
            form.children_count
              ? Number(
                  form.children_count
                )
              : null,

          existing_business:
            form.existing_business,

          business_name:
            form.business_name ||
            null,

          business_type:
            form.business_type ||
            null,

          business_address:
            form.business_address ||
            null,

          business_duration:
            form.business_duration ||
            null,

          monthly_income:
            form.monthly_income ||
            null,

          proposed_business:
            form.existing_business
              ? null
              : form.proposed_business ||
                null,

          investment_required:
            form.existing_business
              ? null
              : form.investment_required ||
                null,

          business_plan:
            form.business_plan ||
            null,

          support_required:
            form.support_required ||
            null,

          membership_paid: false,

          membership_paid_date:
            null,

          membership_payment_reference:
            null,

          status: "pending",

          admin_remarks:
            null,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      const applicationId =
        application.id;

      await uploadDocument(
        applicationId,
        documents.photo,
        "passport-photo"
      );

      await uploadDocument(
        applicationId,
        documents.aadhaar_pan,
        "aadhaar-pan"
      );

      await uploadDocument(
        applicationId,
        documents.ration_card,
        "ration-card"
      );

      await uploadDocument(
        applicationId,
        documents.bank_passbook,
        "bank-passbook"
      );

      const affidavitBlob =
        await generateAffidavitBlob(
          appNumber
        );

      const affidavitPath =
        `${applicationId}/pratidnya-patra-${appNumber}.pdf`;

      const {
        error: pdfUploadError,
      } = await supabase.storage
        .from("women-documents")
        .upload(
          affidavitPath,
          affidavitBlob,
          {
            contentType:
              "application/pdf",

            cacheControl:
              "3600",

            upsert: false,
          }
        );

      if (pdfUploadError) {
        throw pdfUploadError;
      }

      const {
        error: affidavitDbError,
      } = await supabase
        .from("women_documents")
        .insert({
          application_id:
            applicationId,

          document_type:
            "pratidnya-patra",

          file_name:
            `pratidnya-patra-${appNumber}.pdf`,

          file_path:
            affidavitPath,
        });

      if (affidavitDbError) {
        throw affidavitDbError;
      }

      setApplicationNumber(
        appNumber
      );

      setSuccess(true);
    } catch (error) {
      console.error(
        "Application submission error:",
        error
      );

      alert(
        error?.message ||
          t.submitError
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>
            ✓
          </div>

          <h1 style={styles.successH1}>
            {t.successTitle}
          </h1>

          <p style={styles.successP}>
            {t.successText}
          </p>

          <div
            style={
              styles.applicationNumber
            }
          >
            <span
              style={
                styles.applicationNumberSpan
              }
            >
              {t.applicationNo}
            </span>

            <strong
              style={
                styles.applicationNumberStrong
              }
            >
              {applicationNumber}
            </strong>
          </div>

          <button
            type="button"
            style={
              styles.primaryButton
            }
            onClick={
              downloadAffidavit
            }
          >
            {t.download}
          </button>

          <br />

          <a
            href="/"
            style={styles.homeButton}
          >
            Home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* LANGUAGE SELECTOR */}

        <div style={styles.languageBox}>
          <span
            style={
              styles.languageLabel
            }
          >
            {t.language}
          </span>

          <button
            type="button"
            onClick={() =>
              setLanguage("mr")
            }
            style={
              language === "mr"
                ? styles.languageActive
                : styles.languageButton
            }
          >
            मराठी
          </button>

          <button
            type="button"
            onClick={() =>
              setLanguage("hi")
            }
            style={
              language === "hi"
                ? styles.languageActive
                : styles.languageButton
            }
          >
            हिंदी
          </button>

          <button
            type="button"
            onClick={() =>
              setLanguage("en")
            }
            style={
              language === "en"
                ? styles.languageActive
                : styles.languageButton
            }
          >
            English
          </button>
        </div>

        {/* HERO */}

        <section style={styles.hero}>
          <div
            style={styles.heroBadge}
          >
            Ojal Micro Service Foundation
          </div>

          <h1 style={styles.heroH1}>
            {t.title}
          </h1>

          <p style={styles.heroP}>
            {t.subtitle}
          </p>
        </section>

        {/* PROGRAM INFORMATION */}

        <section style={styles.card}>
          <h2 style={styles.cardH2}>
            {t.programInfo}
          </h2>

          <p style={styles.cardP}>
            {t.programText}
          </p>

          <div
            style={
              styles.membershipBox
            }
          >
            <h3
              style={
                styles.membershipH3
              }
            >
              ₹1,500
            </h3>

            <p style={styles.cardP}>
              {t.membership}
            </p>
          </div>

          <div
            style={styles.benefitBox}
          >
            <p style={styles.cardP}>
              {t.yearlySupport}
            </p>
          </div>
        </section>

        {/* FORM */}

        <form onSubmit={handleSubmit}>

          {/* PERSONAL INFORMATION */}

          <section style={styles.card}>
            <h2 style={styles.cardH2}>
              {t.personal}
            </h2>

            <div style={styles.grid}>
              <Field
                label={t.name}
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <Field
                label={t.dob}
                name="date_of_birth"
                type="date"
                value={
                  form.date_of_birth
                }
                onChange={handleChange}
              />

              <Field
                label={t.phone}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />

              <Field
                label={t.email}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* ADDRESS */}

          <section style={styles.card}>
            <h2 style={styles.cardH2}>
              {t.addressInfo}
            </h2>

            <label style={styles.label}>
              {t.address} *
            </label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              style={styles.textarea}
              required
            />

            <div style={styles.grid}>
              <Field
                label={t.city}
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />

              <Field
                label={t.district}
                name="district"
                value={form.district}
                onChange={handleChange}
                required
              />

              <Field
                label={t.pincode}
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                required
              />
            </div>
          </section>

          {/* FAMILY */}

          <section style={styles.card}>
            <h2 style={styles.cardH2}>
              {t.familyInfo}
            </h2>

            <div style={styles.grid}>

              <div>
                <label
                  style={styles.label}
                >
                  {t.marital}
                </label>

                <select
                  name="marital_status"
                  value={
                    form.marital_status
                  }
                  onChange={
                    handleChange
                  }
                  style={
                    styles.input
                  }
                >
                  <option value="">
                    Select
                  </option>

                  <option value="married">
                    {t.married}
                  </option>

                  <option value="unmarried">
                    {t.unmarried}
                  </option>

                  <option value="widow">
                    {t.widow}
                  </option>

                  <option value="divorced">
                    {t.divorced}
                  </option>
                </select>
              </div>

              <Field
                label={t.familyMembers}
                name="family_members"
                type="number"
                value={
                  form.family_members
                }
                onChange={
                  handleChange
                }
              />

              <Field
                label={t.children}
                name="children_count"
                type="number"
                value={
                  form.children_count
                }
                onChange={
                  handleChange
                }
              />
            </div>
          </section>

          {/* BUSINESS */}

          <section style={styles.card}>
            <h2 style={styles.cardH2}>
              {t.businessInfo}
            </h2>

            <label
              style={
                styles.checkboxRow
              }
            >
              <input
                type="checkbox"
                name="existing_business"
                checked={
                  form.existing_business
                }
                onChange={
                  handleChange
                }
                style={
                  styles.checkbox
                }
              />

              <span>
                {t.existingBusiness}
              </span>
            </label>

            {form.existing_business ? (
              <>
                <div
                  style={styles.grid}
                >
                  <Field
                    label={
                      t.businessName
                    }
                    name="business_name"
                    value={
                      form.business_name
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                  <Field
                    label={
                      t.businessType
                    }
                    name="business_type"
                    value={
                      form.business_type
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <Field
                    label={
                      t.businessDuration
                    }
                    name="business_duration"
                    value={
                      form.business_duration
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <Field
                    label={
                      t.monthlyIncome
                    }
                    name="monthly_income"
                    value={
                      form.monthly_income
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

                <label
                  style={styles.label}
                >
                  {t.businessAddress}
                </label>

                <textarea
                  name="business_address"
                  value={
                    form.business_address
                  }
                  onChange={
                    handleChange
                  }
                  rows={3}
                  style={
                    styles.textarea
                  }
                />

                <label
                  style={styles.label}
                >
                  {t.businessPlan}
                </label>

                <textarea
                  name="business_plan"
                  value={
                    form.business_plan
                  }
                  onChange={
                    handleChange
                  }
                  rows={5}
                  style={
                    styles.textarea
                  }
                />
              </>
            ) : (
              <>
                <div
                  style={styles.grid}
                >
                  <Field
                    label={
                      t.proposedBusiness
                    }
                    name="proposed_business"
                    value={
                      form.proposed_business
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                  <Field
                    label={t.investment}
                    name="investment_required"
                    value={
                      form.investment_required
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

                <label
                  style={styles.label}
                >
                  {t.businessPlan}
                </label>

                <textarea
                  name="business_plan"
                  value={
                    form.business_plan
                  }
                  onChange={
                    handleChange
                  }
                  rows={5}
                  style={
                    styles.textarea
                  }
                />
              </>
            )}

            <label
              style={styles.label}
            >
              {t.support}
            </label>

            <textarea
              name="support_required"
              value={
                form.support_required
              }
              onChange={
                handleChange
              }
              rows={5}
              style={styles.textarea}
            />
          </section>

          {/* DOCUMENTS */}

          <section style={styles.card}>
            <h2 style={styles.cardH2}>
              {t.documents}
            </h2>

            <FileInput
              label={t.photo}
              file={documents.photo}
              onChange={(e) =>
                handleFileChange(
                  e,
                  "photo"
                )
              }
              required
            />

            <FileInput
              label={t.aadhaarPan}
              file={
                documents.aadhaar_pan
              }
              onChange={(e) =>
                handleFileChange(
                  e,
                  "aadhaar_pan"
                )
              }
              required
            />

            <FileInput
              label={t.ration}
              file={
                documents.ration_card
              }
              onChange={(e) =>
                handleFileChange(
                  e,
                  "ration_card"
                )
              }
              required
            />

            <FileInput
              label={t.bank}
              file={
                documents.bank_passbook
              }
              onChange={(e) =>
                handleFileChange(
                  e,
                  "bank_passbook"
                )
              }
              required
            />
          </section>

          {/* TERMS */}

          <section style={styles.card}>
            <h2 style={styles.cardH2}>
              {t.terms}
            </h2>

            <div
              style={styles.termsBox}
            >
              <ol
                style={
                  styles.termsList
                }
              >
                {t.termsList.map(
                  (term, index) => (
                    <li
                      key={index}
                      style={
                        styles.termsItem
                      }
                    >
                      {term}
                    </li>
                  )
                )}
              </ol>
            </div>

            <label
              style={
                styles.checkboxRow
              }
            >
              <input
                type="checkbox"
                checked={
                  termsAccepted
                }
                onChange={(e) =>
                  setTermsAccepted(
                    e.target.checked
                  )
                }
                style={
                  styles.checkbox
                }
              />

              <span>
                {t.acceptTerms}
              </span>
            </label>
          </section>

          {/* DECLARATION */}

          <section style={styles.card}>
            <h2 style={styles.cardH2}>
              {t.declaration}
            </h2>

            <div
              style={
                styles.declarationBox
              }
            >
              {t.declarationText}
            </div>

            <label
              style={
                styles.checkboxRow
              }
            >
              <input
                type="checkbox"
                checked={
                  declarationAccepted
                }
                onChange={(e) =>
                  setDeclarationAccepted(
                    e.target.checked
                  )
                }
                style={
                  styles.checkbox
                }
              />

              <span>
                {t.acceptDeclaration}
              </span>
            </label>
          </section>

          {/* AFFIDAVIT */}

          <section style={styles.card}>
            <h2 style={styles.cardH2}>
              {t.affidavit}
            </h2>

            <p style={styles.cardP}>
              {t.affidavitText}
            </p>

            <button
              type="button"
              onClick={
                downloadAffidavit
              }
              disabled={
                !termsAccepted ||
                !declarationAccepted ||
                !form.name ||
                loading
              }
              style={
                !termsAccepted ||
                !declarationAccepted ||
                !form.name ||
                loading
                  ? styles.disabledButton
                  : styles.secondaryButton
              }
            >
              {t.generate}
            </button>
          </section>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            style={
              loading
                ? styles.disabledSubmit
                : styles.submitButton
            }
          >
            {loading
              ? t.submitting
              : t.submit}
          </button>
        </form>
      </div>
    </main>
  );
}


/* =========================================
   FIELD COMPONENT
========================================= */

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label style={styles.label}>
        {label}
        {required ? " *" : ""}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        style={styles.input}
      />
    </div>
  );
}


/* =========================================
   FILE COMPONENT
========================================= */

function FileInput({
  label,
  file,
  onChange,
  required = false,
}) {
  return (
    <div style={styles.fileBox}>
      <label style={styles.label}>
        {label}
        {required ? " *" : ""}
      </label>

      <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={onChange}
        required={required}
        style={styles.fileInput}
      />

      {file && (
        <p style={styles.fileName}>
          ✓ {file.name}
        </p>
      )}
    </div>
  );
}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================================
   STYLES
========================================= */

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #fff7fb 0%, #f5f0ff 50%, #eef7ff 100%)",
    padding: "30px 15px 60px",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    color: "#222",
  },

  container: {
    width: "100%",
    maxWidth: "1000px",
    margin: "auto",
  },

  languageBox: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  languageLabel: {
    fontSize: "16px",
    fontWeight: "600",
    marginRight: "5px",
  },

  languageButton: {
    border: "1px solid #ddd",
    background: "#fff",
    color: "#222",
    borderRadius: "20px",
    padding: "8px 15px",
    cursor: "pointer",
    fontSize: "15px",
  },

  languageActive: {
    border: "1px solid #7c3aed",
    background: "#7c3aed",
    color: "#fff",
    borderRadius: "20px",
    padding: "8px 15px",
    cursor: "pointer",
    fontSize: "15px",
  },

  hero: {
    background:
      "linear-gradient(135deg, #6d28d9, #9333ea)",
    color: "#fff",
    borderRadius: "25px",
    padding: "50px 30px",
    textAlign: "center",
    marginBottom: "25px",
    boxShadow:
      "0 15px 40px rgba(90,50,130,0.18)",
  },

  heroBadge: {
    display: "inline-block",
    background:
      "rgba(255,255,255,0.16)",
    padding: "8px 16px",
    borderRadius: "30px",
    fontSize: "15px",
    marginBottom: "15px",
  },

  heroH1: {
    fontSize:
      "clamp(28px, 5vw, 44px)",
    margin: "10px 0",
    lineHeight: 1.25,
  },

  heroP: {
    fontSize: "19px",
    lineHeight: 1.7,
    margin: "10px auto 0",
    maxWidth: "700px",
  },

  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "30px",
    marginBottom: "22px",
    boxShadow:
      "0 8px 30px rgba(0,0,0,0.07)",
  },

  cardH2: {
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "26px",
    color: "#5b21b6",
  },

  cardP: {
    fontSize: "17px",
    lineHeight: 1.8,
  },

  membershipBox: {
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: "15px",
    padding: "20px",
    marginTop: "20px",
  },

  membershipH3: {
    fontSize: "32px",
    margin: "0 0 8px",
    color: "#c2410c",
  },

  benefitBox: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "15px",
    padding: "18px",
    marginTop: "15px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },

  label: {
    display: "block",
    fontSize: "17px",
    fontWeight: "600",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    border:
      "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "16px",
    background: "#fff",
    outline: "none",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    border:
      "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "16px",
    resize: "vertical",
    marginBottom: "20px",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  checkboxRow: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    fontSize: "17px",
    lineHeight: 1.6,
    marginTop: "20px",
    cursor: "pointer",
  },

  checkbox: {
    width: "20px",
    height: "20px",
    marginTop: "3px",
    flexShrink: 0,
  },

  fileBox: {
    background: "#fafafa",
    border:
      "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "18px",
    marginBottom: "15px",
  },

  fileInput: {
    width: "100%",
    fontSize: "15px",
  },

  fileName: {
    color: "#15803d",
    marginBottom: 0,
    fontSize: "15px",
  },

  termsBox: {
    background: "#fafafa",
    border: "1px solid #eee",
    borderRadius: "14px",
    padding: "20px",
    maxHeight: "350px",
    overflowY: "auto",
  },

  termsList: {
    paddingLeft: "25px",
    margin: 0,
  },

  termsItem: {
    marginBottom: "12px",
    fontSize: "16px",
    lineHeight: 1.7,
  },

  declarationBox: {
    background: "#f8f5ff",
    borderLeft:
      "5px solid #7c3aed",
    borderRadius: "10px",
    padding: "20px",
    fontSize: "17px",
    lineHeight: 1.8,
  },

  secondaryButton: {
    border: "none",
    background: "#7c3aed",
    color: "#fff",
    padding: "14px 22px",
    borderRadius: "10px",
    fontSize: "17px",
    fontWeight: "600",
    cursor: "pointer",
  },

  primaryButton: {
    border: "none",
    background:
      "linear-gradient(135deg, #6d28d9, #9333ea)",
    color: "#fff",
    padding: "15px 25px",
    borderRadius: "10px",
    fontSize: "17px",
    fontWeight: "600",
    cursor: "pointer",
  },

  disabledButton: {
    border: "none",
    background: "#d1d5db",
    color: "#777",
    padding: "14px 22px",
    borderRadius: "10px",
    fontSize: "17px",
    fontWeight: "600",
    cursor: "not-allowed",
  },

  submitButton: {
    width: "100%",
    border: "none",
    background:
      "linear-gradient(135deg, #6d28d9, #9333ea)",
    color: "#fff",
    padding: "18px",
    borderRadius: "14px",
    fontSize: "20px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 10px 25px rgba(109,40,217,0.25)",
  },

  disabledSubmit: {
    width: "100%",
    border: "none",
    background: "#aaa",
    color: "#fff",
    padding: "18px",
    borderRadius: "14px",
    fontSize: "20px",
    fontWeight: "700",
    cursor: "not-allowed",
  },

  successCard: {
    width: "100%",
    maxWidth: "650px",
    margin: "80px auto",
    background: "#fff",
    borderRadius: "25px",
    padding: "45px 30px",
    textAlign: "center",
    boxShadow:
      "0 15px 45px rgba(0,0,0,0.1)",
  },

  successIcon: {
    width: "75px",
    height: "75px",
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#16a34a",
    fontSize: "45px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },

  successH1: {
    fontSize: "30px",
    color: "#15803d",
  },

  successP: {
    fontSize: "17px",
    lineHeight: 1.7,
  },

  applicationNumber: {
    background: "#f5f3ff",
    border:
      "1px solid #ddd6fe",
    padding: "20px",
    borderRadius: "15px",
    margin: "25px 0",
  },

  applicationNumberSpan: {
    display: "block",
    fontSize: "15px",
    color: "#666",
    marginBottom: "8px",
  },

  applicationNumberStrong: {
    display: "block",
    fontSize: "23px",
    color: "#6d28d9",
    wordBreak: "break-word",
  },

  homeButton: {
    display: "inline-block",
    marginTop: "15px",
    padding: "13px 25px",
    borderRadius: "10px",
    background: "#f3f4f6",
    color: "#222",
    textDecoration: "none",
    fontSize: "16px",
  },
};