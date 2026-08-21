import { useMemo, useState } from "react";

import ToolLayout from "../../components/tool/ToolLayout";
import ToolHeader from "../../components/tool/ToolHeader";
import ToolPanel from "../../components/tool/ToolPanel";
import ResultPanel from "../../components/tool/ResultPanel";

function JSONFormatter() {
  const [input, setInput] = useState("");

  const [output, setOutput] = useState("");

  const [indent, setIndent] = useState(2);

  const [error, setError] = useState("");

  const [copied, setCopied] = useState(false);

  const [mode, setMode] = useState<
    "format" | "minify"
  >("format");

  const lineCount = useMemo(() => {
    if (!input) return 0;

    return input.split("\n").length;
  }, [input]);

  const characterCount = input.length;

  const formatJSON = () => {
    if (!input.trim()) {
      setError("Please enter JSON data.");
      setOutput("");
      return;
    }

    try {
      const parsed = JSON.parse(input);

      const formatted =
        mode === "format"
          ? JSON.stringify(
              parsed,
              null,
              indent
            )
          : JSON.stringify(parsed);

      setOutput(formatted);
      setError("");
      setCopied(false);
    } catch (err) {
      console.error(err);

      const message =
        err instanceof Error
          ? err.message
          : "Invalid JSON.";

      setError(message);
      setOutput("");
      setCopied(false);
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  };

  const copyOutput = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(
        output
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to copy JSON to clipboard."
      );
    }
  };

  const downloadJSON = () => {
    if (!output) return;

    const blob = new Blob(
      [output],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "my-toolkit-formatted.json";

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  };

  const loadExample = () => {
    const example = `{
  "name": "My Toolkit",
  "version": "1.0.0",
  "tools": [
    "GST Calculator",
    "EMI Calculator",
    "JSON Formatter"
  ],
  "active": true
}`;

    setInput(example);
    setOutput("");
    setError("");
    setCopied(false);
  };

  return (
    <ToolLayout>
      <ToolHeader
        category="Developer Tools"
        number="001"
        title={
          <>
            JSON
            <span className="font-serif italic text-[#D4A84F]">
              {" "}
              Formatter.
            </span>
          </>
        }
        description="Format, validate and minify JSON instantly with a clean developer-friendly interface."
      />

      <div className="mt-10 grid gap-5 sm:mt-12 lg:mt-16 lg:grid-cols-2">
        {/* INPUT */}
        <ToolPanel
          label="Developer Tools"
          title="Input JSON"
          code="DEV / 001"
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setMode("format")
                }
                className={`rounded-lg px-4 py-2 text-xs transition ${
                  mode === "format"
                    ? "bg-[#D4A84F] text-[#090A0C]"
                    : "border border-[#29251D] text-[#777777] hover:text-[#D4A84F]"
                }`}
              >
                Format
              </button>

              <button
                type="button"
                onClick={() =>
                  setMode("minify")
                }
                className={`rounded-lg px-4 py-2 text-xs transition ${
                  mode === "minify"
                    ? "bg-[#D4A84F] text-[#090A0C]"
                    : "border border-[#29251D] text-[#777777] hover:text-[#D4A84F]"
                }`}
              >
                Minify
              </button>
            </div>

            <button
              type="button"
              onClick={loadExample}
              className="text-xs text-[#555555] transition hover:text-[#D4A84F]"
            >
              Example
            </button>
          </div>

          {/* Editor */}
          <div className="mt-5 overflow-hidden rounded-2xl border border-[#29251D] bg-[#0B0D0F]">
            <div className="flex items-center justify-between border-b border-[#202020] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#D4A84F]" />

                <span className="text-[10px] uppercase tracking-[0.2em] text-[#555555]">
                  JSON
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

                if (error) {
                  setError("");
                }
              }}
              placeholder={`Paste your JSON here...

{
  "name": "John",
  "age": 30
}`}
              spellCheck={false}
              className="min-h-[430px] w-full resize-y bg-transparent p-5 font-mono text-sm leading-7 text-[#D8D4CC] outline-none placeholder:text-[#383838]"
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

          {/* Options */}
          {mode === "format" && (
            <div className="mt-7">
              <label className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                Indentation
              </label>

              <div className="mt-3 flex gap-2">
                {[2, 4].map(
                  (value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setIndent(
                          value
                        )
                      }
                      className={`rounded-lg border px-5 py-2 text-xs transition ${
                        indent === value
                          ? "border-[#D4A84F] text-[#D4A84F]"
                          : "border-[#29251D] text-[#666666] hover:border-[#555555]"
                      }`}
                    >
                      {value} spaces
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-red-900/40 bg-red-950/20 p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-red-500">
                Invalid JSON
              </p>

              <p className="mt-2 font-mono text-sm leading-6 text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-7 flex gap-3">
            <button
              type="button"
              onClick={formatJSON}
              className="flex-1 rounded-xl bg-[#D4A84F] py-4 text-sm font-medium text-[#090A0C] transition hover:bg-[#E3BD68]"
            >
              {mode === "format"
                ? "Format JSON"
                : "Minify JSON"}
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

        {/* OUTPUT */}
        <ResultPanel
          title="Formatted JSON"
          badge={
            output
              ? mode === "format"
                ? "Formatted"
                : "Minified"
              : "Ready"
          }
        >
          {!output ? (
            <div className="flex min-h-[560px] items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#302719] font-mono text-sm text-[#8B6B32]">
                  {"{ }"}
                </div>

                <p className="mt-5 text-sm text-[#777777]">
                  Your formatted JSON will appear here.
                </p>

                <p className="mt-2 text-xs text-[#444444]">
                  Enter valid JSON and click Format.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Output toolbar */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                    Output
                  </p>

                  <p className="mt-1 text-xs text-[#444444]">
                    Valid JSON
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={copyOutput}
                    className="rounded-lg border border-[#29251D] px-4 py-2 text-xs text-[#777777] transition hover:border-[#D4A84F] hover:text-[#D4A84F]"
                  >
                    {copied
                      ? "Copied ✓"
                      : "Copy"}
                  </button>

                  <button
                    type="button"
                    onClick={downloadJSON}
                    className="rounded-lg border border-[#29251D] px-4 py-2 text-xs text-[#777777] transition hover:border-[#D4A84F] hover:text-[#D4A84F]"
                  >
                    Download
                  </button>
                </div>
              </div>

              {/* Output */}
              <div className="mt-5 overflow-hidden rounded-2xl border border-[#29251D] bg-[#0B0D0F]">
                <div className="max-h-[530px] overflow-auto p-5">
                  <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-7 text-[#D8D4CC]">
                    {output}
                  </pre>
                </div>
              </div>

              {/* Result info */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#24201B] bg-[#0D0F11] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#444444]">
                    Status
                  </p>

                  <p className="mt-2 text-sm text-[#D4A84F]">
                    Valid JSON
                  </p>
                </div>

                <div className="rounded-xl border border-[#24201B] bg-[#0D0F11] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#444444]">
                    Mode
                  </p>

                  <p className="mt-2 text-sm text-[#F5F1E8]">
                    {mode === "format"
                      ? `${indent} spaces`
                      : "Minified"}
                  </p>
                </div>
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
              Paste your raw JSON into the editor.
            </p>
          </div>

          <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
            <span className="font-mono text-xs text-[#D4A84F]">
              02
            </span>

            <h3 className="mt-4 text-lg font-light">
              Format
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Format or minify your JSON with the
              indentation you prefer.
            </p>
          </div>

          <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
            <span className="font-mono text-xs text-[#D4A84F]">
              03
            </span>

            <h3 className="mt-4 text-lg font-light">
              Copy or download
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Copy the result or save it as a JSON file.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mt-16 max-w-3xl border-t border-[#1D1D1D] pt-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4A84F]">
          About JSON Formatter
        </p>

        <p className="mt-5 text-sm leading-7 text-[#666666]">
          Format and minify JSON data directly in your
          browser. Invalid JSON is detected before the
          output is generated, helping you quickly identify
          malformed data.
        </p>
      </section>
    </ToolLayout>
  );
}

export default JSONFormatter;