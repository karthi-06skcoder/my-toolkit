import { useRef, useState } from "react";

import ToolLayout from "../../components/tool/ToolLayout";
import ToolHeader from "../../components/tool/ToolHeader";
import ToolPanel from "../../components/tool/ToolPanel";
import ResultPanel from "../../components/tool/ResultPanel";

type BackgroundMode =
  | "white"
  | "black"
  | "custom";

type ImageInfo = {
  width: number;
  height: number;
};

function PNGToJPG() {
  const [file, setFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [outputUrl, setOutputUrl] =
    useState("");

  const [original, setOriginal] =
    useState<ImageInfo | null>(null);

  const [outputSize, setOutputSize] =
    useState(0);

  const [quality, setQuality] =
    useState(90);

  const [background, setBackground] =
    useState<BackgroundMode>("white");

  const [customColor, setCustomColor] =
    useState("#ffffff");

  const [isConverting, setIsConverting] =
    useState(false);

  const [error, setError] =
    useState("");

  const inputRef =
    useRef<HTMLInputElement>(null);

  const formatFileSize = (
    bytes: number
  ) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(2)} MB`;
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

  const convertToJPG = async (
    imageFile: File,
    selectedQuality: number,
    selectedBackground: BackgroundMode,
    selectedColor: string
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

      // JPG doesn't support transparency,
      // so paint a background first.
      if (
        selectedBackground ===
        "white"
      ) {
        context.fillStyle =
          "#ffffff";
      } else if (
        selectedBackground ===
        "black"
      ) {
        context.fillStyle =
          "#000000";
      } else {
        context.fillStyle =
          selectedColor;
      }

      context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

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
              "image/jpeg",
              selectedQuality / 100
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
        width:
          image.naturalWidth,
        height:
          image.naturalHeight,
      });
    } catch (err) {
      console.error(err);

      setError(
        "Unable to convert this PNG image."
      );
    } finally {
      setIsConverting(false);
    }
  };

  const handleFile = async (
    selectedFile: File
  ) => {
    const isPNG =
      selectedFile.type ===
        "image/png" ||
      /\.png$/i.test(
        selectedFile.name
      );

    if (!isPNG) {
      setError(
        "Please select a PNG image."
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

    await convertToJPG(
      selectedFile,
      quality,
      background,
      customColor
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

  const handleConvert = async () => {
    if (!file) {
      return;
    }

    await convertToJPG(
      file,
      quality,
      background,
      customColor
    );
  };

  const downloadJPG = () => {
    if (!outputUrl) {
      return;
    }

    const link =
      document.createElement("a");

    link.href =
      outputUrl;

    link.download =
      "my-toolkit-converted.jpg";

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
    setQuality(90);
    setBackground("white");
    setCustomColor("#ffffff");
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <ToolLayout>
      <ToolHeader
        category="Image Tools"
        number="004"
        title={
          <>
            PNG
            <span className="font-serif italic text-[#D4A84F]">
              {" "}
              → JPG.
            </span>
          </>
        }
        description="Convert PNG images to JPG with adjustable quality and a custom background for transparent images."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* INPUT */}
        <ToolPanel
          label="Image Tools"
          title="Convert your image"
          code="IMG / 004"
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
                Drop a PNG here
              </p>

              <p className="mt-2 text-xs text-[#555555]">
                or click to browse
              </p>

              <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-[#444444]">
                PNG files only
              </p>

              <input
                ref={inputRef}
                type="file"
                accept="image/png,.png"
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
                    PNG
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
                    PNG
                  </p>
                </div>

                <div className="flex min-h-[260px] items-center justify-center p-5">
                  <img
                    src={previewUrl}
                    alt="PNG preview"
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

              {/* Background */}
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-[#A0A0A0]">
                    Background
                  </label>

                  <span className="text-xs text-[#555555]">
                    JPG has no transparency
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    {
                      id: "white" as BackgroundMode,
                      label: "White",
                    },
                    {
                      id: "black" as BackgroundMode,
                      label: "Black",
                    },
                    {
                      id: "custom" as BackgroundMode,
                      label: "Custom",
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setBackground(
                          item.id
                        )
                      }
                      className={`rounded-xl border px-3 py-3 text-xs transition ${
                        background ===
                        item.id
                          ? "border-[#D4A84F] bg-[#D4A84F]/10 text-[#D4A84F]"
                          : "border-[#29251D] bg-[#101214] text-[#777777] hover:border-[#555555]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {background ===
                  "custom" && (
                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#29251D] bg-[#101214] p-3">
                    <input
                      type="color"
                      value={
                        customColor
                      }
                      onChange={(event) =>
                        setCustomColor(
                          event.target.value
                        )
                      }
                      className="h-10 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
                    />

                    <span className="font-mono text-sm text-[#777777]">
                      {customColor}
                    </span>
                  </div>
                )}
              </div>

              {/* Quality */}
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-[#A0A0A0]">
                    JPG Quality
                  </label>

                  <span className="font-mono text-xs text-[#D4A84F]">
                    {quality}%
                  </span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(event) =>
                    setQuality(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  className="mt-5 w-full accent-[#D4A84F]"
                />

                <div className="mt-2 flex justify-between text-[10px] text-[#444444]">
                  <span>Smaller</span>
                  <span>Higher Quality</span>
                </div>
              </div>

              {/* Convert */}
              <button
                type="button"
                disabled={
                  isConverting
                }
                onClick={
                  handleConvert
                }
                className="mt-8 w-full rounded-xl bg-[#D4A84F] py-4 text-sm font-medium text-[#090A0C] transition hover:bg-[#E3BD68] disabled:cursor-not-allowed disabled:opacity-30"
              >
                {isConverting
                  ? "Converting..."
                  : "Convert to JPG"}
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
              ? "JPG Ready"
              : "Ready"
          }
        >
          {!file ? (
            <div className="flex min-h-[500px] items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#302719] text-xl text-[#8B6B32]">
                  JPG
                </div>

                <p className="mt-5 text-sm text-[#777777]">
                  Upload a PNG image to convert it.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Main */}
              <div className="rounded-2xl border border-[#D4A84F]/20 bg-[#D4A84F]/5 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8B6B32]">
                  Output Format
                </p>

                <p className="mt-3 text-4xl font-light text-[#F5F1E8] md:text-5xl">
                  JPG
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
                    PNG
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#24201B] py-4">
                  <span className="text-sm text-[#777777]">
                    Output Format
                  </span>

                  <span className="text-sm text-[#D4A84F]">
                    JPG
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

                <div className="flex justify-between border-b border-[#24201B] py-4">
                  <span className="text-sm text-[#777777]">
                    JPG Size
                  </span>

                  <span className="text-sm text-[#D4A84F]">
                    {outputSize
                      ? formatFileSize(
                          outputSize
                        )
                      : "Processing..."}
                  </span>
                </div>

                <div className="flex justify-between py-4">
                  <span className="text-sm text-[#777777]">
                    Background
                  </span>

                  <span className="text-sm capitalize text-[#F5F1E8]">
                    {background}
                  </span>
                </div>
              </div>

              {/* JPG Preview */}
              {outputUrl && (
                <div className="mt-8 overflow-hidden rounded-2xl border border-[#29251D] bg-[#0D0F11]">
                  <div className="flex items-center justify-between border-b border-[#202020] px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                      JPG Preview
                    </p>

                    <p className="text-xs text-[#D4A84F]">
                      Converted
                    </p>
                  </div>

                  <div className="flex min-h-[220px] items-center justify-center p-5">
                    <img
                      src={outputUrl}
                      alt="JPG preview"
                      className="max-h-[300px] max-w-full rounded-lg object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Download */}
              <button
                type="button"
                disabled={!outputUrl}
                onClick={downloadJPG}
                className="mt-8 w-full rounded-xl bg-[#D4A84F] py-4 text-sm font-medium text-[#090A0C] transition hover:bg-[#E3BD68] disabled:cursor-not-allowed disabled:opacity-30"
              >
                Download JPG
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
              Upload PNG
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Select a PNG image from your device.
            </p>
          </div>

          <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
            <span className="font-mono text-xs text-[#D4A84F]">
              02
            </span>

            <h3 className="mt-4 text-lg font-light">
              Choose options
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Select the background and JPG quality
              before converting.
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
              Preview the result and download your JPG.
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
          PNG to JPG conversion happens directly in your
          browser. Your image does not need to be uploaded
          to a server.
        </p>
      </section>
    </ToolLayout>
  );
}

export default PNGToJPG;