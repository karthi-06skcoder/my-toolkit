import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { categories, tools } from "../../data/tools";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [toolsOpen, setToolsOpen] =
    useState(false);

  const goTo = (path: string) => {
    navigate(path);
    setMenuOpen(false);
    setToolsOpen(false);
  };

  const isHome =
    location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-[#1D1D1D] bg-[#090A0C]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* LOGO */}
          <button
            type="button"
            onClick={() => goTo("/")}
            className="group flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#3A3020] bg-[#101214] transition group-hover:border-[#D4A84F]">
              <span className="font-serif text-sm italic text-[#D4A84F]">
                M
              </span>
            </div>

            <div className="text-left">
              <p className="text-sm font-medium tracking-[0.18em] text-[#F5F1E8]">
                MY TOOLKIT
              </p>

              <p className="text-[8px] uppercase tracking-[0.3em] text-[#555555]">
                Simple. Useful. Free.
              </p>
            </div>
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-8 md:flex">
            <button
              type="button"
              onClick={() => goTo("/")}
              className={`text-xs transition ${
                isHome
                  ? "text-[#D4A84F]"
                  : "text-[#666666] hover:text-[#D4A84F]"
              }`}
            >
              Home
            </button>

            {/* TOOLS DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setToolsOpen(
                    !toolsOpen
                  )
                }
                className="flex items-center gap-2 text-xs text-[#666666] transition hover:text-[#D4A84F]"
              >
                Tools

                <span
                  className={`text-[10px] transition ${
                    toolsOpen
                      ? "rotate-180"
                      : ""
                  }`}
                >
                  ↓
                </span>
              </button>

              {toolsOpen && (
                <div className="absolute right-0 top-10 w-[560px] overflow-hidden rounded-2xl border border-[#29251D] bg-[#0D0F11] shadow-2xl shadow-black/50">
                  <div className="grid grid-cols-2 gap-6 p-6">
                    {categories.map(
                      (category) => {
                        const categoryTools =
                          tools.filter(
                            (tool) =>
                              tool.category ===
                              category
                          );

                        return (
                          <div
                            key={category}
                          >
                            <p className="mb-3 text-[9px] uppercase tracking-[0.25em] text-[#D4A84F]">
                              {category}
                            </p>

                            <div className="space-y-1">
                              {categoryTools
                                .slice(0, 5)
                                .map(
                                  (tool) => (
                                    <button
                                      key={
                                        tool.id
                                      }
                                      type="button"
                                      onClick={() =>
                                        goTo(
                                          tool.path
                                        )
                                      }
                                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs text-[#666666] transition hover:bg-[#151719] hover:text-[#F5F1E8]"
                                    >
                                      <span>
                                        {
                                          tool.name
                                        }
                                      </span>

                                      <span className="text-[#444444]">
                                        →
                                      </span>
                                    </button>
                                  )
                                )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>

                  <div className="border-t border-[#1D1D1D] px-6 py-4">
                    <button
                      type="button"
                      onClick={() => {
                        goTo("/");
                        window.setTimeout(
                          () => {
                            document
                              .getElementById(
                                "all-tools"
                              )
                              ?.scrollIntoView({
                                behavior:
                                  "smooth",
                              });
                          },
                          100
                        );
                      }}
                      className="text-xs text-[#D4A84F] hover:underline"
                    >
                      View all tools →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                goTo("/");
                window.setTimeout(
                  () => {
                    document
                      .getElementById(
                        "about"
                      )
                      ?.scrollIntoView({
                        behavior:
                          "smooth",
                      });
                  },
                  100
                );
              }}
              className="text-xs text-[#666666] transition hover:text-[#D4A84F]"
            >
              About
            </button>
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* SEARCH */}
            <button
              type="button"
              onClick={() => {
                goTo("/");

                window.setTimeout(
                  () => {
                    document
                      .getElementById(
                        "tool-search"
                      )
                      ?.focus();
                  },
                  100
                );
              }}
              className="hidden h-10 w-10 items-center justify-center rounded-lg border border-[#29251D] text-sm text-[#555555] transition hover:border-[#D4A84F] hover:text-[#D4A84F] sm:flex"
              title="Search tools"
            >
              ⌕
            </button>

            {/* MOBILE MENU */}
            <button
              type="button"
              onClick={() =>
                setMenuOpen(
                  !menuOpen
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#29251D] text-[#666666] transition hover:border-[#D4A84F] hover:text-[#D4A84F] md:hidden"
              aria-label="Toggle menu"
            >
              <span className="text-lg">
                {menuOpen ? "×" : "☰"}
              </span>
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="border-t border-[#1D1D1D] py-5 md:hidden">
            <div className="space-y-2">
              <button
                type="button"
                onClick={() =>
                  goTo("/")
                }
                className="w-full rounded-xl px-4 py-3 text-left text-sm text-[#F5F1E8] hover:bg-[#101214]"
              >
                Home
              </button>

              <div>
                <button
                  type="button"
                  onClick={() =>
                    setToolsOpen(
                      !toolsOpen
                    )
                  }
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm text-[#F5F1E8] hover:bg-[#101214]"
                >
                  Tools

                  <span>
                    {toolsOpen
                      ? "−"
                      : "+"}
                  </span>
                </button>

                {toolsOpen && (
                  <div className="mt-2 space-y-5 rounded-xl border border-[#24201B] bg-[#0D0F11] p-4">
                    {categories.map(
                      (category) => (
                        <div
                          key={
                            category
                          }
                        >
                          <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-[#D4A84F]">
                            {category}
                          </p>

                          <div className="space-y-1">
                            {tools
                              .filter(
                                (
                                  tool
                                ) =>
                                  tool.category ===
                                  category
                              )
                              .map(
                                (
                                  tool
                                ) => (
                                  <button
                                    key={
                                      tool.id
                                    }
                                    type="button"
                                    onClick={() =>
                                      goTo(
                                        tool.path
                                      )
                                    }
                                    className="w-full rounded-lg px-3 py-2 text-left text-xs text-[#666666] hover:bg-[#151719] hover:text-[#F5F1E8]"
                                  >
                                    {
                                      tool.name
                                    }
                                  </button>
                                )
                              )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  goTo("/")
                }
                className="w-full rounded-xl px-4 py-3 text-left text-sm text-[#F5F1E8] hover:bg-[#101214]"
              >
                About
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;