"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useLanguageDetection } from "@/hooks/use-language-detection";
import { useShikiHighlighter } from "@/hooks/use-shiki-highlighter";
import { LANGUAGE_LIST, LANGUAGES } from "@/lib/languages";
import { useTRPC } from "@/trpc/client";

const DEFAULT_CODE = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
    // TODO: handle tax calculation
    // TODO: handle currency conversion
  }
  return total;
}`;

const MAX_CHARACTERS = 2000;

export function CodeEditor() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [roastMode, setRoastMode] = useState(true);
  const [manualLanguage, setManualLanguage] = useState<string | null>(null);
  const [highlightedHtml, setHighlightedHtml] = useState<string>("");

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightedRef = useRef<HTMLDivElement>(null);

  const { highlight, isReady } = useShikiHighlighter();
  const { detectedLanguage, isDetecting } = useLanguageDetection(code);

  const router = useRouter();
  const trpc = useTRPC();

  const createRoast = useMutation(
    trpc.roast.create.mutationOptions({
      onSuccess: (data) => {
        router.push(`/roast/${data.id}`);
      },
      onError: (error) => {
        console.error("Roast creation failed:", error);
        alert("Failed to create roast. Please try again.");
      },
    }),
  );

  const currentLanguage = manualLanguage || detectedLanguage || "plaintext";
  const isAutoDetect = !manualLanguage;
  const characterCount = code.length;
  const isOverLimit = characterCount > MAX_CHARACTERS;

  useEffect(() => {
    if (!isReady || !code) {
      setHighlightedHtml("");
      return;
    }

    highlight(code, currentLanguage).then(setHighlightedHtml);
  }, [code, currentLanguage, highlight, isReady]);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollLeft } = scrollContainerRef.current;

    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = scrollTop;
    }

    if (highlightedRef.current) {
      highlightedRef.current.scrollTop = scrollTop;
      highlightedRef.current.scrollLeft = scrollLeft;
    }
  }, []);

  const handleLanguageChange = (lang: string) => {
    if (lang === "auto") {
      setManualLanguage(null);
    } else {
      setManualLanguage(lang);
    }
  };

  const lineNumbers = code.split("\n").map((_, i) => i + 1);

  return (
    <>
      {/* Code Input - 780px centered */}
      <section className="w-full max-w-[780px] border border-border-primary rounded-md overflow-hidden mb-8">
        {/* Header */}
        <div className="flex items-center justify-between h-10 px-4 border-b border-border-primary bg-bg-surface">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent-red" />
            <span className="w-3 h-3 rounded-full bg-accent-amber" />
            <span className="w-3 h-3 rounded-full bg-accent-green" />
          </div>

          {/* Language Selector */}
          <select
            value={manualLanguage || "auto"}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="h-6 px-2 text-xs bg-bg-input border border-border-primary rounded text-text-primary font-mono focus:outline-none focus:ring-1 focus:ring-accent-green"
          >
            <option value="auto">Auto-detect</option>
            {LANGUAGE_LIST.filter((l) => l.name !== "Plain Text").map(
              (lang) => (
                <option key={lang.name} value={lang.shikiId}>
                  {lang.name}
                </option>
              ),
            )}
          </select>
        </div>

        {/* Scroll Container - ÚNICO COM SCROLL - Altura fixa 360px */}
        <div
          ref={scrollContainerRef}
          className="h-[360px] overflow-auto bg-bg-input"
          onScroll={handleScroll}
        >
          {/* Inner Flex - cresce com conteúdo */}
          <div className="flex min-w-max min-h-full">
            {/* Line Numbers */}
            <div
              ref={lineNumbersRef}
              className="w-12 shrink-0 bg-bg-surface border-r border-border-primary sticky left-0"
            >
              <div className="flex flex-col py-4 pl-4 pr-3 text-text-tertiary text-xs font-mono text-right select-none">
                {lineNumbers.map((num) => (
                  <span key={num} className="leading-6">
                    {num}
                  </span>
                ))}
              </div>
            </div>

            {/* Code Area */}
            <div className="relative">
              {/* Highlighted Code Layer */}
              <div
                ref={highlightedRef}
                className="shiki-output p-4 font-mono text-sm leading-6 whitespace-pre pointer-events-none"
              >
                {highlightedHtml ? (
                  <code
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki generates trusted HTML
                    dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                  />
                ) : (
                  <code className="text-text-primary">{code}</code>
                )}
              </div>

              {/* Textarea Layer */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={createRoast.isPending}
                className="absolute inset-0 w-full h-full p-4 font-mono text-sm leading-6 bg-transparent text-transparent whitespace-pre resize-none focus:outline-none m-0"
                style={{
                  caretColor: "var(--color-accent-green)",
                }}
                placeholder="Paste your code here..."
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between h-6 px-4 border-t border-border-primary bg-bg-surface text-text-tertiary text-xs">
          <span suppressHydrationWarning>
            {isAutoDetect
              ? isDetecting
                ? "Detecting language..."
                : detectedLanguage
                  ? `Detected: ${LANGUAGES[detectedLanguage]?.name || detectedLanguage}`
                  : "No language detected"
              : `Selected: ${LANGUAGES[currentLanguage]?.name || currentLanguage}`}
          </span>
          <span className={isOverLimit ? "text-accent-red font-bold" : ""}>
            {characterCount} / {MAX_CHARACTERS}
          </span>
        </div>
      </section>

      {/* Actions Bar - 780px centered */}
      <section className="w-full max-w-[780px] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Toggle
            label="roast mode"
            checked={roastMode}
            onChange={setRoastMode}
          />
          <span className="text-text-tertiary text-xs">
            {"//"} maximum sarcasm enabled
          </span>
        </div>
        <Button
          variant="primary"
          disabled={isOverLimit || createRoast.isPending}
          onClick={() =>
            createRoast.mutate({
              code,
              language: currentLanguage,
              roastMode,
            })
          }
        >
          {createRoast.isPending ? "$ roasting..." : "$ roast_my_code"}
        </Button>
      </section>
    </>
  );
}
