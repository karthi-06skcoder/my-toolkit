import { useMemo, useState } from "react";

import ToolLayout from "../../components/tool/ToolLayout";
import ToolHeader from "../../components/tool/ToolHeader";
import ToolPanel from "../../components/tool/ToolPanel";
import ResultPanel from "../../components/tool/ResultPanel";

type PasswordItem = {
  id: number;
  password: string;
};

function PasswordGenerator() {
  const [length, setLength] =
    useState(16);

  const [includeUppercase, setIncludeUppercase] =
    useState(true);

  const [includeLowercase, setIncludeLowercase] =
    useState(true);

  const [includeNumbers, setIncludeNumbers] =
    useState(true);

  const [includeSymbols, setIncludeSymbols] =
    useState(true);

  const [excludeSimilar, setExcludeSimilar] =
    useState(false);

  const [passwordCount, setPasswordCount] =
    useState(5);

  const [passwords, setPasswords] =
    useState<PasswordItem[]>([]);

  const [copiedId, setCopiedId] =
    useState<number | null>(null);

  const [error, setError] =
    useState("");

  const uppercase =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const lowercase =
    "abcdefghijklmnopqrstuvwxyz";

  const numbers =
    "0123456789";

  const symbols =
    "!@#$%^&*()_+-=[]{}<>?";

  const similarCharacters =
    /[0OoIl1]/g;

  const characterPool = useMemo(() => {
    let pool = "";

    if (includeUppercase) {
      pool += uppercase;
    }

    if (includeLowercase) {
      pool += lowercase;
    }

    if (includeNumbers) {
      pool += numbers;
    }

    if (includeSymbols) {
      pool += symbols;
    }

    if (excludeSimilar) {
      pool = pool.replace(
        similarCharacters,
        ""
      );
    }

    return pool;
  }, [
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeSimilar,
  ]);

  const generateRandomPassword = () => {
    if (!characterPool.length) {
      return "";
    }

    const values =
      new Uint32Array(length);

    crypto.getRandomValues(values);

    let password = "";

    for (let i = 0; i < length; i++) {
      password +=
        characterPool[
          values[i] %
            characterPool.length
        ];
    }

    return password;
  };

  const calculateStrength = (
    password: string
  ) => {
    let score = 0;

    if (password.length >= 8) {
      score += 20;
    }

    if (password.length >= 12) {
      score += 20;
    }

    if (password.length >= 16) {
      score += 10;
    }

    if (/[A-Z]/.test(password)) {
      score += 15;
    }

    if (/[a-z]/.test(password)) {
      score += 10;
    }

    if (/[0-9]/.test(password)) {
      score += 10;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 15;
    }

    return Math.min(score, 100);
  };

  const getStrength = (
    password: string
  ) => {
    const score =
      calculateStrength(password);

    if (score < 40) {
      return {
        label: "Weak",
        score,
      };
    }

    if (score < 75) {
      return {
        label: "Medium",
        score,
      };
    }

    return {
      label: "Strong",
      score,
    };
  };

  const calculateEntropy = () => {
    if (!characterPool.length) {
      return 0;
    }

    return Math.round(
      length *
        Math.log2(
          characterPool.length
        )
    );
  };

  const generatePasswords = () => {
    setError("");
    setCopiedId(null);

    if (!characterPool.length) {
      setPasswords([]);

      setError(
        "Select at least one character type."
      );

      return;
    }

    if (length < 4 || length > 64) {
      setError(
        "Password length must be between 4 and 64."
      );

      return;
    }

    if (
      passwordCount < 1 ||
      passwordCount > 10
    ) {
      setError(
        "Password count must be between 1 and 10."
      );

      return;
    }

    const generated: PasswordItem[] =
      [];

    for (
      let i = 0;
      i < passwordCount;
      i++
    ) {
      generated.push({
        id:
          Date.now() + i,
        password:
          generateRandomPassword(),
      });
    }

    setPasswords(generated);
  };

  const regeneratePassword = (
    id: number
  ) => {
    if (!characterPool.length) {
      setError(
        "Select at least one character type."
      );

      return;
    }

    setPasswords((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              password:
                generateRandomPassword(),
            }
          : item
      )
    );

    setCopiedId(null);
  };

  const copyPassword = async (
    password: string,
    id: number
  ) => {
    try {
      await navigator.clipboard.writeText(
        password
      );

      setCopiedId(id);

      window.setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to copy password."
      );
    }
  };

  const copyAllPasswords = async () => {
    if (!passwords.length) {
      return;
    }

    try {
      const text =
        passwords
          .map(
            (item) => item.password
          )
          .join("\n");

      await navigator.clipboard.writeText(
        text
      );

      setCopiedId(-1);

      window.setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to copy passwords."
      );
    }
  };

  const downloadPasswords = () => {
    if (!passwords.length) {
      return;
    }

    const text =
      passwords
        .map(
          (item) => item.password
        )
        .join("\n");

    const blob = new Blob(
      [text],
      {
        type: "text/plain;charset=utf-8",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "my-toolkit-passwords.txt";

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setPasswords([]);
    setError("");
    setCopiedId(null);
  };

  const strength =
    passwords.length
      ? getStrength(
          passwords[0].password
        )
      : null;

  const entropy =
    calculateEntropy();

  return (
    <ToolLayout>
      <ToolHeader
        category="Developer Tools"
        number="005"
        title={
          <>
            Password
            <span className="font-serif italic text-[#D4A84F]">
              {" "}
              Generator.
            </span>
          </>
        }
        description="Generate strong, secure and customizable passwords directly in your browser."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* LEFT PANEL */}
        <ToolPanel
          label="Developer Tools"
          title="Password settings"
          code="DEV / 005"
        >
          {/* Length */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#A0A0A0]">
                Password Length
              </label>

              <span className="font-mono text-sm text-[#D4A84F]">
                {length}
              </span>
            </div>

            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(event) =>
                setLength(
                  Number(
                    event.target.value
                  )
                )
              }
              className="mt-5 w-full accent-[#D4A84F]"
            />

            <div className="mt-2 flex justify-between text-[10px] text-[#444444]">
              <span>4</span>
              <span>32</span>
              <span>64</span>
            </div>
          </div>

          {/* Character options */}
          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
              Character Types
            </p>

            <div className="mt-4 space-y-2">
              {/* Uppercase */}
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#29251D] bg-[#101214] p-4 transition hover:border-[#3B3326]">
                <div>
                  <p className="text-sm text-[#F5F1E8]">
                    Uppercase
                  </p>

                  <p className="mt-1 font-mono text-xs text-[#444444]">
                    A-Z
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={
                    includeUppercase
                  }
                  onChange={(event) =>
                    setIncludeUppercase(
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 accent-[#D4A84F]"
                />
              </label>

              {/* Lowercase */}
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#29251D] bg-[#101214] p-4 transition hover:border-[#3B3326]">
                <div>
                  <p className="text-sm text-[#F5F1E8]">
                    Lowercase
                  </p>

                  <p className="mt-1 font-mono text-xs text-[#444444]">
                    a-z
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={
                    includeLowercase
                  }
                  onChange={(event) =>
                    setIncludeLowercase(
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 accent-[#D4A84F]"
                />
              </label>

              {/* Numbers */}
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#29251D] bg-[#101214] p-4 transition hover:border-[#3B3326]">
                <div>
                  <p className="text-sm text-[#F5F1E8]">
                    Numbers
                  </p>

                  <p className="mt-1 font-mono text-xs text-[#444444]">
                    0-9
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={
                    includeNumbers
                  }
                  onChange={(event) =>
                    setIncludeNumbers(
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 accent-[#D4A84F]"
                />
              </label>

              {/* Symbols */}
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#29251D] bg-[#101214] p-4 transition hover:border-[#3B3326]">
                <div>
                  <p className="text-sm text-[#F5F1E8]">
                    Symbols
                  </p>

                  <p className="mt-1 font-mono text-xs text-[#444444]">
                    ! @ # $ %
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={
                    includeSymbols
                  }
                  onChange={(event) =>
                    setIncludeSymbols(
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 accent-[#D4A84F]"
                />
              </label>
            </div>
          </div>

          {/* Exclude similar */}
          <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-xl border border-[#29251D] bg-[#101214] p-4">
            <input
              type="checkbox"
              checked={excludeSimilar}
              onChange={(event) =>
                setExcludeSimilar(
                  event.target.checked
                )
              }
              className="h-4 w-4 accent-[#D4A84F]"
            />

            <div>
              <p className="text-sm text-[#F5F1E8]">
                Exclude similar characters
              </p>

              <p className="mt-1 font-mono text-xs text-[#444444]">
                0 O o l I 1
              </p>
            </div>
          </label>

          {/* Password count */}
          <div className="mt-7">
            <label className="text-xs uppercase tracking-[0.2em] text-[#555555]">
              Number of passwords
            </label>

            <div className="mt-3 grid grid-cols-5 gap-2">
              {[1, 3, 5, 7, 10].map(
                (count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() =>
                      setPasswordCount(
                        count
                      )
                    }
                    className={`rounded-lg border py-3 text-xs transition ${
                      passwordCount ===
                      count
                        ? "border-[#D4A84F] bg-[#D4A84F]/10 text-[#D4A84F]"
                        : "border-[#29251D] bg-[#101214] text-[#666666] hover:border-[#555555]"
                    }`}
                  >
                    {count}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Custom count */}
          <div className="mt-4">
            <input
              type="number"
              min="1"
              max="10"
              value={passwordCount}
              onChange={(event) =>
                setPasswordCount(
                  Number(
                    event.target.value
                  )
                )
              }
              className="w-full rounded-xl border border-[#29251D] bg-[#101214] px-4 py-3 text-sm text-[#F5F1E8] outline-none transition focus:border-[#D4A84F]"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-900/40 bg-red-950/20 p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-red-500">
                Error
              </p>

              <p className="mt-2 text-sm leading-6 text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Generate */}
          <button
            type="button"
            onClick={
              generatePasswords
            }
            className="mt-8 w-full rounded-xl bg-[#D4A84F] py-4 text-sm font-medium text-[#090A0C] transition hover:bg-[#E3BD68]"
          >
            Generate Password
          </button>

          <p className="mt-4 text-center text-[10px] uppercase tracking-[0.15em] text-[#444444]">
            Generated locally in your browser
          </p>
        </ToolPanel>

        {/* RIGHT PANEL */}
        <ResultPanel
          title="Generated passwords"
          badge={
            passwords.length
              ? `${passwords.length} Generated`
              : "Ready"
          }
        >
          {!passwords.length ? (
            <div className="flex min-h-[600px] items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#302719] text-2xl text-[#8B6B32]">
                  🔐
                </div>

                <p className="mt-5 text-sm text-[#777777]">
                  Your secure passwords will appear here.
                </p>

                <p className="mt-2 text-xs text-[#444444]">
                  Configure the options and click Generate.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Strength */}
              {strength && (
                <div className="rounded-2xl border border-[#D4A84F]/20 bg-[#D4A84F]/5 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#8B6B32]">
                        Password Strength
                      </p>

                      <p className="mt-2 text-2xl font-light text-[#F5F1E8]">
                        {strength.label}
                      </p>
                    </div>

                    <span className="font-mono text-2xl text-[#D4A84F]">
                      {strength.score}%
                    </span>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#1B1915]">
                    <div
                      className="h-full rounded-full bg-[#D4A84F] transition-all duration-500"
                      style={{
                        width: `${strength.score}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#24201B] bg-[#0D0F11] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#444444]">
                    Length
                  </p>

                  <p className="mt-2 text-sm text-[#D4A84F]">
                    {length}
                  </p>
                </div>

                <div className="rounded-xl border border-[#24201B] bg-[#0D0F11] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#444444]">
                    Entropy
                  </p>

                  <p className="mt-2 text-sm text-[#D4A84F]">
                    {entropy} bits
                  </p>
                </div>
              </div>

              {/* Toolbar */}
              <div className="mt-8 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                    Passwords
                  </p>

                  <p className="mt-1 text-xs text-[#444444]">
                    {passwords.length} generated
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={
                      copyAllPasswords
                    }
                    className="rounded-lg border border-[#29251D] px-4 py-2 text-xs text-[#777777] transition hover:border-[#D4A84F] hover:text-[#D4A84F]"
                  >
                    {copiedId === -1
                      ? "Copied ✓"
                      : "Copy All"}
                  </button>

                  <button
                    type="button"
                    onClick={
                      downloadPasswords
                    }
                    className="rounded-lg border border-[#29251D] px-4 py-2 text-xs text-[#777777] transition hover:border-[#D4A84F] hover:text-[#D4A84F]"
                  >
                    Download
                  </button>
                </div>
              </div>

              {/* Password list */}
              <div className="mt-5 space-y-3">
                {passwords.map(
                  (
                    item,
                    index
                  ) => {
                    const itemStrength =
                      getStrength(
                        item.password
                      );

                    return (
                      <div
                        key={item.id}
                        className="group rounded-xl border border-[#29251D] bg-[#101214] p-4 transition hover:border-[#3D3322]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 shrink-0 font-mono text-xs text-[#444444]">
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <code className="min-w-0 flex-1 break-all font-mono text-sm leading-6 text-[#D8D4CC]">
                            {item.password}
                          </code>

                          <div className="flex shrink-0 gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                copyPassword(
                                  item.password,
                                  item.id
                                )
                              }
                              title="Copy password"
                              className="rounded-lg p-2 text-[#555555] transition hover:bg-[#1A1814] hover:text-[#D4A84F]"
                            >
                              {copiedId ===
                              item.id
                                ? "✓"
                                : "⧉"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                regeneratePassword(
                                  item.id
                                )
                              }
                              title="Regenerate"
                              className="rounded-lg p-2 text-[#555555] transition hover:bg-[#1A1814] hover:text-[#D4A84F]"
                            >
                              ↻
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between pl-9">
                          <span className="text-[10px] uppercase tracking-[0.15em] text-[#444444]">
                            {itemStrength.label}
                          </span>

                          <span className="font-mono text-[10px] text-[#555555]">
                            {itemStrength.score}%
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* Clear */}
              <button
                type="button"
                onClick={clearAll}
                className="mt-6 w-full rounded-xl border border-[#29251D] py-3 text-xs text-[#555555] transition hover:border-[#D4A84F] hover:text-[#D4A84F]"
              >
                Clear Generated Passwords
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
              Customize
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Choose the password length and the character
              types you want to include.
            </p>
          </div>

          <div className="rounded-2xl border border-[#24201B] bg-[#0D0F11] p-6">
            <span className="font-mono text-xs text-[#D4A84F]">
              02
            </span>

            <h3 className="mt-4 text-lg font-light">
              Generate
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Passwords are generated locally using the
              browser's cryptographic random generator.
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
              Copy individual passwords, copy all of them,
              or download the complete list.
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
          Passwords are generated entirely inside your
          browser. No generated password is sent to or
          stored on a server.
        </p>
      </section>
    </ToolLayout>
  );
}

export default PasswordGenerator;