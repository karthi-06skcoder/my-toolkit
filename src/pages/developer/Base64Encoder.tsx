import { useMemo, useState } from "react";

import ToolLayout from "../../components/tool/ToolLayout";
import ToolHeader from "../../components/tool/ToolHeader";
import ToolPanel from "../../components/tool/ToolPanel";
import ResultPanel from "../../components/tool/ResultPanel";

type Mode = "encode" | "decode";

function Base64Encoder() {
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

  const encodeBase64 = (
    value: string
  ) => {
    const bytes =
      new TextEncoder().encode(
        value
      );

    let binary = "";

    const chunkSize = 0x8000;

    for (
      let i = 0;
      i < bytes.length;
      i += chunkSize
    ) {
      const chunk =
        bytes.subarray(
          i,
          i + chunkSize
        );

      binary += String.fromCharCode(
        ...chunk
      );
    }

    return btoa(binary);
  };

  const decodeBase64 = (
    value: string
  ) => {
    const normalized =
      value.replace(
        /\s/g,
        ""
      );

    if (!normalized) {
      return "";
    }

    if (
      !/^[A-Za-z0-9+/]*={0,2}$/.test(
        normalized
      )
    ) {
      throw new Error(
        "Invalid Base64 characters."
      );
    }

    if (
      normalized.length % 4 !== 0
    ) {
      throw new Error(
        "Invalid Base64 length."
      );
    }

    const binary =
      atob(normalized);

    const bytes =
      new Uint8Array(
        binary.length
      );

    for (
      let i = 0;
      i < binary.length;
      i++
    ) {
      bytes[i] =
        binary.charCodeAt(i);
    }

    return new TextDecoder(
      "utf-8",
      {
        fatal: true,
      }
    ).decode(bytes);
  };

  const processValue = () => {
    if (!input.trim()) {
      setError(
        "Please enter some input data."
      );

      setOutput("");
      return;
    }

    try {
      setError("");
      setCopied(false);

      if (mode === "encode") {
        setOutput(
          encodeBase64(input)
        );
      } else {
        setOutput(
          decodeBase64(input)
        );
      }
    } catch (err) {
      console.error(err);

      setOutput("");

      setError(
        err instanceof Error
          ? err.message
          : "Unable to process Base64 data."
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
        ? "my-toolkit-base64.txt"
        : "my-toolkit-decoded.txt";

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
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

  const swapValues = () => {
    if (!output) {
      return;
    }

    setInput(output);
    setOutput(input);

    setError("");
    setCopied(false);
  };

  const loadExample = () => {
    if (mode === "encode") {
      setInput(
        "Hello, My Toolkit! 🚀"
      );
    } else {
      setInput(
        "SGVsbG8sIE15IFRvb2xraXQg8J+agA=="
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
        number="003"
        title={
          <>
            Base64
            <span className="font-serif italic text-[#D4A84F]">
              {" "}
              Encoder.
            </span>
          </>
        }
        description="Encode text to Base64 or decode Base64 back to readable UTF-8 text instantly in your browser."
      />

      <div className="mt-10 grid gap-5 sm:mt-12 lg:mt-16 lg:grid-cols-2">
        {/* INPUT */}
        <ToolPanel
          label="Developer Tools"
          title="Base64 Input"
          code="DEV / 003"
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

          {/* Editor */}
          <div className="mt-5 overflow-hidden rounded-2xl border border-[#29251D] bg-[#0B0D0F]">
            <div className="flex items-center justify-between border-b border-[#202020] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#D4A84F]" />

                <span className="text-[10px] uppercase tracking-[0.2em] text-[#555555]">
                  {mode === "encode"
                    ? "Text Input"
                    : "Base64 Input"}
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
                  ? "Enter text to encode..."
                  : "Paste Base64 data to decode..."
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

          {/* Process */}
          <div className="mt-7 flex gap-3">
            <button
              type="button"
              onClick={processValue}
              className="flex-1 rounded-xl bg-[#D4A84F] py-4 text-sm font-medium text-[#090A0C] transition hover:bg-[#E3BD68]"
            >
              {mode === "encode"
                ? "Encode to Base64"
                : "Decode Base64"}
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
          title={
            mode === "encode"
              ? "Base64 Result"
              : "Decoded Result"
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
                  64
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
                    UTF-8
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={
                      swapValues
                    }
                    className="rounded-lg border border-[#29251D] px-4 py-2 text-xs text-[#777777] transition hover:border-[#D4A84F] hover:text-[#D4A84F]"
                  >
                    Swap
                  </button>

                  <button
                    type="button"
                    onClick={
                      copyOutput
                    }
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
                  Browser based
                </p>

                <p className="mt-3 text-sm leading-6 text-[#666666]">
                  Your data is processed locally in your
                  browser. Nothing needs to be uploaded to
                  a server.
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
              Enter data
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Enter text for encoding or Base64 data for
              decoding.
            </p>
          </div>

          <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
            <span className="font-mono text-xs text-[#D4A84F]">
              02
            </span>

            <h3 className="mt-4 text-lg font-light">
              Process
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Convert between UTF-8 text and Base64
              encoding instantly.
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
              Copy the result or save it as a text file.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mt-16 max-w-3xl border-t border-[#1D1D1D] pt-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4A84F]">
          About Base64 Encoder
        </p>

        <p className="mt-5 text-sm leading-7 text-[#666666]">
          Encode UTF-8 text into Base64 or decode Base64
          data back into readable text. Processing happens
          directly in your browser.
        </p>
      </section>
    </ToolLayout>
  );
}

export default Base64Encoder;