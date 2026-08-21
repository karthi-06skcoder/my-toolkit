type AdSlotProps = {
  label?: string;
  className?: string;
};

function AdSlot({
  label = "Advertisement",
  className = "",
}: AdSlotProps) {
  return (
    <div
      className={`w-full ${className}`}
    >
      <div className="flex min-h-[90px] items-center justify-center rounded-xl border border-[#1A1917] bg-[#0B0D0F]">
        <div className="text-center">
          <p className="text-[9px] uppercase tracking-[0.25em] text-[#333333]">
            {label}
          </p>

          <p className="mt-2 text-[9px] text-[#292929]">
            Advertisement
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdSlot;