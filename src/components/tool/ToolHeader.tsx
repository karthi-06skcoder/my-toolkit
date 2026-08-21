import type { ReactNode } from "react";

type ToolHeaderProps = {
  category: string;
  number: string;
  title: ReactNode;
  description: string;
};

function ToolHeader({
  category,
  number,
  title,
  description,
}: ToolHeaderProps) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 text-xs uppercase tracking-[0.35em] text-[#D4A84F]">
        <span className="h-px w-10 bg-[#D4A84F]" />

        {category} · {number}
      </div>

      <h1 className="mt-7 text-5xl font-light tracking-[-0.04em] md:text-7xl">
        {title}
      </h1>

      <p className="mt-6 max-w-2xl text-sm leading-7 text-[#777777] md:text-base">
        {description}
      </p>
    </div>
  );
}

export default ToolHeader;