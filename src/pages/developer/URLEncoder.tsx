import { useMemo, useState } from "react";

import ToolLayout from "../../components/tool/ToolLayout";
import ToolHeader from "../../components/tool/ToolHeader";
import ToolPanel from "../../components/tool/ToolPanel";
import ResultPanel from "../../components/tool/ResultPanel";

type Mode = "encode" | "decode";

function URLEncoder() {
  const [mode, setMode] =
    useState<Mode>("encode");

  const [input, setInput] =
    useState("");

  const [output, setOutput] =
    useState("");

  const [error, setError] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  const inputCharacters =
    input.length;

  const outputCharacters =
    output.length;

  const inputBytes = useMemo(() => {
    return new TextEncoder().encode(
      input
    ).length;
  }, [input]);

  const outputBytes = useMemo(() => {
    return new TextEncoder().encode(
      output
    ).length;
  }, [output]);

  const processValue = () => {
    if (!input.trim()) {
      setError(
        "Please enter a URL or text."
      );

      setOutput("");
      return;
    }

    try {
      let result = "";

      if (mode === "encode") {
        result =
          encodeURIComponent(input);
      } else {
        result =
          decodeURIComponent(input);
      }

      setOutput(result);
      setError("");
      setCopied(false);
    } catch (err) {
      console.error(err);

      setOutput("");

      setError(
        err instanceof Error
          ? err.message
          : "Unable to process URL data."
      );
    }
  };

  const copyOutput = async () => {
    if (!output) {
      return;
    }

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
        "Unable to copy the result."
      );
    }
  };

  const downloadOutput = () => {
    if (!output) {
      return;
    }

    const blob = new Blob(
      [output],
      {
        type: "text/plain;charset=utf-8",
      }
    );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      mode === "encode"
        ? "my-toolkit-encoded-url.txt"
        : "my-toolkit-decoded-url.txt";

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  };

  const swapValues = () => {
    if (!output) {
      return;
    }

    setInput(output);
    setOutput(input);
    setError("");
    setCopied(false);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  };

  const switchMode = (
    newMode: Mode
  ) => {
    setMode(newMode);
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  };

  const loadExample = () => {
    if (mode === "encode") {
      setInput(
        "https://example.com/search?q=hello world&name=Karthi"
      );
    } else {
      setInput(
        "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26name%3DKarthi"
      );
    }

    setOutput("");
    setError("");
    setCopied(false);
  };

  return (
    <ToolLayout>
      <ToolHeader
        category="Developer Tools"
        number="004"
        title={
          <>
            URL
            <span className="font-serif italic text-[#D4A84F]">
              {" "}
              Encoder.
            </span>
          </>
        }
        description="Encode URLs and text safely for use in query parameters, links and web applications."
      />

      <div className="mt-10 grid gap-5 sm:mt-12 lg:mt-16 lg:grid-cols-2">
        {/* INPUT */}
        <ToolPanel
          label="Developer Tools"
          title="URL Input"
          code="DEV / 004"
        >
          {/* Mode */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                switchMode("encode")
              }
              className={`rounded-xl border py-3 text-xs transition ${
                mode === "encode"
                  ? "border-[#D4A84F] bg-[#D4A84F]/10 text-[#D4A84F]"
                  : "border-[#29251D] bg-[#101214] text-[#666666] hover:text-[#D4A84F]"
              }`}
            >
              Encode
            </button>

            <button
              type="button"
              onClick={() =>
                switchMode("decode")
              }
              className={`rounded-xl border py-3 text-xs transition ${
                mode === "decode"
                  ? "border-[#D4A84F] bg-[#D4A84F]/10 text-[#D4A84F]"
                  : "border-[#29251D] bg-[#101214] text-[#666666] hover:text-[#D4A84F]"
              }`}
            >
              Decode
            </button>
          </div>

          {/* Input editor */}
          <div className="mt-5 overflow-hidden rounded-2xl border border-[#29251D] bg-[#0B0D0F]">
            <div className="flex items-center justify-between border-b border-[#202020] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#D4A84F]" />

                <span className="text-[10px] uppercase tracking-[0.2em] text-[#555555]">
                  {mode === "encode"
                    ? "URL / Text"
                    : "Encoded URL"}
                </span>
              </div>

              <button
                type="button"
                onClick={loadExample}
                className="text-[10px] uppercase tracking-[0.15em] text-[#444444] transition hover:text-[#D4A84F]"
              >
                Example
              </button>
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
              placeholder={
                mode === "encode"
                  ? "Enter URL or text..."
                  : "Paste encoded URL..."
              }
              spellCheck={false}
              className="min-h-[400px] w-full resize-y bg-transparent p-5 font-mono text-sm leading-7 text-[#D8D4CC] outline-none placeholder:text-[#383838]"
            />
          </div>

          {/* Stats */}
          <div className="mt-4 flex flex-wrap gap-5 text-[10px] uppercase tracking-[0.15em] text-[#444444]">
            <span>
              Characters:{" "}
              <span className="text-[#777777]">
                {inputCharacters}
              </span>
            </span>

            <span>
              Bytes:{" "}
              <span className="text-[#777777]">
                {inputBytes}
              </span>
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-900/40 bg-red-950/20 p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-red-500">
                Error
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
              onClick={processValue}
              className="flex-1 rounded-xl bg-[#D4A84F] py-4 text-sm font-medium text-[#090A0C] transition hover:bg-[#E3BD68]"
            >
              {mode === "encode"
                ? "Encode URL"
                : "Decode URL"}
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
          title={
            mode === "encode"
              ? "Encoded URL"
              : "Decoded URL"
          }
          badge={
            output
              ? "Complete"
              : "Ready"
          }
        >
          {!output ? (
            <div className="flex min-h-[540px] items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#302719] font-mono text-sm text-[#8B6B32]">
                  URL
                </div>

                <p className="mt-5 text-sm text-[#777777]">
                  Your result will appear here.
                </p>

                <p className="mt-2 text-xs text-[#444444]">
                  Enter data and click{" "}
                  {mode === "encode"
                    ? "Encode"
                    : "Decode"}.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                    Output
                  </p>

                  <p className="mt-1 text-xs text-[#444444]">
                    URI Component
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={swapValues}
                    className="rounded-lg border border-[#29251D] px-4 py-2 text-xs text-[#777777] transition hover:border-[#D4A84F] hover:text-[#D4A84F]"
                  >
                    Swap
                  </button>

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
                    onClick={
                      downloadOutput
                    }
                    className="rounded-lg border border-[#29251D] px-4 py-2 text-xs text-[#777777] transition hover:border-[#D4A84F] hover:text-[#D4A84F]"
                  >
                    Download
                  </button>
                </div>
              </div>

              {/* Output */}
              <div className="mt-5 overflow-hidden rounded-2xl border border-[#29251D] bg-[#0B0D0F]">
                <div className="max-h-[500px] overflow-auto p-5">
                  <pre className="whitespace-pre-wrap break-all font-mono text-sm leading-7 text-[#D8D4CC]">
                    {output}
                  </pre>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#24201B] bg-[#0D0F11] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#444444]">
                    Characters
                  </p>

                  <p className="mt-2 text-sm text-[#D4A84F]">
                    {outputCharacters}
                  </p>
                </div>

                <div className="rounded-xl border border-[#24201B] bg-[#0D0F11] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#444444]">
                    Bytes
                  </p>

                  <p className="mt-2 text-sm text-[#D4A84F]">
                    {outputBytes}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="mt-8 rounded-xl border border-[#24201B] bg-[#0D0F11] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#D4A84F]">
                  URI Component Encoding
                </p>

                <p className="mt-3 text-sm leading-6 text-[#666666]">
                  Special characters such as spaces, &, ?, #,
                  and non-English characters are safely encoded
                  for use inside URLs.
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
              Enter URL
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Enter a URL, query parameter or text containing
              special characters.
            </p>
          </div>

          <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
            <span className="font-mono text-xs text-[#D4A84F]">
              02
            </span>

            <h3 className="mt-4 text-lg font-light">
              Encode or decode
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Convert the data using standard URI component
              encoding.
            </p>
          </div>

          <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
            <span className="font-mono text-xs text-[#D4A84F]">
              03
            </span>

            <h3 className="mt-4 text-lg font-light">
              Copy the result
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Copy the encoded or decoded value for use in
              your application.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mt-16 max-w-3xl border-t border-[#1D1D1D] pt-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4A84F]">
          About URL Encoder
        </p>

        <p className="mt-5 text-sm leading-7 text-[#666666]">
          Encode and decode URL components directly in your
          browser. This is useful when working with query
          parameters, API URLs and web applications.
        </p>
      </section>
    </ToolLayout>
  );
}

export default URLEncoder;