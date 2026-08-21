function About() {
  return (
    <main className="min-h-screen bg-[#090A0C] text-[#F5F1E8]">
      <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">

        <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4A84F]">
          About
        </p>

        <h1 className="mt-4 text-4xl font-light">
          About{" "}
          <span className="font-serif italic text-[#D4A84F]">
            My Toolkit.
          </span>
        </h1>

        <div className="mt-12 space-y-8 text-sm leading-7 text-[#666666]">

          <p>
            My Toolkit is a collection of simple, useful
            online tools designed to make everyday digital
            tasks faster and easier.
          </p>

          <p>
            From GST and EMI calculations to PDF processing,
            image conversion and developer utilities, the goal
            is to keep commonly needed tools available in one
            clean and easy-to-use place.
          </p>

          <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-[#D4A84F]">
              Our approach
            </p>

            <p className="mt-4">
              Fast. Simple. Private where possible.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}

export default About;