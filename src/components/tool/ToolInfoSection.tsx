type FAQ = {
  question: string;
  answer: string;
};

type ToolInfoSectionProps = {
  title: string;
  description: string;
  sections?: {
    title: string;
    content: string;
  }[];
  faqs?: FAQ[];
};

function ToolInfoSection({
  title,
  description,
  sections = [],
  faqs = [],
}: ToolInfoSectionProps) {
  return (
    <section className="mt-20 border-t border-[#1D1D1D] pt-12">
      <div className="max-w-4xl">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4A84F]">
          Learn more
        </p>

        <h2 className="mt-4 text-3xl font-light text-[#F5F1E8]">
          {title}
        </h2>

        <p className="mt-5 text-sm leading-7 text-[#666666]">
          {description}
        </p>

        {sections.length > 0 && (
          <div className="mt-10 space-y-8">
            {sections.map(
              (section) => (
                <article
                  key={section.title}
                >
                  <h3 className="text-lg font-light text-[#F5F1E8]">
                    {section.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#666666]">
                    {section.content}
                  </p>
                </article>
              )
            )}
          </div>
        )}

        {faqs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-light text-[#F5F1E8]">
              Frequently Asked Questions
            </h2>

            <div className="mt-6 space-y-3">
              {faqs.map(
                (faq) => (
                  <details
                    key={
                      faq.question
                    }
                    className="group rounded-xl border border-[#24201B] bg-[#0D0F11]"
                  >
                    <summary className="cursor-pointer list-none px-5 py-4 text-sm text-[#D8D4CC]">
                      <div className="flex items-center justify-between gap-4">
                        <span>
                          {faq.question}
                        </span>

                        <span className="text-[#D4A84F] transition group-open:rotate-45">
                          +
                        </span>
                      </div>
                    </summary>

                    <div className="border-t border-[#1D1D1D] px-5 py-4">
                      <p className="text-sm leading-7 text-[#666666]">
                        {faq.answer}
                      </p>
                    </div>
                  </details>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ToolInfoSection;