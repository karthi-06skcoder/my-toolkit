import { useNavigate } from "react-router-dom";

import SEO from "../components/common/SEO";

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#090A0C] px-6 text-center">
      <SEO
        title="Page Not Found"
        description="The page you are looking for could not be found."
      />

      <div>
        <p className="font-mono text-sm text-[#D4A84F]">
          404
        </p>

        <h1 className="mt-4 text-5xl font-light">
          Page not{" "}
          <span className="font-serif italic text-[#D4A84F]">
            found.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#555555]">
          The page you requested doesn't exist or may
          have been moved.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/")
          }
          className="mt-8 rounded-xl bg-[#D4A84F] px-7 py-3 text-sm font-medium text-[#090A0C] transition hover:bg-[#E3BD68]"
        >
          Back to Home
        </button>
      </div>
    </main>
  );
}

export default NotFound;