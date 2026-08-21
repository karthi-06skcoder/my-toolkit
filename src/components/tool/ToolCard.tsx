import { useNavigate } from "react-router-dom";

import type { Tool } from "../../data/tools";

type ToolCardProps = {
  tool: Tool;
};

function ToolCard({
  tool,
}: ToolCardProps) {
  const navigate =
    useNavigate();

  return (
    <button
      type="button"
      onClick={() =>
        navigate(tool.path)
      }
      className="group relative w-full overflow-hidden rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-[#D4A84F]/50 hover:bg-[#101214]"
    >
      {/* Gold glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#D4A84F]/5 blur-2xl transition group-hover:bg-[#D4A84F]/10" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#302719] bg-[#101214] font-mono text-xs text-[#D4A84F] transition group-hover:border-[#D4A84F]/50">
            {tool.icon}
          </div>

          {tool.popular && (
            <span className="rounded-full border border-[#D4A84F]/20 bg-[#D4A84F]/5 px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] text-[#8B6B32]">
              Popular
            </span>
          )}
        </div>

        <h3 className="mt-6 text-lg font-light text-[#F5F1E8] transition group-hover:text-[#D4A84F]">
          {tool.name}
        </h3>

        <p className="mt-3 min-h-[48px] text-sm leading-6 text-[#666666]">
          {tool.description}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-[#1D1D1D] pt-4">
          <span className="text-[10px] uppercase tracking-[0.15em] text-[#444444]">
            {tool.category}
          </span>

          <span className="text-sm text-[#555555] transition group-hover:translate-x-1 group-hover:text-[#D4A84F]">
            →
          </span>
        </div>
      </div>
    </button>
  );
}

export default ToolCard;