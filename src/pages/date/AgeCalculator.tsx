import { useMemo, useState } from "react";
import {
  differenceInDays,
  differenceInMonths,
  // differenceInYears,
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

function AgeCalculator() {
  const today = format(new Date(), "yyyy-MM-dd");

  const [dateOfBirth, setDateOfBirth] = useState("");
  const [asOfDate, setAsOfDate] = useState(today);

  const result = useMemo(() => {
    if (!dateOfBirth || !asOfDate) {
      return null;
    }

    const birthDate = startOfDay(parseISO(dateOfBirth));
    const targetDate = startOfDay(parseISO(asOfDate));

    if (!isValid(birthDate) || !isValid(targetDate)) {
      return null;
    }

    if (isAfter(birthDate, targetDate)) {
      return null;
    }

    const totalMonths = differenceInMonths(
        targetDate,
        birthDate
    );

    const years = Math.floor(totalMonths / 12);

    const totalDays = differenceInDays(
      targetDate,
      birthDate
    );

    const remainingMonths = totalMonths % 12;

    const anniversary = new Date(birthDate);
    anniversary.setFullYear(
    birthDate.getFullYear() + years
    );

    anniversary.setMonth(
    birthDate.getMonth() + remainingMonths
    );

    const remainingDays = differenceInDays(
    targetDate,
    anniversary
    );

    const lastBirthday = new Date(
      targetDate.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );

    if (isAfter(lastBirthday, targetDate)) {
      lastBirthday.setFullYear(
        targetDate.getFullYear() - 1
      );
    }

    const nextBirthday = new Date(
      targetDate.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );

    if (
      !isAfter(nextBirthday, targetDate)
    ) {
      nextBirthday.setFullYear(
        targetDate.getFullYear() + 1
      );
    }

    const daysUntilBirthday = differenceInDays(
      nextBirthday,
      targetDate
    );

    const dayOfBirth = format(
      birthDate,
      "EEEE"
    );

    const nextBirthdayDay = format(
      nextBirthday,
      "EEEE"
    );
    

    return {
      years,
      months: remainingMonths,
      days: remainingDays,
      totalMonths,
      totalDays,
      totalWeeks: Math.floor(totalDays / 7),
      daysUntilBirthday,
      dayOfBirth,
      nextBirthday,
      nextBirthdayDay,
    };
  }, [dateOfBirth, asOfDate]);

  const formatDate = (date: Date) => {
    return format(date, "dd MMM yyyy");
  };

  const resetCalculator = () => {
    setDateOfBirth("");
    setAsOfDate(today);
  };

  return (
    <ToolLayout>
      <ToolHeader
        category="Date & Time"
        number="001"
        title={
          <>
            Age
            <span className="font-serif italic text-[#D4A84F]">
              {" "}
              Calculator.
            </span>
          </>
        }
        description="Calculate your exact age in years, months and days. See your total days, weeks and upcoming birthday at a glance."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* INPUT PANEL */}
        <ToolPanel
          label="Calculator"
          title="Enter your dates"
          code="AGE / 001"
        >
          {/* Date of Birth */}
          <div>
            <label className="text-sm text-[#A0A0A0]">
              Date of Birth
            </label>

            <input
              type="date"
              value={dateOfBirth}
              max={asOfDate}
              onChange={(e) =>
                setDateOfBirth(e.target.value)
              }
              className="mt-3 w-full rounded-xl border border-[#29251D] bg-[#101214] px-4 py-4 text-lg text-[#F5F1E8] outline-none transition focus:border-[#D4A84F]/70"
            />
          </div>

          {/* As Of Date */}
          <div className="mt-7">
            <label className="text-sm text-[#A0A0A0]">
              Calculate Age As Of
            </label>

            <input
              type="date"
              value={asOfDate}
              min={dateOfBirth || undefined}
              onChange={(e) =>
                setAsOfDate(e.target.value)
              }
              className="mt-3 w-full rounded-xl border border-[#29251D] bg-[#101214] px-4 py-4 text-lg text-[#F5F1E8] outline-none transition focus:border-[#D4A84F]/70"
            />

            <p className="mt-2 text-xs text-[#4F4F4F]">
              By default, your age is calculated up to
              today.
            </p>
          </div>

          {/* Validation */}
          {dateOfBirth &&
            asOfDate &&
            isAfter(
              parseISO(dateOfBirth),
              parseISO(asOfDate)
            ) && (
              <div className="mt-6 rounded-xl border border-red-900/40 bg-red-950/20 p-4">
                <p className="text-sm text-red-400">
                  Date of birth cannot be after the
                  calculation date.
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

        {/* RESULT PANEL */}
        <ResultPanel
          title="Your age"
          badge={result ? formatDate(parseISO(asOfDate)) : "Today"}
        >
          {!result ? (
            <div className="flex min-h-[430px] items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#302719] text-xl text-[#8B6B32]">
                  🎂
                </div>

                <p className="mt-5 text-sm text-[#777777]">
                  Enter your date of birth to calculate
                  your exact age.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Main age */}
              <div className="rounded-2xl border border-[#D4A84F]/20 bg-[#D4A84F]/5 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8B6B32]">
                  Exact Age
                </p>

                <div className="mt-4 flex flex-wrap items-end gap-4">
                  <div>
                    <p className="text-4xl font-light text-[#F5F1E8] md:text-5xl">
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
                    <p className="text-4xl font-light text-[#F5F1E8] md:text-5xl">
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
                    <p className="text-4xl font-light text-[#D4A84F] md:text-5xl">
                      {result.days}
                    </p>

                    <p className="mt-1 text-xs text-[#666666]">
                      Days*
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-xs text-[#555555]">
                  *The exact years/months/days representation
                  accounts for calendar boundaries.
                </p>
              </div>

              {/* Statistics */}
              <div className="mt-7">
                <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                  Lifetime statistics
                </p>

                <div className="mt-3 space-y-1">
                  <div className="flex justify-between border-b border-[#24201B] py-4">
                    <span className="text-sm text-[#777777]">
                      Total Months
                    </span>

                    <span className="text-sm text-[#F5F1E8]">
                      {result.totalMonths.toLocaleString(
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

                  <div className="flex justify-between py-4">
                    <span className="text-sm text-[#777777]">
                      Total Days
                    </span>

                    <span className="text-sm text-[#D4A84F]">
                      {result.totalDays.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Birth information */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#24201B] bg-[#0D0F11] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#555555]">
                    Born On
                  </p>

                  <p className="mt-2 text-sm text-[#F5F1E8]">
                    {result.dayOfBirth}
                  </p>
                </div>

                <div className="rounded-xl border border-[#24201B] bg-[#0D0F11] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#555555]">
                    Next Birthday
                  </p>

                  <p className="mt-2 text-sm text-[#D4A84F]">
                    {result.nextBirthdayDay}
                  </p>
                </div>
              </div>
            </>
          )}
        </ResultPanel>
      </div>

      {/* Birthday section */}
      {result && (
        <section className="mt-16 rounded-3xl border border-[#302719] bg-[#11100D] p-6 md:p-8">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#D4A84F]">
                Next Birthday
              </p>

              <h2 className="mt-4 text-3xl font-light md:text-4xl">
                {formatDate(result.nextBirthday)}
              </h2>

              <p className="mt-3 text-sm text-[#666666]">
                Your next birthday is{" "}
                <span className="text-[#D4A84F]">
                  {result.daysUntilBirthday}
                </span>{" "}
                days away.
              </p>
            </div>

            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#302719] text-4xl">
              🎂
            </div>
          </div>
        </section>
      )}

      {/* About */}
      <section className="mt-16 max-w-3xl border-t border-[#1D1D1D] pt-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4A84F]">
          About age calculation
        </p>

        <p className="mt-5 text-sm leading-7 text-[#666666]">
          Age is calculated based on the difference between
          your date of birth and the selected calculation
          date. The calculator uses calendar-aware date
          calculations to account for different month
          lengths and leap years.
        </p>
      </section>
    </ToolLayout>
  );
}

export default AgeCalculator;