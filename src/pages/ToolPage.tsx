import { useLocation } from "react-router-dom";

function ToolPage() {
  const location = useLocation();

  const toolName = location.pathname
    .replace("/", "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <main className="min-h-screen bg-[#090A0C] px-6 py-24 text-[#F5F1E8]">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[0.35em] text-[#D4A84F]">
          My Toolkit
        </p>

        <h1 className="mt-5 text-5xl font-light md:text-7xl">
          {toolName}
        </h1>

        <p className="mt-5 text-[#777777]">
          This tool is coming together.
        </p>
      </div>
    </main>
  );
}

export default ToolPage;