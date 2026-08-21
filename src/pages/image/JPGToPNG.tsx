import { useRef, useState } from "react";

import ToolLayout from "../../components/tool/ToolLayout";
import ToolHeader from "../../components/tool/ToolHeader";
import ToolPanel from "../../components/tool/ToolPanel";
import ResultPanel from "../../components/tool/ResultPanel";

type ImageInfo = {
  width: number;
  height: number;
};

function JPGToPNG() {
  const [file, setFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [outputUrl, setOutputUrl] =
    useState("");

  const [original, setOriginal] =
    useState<ImageInfo | null>(null);

  const [outputSize, setOutputSize] =
    useState(0);

  const [isConverting, setIsConverting] =
    useState(false);

  const [error, setError] =
    useState("");

  const inputRef =
    useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const loadImage = (
    imageFile: File
  ) => {
    return new Promise<HTMLImageElement>(
      (resolve, reject) => {
        const image =
          new Image();

        const url =
          URL.createObjectURL(
            imageFile
          );

        image.onload = () => {
          URL.revokeObjectURL(url);
          resolve(image);
        };

        image.onerror = () => {
          URL.revokeObjectURL(url);

          reject(
            new Error(
              "Unable to load image."
            )
          );
        };

        image.src = url;
      }
    );
  };

  const convertToPNG = async (
    imageFile: File
  ) => {
    try {
      setIsConverting(true);
      setError("");

      const image =
        await loadImage(imageFile);

      const canvas =
        document.createElement(
          "canvas"
        );

      canvas.width =
        image.naturalWidth;

      canvas.height =
        image.naturalHeight;

      const context =
        canvas.getContext("2d");

      if (!context) {
        throw new Error(
          "Canvas is not supported."
        );
      }

      context.drawImage(
        image,
        0,
        0
      );

      const blob =
        await new Promise<Blob | null>(
          (resolve) => {
            canvas.toBlob(
              resolve,
              "image/png"
            );
          }
        );

      if (!blob) {
        throw new Error(
          "Unable to convert image."
        );
      }

      if (outputUrl) {
        URL.revokeObjectURL(
          outputUrl
        );
      }

      const url =
        URL.createObjectURL(blob);

      setOutputUrl(url);
      setOutputSize(blob.size);

      setOriginal({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    } catch (err) {
      console.error(err);

      setError(
        "Unable to convert this JPG image."
      );
    } finally {
      setIsConverting(false);
    }
  };

  const handleFile = async (
    selectedFile: File
  ) => {
    const isJPG =
      selectedFile.type ===
        "image/jpeg" ||
      /\.(jpg|jpeg)$/i.test(
        selectedFile.name
      );

    if (!isJPG) {
      setError(
        "Please select a JPG or JPEG image."
      );

      return;
    }

    setError("");

    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl
      );
    }

    if (outputUrl) {
      URL.revokeObjectURL(
        outputUrl
      );
    }

    const preview =
      URL.createObjectURL(
        selectedFile
      );

    setFile(selectedFile);
    setPreviewUrl(preview);
    setOutputUrl("");
    setOutputSize(0);

    await convertToPNG(
      selectedFile
    );
  };

  const handleFileList = (
    files: FileList | null
  ) => {
    if (
      !files ||
      files.length === 0
    ) {
      return;
    }

    handleFile(files[0]);
  };

  const downloadPNG = () => {
    if (!outputUrl) {
      return;
    }

    const link =
      document.createElement("a");

    link.href =
      outputUrl;

    link.download =
      "my-toolkit-converted.png";

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();
  };

  const clearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl
      );
    }

    if (outputUrl) {
      URL.revokeObjectURL(
        outputUrl
      );
    }

    setFile(null);
    setPreviewUrl("");
    setOutputUrl("");
    setOutputSize(0);
    setOriginal(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <ToolLayout>
      <ToolHeader
        category="Image Tools"
        number="003"
        title={
          <>
            JPG
            <span className="font-serif italic text-[#D4A84F]">
              {" "}
              → PNG.
            </span>
          </>
        }
        description="Convert JPG and JPEG images to PNG format directly in your browser without uploading your files."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* INPUT */}
        <ToolPanel
          label="Image Tools"
          title="Convert your image"
          code="IMG / 003"
        >
          {!file ? (
            <div
              onDragOver={(event) => {
                event.preventDefault();
              }}
              onDrop={(event) => {
                event.preventDefault();

                handleFileList(
                  event.dataTransfer.files
                );
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
                Drop a JPG here
              </p>

              <p className="mt-2 text-xs text-[#555555]">
                or click to browse
              </p>

              <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-[#444444]">
                JPG · JPEG
              </p>

              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,.jpg,.jpeg"
                className="hidden"
                onChange={(event) =>
                  handleFileList(
                    event.target.files
                  )
                }
              />
            </div>
          ) : (
            <>
              {/* File info */}
              <div className="rounded-2xl border border-[#29251D] bg-[#101214] p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#302719] text-xs text-[#D4A84F]">
                    JPG
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-[#F5F1E8]">
                      {file.name}
                    </p>

                    <p className="mt-1 text-xs text-[#555555]">
                      {formatFileSize(
                        file.size
                      )}
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

              {/* Preview */}
              <div className="mt-6 overflow-hidden rounded-2xl border border-[#29251D] bg-[#0D0F11]">
                <div className="flex items-center justify-between border-b border-[#202020] px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                    Original Preview
                  </p>

                  <p className="text-xs text-[#D4A84F]">
                    JPG
                  </p>
                </div>

                <div className="flex min-h-[260px] items-center justify-center p-5">
                  <img
                    src={previewUrl}
                    alt="JPG preview"
                    className="max-h-[350px] max-w-full rounded-lg object-contain"
                  />
                </div>
              </div>

              {/* Dimensions */}
              {original && (
                <div className="mt-6 rounded-xl border border-[#24201B] bg-[#0D0F11] p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                      Dimensions
                    </span>

                    <span className="font-mono text-sm text-[#D4A84F]">
                      {original.width} ×{" "}
                      {original.height}
                    </span>
                  </div>
                </div>
              )}

              {/* Convert button */}
              <button
                type="button"
                disabled={
                  isConverting
                }
                onClick={() =>
                  convertToPNG(file)
                }
                className="mt-8 w-full rounded-xl bg-[#D4A84F] py-4 text-sm font-medium text-[#090A0C] transition hover:bg-[#E3BD68] disabled:cursor-not-allowed disabled:opacity-30"
              >
                {isConverting
                  ? "Converting..."
                  : "Convert to PNG"}
              </button>
            </>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-900/40 bg-red-950/20 p-4">
              <p className="text-sm text-red-400">
                {error}
              </p>
            </div>
          )}
        </ToolPanel>

        {/* RESULT */}
        <ResultPanel
          title="Conversion result"
          badge={
            outputUrl
              ? "PNG Ready"
              : "Ready"
          }
        >
          {!file ? (
            <div className="flex min-h-[500px] items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#302719] text-xl text-[#8B6B32]">
                  PNG
                </div>

                <p className="mt-5 text-sm text-[#777777]">
                  Upload a JPG image to convert it.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Main result */}
              <div className="rounded-2xl border border-[#D4A84F]/20 bg-[#D4A84F]/5 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8B6B32]">
                  Output Format
                </p>

                <p className="mt-3 text-4xl font-light text-[#F5F1E8] md:text-5xl">
                  PNG
                </p>

                <p className="mt-3 text-xs text-[#666666]">
                  {original
                    ? `${original.width} × ${original.height} pixels`
                    : ""}
                </p>
              </div>

              {/* Stats */}
              <div className="mt-7 space-y-1">
                <div className="flex justify-between border-b border-[#24201B] py-4">
                  <span className="text-sm text-[#777777]">
                    Original Format
                  </span>

                  <span className="text-sm text-[#F5F1E8]">
                    JPG
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#24201B] py-4">
                  <span className="text-sm text-[#777777]">
                    Output Format
                  </span>

                  <span className="text-sm text-[#D4A84F]">
                    PNG
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#24201B] py-4">
                  <span className="text-sm text-[#777777]">
                    Original Size
                  </span>

                  <span className="text-sm text-[#F5F1E8]">
                    {formatFileSize(
                      file.size
                    )}
                  </span>
                </div>

                <div className="flex justify-between py-4">
                  <span className="text-sm text-[#777777]">
                    PNG Size
                  </span>

                  <span className="text-sm text-[#D4A84F]">
                    {outputSize
                      ? formatFileSize(
                          outputSize
                        )
                      : "Processing..."}
                  </span>
                </div>
              </div>

              {/* PNG Preview */}
              {outputUrl && (
                <div className="mt-8 overflow-hidden rounded-2xl border border-[#29251D] bg-[#0D0F11]">
                  <div className="flex items-center justify-between border-b border-[#202020] px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                      PNG Preview
                    </p>

                    <p className="text-xs text-[#D4A84F]">
                      Converted
                    </p>
                  </div>

                  <div className="flex min-h-[220px] items-center justify-center p-5">
                    <img
                      src={outputUrl}
                      alt="PNG preview"
                      className="max-h-[300px] max-w-full rounded-lg object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Download */}
              <button
                type="button"
                disabled={!outputUrl}
                onClick={downloadPNG}
                className="mt-8 w-full rounded-xl bg-[#D4A84F] py-4 text-sm font-medium text-[#090A0C] transition hover:bg-[#E3BD68] disabled:cursor-not-allowed disabled:opacity-30"
              >
                Download PNG
              </button>
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
              Upload JPG
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Select a JPG or JPEG image from your device.
            </p>
          </div>

          <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
            <span className="font-mono text-xs text-[#D4A84F]">
              02
            </span>

            <h3 className="mt-4 text-lg font-light">
              Convert
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              The image is converted to PNG directly in
              your browser.
            </p>
          </div>

          <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
            <span className="font-mono text-xs text-[#D4A84F]">
              03
            </span>

            <h3 className="mt-4 text-lg font-light">
              Download
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Preview the converted image and download
              your PNG file.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="mt-16 max-w-3xl border-t border-[#1D1D1D] pt-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4A84F]">
          Private by design
        </p>

        <p className="mt-5 text-sm leading-7 text-[#666666]">
          JPG to PNG conversion happens directly in your
          browser. Your image does not need to be uploaded
          to a server.
        </p>
      </section>
    </ToolLayout>
  );
}

export default JPGToPNG;