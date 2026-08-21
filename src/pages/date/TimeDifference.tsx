import { useMemo, useState } from "react";

import ToolLayout from "../../components/tool/ToolLayout";
import ToolHeader from "../../components/tool/ToolHeader";
import ToolPanel from "../../components/tool/ToolPanel";
import ResultPanel from "../../components/tool/ResultPanel";

function TimeDifference() {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:30");
  const [overnight, setOvernight] = useState(false);

  const result = useMemo(() => {
    const [startHour, startMinute] = startTime
      .split(":")
      .map(Number);

    const [endHour, endMinute] = endTime
      .split(":")
      .map(Number);

    if (
      Number.isNaN(startHour) ||
      Number.isNaN(startMinute) ||
      Number.isNaN(endHour) ||
      Number.isNaN(endMinute)
    ) {
      return null;
    }

    const startTotalMinutes =
      startHour * 60 + startMinute;

    let endTotalMinutes =
      endHour * 60 + endMinute;

    if (overnight || endTotalMinutes < startTotalMinutes) {
      endTotalMinutes += 24 * 60;
    }

    const differenceMinutes =
      endTotalMinutes - startTotalMinutes;

    if (differenceMinutes < 0) {
      return null;
    }

    const hours = Math.floor(
      differenceMinutes / 60
    );

    const minutes = differenceMinutes % 60;

    const totalSeconds =
      differenceMinutes * 60;

    return {
      hours,
      minutes,
      totalMinutes: differenceMinutes,
      totalSeconds,
    };
  }, [startTime, endTime, overnight]);

  const resetCalculator = () => {
    setStartTime("09:00");
    setEndTime("17:30");
    setOvernight(false);
  };

  return (
    <ToolLayout>
      <ToolHeader
        category="Date & Time"
        number="003"
        title={
          <>
            Time
            <span className="font-serif italic text-[#D4A84F]">
              {" "}
              Difference.
            </span>
          </>
        }
        description="Calculate the exact duration between two times, including overnight time differences."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* INPUT PANEL */}
        <ToolPanel
          label="Calculator"
          title="Enter your times"
          code="TIME / 003"
        >
          {/* Start Time */}
          <div>
            <label className="text-sm text-[#A0A0A0]">
              Start Time
            </label>

            <input
              type="time"
              value={startTime}
              onChange={(e) =>
                setStartTime(e.target.value)
              }
              className="mt-3 w-full rounded-xl border border-[#29251D] bg-[#101214] px-4 py-4 text-lg text-[#F5F1E8] outline-none transition focus:border-[#D4A84F]/70"
            />
          </div>

          {/* End Time */}
          <div className="mt-7">
            <label className="text-sm text-[#A0A0A0]">
              End Time
            </label>

            <input
              type="time"
              value={endTime}
              onChange={(e) =>
                setEndTime(e.target.value)
              }
              className="mt-3 w-full rounded-xl border border-[#29251D] bg-[#101214] px-4 py-4 text-lg text-[#F5F1E8] outline-none transition focus:border-[#D4A84F]/70"
            />
          </div>

          {/* Overnight */}
          <div className="mt-7 rounded-xl border border-[#29251D] bg-[#101214] p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={overnight}
                onChange={(e) =>
                  setOvernight(e.target.checked)
                }
                className="mt-1 h-4 w-4 accent-[#D4A84F]"
              />

              <div>
                <p className="text-sm text-[#F5F1E8]">
                  End time is on the next day
                </p>

                <p className="mt-1 text-xs leading-5 text-[#555555]">
                  Useful for night shifts and times that
                  cross midnight.
                </p>
              </div>
            </label>
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
          title="Time difference"
          badge={overnight ? "Overnight" : "Same day"}
        >
          {!result ? (
            <div className="flex min-h-[430px] items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#302719] text-xl text-[#8B6B32]">
                  ⏱
                </div>

                <p className="mt-5 text-sm text-[#777777]">
                  Enter two times to calculate the
                  duration.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Main result */}
              <div className="rounded-2xl border border-[#D4A84F]/20 bg-[#D4A84F]/5 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8B6B32]">
                  Exact Duration
                </p>

                <div className="mt-4 flex items-end gap-4">
                  <div>
                    <p className="text-5xl font-light text-[#F5F1E8] md:text-6xl">
                      {result.hours}
                    </p>

                    <p className="mt-1 text-xs text-[#666666]">
                      Hours
                    </p>
                  </div>

                  <span className="mb-4 text-2xl text-[#555555]">
                    :
                  </span>

                  <div>
                    <p className="text-5xl font-light text-[#D4A84F] md:text-6xl">
                      {String(result.minutes).padStart(
                        2,
                        "0"
                      )}
                    </p>

                    <p className="mt-1 text-xs text-[#666666]">
                      Minutes
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-7">
                <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                  Duration summary
                </p>

                <div className="mt-3 space-y-1">
                  <div className="flex justify-between border-b border-[#24201B] py-4">
                    <span className="text-sm text-[#777777]">
                      Total Hours
                    </span>

                    <span className="text-sm text-[#F5F1E8]">
                      {(
                        result.totalMinutes / 60
                      ).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-[#24201B] py-4">
                    <span className="text-sm text-[#777777]">
                      Total Minutes
                    </span>

                    <span className="text-sm text-[#D4A84F]">
                      {result.totalMinutes.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between py-4">
                    <span className="text-sm text-[#777777]">
                      Total Seconds
                    </span>

                    <span className="text-sm text-[#F5F1E8]">
                      {result.totalSeconds.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Time range */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#24201B] bg-[#0D0F11] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#555555]">
                    Start
                  </p>

                  <p className="mt-2 text-lg text-[#F5F1E8]">
                    {startTime}
                  </p>
                </div>

                <div className="rounded-xl border border-[#24201B] bg-[#0D0F11] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#555555]">
                    End
                  </p>

                  <p className="mt-2 text-lg text-[#D4A84F]">
                    {endTime}
                  </p>
                </div>
              </div>
            </>
          )}
        </ResultPanel>
      </div>

      {/* Examples */}
      <section className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4A84F]">
            Same Day
          </p>

          <p className="mt-4 text-sm leading-7 text-[#777777]">
            09:00 AM → 05:30 PM
            <br />
            = 8 hours 30 minutes
          </p>
        </div>

        <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4A84F]">
            Overnight
          </p>

          <p className="mt-4 text-sm leading-7 text-[#777777]">
            10:30 PM → 02:15 AM
            <br />
            = 3 hours 45 minutes
          </p>
        </div>
      </section>

      {/* About */}
      <section className="mt-16 max-w-3xl border-t border-[#1D1D1D] pt-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4A84F]">
          About time difference
        </p>

        <p className="mt-5 text-sm leading-7 text-[#666666]">
          Calculate the duration between two times in
          hours, minutes and seconds. Enable overnight mode
          when the end time occurs after midnight.
        </p>
      </section>
    </ToolLayout>
  );
}

export default TimeDifference;