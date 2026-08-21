import {
  useMemo,
  useState,
} from "react";

import {
  categories,
  tools,
} from "../data/tools";

import ToolCard from "../components/tool/ToolCard";
import SEO from "../components/common/SEO";
import AdSlot from "../components/ads/AdSlot";

function Home() {
  const [search, setSearch] =
    useState("");

  const [activeCategory, setActiveCategory] =
    useState<
      "All" | (typeof categories)[number]
    >("All");

  const filteredTools =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      return tools.filter(
        (tool) => {
          const matchesCategory =
            activeCategory ===
              "All" ||
            tool.category ===
              activeCategory;

          const matchesSearch =
            !searchValue ||
            tool.name
              .toLowerCase()
              .includes(searchValue) ||
            tool.description
              .toLowerCase()
              .includes(searchValue) ||
            tool.category
              .toLowerCase()
              .includes(searchValue);

          return (
            matchesCategory &&
            matchesSearch
          );
        }
      );
    }, [
      search,
      activeCategory,
    ]);

  const popularTools =
    tools.filter(
      (tool) => tool.popular
    );

  return (
    <>
      <SEO
        title="Free Online Tools"
        description="My Toolkit provides free online calculators, PDF tools, image converters and developer utilities. Fast, simple and easy to use."
      />
      <main className="min-h-screen bg-[#090A0C] text-[#F5F1E8]">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-[#1D1D1D]">
          {/* Background glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#D4A84F]/5 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 lg:px-8 lg:pb-28 lg:pt-32">
            <div className="mx-auto max-w-4xl text-center">
              {/* Eyebrow */}
              <div className="mb-7 flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-[#D4A84F]/50" />

                <span className="text-[10px] uppercase tracking-[0.35em] text-[#8B6B32]">
                  Simple tools. Zero friction.
                </span>

                <span className="h-px w-8 bg-[#D4A84F]/50" />
              </div>

              {/* Heading */}
              <h1 className="text-4xl font-light tracking-tight sm:text-6xl lg:text-8xl">
                Your everyday
                <br />

                <span className="font-serif italic text-[#D4A84F]">
                  tools.
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[#666666] sm:text-lg">
                Calculators, converters, PDF tools,
                image utilities and developer tools —
                everything you need in one place.
              </p>

              {/* Search */}
              <div className="mx-auto mt-10 max-w-2xl">
                <div className="group flex items-center rounded-2xl border border-[#29251D] bg-[#101214] px-5 transition focus-within:border-[#D4A84F]/60">
                  <span className="mr-4 text-lg text-[#555555]">
                    ⌕
                  </span>

                  <input
                    type="text"
                    id="tool-search"
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search tools..."
                    className="w-full bg-transparent py-5 text-sm text-[#F5F1E8] outline-none placeholder:text-[#444444]"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() =>
                        setSearch("")
                      }
                      className="text-xs text-[#555555] hover:text-[#D4A84F]"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#333333]">
                  {tools.length} tools available
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR */}
        {!search &&
          activeCategory ===
            "All" && (
            <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4A84F]">
                    Start here
                  </p>

                  <h2 className="mt-3 text-3xl font-light">
                    Popular tools
                  </h2>
                </div>

                <span className="hidden text-xs text-[#444444] sm:block">
                  Frequently used
                </span>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {popularTools.map(
                  (tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                    />
                  )
                )}
              </div>
            </section>
          )}
        <AdSlot
          className="mx-auto max-w-5xl"
        />
        {/* ALL TOOLS */}
        <section id="all-tools" className="border-t border-[#1D1D1D]">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            {/* Header */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4A84F]">
                  Explore
                </p>

                <h2 className="mt-3 text-3xl font-light">
                  All tools
                </h2>
              </div>

              {/* Category filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveCategory(
                      "All"
                    )
                  }
                  className={`rounded-full border px-4 py-2 text-xs transition ${
                    activeCategory ===
                    "All"
                      ? "border-[#D4A84F] bg-[#D4A84F]/10 text-[#D4A84F]"
                      : "border-[#29251D] text-[#666666] hover:border-[#555555] hover:text-[#D4A84F]"
                  }`}
                >
                  All
                </button>

                {categories.map(
                  (category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() =>
                        setActiveCategory(
                          category
                        )
                      }
                      className={`rounded-full border px-4 py-2 text-xs transition ${
                        activeCategory ===
                        category
                          ? "border-[#D4A84F] bg-[#D4A84F]/10 text-[#D4A84F]"
                          : "border-[#29251D] text-[#666666] hover:border-[#555555] hover:text-[#D4A84F]"
                      }`}
                    >
                      {category}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Search result info */}
            {(search ||
              activeCategory !==
                "All") && (
              <div className="mt-8 flex items-center justify-between border-b border-[#1D1D1D] pb-5">
                <p className="text-sm text-[#666666]">
                  {filteredTools.length}{" "}
                  {filteredTools.length ===
                  1
                    ? "tool"
                    : "tools"}{" "}
                  found
                </p>

                {search && (
                  <p className="text-xs text-[#444444]">
                    Search: "
                    <span className="text-[#D4A84F]">
                      {search}
                    </span>
                    "
                  </p>
                )}
              </div>
            )}

            {/* Tools */}
            {filteredTools.length >
            0 ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTools.map(
                  (tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                    />
                  )
                )}
              </div>
            ) : (
              <div className="flex min-h-[350px] items-center justify-center text-center">
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#302719] text-[#8B6B32]">
                    ?
                  </div>

                  <h3 className="mt-5 text-lg font-light">
                    No tools found
                  </h3>

                  <p className="mt-2 text-sm text-[#555555]">
                    Try a different search or category.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setActiveCategory(
                        "All"
                      );
                    }}
                    className="mt-6 text-xs text-[#D4A84F] hover:underline"
                  >
                    Reset filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* TRUST / PRIVACY */}
        <section id="about" className="border-t border-[#1D1D1D]">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-7">
                <div className="text-xl text-[#D4A84F]">
                  ⚡
                </div>

                <h3 className="mt-5 text-lg font-light">
                  Fast
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#666666]">
                  Lightweight tools designed to get your
                  work done without unnecessary steps.
                </p>
              </div>

              <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-7">
                <div className="text-xl text-[#D4A84F]">
                  🔒
                </div>

                <h3 className="mt-5 text-lg font-light">
                  Private
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#666666]">
                  Many tools process your data directly in
                  your browser instead of uploading it.
                </p>
              </div>

              <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-7">
                <div className="text-xl text-[#D4A84F]">
                  ◈
                </div>

                <h3 className="mt-5 text-lg font-light">
                  Free
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#666666]">
                  Useful everyday utilities without creating
                  an account or complicated setup.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
    
  );
}

export default Home;