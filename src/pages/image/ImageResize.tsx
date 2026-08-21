import { useRef, useState } from "react";

import ToolLayout from "../../components/tool/ToolLayout";
import ToolHeader from "../../components/tool/ToolHeader";
import ToolPanel from "../../components/tool/ToolPanel";
import ResultPanel from "../../components/tool/ResultPanel";

type ImageInfo = {
  width: number;
  height: number;
};

function ImageResize() {
  const [file, setFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [original, setOriginal] =
    useState<ImageInfo | null>(null);

  const [width, setWidth] =
    useState("");

  const [height, setHeight] =
    useState("");

  const [keepRatio, setKeepRatio] =
    useState(true);

  const [outputUrl, setOutputUrl] =
    useState("");

  const [outputSize, setOutputSize] =
    useState(0);

  const [isResizing, setIsResizing] =
    useState(false);

  const [error, setError] =
    useState("");

  const inputRef =
    useRef<HTMLInputElement>(null);

  const ratioRef =
    useRef(1);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getExtension = (imageFile: File) => {
    return (
      imageFile.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg"
    );
  };

  const getMimeType = (imageFile: File) => {
    const extension =
      getExtension(imageFile);

    if (extension === "png") {
      return "image/png";
    }

    if (extension === "webp") {
      return "image/webp";
    }

    return "image/jpeg";
  };

  const isSupportedImage = (imageFile: File) => {
    const extension =
      getExtension(imageFile);

    return [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ].includes(extension);
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

  const handleFile = async (
    imageFile: File
  ) => {
    if (!isSupportedImage(imageFile)) {
      setError(
        "Please select a JPG, PNG or WebP image."
      );

      return;
    }

    try {
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

      const image =
        await loadImage(
          imageFile
        );

      const imageWidth =
        image.naturalWidth;

      const imageHeight =
        image.naturalHeight;

      setFile(imageFile);

      setOriginal({
        width: imageWidth,
        height: imageHeight,
      });

      setWidth(
        String(imageWidth)
      );

      setHeight(
        String(imageHeight)
      );

      ratioRef.current =
        imageWidth / imageHeight;

      setPreviewUrl(
        URL.createObjectURL(
          imageFile
        )
      );

      setOutputUrl("");
      setOutputSize(0);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load this image."
      );
    }
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

  const handleWidthChange = (
    value: string
  ) => {
    setWidth(value);

    if (
      keepRatio &&
      value &&
      Number(value) > 0
    ) {
      const newWidth =
        Number(value);

      const newHeight =
        Math.round(
          newWidth /
            ratioRef.current
        );

      setHeight(
        String(newHeight)
      );
    }
  };

  const handleHeightChange = (
    value: string
  ) => {
    setHeight(value);

    if (
      keepRatio &&
      value &&
      Number(value) > 0
    ) {
      const newHeight =
        Number(value);

      const newWidth =
        Math.round(
          newHeight *
            ratioRef.current
        );

      setWidth(
        String(newWidth)
      );
    }
  };

  const applyPercentage = (
    percentage: number
  ) => {
    if (!original) {
      return;
    }

    const newWidth =
      Math.round(
        original.width *
          (percentage / 100)
      );

    const newHeight =
      Math.round(
        original.height *
          (percentage / 100)
      );

    setWidth(
      String(newWidth)
    );

    setHeight(
      String(newHeight)
    );
  };

  const resizeImage = async () => {
    if (!file || !original) {
      return;
    }

    const newWidth =
      Number(width);

    const newHeight =
      Number(height);

    if (
      !Number.isInteger(newWidth) ||
      !Number.isInteger(newHeight) ||
      newWidth <= 0 ||
      newHeight <= 0
    ) {
      setError(
        "Please enter valid width and height."
      );

      return;
    }

    if (
      newWidth > 10000 ||
      newHeight > 10000
    ) {
      setError(
        "Maximum supported dimension is 10,000 pixels."
      );

      return;
    }

    try {
      setIsResizing(true);
      setError("");

      const image =
        await loadImage(file);

      const canvas =
        document.createElement(
          "canvas"
        );

      canvas.width =
        newWidth;

      canvas.height =
        newHeight;

      const context =
        canvas.getContext("2d");

      if (!context) {
        throw new Error(
          "Canvas is not supported."
        );
      }

      /*
       * PNG/WebP may contain transparency.
       * We don't add a background here so
       * transparent pixels remain transparent.
       */
      context.drawImage(
        image,
        0,
        0,
        newWidth,
        newHeight
      );

      const mimeType =
        getMimeType(file);

      const blob =
        await new Promise<Blob | null>(
          (resolve) => {
            canvas.toBlob(
              resolve,
              mimeType,
              0.92
            );
          }
        );

      if (!blob) {
        throw new Error(
          "Unable to create resized image."
        );
      }

      if (outputUrl) {
        URL.revokeObjectURL(
          outputUrl
        );
      }

      const url =
        URL.createObjectURL(
          blob
        );

      setOutputUrl(url);
      setOutputSize(blob.size);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to resize this image."
      );
    } finally {
      setIsResizing(false);
    }
  };

  const downloadImage = () => {
    if (!outputUrl || !file) {
      return;
    }

    const extension =
      getExtension(file);

    const link =
      document.createElement("a");

    link.href =
      outputUrl;

    link.download =
      `my-toolkit-resized.${extension}`;

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

    setWidth("");
    setHeight("");

    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const resizePercentage =
    original && Number(width)
      ? (
          (Number(width) /
            original.width) *
          100
        ).toFixed(0)
      : 0;

  return (
    <ToolLayout>
      <ToolHeader
        category="Image Tools"
        number="002"
        title={
          <>
            Image
            <span className="font-serif italic text-[#D4A84F]">
              {" "}
              Resize.
            </span>
          </>
        }
        description="Resize images by entering exact dimensions or choosing a percentage while preserving the aspect ratio."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* INPUT */}
        <ToolPanel
          label="Image Tools"
          title="Resize your image"
          code="IMG / 002"
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
              {/* File information */}
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

              {/* Original dimensions */}
              <div className="mt-6 rounded-xl border border-[#24201B] bg-[#0D0F11] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                    Original Dimensions
                  </span>

                  <span className="font-mono text-sm text-[#D4A84F]">
                    {original?.width} ×{" "}
                    {original?.height}
                  </span>
                </div>
              </div>

              {/* Width */}
              <div className="mt-7">
                <label className="text-sm text-[#A0A0A0]">
                  Width
                </label>

                <div className="mt-3 flex items-center rounded-xl border border-[#29251D] bg-[#101214] transition focus-within:border-[#D4A84F]/70">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={width}
                    onChange={(event) =>
                      handleWidthChange(
                        event.target.value
                      )
                    }
                    className="w-full bg-transparent px-4 py-4 text-lg text-[#F5F1E8] outline-none"
                  />

                  <span className="pr-4 text-xs text-[#555555]">
                    px
                  </span>
                </div>
              </div>

              {/* Height */}
              <div className="mt-5">
                <label className="text-sm text-[#A0A0A0]">
                  Height
                </label>

                <div className="mt-3 flex items-center rounded-xl border border-[#29251D] bg-[#101214] transition focus-within:border-[#D4A84F]/70">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={height}
                    onChange={(event) =>
                      handleHeightChange(
                        event.target.value
                      )
                    }
                    className="w-full bg-transparent px-4 py-4 text-lg text-[#F5F1E8] outline-none"
                  />

                  <span className="pr-4 text-xs text-[#555555]">
                    px
                  </span>
                </div>
              </div>

              {/* Aspect ratio */}
              <label className="mt-5 flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={keepRatio}
                  onChange={(event) =>
                    setKeepRatio(
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 accent-[#D4A84F]"
                />

                <span className="text-sm text-[#777777]">
                  Keep aspect ratio
                </span>

                <span className="text-xs text-[#444444]">
                  🔒
                </span>
              </label>

              {/* Presets */}
              <div className="mt-7">
                <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                  Quick resize
                </p>

                <div className="mt-4 grid grid-cols-4 gap-2">
                  {[25, 50, 75, 100].map(
                    (percentage) => (
                      <button
                        key={percentage}
                        type="button"
                        onClick={() =>
                          applyPercentage(
                            percentage
                          )
                        }
                        className="rounded-lg border border-[#29251D] bg-[#101214] py-3 text-xs text-[#777777] transition hover:border-[#D4A84F] hover:text-[#D4A84F]"
                      >
                        {percentage}%
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Resize button */}
              <button
                type="button"
                disabled={
                  isResizing ||
                  !width ||
                  !height
                }
                onClick={resizeImage}
                className="mt-8 w-full rounded-xl bg-[#D4A84F] py-4 text-sm font-medium text-[#090A0C] transition hover:bg-[#E3BD68] disabled:cursor-not-allowed disabled:opacity-30"
              >
                {isResizing
                  ? "Resizing..."
                  : "Resize Image"}
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
          title="Resize result"
          badge={
            file
              ? `${resizePercentage}%`
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
                  Upload an image to start resizing.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* New dimensions */}
              <div className="rounded-2xl border border-[#D4A84F]/20 bg-[#D4A84F]/5 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8B6B32]">
                  New Dimensions
                </p>

                <p className="mt-3 text-4xl font-light text-[#F5F1E8] md:text-5xl">
                  {width} × {height}
                </p>

                <p className="mt-3 text-xs text-[#666666]">
                  pixels
                </p>
              </div>

              {/* Stats */}
              <div className="mt-7 space-y-1">
                <div className="flex justify-between border-b border-[#24201B] py-4">
                  <span className="text-sm text-[#777777]">
                    Original
                  </span>

                  <span className="text-sm text-[#F5F1E8]">
                    {original?.width} ×{" "}
                    {original?.height}
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#24201B] py-4">
                  <span className="text-sm text-[#777777]">
                    New Size
                  </span>

                  <span className="text-sm text-[#D4A84F]">
                    {width} × {height}
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#24201B] py-4">
                  <span className="text-sm text-[#777777]">
                    Original File
                  </span>

                  <span className="text-sm text-[#F5F1E8]">
                    {formatFileSize(
                      file.size
                    )}
                  </span>
                </div>

                <div className="flex justify-between py-4">
                  <span className="text-sm text-[#777777]">
                    Output File
                  </span>

                  <span className="text-sm text-[#D4A84F]">
                    {outputSize > 0
                      ? formatFileSize(
                          outputSize
                        )
                      : "Not generated"}
                  </span>
                </div>
              </div>

              {/* Preview */}
              {outputUrl && (
                <div className="mt-8 overflow-hidden rounded-2xl border border-[#29251D] bg-[#0D0F11]">
                  <div className="flex items-center justify-between border-b border-[#202020] px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                      Resized Preview
                    </p>

                    <p className="text-xs text-[#D4A84F]">
                      {width} × {height}
                    </p>
                  </div>

                  <div className="flex min-h-[220px] items-center justify-center p-5">
                    <img
                      src={outputUrl}
                      alt="Resized preview"
                      className="max-h-[300px] max-w-full rounded-lg object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Download */}
              <button
                type="button"
                disabled={!outputUrl}
                onClick={downloadImage}
                className="mt-8 w-full rounded-xl bg-[#D4A84F] py-4 text-sm font-medium text-[#090A0C] transition hover:bg-[#E3BD68] disabled:cursor-not-allowed disabled:opacity-30"
              >
                Download Resized Image
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
              Resize
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Enter exact dimensions or use one of the
              quick resize presets.
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
              Preview the resized image and download it
              instantly.
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
          Image resizing happens directly in your browser.
          Your image does not need to be uploaded to a
          server.
        </p>
      </section>
    </ToolLayout>
  );
}

export default ImageResize;