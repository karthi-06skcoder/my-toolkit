function Contact() {
  return (
    <main className="min-h-screen bg-[#090A0C] text-[#F5F1E8]">
      <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">

        <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4A84F]">
          Contact
        </p>

        <h1 className="mt-4 text-4xl font-light">
          Get in{" "}
          <span className="font-serif italic text-[#D4A84F]">
            touch.
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#666666]">
          Found a problem, have a suggestion, or want to
          report an issue with one of our tools?
        </p>

        <div className="mt-12 rounded-2xl border border-[#24201B] bg-[#0D0F11] p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#D4A84F]">
            Email
          </p>

          <a
            href="mailto:hello@mytoolkit.com"
            className="mt-4 inline-block text-lg text-[#F5F1E8] transition hover:text-[#D4A84F]"
          >
            hello@mytoolkit.com
          </a>

          <p className="mt-5 text-sm leading-6 text-[#555555]">
            Replace this email address with your actual
            support/contact email before publishing the
            website.
          </p>
        </div>
      </div>
    </main>
  );
}

export default Contact;