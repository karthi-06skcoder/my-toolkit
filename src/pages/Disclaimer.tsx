import SEO from "../components/common/SEO";

function Disclaimer() {
  return (
    <>
      <SEO
        title="Disclaimer"
        description="My Toolkit disclaimer covering calculator results, financial information and general tool usage."
      />

      <main className="min-h-screen bg-[#090A0C] px-5 py-16 text-[#F5F1E8] sm:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl">

          <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4A84F]">
            Legal
          </p>

          <h1 className="mt-4 text-4xl font-light sm:text-5xl">
            Disclaimer
          </h1>

          <div className="mt-10 space-y-8 text-sm leading-7 text-[#666666]">

            <section>
              <h2 className="text-xl font-light text-[#F5F1E8]">
                General Information
              </h2>

              <p className="mt-3">
                The tools and information provided by My Toolkit
                are intended for general informational and
                utility purposes only.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light text-[#F5F1E8]">
                Calculator Results
              </h2>

              <p className="mt-3">
                Calculator results are estimates generated from
                the information entered by the user. Actual
                financial, tax, loan, salary or other results may
                vary depending on applicable rules, rates,
                fees, policies and individual circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light text-[#F5F1E8]">
                Financial Information
              </h2>

              <p className="mt-3">
                My Toolkit does not provide financial, tax,
                investment, legal or professional advice.
                Please consult an appropriately qualified
                professional before making financial or other
                important decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light text-[#F5F1E8]">
                File Processing
              </h2>

              <p className="mt-3">
                File-based tools are provided for convenience.
                Users should retain backups of important files
                before processing them.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light text-[#F5F1E8]">
                No Guarantee
              </h2>

              <p className="mt-3">
                While we aim to keep the tools accurate and
                reliable, My Toolkit does not guarantee that
                every result will be error-free or suitable for
                a particular purpose.
              </p>
            </section>

          </div>
        </div>
      </main>
    </>
  );
}

export default Disclaimer;