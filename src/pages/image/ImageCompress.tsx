import { useEffect, useRef, useState } from "react";

import ToolLayout from "../../components/tool/ToolLayout";
import ToolHeader from "../../components/tool/ToolHeader";
import ToolPanel from "../../components/tool/ToolPanel";
import ResultPanel from "../../components/tool/ResultPanel";

function ImageCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] =
    useState("");

  const [compressedUrl, setCompressedUrl] =
    useState("");

  const [compressedSize, setCompressedSize] =
    useState(0);

  const [quality, setQuality] =
    useState(80);

  const [isCompressing, setIsCompressing] =
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

  const getExtension = (file: File) => {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase();

    return extension || "jpg";
  };

  const getMimeType = (file: File) => {
    const extension = getExtension(file);

    if (
      extension === "png"
    ) {
      return "image/png";
    }

    if (
      extension === "webp"
    ) {
      return "image/webp";
    }

    return "image/jpeg";
  };

  const validateFile = (selectedFile: File) => {
    const extension =
      getExtension(selectedFile);

    const supported = [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ];

    return (
      selectedFile.type.startsWith("image/") &&
      supported.includes(extension)
    );
  };

  const compressImage = (
    selectedFile: File,
    selectedQuality: number
  ) => {
    return new Promise<Blob>(
      (resolve, reject) => {
        const image =
          new Image();

        const objectUrl =
          URL.createObjectURL(
            selectedFile
          );

        image.onload = () => {
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
            URL.revokeObjectURL(
              objectUrl
            );

            reject(
              new Error(
                "Canvas is not supported."
              )
            );

            return;
          }

          context.drawImage(
            image,
            0,
            0
          );

          const mimeType =
            getMimeType(
              selectedFile
            );

          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(
                objectUrl
              );

              if (!blob) {
                reject(
                  new Error(
                    "Unable to compress image."
                  )
                );

                return;
              }

              resolve(blob);
            },
            mimeType,
            selectedQuality / 100
          );
        };

        image.onerror = () => {
          URL.revokeObjectURL(
            objectUrl
          );

          reject(
            new Error(
              "Unable to load image."
            )
          );
        };

        image.src =
          objectUrl;
      }
    );
  };

  const generateCompression =
    async (
      selectedFile: File,
      selectedQuality: number
    ) => {
      try {
        setIsCompressing(true);
        setError("");

        const blob =
          await compressImage(
            selectedFile,
            selectedQuality
          );

        const url =
          URL.createObjectURL(blob);

        setCompressedUrl(url);
        setCompressedSize(
          blob.size
        );
      } catch (err) {
        console.error(err);

        setError(
          "Unable to compress this image."
        );
      } finally {
        setIsCompressing(false);
      }
    };

  const handleFile = async (
    selectedFile: File
  ) => {
    if (!validateFile(selectedFile)) {
      setError(
        "Please select a JPG, PNG or WebP image."
      );

      return;
    }

    setError("");

    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl
      );
    }

    if (compressedUrl) {
      URL.revokeObjectURL(
        compressedUrl
      );
    }

    const url =
      URL.createObjectURL(
        selectedFile
      );

    setFile(selectedFile);
    setPreviewUrl(url);
    setCompressedUrl("");
    setCompressedSize(0);

    await generateCompression(
      selectedFile,
      quality
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

  useEffect(() => {
    if (!file) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        generateCompression(
          file,
          quality
        );
      }, 150);

    return () =>
      window.clearTimeout(timer);
  }, [quality]);

  const downloadImage = () => {
    if (!compressedUrl || !file) {
      return;
    }

    const extension =
      getExtension(file);

    const link =
      document.createElement("a");

    link.href =
      compressedUrl;

    link.download =
      `my-toolkit-compressed.${extension}`;

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

    if (compressedUrl) {
      URL.revokeObjectURL(
        compressedUrl
      );
    }

    setFile(null);
    setPreviewUrl("");
    setCompressedUrl("");
    setCompressedSize(0);
    setQuality(80);
    setError("");

    if (inputRef.current) {
      inputRef.current.value =
        "";
    }
  };

  const savedBytes =
    file && compressedSize
      ? file.size -
        compressedSize
      : 0;

  const savedPercentage =
    file && file.size > 0
      ? Math.max(
          0,
          (savedBytes / file.size) *
            100
        )
      : 0;

  return (
    <ToolLayout>
      <ToolHeader
        category="Image Tools"
        number="001"
        title={
          <>
            Image
            <span className="font-serif italic text-[#D4A84F]">
              {" "}
              Compress.
            </span>
          </>
        }
        description="Reduce image file size while keeping the best possible visual quality. Your image stays on your device."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* INPUT */}
        <ToolPanel
          label="Image Tools"
          title="Compress your image"
          code="IMG / 001"
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
                Drop an image here
              </p>

              <p className="mt-2 text-xs text-[#555555]">
                or click to browse
              </p>

              <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-[#444444]">
                JPG · PNG · WebP
              </p>

              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
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
              {/* File */}
              <div className="rounded-2xl border border-[#29251D] bg-[#101214] p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#302719] text-xs text-[#D4A84F]">
                    IMG
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
                    Preview
                  </p>

                  <p className="text-xs text-[#555555]">
                    Original
                  </p>
                </div>

                <div className="flex min-h-[250px] items-center justify-center p-5">
                  <img
                    src={previewUrl}
                    alt="Original preview"
                    className="max-h-[350px] max-w-full rounded-lg object-contain"
                  />
                </div>
              </div>

              {/* Quality */}
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-[#A0A0A0]">
                    Compression Quality
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
                  <span>Better Quality</span>
                </div>
              </div>
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
          title="Compression result"
          badge={
            file
              ? `${quality}% quality`
              : "Ready"
          }
        >
          {!file ? (
            <div className="flex min-h-[500px] items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#302719] text-2xl text-[#8B6B32]">
                  IMG
                </div>

                <p className="mt-5 text-sm text-[#777777]">
                  Upload an image to start compressing.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Size */}
              <div className="rounded-2xl border border-[#D4A84F]/20 bg-[#D4A84F]/5 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8B6B32]">
                  New File Size
                </p>

                <p className="mt-3 text-4xl font-light text-[#F5F1E8] md:text-5xl">
                  {isCompressing
                    ? "..."
                    : formatFileSize(
                        compressedSize
                      )}
                </p>

                {!isCompressing &&
                  compressedSize > 0 && (
                    <p className="mt-3 text-xs text-[#D4A84F]">
                      {savedPercentage.toFixed(
                        1
                      )}
                      % smaller
                    </p>
                  )}
              </div>

              {/* Stats */}
              <div className="mt-7 space-y-1">
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
                    Compressed Size
                  </span>

                  <span className="text-sm text-[#D4A84F]">
                    {isCompressing
                      ? "Processing..."
                      : formatFileSize(
                          compressedSize
                        )}
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#24201B] py-4">
                  <span className="text-sm text-[#777777]">
                    Space Saved
                  </span>

                  <span className="text-sm text-[#F5F1E8]">
                    {isCompressing
                      ? "..."
                      : formatFileSize(
                          Math.max(
                            savedBytes,
                            0
                          )
                        )}
                  </span>
                </div>

                <div className="flex justify-between py-4">
                  <span className="text-sm text-[#777777]">
                    Quality
                  </span>

                  <span className="text-sm text-[#F5F1E8]">
                    {quality}%
                  </span>
                </div>
              </div>

              {/* Compressed preview */}
              {compressedUrl &&
                !isCompressing && (
                  <div className="mt-8 overflow-hidden rounded-2xl border border-[#29251D] bg-[#0D0F11]">
                    <div className="flex items-center justify-between border-b border-[#202020] px-5 py-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                        Preview
                      </p>

                      <p className="text-xs text-[#D4A84F]">
                        Compressed
                      </p>
                    </div>

                    <div className="flex min-h-[220px] items-center justify-center p-5">
                      <img
                        src={compressedUrl}
                        alt="Compressed preview"
                        className="max-h-[300px] max-w-full rounded-lg object-contain"
                      />
                    </div>
                  </div>
                )}

              {/* Download */}
              <button
                type="button"
                disabled={
                  !compressedUrl ||
                  isCompressing
                }
                onClick={
                  downloadImage
                }
                className="mt-8 w-full rounded-xl bg-[#D4A84F] py-4 text-sm font-medium text-[#090A0C] transition hover:bg-[#E3BD68] disabled:cursor-not-allowed disabled:opacity-30"
              >
                Download Compressed Image
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
              Upload
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Choose a JPG, PNG or WebP image from your
              device.
            </p>
          </div>

          <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
            <span className="font-mono text-xs text-[#D4A84F]">
              02
            </span>

            <h3 className="mt-4 text-lg font-light">
              Adjust
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Move the quality slider to balance image
              quality and file size.
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
              Compare the result and download your
              compressed image.
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
          Image compression happens directly in your
          browser. Your image does not need to be uploaded
          to a server, making this tool suitable for
          processing private images.
        </p>
      </section>
    </ToolLayout>
  );
}

export default ImageCompress;