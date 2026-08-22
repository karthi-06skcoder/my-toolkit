import { useMemo, useState } from "react";

import ToolLayout from "../../components/tool/ToolLayout";
import ToolHeader from "../../components/tool/ToolHeader";
import ToolPanel from "../../components/tool/ToolPanel";
import ResultPanel from "../../components/tool/ResultPanel";

import SEO from "../../components/common/SEO";

import { trackToolUsage } from "../../utils/analytics";

type EMIResult = {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  principalPercentage: number;
  interestPercentage: number;
};

function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState("500000");
  const [interestRate, setInterestRate] = useState("8.5");
  const [tenure, setTenure] = useState("5");

  const result = useMemo<EMIResult | null>(() => {
    const principal = Number(loanAmount);
    const annualRate = Number(interestRate);
    const years = Number(tenure);

    if (
      !principal ||
      principal <= 0 ||
      annualRate < 0 ||
      years <= 0
    ) {
      return null;
    }

    const months = years * 12;
    const monthlyRate = annualRate / 12 / 100;

    let monthlyEMI = 0;

    if (monthlyRate === 0) {
      monthlyEMI = principal / months;
    } else {
      monthlyEMI =
        (principal *
          monthlyRate *
          Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalPayment = monthlyEMI * months;
    const totalInterest = totalPayment - principal;

    trackToolUsage(
      "emi_calculator",
      "calculator"
    );

    return {
      monthlyEMI,
      totalInterest,
      totalPayment,
      principalPercentage:
        (principal / totalPayment) * 100,
      interestPercentage:
        (totalInterest / totalPayment) * 100,
    };
  }, [loanAmount, interestRate, tenure]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const resetCalculator = () => {
    setLoanAmount("");
    setInterestRate("");
    setTenure("");
  };

  return (
    <ToolLayout>
      <SEO
        title="EMI Calculator"
        description="Calculate monthly EMI, total interest and total loan repayment using our free online EMI calculator."
      />
      <ToolHeader
        category="Finance"
        number="002"
        title={
          <>
            EMI
            <span className="font-serif italic text-[#D4A84F]">
              {" "}
              Calculator.
            </span>
          </>
        }
        description="Calculate your monthly EMI, total interest and total repayment for any loan. Adjust the values and understand your repayment instantly."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* INPUT PANEL */}
        <ToolPanel
          label="Calculator"
          title="Loan details"
          code="EMI / 002"
        >
          {/* Loan Amount */}
          <div>
            <label className="text-sm text-[#A0A0A0]">
              Loan Amount
            </label>

            <div className="mt-3 flex items-center rounded-xl border border-[#29251D] bg-[#101214] transition focus-within:border-[#D4A84F]/70">
              <span className="pl-4 text-[#D4A84F]">
                ₹
              </span>

              <input
                type="number"
                min="0"
                value={loanAmount}
                onChange={(e) =>
                  setLoanAmount(e.target.value)
                }
                placeholder="Enter loan amount"
                className="w-full bg-transparent px-3 py-4 text-lg outline-none placeholder:text-[#444444]"
              />
            </div>
          </div>

          {/* Interest Rate */}
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#A0A0A0]">
                Interest Rate
              </label>

              <span className="font-mono text-xs text-[#D4A84F]">
                {interestRate || "0"}%
              </span>
            </div>

            <div className="mt-3 flex items-center rounded-xl border border-[#29251D] bg-[#101214] transition focus-within:border-[#D4A84F]/70">
              <input
                type="number"
                min="0"
                step="0.01"
                value={interestRate}
                onChange={(e) =>
                  setInterestRate(e.target.value)
                }
                placeholder="8.5"
                className="w-full bg-transparent px-4 py-4 text-lg outline-none placeholder:text-[#444444]"
              />

              <span className="pr-4 text-[#777777]">
                %
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="30"
              step="0.1"
              value={Number(interestRate) || 0}
              onChange={(e) =>
                setInterestRate(e.target.value)
              }
              className="mt-4 w-full accent-[#D4A84F]"
            />

            <div className="mt-2 flex justify-between text-[10px] text-[#444444]">
              <span>0%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Tenure */}
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#A0A0A0]">
                Loan Tenure
              </label>

              <span className="font-mono text-xs text-[#D4A84F]">
                {tenure || "0"} years
              </span>
            </div>

            <div className="mt-3 flex items-center rounded-xl border border-[#29251D] bg-[#101214] transition focus-within:border-[#D4A84F]/70">
              <input
                type="number"
                min="1"
                max="30"
                value={tenure}
                onChange={(e) =>
                  setTenure(e.target.value)
                }
                placeholder="5"
                className="w-full bg-transparent px-4 py-4 text-lg outline-none placeholder:text-[#444444]"
              />

              <span className="pr-4 text-[#777777]">
                Years
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="30"
              value={Number(tenure) || 1}
              onChange={(e) =>
                setTenure(e.target.value)
              }
              className="mt-4 w-full accent-[#D4A84F]"
            />

            <div className="mt-2 flex justify-between text-[10px] text-[#444444]">
              <span>1 year</span>
              <span>30 years</span>
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

        {/* RESULT PANEL */}
        <ResultPanel
          title="Repayment summary"
          badge={`${tenure || 0} years`}
        >
          {!result ? (
            <div className="flex min-h-[450px] items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#302719] text-xl text-[#8B6B32]">
                  ₹
                </div>

                <p className="mt-5 text-sm text-[#777777]">
                  Enter your loan details to calculate
                  your EMI.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* EMI */}
              <div className="rounded-2xl border border-[#D4A84F]/20 bg-[#D4A84F]/5 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8B6B32]">
                  Monthly EMI
                </p>

                <p className="mt-3 text-4xl font-light text-[#F5F1E8] md:text-5xl">
                  {formatCurrency(result.monthlyEMI)}
                </p>
              </div>

              {/* Summary */}
              <div className="mt-6 space-y-1">
                <div className="flex items-center justify-between border-b border-[#24201B] py-4">
                  <span className="text-sm text-[#777777]">
                    Loan Amount
                  </span>

                  <span className="text-sm text-[#F5F1E8]">
                    {formatCurrency(Number(loanAmount))}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#24201B] py-4">
                  <span className="text-sm text-[#777777]">
                    Total Interest
                  </span>

                  <span className="text-sm text-[#D4A84F]">
                    {formatCurrency(result.totalInterest)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#24201B] py-4">
                  <span className="text-sm text-[#777777]">
                    Total Payment
                  </span>

                  <span className="text-sm text-[#F5F1E8]">
                    {formatCurrency(result.totalPayment)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-4">
                  <span className="text-sm text-[#777777]">
                    Interest Rate
                  </span>

                  <span className="text-sm text-[#F5F1E8]">
                    {interestRate}%
                  </span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                  Payment breakdown
                </p>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#24201B]">
                  <div
                    className="h-full bg-[#D4A84F]"
                    style={{
                      width: `${result.principalPercentage}%`,
                    }}
                  />
                </div>

                <div className="mt-4 flex justify-between text-xs">
                  <div>
                    <span className="text-[#D4A84F]">
                      Principal
                    </span>

                    <p className="mt-1 text-[#777777]">
                      {result.principalPercentage.toFixed(
                        1
                      )}
                      %
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[#777777]">
                      Interest
                    </span>

                    <p className="mt-1 text-[#555555]">
                      {result.interestPercentage.toFixed(
                        1
                      )}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </ResultPanel>
      </div>

      {/* Formula */}
      <section className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4A84F]">
            EMI Formula
          </p>

          <p className="mt-5 font-mono text-sm leading-7 text-[#777777]">
            EMI = P × r × (1 + r)ⁿ
            <br />
            ─────────────────
            <br />
            (1 + r)ⁿ − 1
          </p>

          <p className="mt-5 text-xs leading-6 text-[#555555]">
            P = Principal amount
            <br />
            r = Monthly interest rate
            <br />
            n = Number of monthly payments
          </p>
        </div>

        <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4A84F]">
            Example
          </p>

          <p className="mt-5 text-sm leading-7 text-[#777777]">
            A ₹5,00,000 loan at 8.5% annual interest
            for 5 years will have a fixed monthly EMI
            calculated using the standard reducing-balance
            formula.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="mt-16 max-w-3xl border-t border-[#1D1D1D] pt-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4A84F]">
          About EMI calculation
        </p>

        <p className="mt-5 text-sm leading-7 text-[#666666]">
          EMI stands for Equated Monthly Instalment. It is
          the fixed amount paid by a borrower every month
          toward a loan. The EMI generally consists of both
          principal and interest components.
        </p>
      </section>
    </ToolLayout>
  );
}

export default EMICalculator;