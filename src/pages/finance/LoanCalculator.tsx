import { useMemo, useState } from "react";

import ToolLayout from "../../components/tool/ToolLayout";
import ToolHeader from "../../components/tool/ToolHeader";
import ToolPanel from "../../components/tool/ToolPanel";
import ResultPanel from "../../components/tool/ResultPanel";
import { trackToolUsage } from "../../utils/analytics";

function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState("1000000");
  const [interestRate, setInterestRate] = useState("9");
  const [tenure, setTenure] = useState("10");

  const result = useMemo(() => {
    const principal = Number(loanAmount);
    const annualRate = Number(interestRate);
    const years = Number(tenure);

    if (
      !principal ||
      principal <= 0 ||
      annualRate < 0 ||
      !years ||
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
      const factor = Math.pow(
        1 + monthlyRate,
        months
      );

      monthlyEMI =
        (principal * monthlyRate * factor) /
        (factor - 1);
    }

    const totalPayment = monthlyEMI * months;
    const totalInterest = totalPayment - principal;

    trackToolUsage(
      "loan_calculator",
      "calculator"
    );

    return {
      principal,
      monthlyEMI,
      totalPayment,
      totalInterest,
      months,
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
      <ToolHeader
        category="Finance"
        number="004"
        title={
          <>
            Loan
            <span className="font-serif italic text-[#D4A84F]">
              {" "}
              Calculator.
            </span>
          </>
        }
        description="Estimate your monthly loan payment, total interest and total repayment based on your loan amount, interest rate and tenure."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* INPUT PANEL */}
        <ToolPanel
          label="Calculator"
          title="Loan details"
          code="LOAN / 004"
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
                placeholder="1000000"
                className="w-full bg-transparent px-3 py-4 text-lg outline-none placeholder:text-[#444444]"
              />
            </div>
          </div>

          {/* Interest Rate */}
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#A0A0A0]">
                Annual Interest Rate
              </label>

              <span className="font-mono text-xs text-[#D4A84F]">
                {interestRate || 0}%
              </span>
            </div>

            <div className="mt-3 flex items-center rounded-xl border border-[#29251D] bg-[#101214] transition focus-within:border-[#D4A84F]/70">
              <input
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={interestRate}
                onChange={(e) =>
                  setInterestRate(e.target.value)
                }
                placeholder="9"
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
                {tenure || 0} years
              </span>
            </div>

            <div className="mt-3 flex items-center rounded-xl border border-[#29251D] bg-[#101214] transition focus-within:border-[#D4A84F]/70">
              <input
                type="number"
                min="1"
                max="40"
                value={tenure}
                onChange={(e) =>
                  setTenure(e.target.value)
                }
                placeholder="10"
                className="w-full bg-transparent px-4 py-4 text-lg outline-none placeholder:text-[#444444]"
              />

              <span className="pr-4 text-[#777777]">
                Years
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="40"
              value={Number(tenure) || 1}
              onChange={(e) =>
                setTenure(e.target.value)
              }
              className="mt-4 w-full accent-[#D4A84F]"
            />

            <div className="mt-2 flex justify-between text-[10px] text-[#444444]">
              <span>1 year</span>
              <span>40 years</span>
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
          title="Loan summary"
          badge={`${tenure || 0} years`}
        >
          {!result ? (
            <div className="flex min-h-[480px] items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#302719] text-xl text-[#8B6B32]">
                  ₹
                </div>

                <p className="mt-5 text-sm text-[#777777]">
                  Enter your loan details to see the
                  repayment summary.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* EMI */}
              <div className="rounded-2xl border border-[#D4A84F]/20 bg-[#D4A84F]/5 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8B6B32]">
                  Monthly Payment
                </p>

                <p className="mt-3 text-4xl font-light text-[#F5F1E8] md:text-5xl">
                  {formatCurrency(result.monthlyEMI)}
                </p>

                <p className="mt-3 text-xs text-[#666666]">
                  Estimated monthly EMI
                </p>
              </div>

              {/* Summary */}
              <div className="mt-7">
                <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                  Repayment summary
                </p>

                <div className="mt-3 space-y-1">
                  <div className="flex justify-between border-b border-[#24201B] py-4">
                    <span className="text-sm text-[#777777]">
                      Loan Amount
                    </span>

                    <span className="text-sm text-[#F5F1E8]">
                      {formatCurrency(result.principal)}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-[#24201B] py-4">
                    <span className="text-sm text-[#777777]">
                      Total Interest
                    </span>

                    <span className="text-sm text-[#D4A84F]">
                      {formatCurrency(
                        result.totalInterest
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-[#24201B] py-4">
                    <span className="text-sm text-[#777777]">
                      Total Repayment
                    </span>

                    <span className="text-sm text-[#F5F1E8]">
                      {formatCurrency(
                        result.totalPayment
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between py-4">
                    <span className="text-sm text-[#777777]">
                      Total Duration
                    </span>

                    <span className="text-sm text-[#F5F1E8]">
                      {result.months} months
                    </span>
                  </div>
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

                <div className="mt-4 flex justify-between">
                  <div>
                    <p className="text-xs text-[#D4A84F]">
                      Principal
                    </p>

                    <p className="mt-1 text-sm text-[#777777]">
                      {result.principalPercentage.toFixed(
                        1
                      )}
                      %
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-[#777777]">
                      Interest
                    </p>

                    <p className="mt-1 text-sm text-[#555555]">
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

      {/* Formula + Example */}
      <section className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4A84F]">
            Loan Formula
          </p>

          <p className="mt-5 font-mono text-sm leading-7 text-[#777777]">
            EMI = P × r × (1 + r)ⁿ
            <br />
            ─────────────────
            <br />
            (1 + r)ⁿ − 1
          </p>

          <p className="mt-5 text-xs leading-6 text-[#555555]">
            P = Loan principal
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
            For a ₹10,00,000 loan at 9% annual interest
            over 10 years, the calculator estimates your
            monthly EMI and shows how much you will repay
            in total.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="mt-16 max-w-3xl border-t border-[#1D1D1D] pt-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4A84F]">
          About loan calculation
        </p>

        <p className="mt-5 text-sm leading-7 text-[#666666]">
          This calculator uses the standard reducing-balance
          EMI formula. Actual loan payments may vary based
          on lender-specific terms, fees, insurance and
          other applicable charges.
        </p>
      </section>
    </ToolLayout>
  );
}

export default LoanCalculator;