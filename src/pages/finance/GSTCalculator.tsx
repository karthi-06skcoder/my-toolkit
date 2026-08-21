import { useMemo, useState } from "react";
import ToolLayout from "../../components/tool/ToolLayout";
import ToolHeader from "../../components/tool/ToolHeader";
import ToolPanel from "../../components/tool/ToolPanel";
import ResultPanel from "../../components/tool/ResultPanel";

import SEO from "../../components/common/SEO";
import StructuredData from "../../components/common/StructuredData";
import ToolInfoSection from "../../components/tool/ToolInfoSection";

import { trackEvent } from "../../utils/analytics";

type CalculationType = "exclusive" | "inclusive";
type TaxType = "intra" | "inter";

function GSTCalculator() {
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState(18);
  const [calculationType, setCalculationType] =
    useState<CalculationType>("exclusive");
  const [taxType, setTaxType] = useState<TaxType>("intra");

  const result = useMemo(() => {
    const value = Number(amount);

    if (!value || value <= 0) {
      return null;
    }

    let taxableAmount = 0;
    let gstAmount = 0;
    let totalAmount = 0;

    if (calculationType === "exclusive") {
      taxableAmount = value;
      gstAmount = value * (gstRate / 100);
      totalAmount = value + gstAmount;
    } else {
      totalAmount = value;
      taxableAmount = value / (1 + gstRate / 100);
      gstAmount = value - taxableAmount;
    }

    const cgst = taxType === "intra" ? gstAmount / 2 : 0;
    const sgst = taxType === "intra" ? gstAmount / 2 : 0;
    const igst = taxType === "inter" ? gstAmount : 0;

    return {
      taxableAmount,
      gstAmount,
      totalAmount,
      cgst,
      sgst,
      igst,
    };
  }, [amount, gstRate, calculationType, taxType]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const resetCalculator = () => {
    setAmount("");
    setGstRate(18);
    setCalculationType("exclusive");
    setTaxType("intra");
  };

  trackEvent(
    "tool_used",
    {
      tool_name:
        "gst_calculator",
      tool_category:
        "calculator",
    }
  );

  return (
    <ToolLayout>
      <SEO
        title="GST Calculator"
        description="Calculate GST amount, GST-inclusive price and GST-exclusive price instantly with our free online GST calculator."
      />
      <StructuredData
        name="GST Calculator"
        description="Free online GST calculator to calculate GST amount, inclusive price and exclusive price."
        url="https://mytoolkit.com/gst-calculator"
        category="FinanceApplication"
      />
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <ToolHeader
            category="Finance"
            number="001"
            title={
                <>
                GST
                <span className="font-serif italic text-[#D4A84F]">
                    {" "}
                    Calculator.
                </span>
                </>
            }
            description="Calculate GST, CGST, SGST and IGST instantly. Choose whether your amount includes GST or not and get a clear tax breakdown."
            />

        {/* Calculator */}
        <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Input panel */}
          <ToolPanel label="Calculator" title="Enter your details" code="GST / 001">
            {/* <div className="flex items-center justify-between border-b border-[#202020] pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#555555]">
                  Calculator
                </p>

                <h2 className="mt-2 text-xl font-light">
                  Enter your details
                </h2>
              </div>

              <span className="font-mono text-xs text-[#444444]">
                GST / 001
              </span>
            </div> */}

            {/* Amount */}
            <div className="mt-8">
              <label className="text-sm text-[#A0A0A0]">
                Amount
              </label>

              <div className="mt-3 flex items-center rounded-xl border border-[#29251D] bg-[#101214] transition focus-within:border-[#D4A84F]/70">
                <span className="pl-4 text-[#D4A84F]">₹</span>

                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-transparent px-3 py-4 text-lg outline-none placeholder:text-[#444444]"
                />
              </div>
            </div>

            {/* GST Rate */}
            <div className="mt-7">
              <label className="text-sm text-[#A0A0A0]">
                GST Rate
              </label>

              <div className="mt-3 grid grid-cols-4 gap-2">
                {[5, 12, 18, 28].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setGstRate(rate)}
                    className={`rounded-xl border px-3 py-3 text-sm transition ${
                      gstRate === rate
                        ? "border-[#D4A84F] bg-[#D4A84F]/10 text-[#D4A84F]"
                        : "border-[#29251D] bg-[#101214] text-[#777777] hover:border-[#555555]"
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            {/* Calculation Type */}
            <div className="mt-7">
              <label className="text-sm text-[#A0A0A0]">
                Calculation Type
              </label>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCalculationType("exclusive")}
                  className={`rounded-xl border p-4 text-left transition ${
                    calculationType === "exclusive"
                      ? "border-[#D4A84F] bg-[#D4A84F]/10"
                      : "border-[#29251D] bg-[#101214] hover:border-[#555555]"
                  }`}
                >
                  <span
                    className={`block text-sm ${
                      calculationType === "exclusive"
                        ? "text-[#D4A84F]"
                        : "text-[#F5F1E8]"
                    }`}
                  >
                    GST Exclusive
                  </span>

                  <span className="mt-1 block text-xs text-[#555555]">
                    GST is added to amount
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setCalculationType("inclusive")}
                  className={`rounded-xl border p-4 text-left transition ${
                    calculationType === "inclusive"
                      ? "border-[#D4A84F] bg-[#D4A84F]/10"
                      : "border-[#29251D] bg-[#101214] hover:border-[#555555]"
                  }`}
                >
                  <span
                    className={`block text-sm ${
                      calculationType === "inclusive"
                        ? "text-[#D4A84F]"
                        : "text-[#F5F1E8]"
                    }`}
                  >
                    GST Inclusive
                  </span>

                  <span className="mt-1 block text-xs text-[#555555]">
                    GST is already included
                  </span>
                </button>
              </div>
            </div>

            {/* Tax Type */}
            <div className="mt-7">
              <label className="text-sm text-[#A0A0A0]">
                Tax Type
              </label>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTaxType("intra")}
                  className={`rounded-xl border p-4 text-left transition ${
                    taxType === "intra"
                      ? "border-[#D4A84F] bg-[#D4A84F]/10"
                      : "border-[#29251D] bg-[#101214] hover:border-[#555555]"
                  }`}
                >
                  <span
                    className={`block text-sm ${
                      taxType === "intra"
                        ? "text-[#D4A84F]"
                        : "text-[#F5F1E8]"
                    }`}
                  >
                    CGST + SGST
                  </span>

                  <span className="mt-1 block text-xs text-[#555555]">
                    Intra-state transaction
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTaxType("inter")}
                  className={`rounded-xl border p-4 text-left transition ${
                    taxType === "inter"
                      ? "border-[#D4A84F] bg-[#D4A84F]/10"
                      : "border-[#29251D] bg-[#101214] hover:border-[#555555]"
                  }`}
                >
                  <span
                    className={`block text-sm ${
                      taxType === "inter"
                        ? "text-[#D4A84F]"
                        : "text-[#F5F1E8]"
                    }`}
                  >
                    IGST
                  </span>

                  <span className="mt-1 block text-xs text-[#555555]">
                    Inter-state transaction
                  </span>
                </button>
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

          {/* Result panel */}
          <ResultPanel title="GST breakdown" badge={`${gstRate}%`}>
            {/* <div className="flex items-center justify-between border-b border-[#29241B] pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#8B6B32]">
                  Result
                </p>

                <h2 className="mt-2 text-xl font-light">
                  GST breakdown
                </h2>
              </div>

              <span className="text-xs text-[#555555]">
                {gstRate}%
              </span>
            </div> */}

            {!result ? (
              <div className="flex min-h-[420px] items-center justify-center text-center">
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#302719] text-xl text-[#8B6B32]">
                    ₹
                  </div>

                  <p className="mt-5 text-sm text-[#777777]">
                    Enter an amount to see your GST breakdown.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-8">
                {/* Total */}
                <div className="rounded-2xl border border-[#D4A84F]/20 bg-[#D4A84F]/5 p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8B6B32]">
                    Total Amount
                  </p>

                  <p className="mt-3 text-4xl font-light text-[#F5F1E8] md:text-5xl">
                    {formatCurrency(result.totalAmount)}
                  </p>
                </div>

                {/* Breakdown */}
                <div className="mt-6 space-y-1">
                  <div className="flex items-center justify-between border-b border-[#24201B] py-4">
                    <span className="text-sm text-[#777777]">
                      Taxable Amount
                    </span>

                    <span className="text-sm text-[#F5F1E8]">
                      {formatCurrency(result.taxableAmount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#24201B] py-4">
                    <span className="text-sm text-[#777777]">
                      GST ({gstRate}%)
                    </span>

                    <span className="text-sm text-[#D4A84F]">
                      {formatCurrency(result.gstAmount)}
                    </span>
                  </div>

                  {taxType === "intra" && (
                    <>
                      <div className="flex items-center justify-between border-b border-[#24201B] py-4">
                        <span className="text-sm text-[#777777]">
                          CGST ({gstRate / 2}%)
                        </span>

                        <span className="text-sm text-[#F5F1E8]">
                          {formatCurrency(result.cgst)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-b border-[#24201B] py-4">
                        <span className="text-sm text-[#777777]">
                          SGST ({gstRate / 2}%)
                        </span>

                        <span className="text-sm text-[#F5F1E8]">
                          {formatCurrency(result.sgst)}
                        </span>
                      </div>
                    </>
                  )}

                  {taxType === "inter" && (
                    <div className="flex items-center justify-between border-b border-[#24201B] py-4">
                      <span className="text-sm text-[#777777]">
                        IGST ({gstRate}%)
                      </span>

                      <span className="text-sm text-[#F5F1F8]">
                        {formatCurrency(result.igst)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Formula */}
                <div className="mt-8 rounded-xl border border-[#24201B] bg-[#0D0F11] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                    Calculation
                  </p>

                  <p className="mt-3 font-mono text-xs leading-6 text-[#777777]">
                    {calculationType === "exclusive"
                      ? `GST = ${formatCurrency(
                          result.taxableAmount
                        )} × ${gstRate}%`
                      : `Taxable = ${formatCurrency(
                          result.totalAmount
                        )} ÷ (1 + ${gstRate}%)`}
                  </p>
                </div>
              </div>
            )}
          </ResultPanel>
        </div>

        {/* Information */}
        <section className="mt-16 max-w-3xl border-t border-[#1D1D1D] pt-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4A84F]">
            About GST calculation
          </p>

          <p className="mt-5 text-sm leading-7 text-[#666666]">
            For intra-state transactions, GST is generally divided equally
            between CGST and SGST. For inter-state transactions, the applicable
            GST is represented as IGST. This calculator provides a quick
            estimate and should not be treated as tax or legal advice.
          </p>
        </section>
      </div>
      <ToolInfoSection
        title="GST Calculator"
        description="Use this free GST calculator to quickly calculate GST amounts and understand GST-inclusive and GST-exclusive prices."
        sections={[
          {
            title: "What is GST?",
            content:
              "Goods and Services Tax (GST) is an indirect tax applied to the supply of goods and services in India. GST rates vary depending on the category of goods or services.",
          },
          {
            title: "How to calculate GST?",
            content:
              "For a GST-exclusive amount, GST is calculated by multiplying the base amount by the GST rate and dividing by 100. For a GST-inclusive amount, the GST component can be derived from the total price and applicable GST rate.",
          },
        ]}
        faqs={[
          {
            question:
              "What is a GST calculator?",
            answer:
              "A GST calculator helps you calculate the GST amount and determine the total price including or excluding GST.",
          },
          {
            question:
              "Can I calculate GST inclusive price?",
            answer:
              "Yes. Enter the amount, choose the GST rate and select the appropriate calculation mode to calculate the GST-inclusive price.",
          },
          {
            question:
              "Which GST rates can I calculate?",
            answer:
              "You can use the calculator with common GST rates such as 5%, 12%, 18% and 28%, as supported by the calculator.",
          },
        ]}
      />
    </ToolLayout>
  );
}

export default GSTCalculator;