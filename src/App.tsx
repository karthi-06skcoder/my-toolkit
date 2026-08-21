import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
// import ToolPage from "./pages/ToolPage";
import GSTCalculator from "./pages/finance/GSTCalculator";
import EMICalculator from "./pages/finance/EMICalculator";
import SalaryCalculator from "./pages/finance/SalaryCalculator";
import LoanCalculator from "./pages/finance/LoanCalculator";
import PercentageCalculator from "./pages/finance/PercentageCalculator";

import AgeCalculator from "./pages/date/AgeCalculator";
import DateDifference from "./pages/date/DateDifference";
import TimeDifference from "./pages/date/TimeDifference";

import PDFMerge from "./pages/pdf/PDFMerge";
import PDFSplit from "./pages/pdf/PDFSplit";

import ImageCompress from "./pages/image/ImageCompress";
import ImageResize from "./pages/image/ImageResize";
import JPGToPNG from "./pages/image/JPGToPNG";
import PNGToJPG from "./pages/image/PNGToJPG";

import JSONFormatter from "./pages/developer/JSONFormatter";
import JSONValidator from "./pages/developer/JSONValidator";
import Base64Encoder from "./pages/developer/Base64Encoder";
import URLEncoder from "./pages/developer/URLEncoder";
import PasswordGenerator from "./pages/developer/PasswordGenerator";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import Terms from "./pages/legal/Terms";
import About from "./pages/legal/About";
import Contact from "./pages/legal/Contact";
import NotFound from "./pages/NotFound";

import GoogleAnalytics from "./components/analytics/GoogleAnalytics";
import AnalyticsTracker from "./components/analytics/AnalyticsTracker";

function App() {
  return (
    <BrowserRouter>
    <GoogleAnalytics />
    <AnalyticsTracker />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/gst-calculator" element={<GSTCalculator />} />
        <Route path="/emi-calculator" element={<EMICalculator />} />
        <Route path="/salary-calculator" element={<SalaryCalculator />} />
        <Route path="/loan-calculator" element={<LoanCalculator />} />
        <Route path="/percentage-calculator" element={<PercentageCalculator />} />

        <Route path="/age-calculator" element={<AgeCalculator />} />
        <Route path="/date-difference" element={<DateDifference />} />
        <Route path="/time-difference" element={<TimeDifference />} />

        <Route path="/pdf-merge" element={<PDFMerge />} />
        <Route path="/pdf-split" element={<PDFSplit />} />

        <Route path="/image-compress" element={<ImageCompress />} />
        <Route path="/image-resize" element={<ImageResize />} />
        <Route path="/jpg-to-png" element={<JPGToPNG />} />
        <Route path="/png-to-jpg" element={<PNGToJPG />} />

        <Route path="/json-formatter" element={<JSONFormatter />} />
        <Route path="/json-validator" element={<JSONValidator />} />
        <Route path="/base64-encoder" element={<Base64Encoder />} />
        <Route path="/url-encoder" element={<URLEncoder />} />

        <Route path="/password-generator" element={<PasswordGenerator />} />
        
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;