import type { Tool } from "../../data/tools";
import { Link } from "react-router-dom";

type ToolCardProps = {
  tool: Tool;
  index: number;
};

function ToolCard({ tool, index }: ToolCardProps) {
  return (
    <Link
      to={tool.path}
      className="group relative block min-h-[220px] overflow-hidden rounded-2xl border border-[#24201A] bg-[#0D0F11] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4A84F]/60 hover:bg-[#111315]"
    >
      {/* Number */}
      <div className="flex items-start justify-between">
        <span className="font-mono text-xs tracking-[0.2em] text-[#555555]">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="text-xl text-[#444444] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#D4A84F]">
          ↗
        </span>
      </div>

      {/* Content */}
      <div className="mt-14">
        <h4 className="text-xl font-light tracking-tight text-[#F5F1E8]">
          {tool.name}
        </h4>

        <p className="mt-3 max-w-[260px] text-sm leading-6 text-[#707070]">
          {tool.description}
        </p>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 h-px w-0 bg-[#D4A84F] transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}

export default ToolCard;