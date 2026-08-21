import type { ReactNode } from "react";

type ToolPanelProps = {
  label: string;
  title: string;
  code?: string;
  children: ReactNode;
};

function ToolPanel({
  label,
  title,
  code,
  children,
}: ToolPanelProps) {
  return (
    <section className="rounded-3xl border border-[#25221C] bg-[#0D0F11] p-6 md:p-8">
      <div className="flex items-center justify-between border-b border-[#202020] pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#555555]">
            {label}
          </p>

          <h2 className="mt-2 text-xl font-light">
            {title}
          </h2>
        </div>

        {code && (
          <span className="font-mono text-xs text-[#444444]">
            {code}
          </span>
        )}
      </div>

      <div className="mt-8">
        {children}
      </div>
    </section>
  );
}

export default ToolPanel;