import type { ReactNode } from "react";

type ResultPanelProps = {
  label?: string;
  title: string;
  badge?: string;
  children: ReactNode;
};

function ResultPanel({
  label = "Result",
  title,
  badge,
  children,
}: ResultPanelProps) {
  return (
    <section className="rounded-3xl border border-[#302719] bg-[#11100D] p-6 md:p-8">
      <div className="flex items-center justify-between border-b border-[#29241B] pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#8B6B32]">
            {label}
          </p>

          <h2 className="mt-2 text-xl font-light">
            {title}
          </h2>
        </div>

        {badge && (
          <span className="text-xs text-[#555555]">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-8">
        {children}
      </div>
    </section>
  );
}

export default ResultPanel;