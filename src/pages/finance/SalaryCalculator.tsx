import { useMemo, useState } from "react";

import ToolLayout from "../../components/tool/ToolLayout";
import ToolHeader from "../../components/tool/ToolHeader";
import ToolPanel from "../../components/tool/ToolPanel";
import ResultPanel from "../../components/tool/ResultPanel";

function SalaryCalculator() {
  const [grossSalary, setGrossSalary] = useState("50000");
  const [basicPercentage, setBasicPercentage] = useState("40");
  const [hraPercentage, setHraPercentage] = useState("40");
  const [pfPercentage, setPfPercentage] = useState("12");
  const [professionalTax, setProfessionalTax] = useState("200");
  const [otherDeductions, setOtherDeductions] = useState("0");

  const result = useMemo(() => {
    const gross = Number(grossSalary);
    const basicPercent = Number(basicPercentage);
    const hraPercent = Number(hraPercentage);
    const pfPercent = Number(pfPercentage);
    const pt = Number(professionalTax) || 0;
    const other = Number(otherDeductions) || 0;

    if (
      !gross ||
      gross <= 0 ||
      basicPercent < 0 ||
      hraPercent < 0 ||
      pfPercent < 0
    ) {
      return null;
    }

    const basic = gross * (basicPercent / 100);
    const hra = basic * (hraPercent / 100);

    const allowances = Math.max(
      gross - basic - hra,
      0
    );

    const employeePF = basic * (pfPercent / 100);

    const totalDeductions =
      employeePF + pt + other;

    const netSalary =
      gross - totalDeductions;

    return {
      gross,
      basic,
      hra,
      allowances,
      employeePF,
      professionalTax: pt,
      otherDeductions: other,
      totalDeductions,
      netSalary,
      annualGross: gross * 12,
      annualNet: netSalary * 12,
    };
  }, [
    grossSalary,
    basicPercentage,
    hraPercentage,
    pfPercentage,
    professionalTax,
    otherDeductions,
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const resetCalculator = () => {
    setGrossSalary("");
    setBasicPercentage("40");
    setHraPercentage("40");
    setPfPercentage("12");
    setProfessionalTax("200");
    setOtherDeductions("0");
  };

  return (
    <ToolLayout>
      <ToolHeader
        category="Finance"
        number="003"
        title={
          <>
            Salary
            <span className="font-serif italic text-[#D4A84F]">
              {" "}
              Calculator.
            </span>
          </>
        }
        description="Break down your salary into basic pay, HRA, allowances and deductions to understand your estimated monthly in-hand salary."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* INPUT */}
        <ToolPanel
          label="Calculator"
          title="Salary details"
          code="SAL / 003"
        >
          {/* Gross Salary */}
          <div>
            <label className="text-sm text-[#A0A0A0]">
              Monthly Gross Salary
            </label>

            <div className="mt-3 flex items-center rounded-xl border border-[#29251D] bg-[#101214] transition focus-within:border-[#D4A84F]/70">
              <span className="pl-4 text-[#D4A84F]">
                ₹
              </span>

              <input
                type="number"
                min="0"
                value={grossSalary}
                onChange={(e) =>
                  setGrossSalary(e.target.value)
                }
                placeholder="50000"
                className="w-full bg-transparent px-3 py-4 text-lg outline-none placeholder:text-[#444444]"
              />
            </div>
          </div>

          {/* Basic */}
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#A0A0A0]">
                Basic Salary
              </label>

              <span className="font-mono text-xs text-[#D4A84F]">
                {basicPercentage || 0}%
              </span>
            </div>

            <input
              type="number"
              min="0"
              max="100"
              value={basicPercentage}
              onChange={(e) =>
                setBasicPercentage(e.target.value)
              }
              className="mt-3 w-full rounded-xl border border-[#29251D] bg-[#101214] px-4 py-4 text-lg outline-none transition focus:border-[#D4A84F]/70"
            />

            <input
              type="range"
              min="0"
              max="100"
              value={Number(basicPercentage) || 0}
              onChange={(e) =>
                setBasicPercentage(e.target.value)
              }
              className="mt-4 w-full accent-[#D4A84F]"
            />
          </div>

          {/* HRA */}
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#A0A0A0]">
                HRA
              </label>

              <span className="font-mono text-xs text-[#D4A84F]">
                {hraPercentage || 0}%
              </span>
            </div>

            <input
              type="number"
              min="0"
              max="100"
              value={hraPercentage}
              onChange={(e) =>
                setHraPercentage(e.target.value)
              }
              className="mt-3 w-full rounded-xl border border-[#29251D] bg-[#101214] px-4 py-4 text-lg outline-none transition focus:border-[#D4A84F]/70"
            />

            <input
              type="range"
              min="0"
              max="100"
              value={Number(hraPercentage) || 0}
              onChange={(e) =>
                setHraPercentage(e.target.value)
              }
              className="mt-4 w-full accent-[#D4A84F]"
            />

            <p className="mt-2 text-xs text-[#4F4F4F]">
              HRA is calculated as a percentage of
              Basic Salary.
            </p>
          </div>

          {/* PF */}
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#A0A0A0]">
                Employee PF
              </label>

              <span className="font-mono text-xs text-[#D4A84F]">
                {pfPercentage || 0}%
              </span>
            </div>

            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={pfPercentage}
              onChange={(e) =>
                setPfPercentage(e.target.value)
              }
              className="mt-3 w-full rounded-xl border border-[#29251D] bg-[#101214] px-4 py-4 text-lg outline-none transition focus:border-[#D4A84F]/70"
            />

            <p className="mt-2 text-xs text-[#4F4F4F]">
              Calculated on Basic Salary for this
              calculator.
            </p>
          </div>

          {/* Professional Tax */}
          <div className="mt-7">
            <label className="text-sm text-[#A0A0A0]">
              Professional Tax
            </label>

            <div className="mt-3 flex items-center rounded-xl border border-[#29251D] bg-[#101214] transition focus-within:border-[#D4A84F]/70">
              <span className="pl-4 text-[#D4A84F]">
                ₹
              </span>

              <input
                type="number"
                min="0"
                value={professionalTax}
                onChange={(e) =>
                  setProfessionalTax(e.target.value)
                }
                className="w-full bg-transparent px-3 py-4 text-lg outline-none"
              />
            </div>
          </div>

          {/* Other deductions */}
          <div className="mt-7">
            <label className="text-sm text-[#A0A0A0]">
              Other Deductions
            </label>

            <div className="mt-3 flex items-center rounded-xl border border-[#29251D] bg-[#101214] transition focus-within:border-[#D4A84F]/70">
              <span className="pl-4 text-[#D4A84F]">
                ₹
              </span>

              <input
                type="number"
                min="0"
                value={otherDeductions}
                onChange={(e) =>
                  setOtherDeductions(e.target.value)
                }
                placeholder="0"
                className="w-full bg-transparent px-3 py-4 text-lg outline-none"
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
          title="Salary breakdown"
          badge="Monthly"
        >
          {!result ? (
            <div className="flex min-h-[550px] items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#302719] text-xl text-[#8B6B32]">
                  ₹
                </div>

                <p className="mt-5 text-sm text-[#777777]">
                  Enter your salary details to see your
                  estimated in-hand salary.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Net salary */}
              <div className="rounded-2xl border border-[#D4A84F]/20 bg-[#D4A84F]/5 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8B6B32]">
                  Estimated In-hand Salary
                </p>

                <p className="mt-3 text-4xl font-light text-[#F5F1E8] md:text-5xl">
                  {formatCurrency(result.netSalary)}
                </p>

                <p className="mt-3 text-xs text-[#666666]">
                  Approximate monthly take-home before
                  income-tax/TDS adjustments.
                </p>
              </div>

              {/* Earnings */}
              <div className="mt-7">
                <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                  Earnings
                </p>

                <div className="mt-3 space-y-1">
                  <div className="flex justify-between border-b border-[#24201B] py-4">
                    <span className="text-sm text-[#777777]">
                      Basic Salary
                    </span>

                    <span className="text-sm text-[#F5F1E8]">
                      {formatCurrency(result.basic)}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-[#24201B] py-4">
                    <span className="text-sm text-[#777777]">
                      HRA
                    </span>

                    <span className="text-sm text-[#F5F1E8]">
                      {formatCurrency(result.hra)}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-[#24201B] py-4">
                    <span className="text-sm text-[#777777]">
                      Other Allowances
                    </span>

                    <span className="text-sm text-[#F5F1E8]">
                      {formatCurrency(result.allowances)}
                    </span>
                  </div>

                  <div className="flex justify-between py-4">
                    <span className="text-sm text-[#777777]">
                      Gross Salary
                    </span>

                    <span className="text-sm font-medium text-[#D4A84F]">
                      {formatCurrency(result.gross)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                  Deductions
                </p>

                <div className="mt-3 space-y-1">
                  <div className="flex justify-between border-b border-[#24201B] py-4">
                    <span className="text-sm text-[#777777]">
                      Employee PF
                    </span>

                    <span className="text-sm text-[#F5F1E8]">
                      - {formatCurrency(result.employeePF)}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-[#24201B] py-4">
                    <span className="text-sm text-[#777777]">
                      Professional Tax
                    </span>

                    <span className="text-sm text-[#F5F1E8]">
                      - {formatCurrency(result.professionalTax)}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-[#24201B] py-4">
                    <span className="text-sm text-[#777777]">
                      Other Deductions
                    </span>

                    <span className="text-sm text-[#F5F1E8]">
                      - {formatCurrency(result.otherDeductions)}
                    </span>
                  </div>

                  <div className="flex justify-between py-4">
                    <span className="text-sm text-[#777777]">
                      Total Deductions
                    </span>

                    <span className="text-sm text-[#D4A84F]">
                      {formatCurrency(
                        result.totalDeductions
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Annual */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#24201B] bg-[#0D0F11] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#555555]">
                    Annual Gross
                  </p>

                  <p className="mt-2 text-lg text-[#F5F1E8]">
                    {formatCurrency(result.annualGross)}
                  </p>
                </div>

                <div className="rounded-xl border border-[#24201B] bg-[#0D0F11] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#555555]">
                    Annual In-hand
                  </p>

                  <p className="mt-2 text-lg text-[#D4A84F]">
                    {formatCurrency(result.annualNet)}
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
          About this calculation
        </p>

        <p className="mt-5 text-sm leading-7 text-[#666666]">
          This calculator provides an estimated salary
          breakdown based on the values entered. Actual
          take-home salary can vary depending on company
          salary structure, statutory contributions, tax
          deductions and other applicable components.
        </p>
      </section>
    </ToolLayout>
  );
}

export default SalaryCalculator;