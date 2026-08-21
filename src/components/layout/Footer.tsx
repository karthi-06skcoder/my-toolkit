import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  const goTo = (path: string) => {
    navigate(path);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t border-[#1D1D1D] bg-[#08090B]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">

          {/* Brand */}
          <div>
            <button
              type="button"
              onClick={() => goTo("/")}
              className="group flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#3A3020] bg-[#101214] transition group-hover:border-[#D4A84F]">
                <span className="font-serif text-sm italic text-[#D4A84F]">
                  M
                </span>
              </div>

              <div className="text-left">
                <p className="text-sm font-medium tracking-[0.18em] text-[#F5F1E8]">
                  MY TOOLKIT
                </p>

                <p className="text-[8px] uppercase tracking-[0.3em] text-[#555555]">
                  Simple. Useful. Free.
                </p>
              </div>
            </button>

            <p className="mt-6 max-w-sm text-sm leading-7 text-[#555555]">
              Simple online tools for everyday calculations,
              file processing, image conversion and developer
              utilities.
            </p>

            <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-[#333333]">
              Built for everyday work.
            </p>
          </div>

          {/* Tools */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4A84F]">
              Tools
            </p>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => goTo("/gst-calculator")}
                className="block text-sm text-[#555555] transition hover:text-[#D4A84F]"
              >
                GST Calculator
              </button>

              <button
                type="button"
                onClick={() => goTo("/emi-calculator")}
                className="block text-sm text-[#555555] transition hover:text-[#D4A84F]"
              >
                EMI Calculator
              </button>

              <button
                type="button"
                onClick={() => goTo("/pdf-merge")}
                className="block text-sm text-[#555555] transition hover:text-[#D4A84F]"
              >
                PDF Merge
              </button>

              <button
                type="button"
                onClick={() => goTo("/image-compress")}
                className="block text-sm text-[#555555] transition hover:text-[#D4A84F]"
              >
                Image Compress
              </button>

              <button
                type="button"
                onClick={() => goTo("/json-formatter")}
                className="block text-sm text-[#555555] transition hover:text-[#D4A84F]"
              >
                JSON Formatter
              </button>
            </div>
          </div>

          {/* Developer */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4A84F]">
              Developer
            </p>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => goTo("/json-validator")}
                className="block text-sm text-[#555555] transition hover:text-[#D4A84F]"
              >
                JSON Validator
              </button>

              <button
                type="button"
                onClick={() => goTo("/base64-encoder")}
                className="block text-sm text-[#555555] transition hover:text-[#D4A84F]"
              >
                Base64 Encoder
              </button>

              <button
                type="button"
                onClick={() => goTo("/url-encoder")}
                className="block text-sm text-[#555555] transition hover:text-[#D4A84F]"
              >
                URL Encoder
              </button>

              <button
                type="button"
                onClick={() => goTo("/password-generator")}
                className="block text-sm text-[#555555] transition hover:text-[#D4A84F]"
              >
                Password Generator
              </button>
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4A84F]">
              Information
            </p>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => goTo("/about")}
                className="block text-sm text-[#555555] transition hover:text-[#D4A84F]"
              >
                About
              </button>

              <button
                type="button"
                onClick={() => goTo("/privacy-policy")}
                className="block text-sm text-[#555555] transition hover:text-[#D4A84F]"
              >
                Privacy Policy
              </button>

              <button
                type="button"
                onClick={() => goTo("/terms")}
                className="block text-sm text-[#555555] transition hover:text-[#D4A84F]"
              >
                Terms of Use
              </button>

              <button
                type="button"
                onClick={() => goTo("/contact")}
                className="block text-sm text-[#555555] transition hover:text-[#D4A84F]"
              >
                Contact
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4 border-t border-[#1D1D1D] py-7 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-[#3F3F3F]">
            © {new Date().getFullYear()} My Toolkit. All
            rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => goTo("/privacy-policy")}
              className="text-[10px] uppercase tracking-[0.15em] text-[#444444] transition hover:text-[#D4A84F]"
            >
              Privacy
            </button>

            <button
              type="button"
              onClick={() => goTo("/terms")}
              className="text-[10px] uppercase tracking-[0.15em] text-[#444444] transition hover:text-[#D4A84F]"
            >
              Terms
            </button>

            <button
              type="button"
              onClick={() => goTo("/contact")}
              className="text-[10px] uppercase tracking-[0.15em] text-[#444444] transition hover:text-[#D4A84F]"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;