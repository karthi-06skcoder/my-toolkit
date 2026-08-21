import type { ReactNode } from "react";

type ToolLayoutProps = {
  children: ReactNode;
};

function ToolLayout({ children }: ToolLayoutProps) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#090A0C] px-6 py-16 text-[#F5F1E8] md:py-24">
      <div className="mx-auto max-w-6xl">
        {children}
      </div>
    </main>
  );
}

export default ToolLayout;