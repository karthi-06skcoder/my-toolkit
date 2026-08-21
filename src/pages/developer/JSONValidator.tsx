import { useMemo, useState } from "react";

import ToolLayout from "../../components/tool/ToolLayout";
import ToolHeader from "../../components/tool/ToolHeader";
import ToolPanel from "../../components/tool/ToolPanel";
import ResultPanel from "../../components/tool/ResultPanel";

type ValidationResult = {
  valid: boolean;
  type?: string;
  error?: string;
  position?: number;
  line?: number;
  column?: number;
};

function JSONValidator() {
  const [input, setInput] = useState("");

  const [result, setResult] =
    useState<ValidationResult | null>(null);

  const [copied, setCopied] = useState(false);

  const characterCount = input.length;

  const lineCount = useMemo(() => {
    if (!input) return 0;

    return input.split("\n").length;
  }, [input]);

  // const getJSONType = (value: unknown) => {
  //   if (Array.isArray(value)) {
  //     return "Array";
  //   }

  //   if (value === null) {
  //     return "Null";
  //   }

  //   return (
  //     typeof value
  //       .charAt?.(0)
  //       ?.toUpperCase() +
  //     typeof value.slice === "function"
  //       ? ""
  //       : ""
  //   );
  // };

  const detectPosition = (
    errorMessage: string
  ) => {
    const match =
      errorMessage.match(
        /position\s+(\d+)/i
      );

    if (!match) {
      return null;
    }

    return Number(match[1]);
  };

  const getLineColumn = (
    text: string,
    position: number
  ) => {
    const before =
      text.slice(0, position);

    const line =
      before.split("\n").length;

    const lastNewLine =
      before.lastIndexOf("\n");

    const column =
      position -
      lastNewLine;

    return {
      line,
      column,
    };
  };

  const getValueType = (
    value: unknown
  ) => {
    if (Array.isArray(value)) {
      return "Array";
    }

    if (value === null) {
      return "Null";
    }

    if (
      typeof value === "object"
    ) {
      return "Object";
    }

    if (
      typeof value === "string"
    ) {
      return "String";
    }

    if (
      typeof value === "number"
    ) {
      return "Number";
    }

    if (
      typeof value === "boolean"
    ) {
      return "Boolean";
    }

    return "Unknown";
  };

  const validateJSON = () => {
    if (!input.trim()) {
      setResult({
        valid: false,
        error: "Please enter JSON data.",
      });

      return;
    }

    try {
      const parsed =
        JSON.parse(input);

      setResult({
        valid: true,
        type: getValueType(parsed),
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Invalid JSON.";

      const position =
        detectPosition(
          errorMessage
        );

      let line: number | undefined;
      let column:
        | number
        | undefined;

      if (
        position !== null
      ) {
        const location =
          getLineColumn(
            input,
            position
          );

        line = location.line;
        column = location.column;
      }

      setResult({
        valid: false,
        error: errorMessage,
        position:
          position ?? undefined,
        line,
        column,
      });
    }

    setCopied(false);
  };

  const loadValidExample = () => {
    setInput(`{
  "name": "My Toolkit",
  "version": "1.0.0",
  "tools": [
    "GST Calculator",
    "EMI Calculator",
    "JSON Formatter"
  ],
  "active": true
}`);

    setResult(null);
    setCopied(false);
  };

  const loadInvalidExample = () => {
    setInput(`{
  "name": "My Toolkit",
  "version": "1.0.0",
  "tools": [
    "GST Calculator",
    "EMI Calculator",
    "JSON Formatter",
  ],
  "active": true
}`);

    setResult(null);
    setCopied(false);
  };

  const copyInput = async () => {
    if (!input) return;

    try {
      await navigator.clipboard.writeText(
        input
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);

      setResult({
        valid: false,
        error:
          "Unable to copy JSON to clipboard.",
      });
    }
  };

  const clearAll = () => {
    setInput("");
    setResult(null);
    setCopied(false);
  };

  return (
    <ToolLayout>
      <ToolHeader
        category="Developer Tools"
        number="002"
        title={
          <>
            JSON
            <span className="font-serif italic text-[#D4A84F]">
              {" "}
              Validator.
            </span>
          </>
        }
        description="Validate JSON syntax instantly and identify malformed JSON before it reaches your application."
      />

      <div className="mt-10 grid gap-5 sm:mt-12 lg:mt-16 lg:grid-cols-2">
        {/* INPUT */}
        <ToolPanel
          label="Developer Tools"
          title="Validate JSON"
          code="DEV / 002"
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={
                  loadValidExample
                }
                className="rounded-lg border border-[#29251D] px-4 py-2 text-xs text-[#666666] transition hover:border-[#D4A84F] hover:text-[#D4A84F]"
              >
                Valid Example
              </button>

              <button
                type="button"
                onClick={
                  loadInvalidExample
                }
                className="rounded-lg border border-[#29251D] px-4 py-2 text-xs text-[#666666] transition hover:border-red-500/50 hover:text-red-400"
              >
                Invalid Example
              </button>
            </div>

            <button
              type="button"
              onClick={copyInput}
              className="text-xs text-[#555555] transition hover:text-[#D4A84F]"
            >
              {copied
                ? "Copied ✓"
                : "Copy"}
            </button>
          </div>

          {/* Editor */}
          <div className="mt-5 overflow-hidden rounded-2xl border border-[#29251D] bg-[#0B0D0F]">
            <div className="flex items-center justify-between border-b border-[#202020] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#D4A84F]" />

                <span className="text-[10px] uppercase tracking-[0.2em] text-[#555555]">
                  JSON Input
                </span>
              </div>

              <span className="text-[10px] text-[#444444]">
                UTF-8
              </span>
            </div>

            <textarea
              value={input}
              onChange={(event) => {
                setInput(
                  event.target.value
                );
                setResult(null);
              }}
              placeholder={`Paste your JSON here...

{
  "name": "John",
  "age": 30
}`}
              spellCheck={false}
              className="min-h-[450px] w-full resize-y bg-transparent p-5 font-mono text-sm leading-7 text-[#D8D4CC] outline-none placeholder:text-[#383838]"
            />
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-5 text-[10px] uppercase tracking-[0.15em] text-[#444444]">
            <span>
              Characters:{" "}
              <span className="text-[#777777]">
                {characterCount}
              </span>
            </span>

            <span>
              Lines:{" "}
              <span className="text-[#777777]">
                {lineCount}
              </span>
            </span>
          </div>

          {/* Validate */}
          <div className="mt-7 flex gap-3">
            <button
              type="button"
              onClick={validateJSON}
              className="flex-1 rounded-xl bg-[#D4A84F] py-4 text-sm font-medium text-[#090A0C] transition hover:bg-[#E3BD68]"
            >
              Validate JSON
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-[#29251D] px-6 py-4 text-sm text-[#666666] transition hover:border-[#D4A84F] hover:text-[#D4A84F]"
            >
              Clear
            </button>
          </div>
        </ToolPanel>

        {/* RESULT */}
        <ResultPanel
          title="Validation result"
          badge={
            result
              ? result.valid
                ? "Valid"
                : "Invalid"
              : "Ready"
          }
        >
          {!result ? (
            <div className="flex min-h-[560px] items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#302719] font-mono text-sm text-[#8B6B32]">
                  {"{ }"}
                </div>

                <p className="mt-5 text-sm text-[#777777]">
                  JSON validation result will appear here.
                </p>

                <p className="mt-2 text-xs text-[#444444]">
                  Enter JSON and click Validate.
                </p>
              </div>
            </div>
          ) : result.valid ? (
            <>
              {/* Valid */}
              <div className="rounded-2xl border border-[#D4A84F]/30 bg-[#D4A84F]/5 p-7">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D4A84F]/40 text-lg text-[#D4A84F]">
                    ✓
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#8B6B32]">
                      Validation successful
                    </p>

                    <p className="mt-2 text-2xl font-light text-[#F5F1E8]">
                      Valid JSON
                    </p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="mt-7 space-y-1">
                <div className="flex justify-between border-b border-[#24201B] py-4">
                  <span className="text-sm text-[#777777]">
                    Status
                  </span>

                  <span className="text-sm text-[#D4A84F]">
                    Valid
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#24201B] py-4">
                  <span className="text-sm text-[#777777]">
                    JSON Type
                  </span>

                  <span className="text-sm text-[#F5F1E8]">
                    {result.type}
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#24201B] py-4">
                  <span className="text-sm text-[#777777]">
                    Characters
                  </span>

                  <span className="text-sm text-[#F5F1E8]">
                    {characterCount}
                  </span>
                </div>

                <div className="flex justify-between py-4">
                  <span className="text-sm text-[#777777]">
                    Lines
                  </span>

                  <span className="text-sm text-[#F5F1E8]">
                    {lineCount}
                  </span>
                </div>
              </div>

              {/* Success note */}
              <div className="mt-8 rounded-xl border border-[#24201B] bg-[#0D0F11] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#D4A84F]">
                  Ready to use
                </p>

                <p className="mt-3 text-sm leading-6 text-[#666666]">
                  Your JSON syntax is valid and can be
                  safely parsed by a standard JSON parser.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Invalid */}
              <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-7">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 text-lg text-red-400">
                    ×
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-red-500">
                      Validation failed
                    </p>

                    <p className="mt-2 text-2xl font-light text-[#F5F1E8]">
                      Invalid JSON
                    </p>
                  </div>
                </div>
              </div>

              {/* Error */}
              <div className="mt-7 rounded-xl border border-red-900/30 bg-[#100D0D] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                  Error
                </p>

                <p className="mt-3 break-words font-mono text-sm leading-7 text-red-400">
                  {result.error}
                </p>
              </div>

              {/* Position */}
              {result.position !==
                undefined && (
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-[#24201B] bg-[#0D0F11] p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#444444]">
                      Position
                    </p>

                    <p className="mt-2 font-mono text-sm text-[#D4A84F]">
                      {result.position}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#24201B] bg-[#0D0F11] p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#444444]">
                      Line
                    </p>

                    <p className="mt-2 font-mono text-sm text-[#D4A84F]">
                      {result.line ??
                        "-"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#24201B] bg-[#0D0F11] p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#444444]">
                      Column
                    </p>

                    <p className="mt-2 font-mono text-sm text-[#D4A84F]">
                      {result.column ??
                        "-"}
                    </p>
                  </div>
                </div>
              )}

              {/* Tip */}
              <div className="mt-8 rounded-xl border border-[#24201B] bg-[#0D0F11] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#D4A84F]">
                  Quick tip
                </p>

                <p className="mt-3 text-sm leading-6 text-[#666666]">
                  Check commas, quotes, brackets and
                  braces around the reported error location.
                </p>
              </div>
            </>
          )}
        </ResultPanel>
      </div>

      {/* How it works */}
      <section className="mt-16 border-t border-[#1D1D1D] pt-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4A84F]">
          How it works
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
            <span className="font-mono text-xs text-[#D4A84F]">
              01
            </span>

            <h3 className="mt-4 text-lg font-light">
              Paste JSON
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Paste your JSON data into the validator.
            </p>
          </div>

          <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
            <span className="font-mono text-xs text-[#D4A84F]">
              02
            </span>

            <h3 className="mt-4 text-lg font-light">
              Validate
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              The browser's native JSON parser checks the
              syntax.
            </p>
          </div>

          <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
            <span className="font-mono text-xs text-[#D4A84F]">
              03
            </span>

            <h3 className="mt-4 text-lg font-light">
              Fix errors
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Use the error details and position to fix
              malformed JSON.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mt-16 max-w-3xl border-t border-[#1D1D1D] pt-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4A84F]">
          About JSON Validator
        </p>

        <p className="mt-5 text-sm leading-7 text-[#666666]">
          Validate JSON syntax directly in your browser
          without sending your data to a server. This is
          useful when working with API responses,
          configuration files and application data.
        </p>
      </section>
    </ToolLayout>
  );
}

export default JSONValidator;