import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";

import ToolLayout from "../../components/tool/ToolLayout";
import ToolHeader from "../../components/tool/ToolHeader";
import ToolPanel from "../../components/tool/ToolPanel";
import ResultPanel from "../../components/tool/ResultPanel";

type PDFFile = {
  id: string;
  file: File;
};

function PDFMerge() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    setError("");

    const pdfFiles = Array.from(selectedFiles)
      .filter(
        (file) =>
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf")
      )
      .map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
        file,
      }));

    setFiles((current) => [
      ...current,
      ...pdfFiles,
    ]);
  };

  const removeFile = (id: string) => {
    setFiles((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const moveFile = (
    index: number,
    direction: "up" | "down"
  ) => {
    setFiles((current) => {
      const newFiles = [...current];

      const newIndex =
        direction === "up"
          ? index - 1
          : index + 1;

      if (
        newIndex < 0 ||
        newIndex >= newFiles.length
      ) {
        return current;
      }

      [
        newFiles[index],
        newFiles[newIndex],
      ] = [
        newFiles[newIndex],
        newFiles[index],
      ];

      return newFiles;
    });
  };

  const clearFiles = () => {
    setFiles([]);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const totalSize = files.reduce(
    (total, item) => total + item.file.size,
    0
  );

  const mergePDFs = async () => {
    if (files.length < 2) {
      setError("Please select at least 2 PDF files.");
      return;
    }

    try {
      setIsMerging(true);
      setError("");

      const mergedPdf =
        await PDFDocument.create();

      for (const item of files) {
        const fileBytes =
          await item.file.arrayBuffer();

        const pdf = await PDFDocument.load(fileBytes, {
            ignoreEncryption: true,
        });

        const pages =
          await mergedPdf.copyPages(
            pdf,
            pdf.getPageIndices()
          );

        pages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      const mergedBytes =
        await mergedPdf.save();

      const blob = new Blob(
        [
          new Uint8Array(
            mergedBytes
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
      link.download = "my-toolkit-merged.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to merge these PDF files. Please make sure they are valid PDF documents."
      );
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <ToolLayout>
      <ToolHeader
        category="PDF Tools"
        number="001"
        title={
          <>
            PDF
            <span className="font-serif italic text-[#D4A84F]">
              {" "}
              Merge.
            </span>
          </>
        }
        description="Combine multiple PDF documents into one file directly in your browser. Your files stay on your device."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* FILE INPUT */}
        <ToolPanel
          label="PDF Tools"
          title="Add your files"
          code="PDF / 001"
        >
          {/* Drop zone */}
          <div
            onDragOver={(event) => {
              event.preventDefault();
            }}
            onDrop={(event) => {
              event.preventDefault();
              addFiles(event.dataTransfer.files);
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
              Drop PDF files here
            </p>

            <p className="mt-2 text-xs text-[#555555]">
              or click to browse from your device
            </p>

            <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-[#444444]">
              PDF files only
            </p>

            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              multiple
              className="hidden"
              onChange={(event) =>
                addFiles(event.target.files)
              }
            />
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between border-b border-[#202020] pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                    Selected Files
                  </p>

                  <p className="mt-1 text-sm text-[#777777]">
                    {files.length} file
                    {files.length !== 1
                      ? "s"
                      : ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearFiles}
                  className="text-xs text-[#666666] transition hover:text-[#D4A84F]"
                >
                  Clear all
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {files.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-[#29251D] bg-[#101214] p-3"
                  >
                    {/* Number */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#302719] text-xs text-[#D4A84F]">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    {/* File */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-[#F5F1E8]">
                        {item.file.name}
                      </p>

                      <p className="mt-1 text-xs text-[#555555]">
                        {formatFileSize(
                          item.file.size
                        )}
                      </p>
                    </div>

                    {/* Move */}
                    <div className="hidden gap-1 sm:flex">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() =>
                          moveFile(
                            index,
                            "up"
                          )
                        }
                        className="rounded-lg border border-[#29251D] px-2 py-1 text-xs text-[#666666] transition hover:border-[#D4A84F] hover:text-[#D4A84F] disabled:cursor-not-allowed disabled:opacity-20"
                      >
                        ↑
                      </button>

                      <button
                        type="button"
                        disabled={
                          index ===
                          files.length - 1
                        }
                        onClick={() =>
                          moveFile(
                            index,
                            "down"
                          )
                        }
                        className="rounded-lg border border-[#29251D] px-2 py-1 text-xs text-[#666666] transition hover:border-[#D4A84F] hover:text-[#D4A84F] disabled:cursor-not-allowed disabled:opacity-20"
                      >
                        ↓
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() =>
                        removeFile(item.id)
                      }
                      className="rounded-lg px-2 py-1 text-sm text-[#555555] transition hover:text-red-400"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-900/40 bg-red-950/20 p-4">
              <p className="text-sm text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Merge */}
          <button
            type="button"
            disabled={
              files.length < 2 ||
              isMerging
            }
            onClick={mergePDFs}
            className="mt-8 w-full rounded-xl bg-[#D4A84F] py-4 text-sm font-medium text-[#090A0C] transition hover:bg-[#E3BD68] disabled:cursor-not-allowed disabled:opacity-30"
          >
            {isMerging
              ? "Merging PDFs..."
              : "Merge PDFs"}
          </button>
        </ToolPanel>

        {/* INFO PANEL */}
        <ResultPanel
          title="Merge summary"
          badge={
            files.length > 0
              ? `${files.length} files`
              : "Ready"
          }
        >
          {files.length === 0 ? (
            <div className="flex min-h-[450px] items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#302719] text-2xl text-[#8B6B32]">
                  PDF
                </div>

                <p className="mt-5 text-sm text-[#777777]">
                  Add PDF files to start merging.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* File count */}
              <div className="rounded-2xl border border-[#D4A84F]/20 bg-[#D4A84F]/5 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8B6B32]">
                  Files Ready
                </p>

                <p className="mt-3 text-4xl font-light text-[#F5F1E8] md:text-5xl">
                  {files.length}
                </p>

                <p className="mt-2 text-xs text-[#666666]">
                  PDF documents selected
                </p>
              </div>

              {/* Stats */}
              <div className="mt-7 space-y-1">
                <div className="flex justify-between border-b border-[#24201B] py-4">
                  <span className="text-sm text-[#777777]">
                    Total Files
                  </span>

                  <span className="text-sm text-[#F5F1E8]">
                    {files.length}
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#24201B] py-4">
                  <span className="text-sm text-[#777777]">
                    Total Size
                  </span>

                  <span className="text-sm text-[#D4A84F]">
                    {formatFileSize(totalSize)}
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

              {/* Privacy */}
              <div className="mt-8 rounded-xl border border-[#24201B] bg-[#0D0F11] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#D4A84F]">
                  Private by design
                </p>

                <p className="mt-3 text-xs leading-6 text-[#666666]">
                  Your PDF files are processed directly
                  in your browser. They are not uploaded
                  to a server.
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
              Add PDFs
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Select or drag multiple PDF documents
              into the tool.
            </p>
          </div>

          <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
            <span className="font-mono text-xs text-[#D4A84F]">
              02
            </span>

            <h3 className="mt-4 text-lg font-light">
              Arrange
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Change the order of your files before
              merging them.
            </p>
          </div>

          <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
            <span className="font-mono text-xs text-[#D4A84F]">
              03
            </span>

            <h3 className="mt-4 text-lg font-light">
              Merge
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Create and download one combined PDF
              instantly.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mt-16 max-w-3xl border-t border-[#1D1D1D] pt-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4A84F]">
          About PDF Merge
        </p>

        <p className="mt-5 text-sm leading-7 text-[#666666]">
          Combine multiple PDF files into a single
          document without uploading your files to a
          server. The merging process happens locally
          inside your browser.
        </p>
      </section>
    </ToolLayout>
  );
}

export default PDFMerge;