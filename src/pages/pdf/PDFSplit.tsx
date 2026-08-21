import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";

import ToolLayout from "../../components/tool/ToolLayout";
import ToolHeader from "../../components/tool/ToolHeader";
import ToolPanel from "../../components/tool/ToolPanel";
import ResultPanel from "../../components/tool/ResultPanel";

function PDFSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageRange, setPageRange] = useState("");
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const loadPDF = async (selectedFile: File) => {
    try {
      setError("");

      const bytes = await selectedFile.arrayBuffer();

      const pdf = await PDFDocument.load(bytes, {
        ignoreEncryption: true,
      });

      setFile(selectedFile);
      setPageCount(pdf.getPageCount());
      setSelectedPages([]);
      setPageRange("");
    } catch (err) {
      console.error(err);

      setError(
        "Unable to read this PDF. Please select a valid PDF file."
      );

      setFile(null);
      setPageCount(0);
    }
  };

  const addFile = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    const selectedFile = selectedFiles[0];

    const isPDF =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      setError("Please select a PDF file.");
      return;
    }

    loadPDF(selectedFile);
  };

  const parsePageRange = (value: string) => {
    if (!pageCount) return [];

    const pages = new Set<number>();

    const parts = value
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    for (const part of parts) {
      if (part.includes("-")) {
        const [startText, endText] =
          part.split("-").map((item) => item.trim());

        const start = Number(startText);
        const end = Number(endText);

        if (
          !Number.isInteger(start) ||
          !Number.isInteger(end) ||
          start < 1 ||
          end > pageCount ||
          start > end
        ) {
          return null;
        }

        for (let page = start; page <= end; page++) {
          pages.add(page);
        }
      } else {
        const page = Number(part);

        if (
          !Number.isInteger(page) ||
          page < 1 ||
          page > pageCount
        ) {
          return null;
        }

        pages.add(page);
      }
    }

    return Array.from(pages).sort(
      (a, b) => a - b
    );
  };

  const handleRangeChange = (
    value: string
  ) => {
    setPageRange(value);
    setError("");

    if (!value.trim()) {
      setSelectedPages([]);
      return;
    }

    const pages = parsePageRange(value);

    if (pages === null) {
      setSelectedPages([]);
      setError(
        `Invalid page range. Use values like 1-3, 5, 8-10. Maximum page is ${pageCount}.`
      );
      return;
    }

    setSelectedPages(pages);
  };

  const togglePage = (page: number) => {
    setError("");

    setSelectedPages((current) => {
      if (current.includes(page)) {
        return current.filter(
          (item) => item !== page
        );
      }

      return [...current, page].sort(
        (a, b) => a - b
      );
    });
  };

  const selectAll = () => {
    const pages = Array.from(
      { length: pageCount },
      (_, index) => index + 1
    );

    setSelectedPages(pages);

    setPageRange(
      pageCount > 0 ? `1-${pageCount}` : ""
    );
  };

  const clearSelection = () => {
    setSelectedPages([]);
    setPageRange("");
    setError("");
  };

  const splitPDF = async () => {
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    if (selectedPages.length === 0) {
      setError("Please select at least one page.");
      return;
    }

    try {
      setIsProcessing(true);
      setError("");

      const bytes = await file.arrayBuffer();

      const sourcePdf = await PDFDocument.load(
        bytes,
        {
          ignoreEncryption: true,
        }
      );

      const outputPdf =
        await PDFDocument.create();

      const pageIndexes =
        selectedPages.map((page) => page - 1);

      const pages = await outputPdf.copyPages(
        sourcePdf,
        pageIndexes
      );

      pages.forEach((page) => {
        outputPdf.addPage(page);
      });

      const outputBytes =
        await outputPdf.save();

      const blob = new Blob(
        [
          new Uint8Array(
            outputBytes
          ) as Uint8Array<ArrayBuffer>
        ],
        {
          type: "application/pdf",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        "my-toolkit-split.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to split this PDF. The document may be encrypted or unsupported."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPageCount(0);
    setSelectedPages([]);
    setPageRange("");
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <ToolLayout>
      <ToolHeader
        category="PDF Tools"
        number="002"
        title={
          <>
            PDF
            <span className="font-serif italic text-[#D4A84F]">
              {" "}
              Split.
            </span>
          </>
        }
        description="Extract selected pages from a PDF and create a new document directly in your browser."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* INPUT PANEL */}
        <ToolPanel
          label="PDF Tools"
          title="Select pages"
          code="PDF / 002"
        >
          {!file ? (
            <div
              onDragOver={(event) => {
                event.preventDefault();
              }}
              onDrop={(event) => {
                event.preventDefault();
                addFile(event.dataTransfer.files);
              }}
              onClick={() =>
                inputRef.current?.click()
              }
              className="cursor-pointer rounded-2xl border border-dashed border-[#3A3020] bg-[#101214] p-10 text-center transition hover:border-[#D4A84F]/70 hover:bg-[#131518]"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#302719] text-2xl text-[#D4A84F]">
                +
              </div>

              <p className="mt-5 text-sm text-[#F5F1E8]">
                Drop a PDF here
              </p>

              <p className="mt-2 text-xs text-[#555555]">
                or click to browse
              </p>

              <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-[#444444]">
                PDF files only
              </p>

              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(event) =>
                  addFile(event.target.files)
                }
              />
            </div>
          ) : (
            <>
              {/* File info */}
              <div className="rounded-2xl border border-[#29251D] bg-[#101214] p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#302719] text-xs text-[#D4A84F]">
                    PDF
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-[#F5F1E8]">
                      {file.name}
                    </p>

                    <p className="mt-1 text-xs text-[#555555]">
                      {pageCount} pages ·{" "}
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={clearFile}
                    className="text-xs text-[#555555] transition hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Page range */}
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-[#A0A0A0]">
                    Page Range
                  </label>

                  <span className="text-xs text-[#555555]">
                    {selectedPages.length} selected
                  </span>
                </div>

                <input
                  type="text"
                  value={pageRange}
                  onChange={(event) =>
                    handleRangeChange(
                      event.target.value
                    )
                  }
                  placeholder="Example: 1-3, 5, 8-10"
                  className="mt-3 w-full rounded-xl border border-[#29251D] bg-[#101214] px-4 py-4 text-lg text-[#F5F1E8] outline-none placeholder:text-[#444444] transition focus:border-[#D4A84F]/70"
                />

                <p className="mt-2 text-xs text-[#555555]">
                  Enter individual pages or ranges
                  separated by commas.
                </p>
              </div>

              {/* Quick actions */}
              <div className="mt-6 flex gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="rounded-lg border border-[#29251D] px-4 py-2 text-xs text-[#777777] transition hover:border-[#D4A84F] hover:text-[#D4A84F]"
                >
                  Select all
                </button>

                <button
                  type="button"
                  onClick={clearSelection}
                  className="rounded-lg border border-[#29251D] px-4 py-2 text-xs text-[#777777] transition hover:border-[#D4A84F] hover:text-[#D4A84F]"
                >
                  Clear
                </button>
              </div>

              {/* Page buttons */}
              <div className="mt-7">
                <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                  Pages
                </p>

                <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-7 md:grid-cols-8">
                  {Array.from(
                    { length: pageCount },
                    (_, index) => index + 1
                  ).map((page) => {
                    const selected =
                      selectedPages.includes(page);

                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() =>
                          togglePage(page)
                        }
                        className={`flex aspect-square items-center justify-center rounded-xl border text-sm transition ${
                          selected
                            ? "border-[#D4A84F] bg-[#D4A84F] text-[#090A0C]"
                            : "border-[#29251D] bg-[#101214] text-[#666666] hover:border-[#D4A84F]/60 hover:text-[#D4A84F]"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-900/40 bg-red-950/20 p-4">
              <p className="text-sm text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Split */}
          {file && (
            <button
              type="button"
              disabled={
                selectedPages.length === 0 ||
                isProcessing
              }
              onClick={splitPDF}
              className="mt-8 w-full rounded-xl bg-[#D4A84F] py-4 text-sm font-medium text-[#090A0C] transition hover:bg-[#E3BD68] disabled:cursor-not-allowed disabled:opacity-30"
            >
              {isProcessing
                ? "Creating PDF..."
                : "Split PDF"}
            </button>
          )}
        </ToolPanel>

        {/* RESULT PANEL */}
        <ResultPanel
          title="Split summary"
          badge={
            file
              ? `${selectedPages.length} pages`
              : "Ready"
          }
        >
          {!file ? (
            <div className="flex min-h-[470px] items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#302719] text-2xl text-[#8B6B32]">
                  PDF
                </div>

                <p className="mt-5 text-sm text-[#777777]">
                  Upload a PDF to begin.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Selected pages */}
              <div className="rounded-2xl border border-[#D4A84F]/20 bg-[#D4A84F]/5 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8B6B32]">
                  Selected Pages
                </p>

                <p className="mt-3 text-4xl font-light text-[#F5F1E8] md:text-5xl">
                  {selectedPages.length}
                </p>

                <p className="mt-2 text-xs text-[#666666]">
                  of {pageCount} total pages
                </p>
              </div>

              {/* Details */}
              <div className="mt-7 space-y-1">
                <div className="flex justify-between border-b border-[#24201B] py-4">
                  <span className="text-sm text-[#777777]">
                    Source
                  </span>

                  <span className="max-w-[180px] truncate text-sm text-[#F5F1E8]">
                    {file.name}
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#24201B] py-4">
                  <span className="text-sm text-[#777777]">
                    Total Pages
                  </span>

                  <span className="text-sm text-[#F5F1E8]">
                    {pageCount}
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#24201B] py-4">
                  <span className="text-sm text-[#777777]">
                    Selected
                  </span>

                  <span className="text-sm text-[#D4A84F]">
                    {selectedPages.length}
                  </span>
                </div>

                <div className="flex justify-between py-4">
                  <span className="text-sm text-[#777777]">
                    Output
                  </span>

                  <span className="text-sm text-[#F5F1E8]">
                    Single PDF
                  </span>
                </div>
              </div>

              {/* Selected list */}
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                  Selected Pages
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedPages.length === 0 ? (
                    <p className="text-sm text-[#555555]">
                      No pages selected.
                    </p>
                  ) : (
                    selectedPages.map((page) => (
                      <span
                        key={page}
                        className="rounded-lg border border-[#302719] bg-[#101214] px-3 py-2 text-xs text-[#D4A84F]"
                      >
                        Page {page}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Privacy */}
              <div className="mt-8 rounded-xl border border-[#24201B] bg-[#0D0F11] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#D4A84F]">
                  Private by design
                </p>

                <p className="mt-3 text-xs leading-6 text-[#666666]">
                  Your PDF is processed directly in your
                  browser. It is not uploaded to a server.
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
              Upload
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Select a PDF document from your device.
            </p>
          </div>

          <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
            <span className="font-mono text-xs text-[#D4A84F]">
              02
            </span>

            <h3 className="mt-4 text-lg font-light">
              Select pages
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Choose individual pages or enter ranges
              such as 1-3, 5, 8-10.
            </p>
          </div>

          <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
            <span className="font-mono text-xs text-[#D4A84F]">
              03
            </span>

            <h3 className="mt-4 text-lg font-light">
              Split
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Create a new PDF containing only your
              selected pages.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mt-16 max-w-3xl border-t border-[#1D1D1D] pt-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4A84F]">
          About PDF Split
        </p>

        <p className="mt-5 text-sm leading-7 text-[#666666]">
          Extract selected pages from an existing PDF and
          create a separate document without uploading the
          original file to a server.
        </p>
      </section>
    </ToolLayout>
  );
}

export default PDFSplit;