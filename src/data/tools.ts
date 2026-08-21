export type ToolCategory =
  | "Calculators"
  | "PDF Tools"
  | "Image Tools"
  | "Developer Tools";

export type Tool = {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  path: string;
  icon: string;
  popular?: boolean;
};

export const tools: Tool[] = [
  // -------------------------
  // CALCULATORS
  // -------------------------

  {
    id: "gst-calculator",
    name: "GST Calculator",
    description:
      "Calculate GST amount, inclusive and exclusive prices.",
    category: "Calculators",
    path: "/gst-calculator",
    icon: "₹",
    popular: true,
  },

  {
    id: "emi-calculator",
    name: "EMI Calculator",
    description:
      "Calculate monthly EMI, total interest and repayment.",
    category: "Calculators",
    path: "/emi-calculator",
    icon: "◉",
    popular: true,
  },

  {
    id: "age-calculator",
    name: "Age Calculator",
    description:
      "Calculate your exact age in years, months and days.",
    category: "Calculators",
    path: "/age-calculator",
    icon: "⌛",
    popular: true,
  },

  {
    id: "percentage-calculator",
    name: "Percentage Calculator",
    description:
      "Calculate percentages, increases, decreases and differences.",
    category: "Calculators",
    path: "/percentage-calculator",
    icon: "%",
  },

  {
    id: "salary-calculator",
    name: "Salary Calculator",
    description:
      "Calculate salary breakdown, deductions and take-home pay.",
    category: "Calculators",
    path: "/salary-calculator",
    icon: "₹",
  },

  {
    id: "loan-calculator",
    name: "Loan Calculator",
    description:
      "Estimate loan EMI, interest and total repayment.",
    category: "Calculators",
    path: "/loan-calculator",
    icon: "◈",
  },

  {
    id: "date-difference",
    name: "Date Difference",
    description:
      "Calculate the difference between two dates.",
    category: "Calculators",
    path: "/date-difference",
    icon: "◫",
  },

  {
    id: "time-difference",
    name: "Time Difference",
    description:
      "Calculate the difference between two times.",
    category: "Calculators",
    path: "/time-difference",
    icon: "◷",
  },

  // -------------------------
  // PDF TOOLS
  // -------------------------

  {
    id: "pdf-merge",
    name: "PDF Merge",
    description:
      "Combine multiple PDF files into one document.",
    category: "PDF Tools",
    path: "/pdf-merge",
    icon: "▣",
    popular: true,
  },

  {
    id: "pdf-split",
    name: "PDF Split",
    description:
      "Split a PDF into separate pages or documents.",
    category: "PDF Tools",
    path: "/pdf-split",
    icon: "◫",
  },

  // -------------------------
  // IMAGE TOOLS
  // -------------------------

  {
    id: "image-compress",
    name: "Image Compress",
    description:
      "Reduce image file size while keeping good quality.",
    category: "Image Tools",
    path: "/image-compress",
    icon: "◉",
    popular: true,
  },

  {
    id: "image-resize",
    name: "Image Resize",
    description:
      "Resize images using custom dimensions or presets.",
    category: "Image Tools",
    path: "/image-resize",
    icon: "↔",
  },

  {
    id: "jpg-to-png",
    name: "JPG → PNG",
    description:
      "Convert JPG and JPEG images to PNG format.",
    category: "Image Tools",
    path: "/jpg-to-png",
    icon: "→",
  },

  {
    id: "png-to-jpg",
    name: "PNG → JPG",
    description:
      "Convert PNG images to JPG format with quality controls.",
    category: "Image Tools",
    path: "/png-to-jpg",
    icon: "→",
  },

  // -------------------------
  // DEVELOPER TOOLS
  // -------------------------

  {
    id: "json-formatter",
    name: "JSON Formatter",
    description:
      "Format, validate and minify JSON data.",
    category: "Developer Tools",
    path: "/json-formatter",
    icon: "{ }",
    popular: true,
  },

  {
    id: "json-validator",
    name: "JSON Validator",
    description:
      "Validate JSON syntax and find malformed data.",
    category: "Developer Tools",
    path: "/json-validator",
    icon: "{ }",
  },

  {
    id: "base64-encoder",
    name: "Base64 Encoder",
    description:
      "Encode and decode Base64 text instantly.",
    category: "Developer Tools",
    path: "/base64-encoder",
    icon: "64",
  },

  {
    id: "url-encoder",
    name: "URL Encoder",
    description:
      "Encode and decode URL components safely.",
    category: "Developer Tools",
    path: "/url-encoder",
    icon: "URL",
  },

  {
    id: "password-generator",
    name: "Password Generator",
    description:
      "Generate secure and customizable passwords.",
    category: "Developer Tools",
    path: "/password-generator",
    icon: "🔐",
    popular: true,
  },
];

export const categories: ToolCategory[] = [
  "Calculators",
  "PDF Tools",
  "Image Tools",
  "Developer Tools",
];