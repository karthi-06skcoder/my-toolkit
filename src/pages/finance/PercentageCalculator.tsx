import { useMemo, useState } from "react";

import ToolLayout from "../../components/tool/ToolLayout";
import ToolHeader from "../../components/tool/ToolHeader";
import ToolPanel from "../../components/tool/ToolPanel";
import ResultPanel from "../../components/tool/ResultPanel";

type Mode =
  | "percentage-of"
  | "percentage-value"
  | "increase"
  | "decrease";

function PercentageCalculator() {
  const [mode, setMode] =
    useState<Mode>("percentage-of");

  const [firstValue, setFirstValue] =
    useState("18");

  const [secondValue, setSecondValue] =
    useState("10000");

  const result = useMemo(() => {
    const first = Number(firstValue);
    const second = Number(secondValue);

    if (
      !Number.isFinite(first) ||
      !Number.isFinite(second)
    ) {
      return null;
    }

    if (mode === "percentage-of") {
      if (second === 0) return null;

      return {
        value: (first / 100) * second,
        suffix: "",
      };
    }

    if (mode === "percentage-value") {
      if (second === 0) return null;

      return {
        value: (first / second) * 100,
        suffix: "%",
      };
    }

    if (mode === "increase") {
      if (second === 0) return null;

      return {
        value: ((second - first) / first) * 100,
        suffix: "%",
      };
    }

    if (mode === "decrease") {
      if (first === 0) return null;

      return {
        value: ((first - second) / first) * 100,
        suffix: "%",
      };
    }

    return null;
  }, [firstValue, secondValue, mode]);

  const getLabels = () => {
    switch (mode) {
      case "percentage-of":
        return {
          first: "Percentage",
          firstPlaceholder: "18",
          firstSuffix: "%",
          second: "Amount",
          secondPlaceholder: "10000",
          secondSuffix: "₹",
        };

      case "percentage-value":
        return {
          first: "Value",
          firstPlaceholder: "20000",
          firstSuffix: "₹",
          second: "Total",
          secondPlaceholder: "50000",
          secondSuffix: "₹",
        };

      case "increase":
        return {
          first: "Original Value",
          firstPlaceholder: "10000",
          firstSuffix: "₹",
          second: "New Value",
          secondPlaceholder: "12000",
          secondSuffix: "₹",
        };

      case "decrease":
        return {
          first: "Original Value",
          firstPlaceholder: "10000",
          firstSuffix: "₹",
          second: "New Value",
          secondPlaceholder: "8000",
          secondSuffix: "₹",
        };
    }
  };

  const labels = getLabels();

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
    }).format(value);
  };

  const resetCalculator = () => {
    setMode("percentage-of");
    setFirstValue("18");
    setSecondValue("10000");
  };

  const modes = [
    {
      id: "percentage-of" as Mode,
      title: "X% of Y",
      description: "Find a percentage of a number.",
    },
    {
      id: "percentage-value" as Mode,
      title: "X is what % of Y?",
      description: "Find what percentage one value is of another.",
    },
    {
      id: "increase" as Mode,
      title: "Percentage Increase",
      description: "Calculate the percentage increase.",
    },
    {
      id: "decrease" as Mode,
      title: "Percentage Decrease",
      description: "Calculate the percentage decrease.",
    },
  ];

  return (
    <ToolLayout>
      <ToolHeader
        category="Finance"
        number="005"
        title={
          <>
            Percentage
            <span className="font-serif italic text-[#D4A84F]">
              {" "}
              Calculator.
            </span>
          </>
        }
        description="Calculate percentages, increases and decreases quickly with four simple calculation modes."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* INPUT */}
        <ToolPanel
          label="Calculator"
          title="Choose a calculation"
          code="PCT / 005"
        >
          {/* Modes */}
          <div className="grid gap-2">
            {modes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={`rounded-xl border p-4 text-left transition ${
                  mode === item.id
                    ? "border-[#D4A84F] bg-[#D4A84F]/10"
                    : "border-[#29251D] bg-[#101214] hover:border-[#555555]"
                }`}
              >
                <span
                  className={`block text-sm ${
                    mode === item.id
                      ? "text-[#D4A84F]"
                      : "text-[#F5F1E8]"
                  }`}
                >
                  {item.title}
                </span>

                <span className="mt-1 block text-xs text-[#555555]">
                  {item.description}
                </span>
              </button>
            ))}
          </div>

          {/* First value */}
          <div className="mt-8">
            <label className="text-sm text-[#A0A0A0]">
              {labels.first}
            </label>

            <div className="mt-3 flex items-center rounded-xl border border-[#29251D] bg-[#101214] transition focus-within:border-[#D4A84F]/70">
              {labels.firstSuffix === "₹" && (
                <span className="pl-4 text-[#D4A84F]">
                  ₹
                </span>
              )}

              <input
                type="number"
                value={firstValue}
                onChange={(e) =>
                  setFirstValue(e.target.value)
                }
                placeholder={labels.firstPlaceholder}
                className="w-full bg-transparent px-3 py-4 text-lg outline-none placeholder:text-[#444444]"
              />

              {labels.firstSuffix === "%" && (
                <span className="pr-4 text-[#777777]">
                  %
                </span>
              )}
            </div>
          </div>

          {/* Second value */}
          <div className="mt-7">
            <label className="text-sm text-[#A0A0A0]">
              {labels.second}
            </label>

            <div className="mt-3 flex items-center rounded-xl border border-[#29251D] bg-[#101214] transition focus-within:border-[#D4A84F]/70">
              {labels.secondSuffix === "₹" && (
                <span className="pl-4 text-[#D4A84F]">
                  ₹
                </span>
              )}

              <input
                type="number"
                value={secondValue}
                onChange={(e) =>
                  setSecondValue(e.target.value)
                }
                placeholder={labels.secondPlaceholder}
                className="w-full bg-transparent px-3 py-4 text-lg outline-none placeholder:text-[#444444]"
              />
            </div>
          </div>

          {/* Reset */}
          <button
            type="button"
            onClick={resetCalculator}
            className="mt-8 w-full rounded-xl border border-[#29251D] py-3 text-sm text-[#777777] transition hover:border-[#D4A84F] hover:text-[#D4A84F]"
          >
            Reset Calculator
          </button>
        </ToolPanel>

        {/* RESULT */}
        <ResultPanel
          title="Calculation result"
          badge="Percentage"
        >
          {!result ? (
            <div className="flex min-h-[430px] items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#302719] text-xl text-[#8B6B32]">
                  %
                </div>

                <p className="mt-5 text-sm text-[#777777]">
                  Enter values to calculate your
                  percentage.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Main result */}
              <div className="rounded-2xl border border-[#D4A84F]/20 bg-[#D4A84F]/5 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8B6B32]">
                  Result
                </p>

                <p className="mt-3 text-4xl font-light text-[#F5F1E8] md:text-5xl">
                  {formatNumber(result.value)}
                  {result.suffix}
                </p>
              </div>

              {/* Explanation */}
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                  Calculation
                </p>

                <div className="mt-4 rounded-xl border border-[#24201B] bg-[#0D0F11] p-5">
                  <p className="font-mono text-sm leading-7 text-[#777777]">
                    {mode === "percentage-of" && (
                      <>
                        {firstValue}% × ₹
                        {formatNumber(
                          Number(secondValue)
                        )}
                        <br />
                        = ₹
                        {formatNumber(result.value)}
                      </>
                    )}

                    {mode === "percentage-value" && (
                      <>
                        ₹
                        {formatNumber(
                          Number(firstValue)
                        )}{" "}
                        ÷ ₹
                        {formatNumber(
                          Number(secondValue)
                        )}{" "}
                        × 100
                        <br />
                        = {formatNumber(result.value)}%
                      </>
                    )}

                    {mode === "increase" && (
                      <>
                        (
                        {formatNumber(
                          Number(secondValue)
                        )}{" "}
                        −{" "}
                        {formatNumber(
                          Number(firstValue)
                        )}
                        ) ÷{" "}
                        {formatNumber(
                          Number(firstValue)
                        )}{" "}
                        × 100
                        <br />
                        = {formatNumber(result.value)}%
                      </>
                    )}

                    {mode === "decrease" && (
                      <>
                        (
                        {formatNumber(
                          Number(firstValue)
                        )}{" "}
                        −{" "}
                        {formatNumber(
                          Number(secondValue)
                        )}
                        ) ÷{" "}
                        {formatNumber(
                          Number(firstValue)
                        )}{" "}
                        × 100
                        <br />
                        = {formatNumber(result.value)}%
                      </>
                    )}
                  </p>
                </div>
              </div>
            </>
          )}
        </ResultPanel>
      </div>

      {/* Information */}
      <section className="mt-16 max-w-3xl border-t border-[#1D1D1D] pt-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4A84F]">
          About percentage calculation
        </p>

        <p className="mt-5 text-sm leading-7 text-[#666666]">
          Percentages express a value as a proportion of
          100. This calculator provides several common
          percentage calculations that are useful for
          finance, shopping, business and everyday tasks.
        </p>
      </section>
    </ToolLayout>
  );
}

export default PercentageCalculator;