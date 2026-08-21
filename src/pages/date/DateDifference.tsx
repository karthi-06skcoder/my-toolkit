import { useMemo, useState } from "react";
import {
  differenceInDays,
  // differenceInHours,
  // differenceInMinutes,
  differenceInMonths,
  // differenceInSeconds,
  // differenceInWeeks,
  differenceInYears,
  format,
  isAfter,
  isValid,
  parseISO,
  startOfDay,
} from "date-fns";

import ToolLayout from "../../components/tool/ToolLayout";
import ToolHeader from "../../components/tool/ToolHeader";
import ToolPanel from "../../components/tool/ToolPanel";
import ResultPanel from "../../components/tool/ResultPanel";

function DateDifference() {
  const today = format(new Date(), "yyyy-MM-dd");

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [inclusive, setInclusive] = useState(false);

  const result = useMemo(() => {
    const start = startOfDay(parseISO(startDate));
    const end = startOfDay(parseISO(endDate));

    if (
      !isValid(start) ||
      !isValid(end) ||
      isAfter(start, end)
    ) {
      return null;
    }

    const extraDay = inclusive ? 1 : 0;

    const totalDays =
      differenceInDays(end, start) + extraDay;

    const totalWeeks = Math.floor(totalDays / 7);

    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    const totalMonths = differenceInMonths(
      end,
      start
    );

    const years = differenceInYears(end, start);

    const remainingMonths =
      totalMonths - years * 12;

    const anniversary = new Date(start);

    anniversary.setFullYear(
      start.getFullYear() + years
    );

    anniversary.setMonth(
      start.getMonth() + remainingMonths
    );

    const remainingDays = differenceInDays(
      end,
      anniversary
    );

    return {
      years,
      months: remainingMonths,
      days: remainingDays,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      totalSeconds,
    };
  }, [startDate, endDate, inclusive]);

  const resetCalculator = () => {
    setStartDate(today);
    setEndDate(today);
    setInclusive(false);
  };

  return (
    <ToolLayout>
      <ToolHeader
        category="Date & Time"
        number="002"
        title={
          <>
            Date
            <span className="font-serif italic text-[#D4A84F]">
              {" "}
              Difference.
            </span>
          </>
        }
        description="Find the exact difference between two dates in years, months, days and more."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* INPUT */}
        <ToolPanel
          label="Calculator"
          title="Choose your dates"
          code="DATE / 002"
        >
          {/* Start Date */}
          <div>
            <label className="text-sm text-[#A0A0A0]">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
              className="mt-3 w-full rounded-xl border border-[#29251D] bg-[#101214] px-4 py-4 text-lg text-[#F5F1E8] outline-none transition focus:border-[#D4A84F]/70"
            />
          </div>

          {/* End Date */}
          <div className="mt-7">
            <label className="text-sm text-[#A0A0A0]">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
              className="mt-3 w-full rounded-xl border border-[#29251D] bg-[#101214] px-4 py-4 text-lg text-[#F5F1E8] outline-none transition focus:border-[#D4A84F]/70"
            />
          </div>

          {/* Inclusive */}
          <div className="mt-7 rounded-xl border border-[#29251D] bg-[#101214] p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={inclusive}
                onChange={(e) =>
                  setInclusive(e.target.checked)
                }
                className="mt-1 h-4 w-4 accent-[#D4A84F]"
              />

              <div>
                <p className="text-sm text-[#F5F1E8]">
                  Include both dates
                </p>

                <p className="mt-1 text-xs leading-5 text-[#555555]">
                  Adds one day to the total when both the
                  start and end dates are counted.
                </p>
              </div>
            </label>
          </div>

          {/* Validation */}
          {isAfter(
            parseISO(startDate),
            parseISO(endDate)
          ) && (
            <div className="mt-6 rounded-xl border border-red-900/40 bg-red-950/20 p-4">
              <p className="text-sm text-red-400">
                End date must be on or after the start date.
              </p>
            </div>
          )}

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
          title="Date difference"
          badge={inclusive ? "Inclusive" : "Standard"}
        >
          {!result ? (
            <div className="flex min-h-[470px] items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#302719] text-xl text-[#8B6B32]">
                  Δ
                </div>

                <p className="mt-5 text-sm text-[#777777]">
                  Select two dates to calculate the
                  difference.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Main */}
              <div className="rounded-2xl border border-[#D4A84F]/20 bg-[#D4A84F]/5 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8B6B32]">
                  Exact Difference
                </p>

                <div className="mt-4 flex flex-wrap items-end gap-4">
                  <div>
                    <p className="text-4xl font-light text-[#F5F1E8]">
                      {result.years}
                    </p>

                    <p className="mt-1 text-xs text-[#666666]">
                      Years
                    </p>
                  </div>

                  <span className="mb-4 text-[#555555]">
                    ·
                  </span>

                  <div>
                    <p className="text-4xl font-light text-[#F5F1E8]">
                      {result.months}
                    </p>

                    <p className="mt-1 text-xs text-[#666666]">
                      Months
                    </p>
                  </div>

                  <span className="mb-4 text-[#555555]">
                    ·
                  </span>

                  <div>
                    <p className="text-4xl font-light text-[#D4A84F]">
                      {result.days}
                    </p>

                    <p className="mt-1 text-xs text-[#666666]">
                      Days
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="mt-7">
                <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                  Total duration
                </p>

                <div className="mt-3 space-y-1">
                  <div className="flex justify-between border-b border-[#24201B] py-4">
                    <span className="text-sm text-[#777777]">
                      Total Days
                    </span>

                    <span className="text-sm text-[#D4A84F]">
                      {result.totalDays.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-[#24201B] py-4">
                    <span className="text-sm text-[#777777]">
                      Total Weeks
                    </span>

                    <span className="text-sm text-[#F5F1E8]">
                      {result.totalWeeks.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-[#24201B] py-4">
                    <span className="text-sm text-[#777777]">
                      Total Hours
                    </span>

                    <span className="text-sm text-[#F5F1E8]">
                      {result.totalHours.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-[#24201B] py-4">
                    <span className="text-sm text-[#777777]">
                      Total Minutes
                    </span>

                    <span className="text-sm text-[#F5F1E8]">
                      {result.totalMinutes.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between py-4">
                    <span className="text-sm text-[#777777]">
                      Total Seconds
                    </span>

                    <span className="text-sm text-[#D4A84F]">
                      {result.totalSeconds.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </ResultPanel>
      </div>

      {/* Date summary */}
      {result && (
        <section className="mt-16 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
              Start Date
            </p>

            <p className="mt-3 text-lg text-[#F5F1E8]">
              {format(
                parseISO(startDate),
                "dd MMM yyyy"
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
              End Date
            </p>

            <p className="mt-3 text-lg text-[#D4A84F]">
              {format(
                parseISO(endDate),
                "dd MMM yyyy"
              )}
            </p>
          </div>
        </section>
      )}

      {/* About */}
      <section className="mt-16 max-w-3xl border-t border-[#1D1D1D] pt-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4A84F]">
          About date difference
        </p>

        <p className="mt-5 text-sm leading-7 text-[#666666]">
          Calculate the duration between two dates in
          calendar units or convert the difference into
          total days, weeks, hours, minutes and seconds.
          Use the inclusive option when both the start and
          end dates should be counted.
        </p>
      </section>
    </ToolLayout>
  );
}

export default DateDifference;