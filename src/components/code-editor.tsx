"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useLanguageDetection } from "@/hooks/use-language-detection";
import { useShikiHighlighter } from "@/hooks/use-shiki-highlighter";
import { LANGUAGE_LIST, LANGUAGES } from "@/lib/languages";

const DEFAULT_CODE = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
    // TODO: handle tax calculation
    // TODO: handle currency conversion
  }
  return total;
}`;

export function CodeEditor() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [roastMode, setRoastMode] = useState(true);
  const [manualLanguage, setManualLanguage] = useState<string | null>(null);
  const [highlightedHtml, setHighlightedHtml] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightedRef = useRef<HTMLDivElement>(null);

  const { highlight, isReady } = useShikiHighlighter();
  const { detectedLanguage, isDetecting } = useLanguageDetection(code);

  const currentLanguage = manualLanguage || detectedLanguage || "plaintext";
  const isAutoDetect = !manualLanguage;

  useEffect(() => {
    if (!isReady || !code) {
      setHighlightedHtml("");
      return;
    }

    highlight(code, currentLanguage).then(setHighlightedHtml);
  }, [code, currentLanguage, highlight, isReady]);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && highlightedRef.current) {
      highlightedRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightedRef.current.scrollLeft = textareaRef.current.scrollLeft;
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

        <div className="flex min-h-[360px] bg-bg-input relative">
          {/* Line Numbers */}
          <div className="flex flex-col gap-1 py-4 px-3 border-r border-border-primary bg-bg-surface text-text-tertiary text-xs font-mono text-right select-none">
            {lineNumbers.map((num) => (
              <span key={num} className="leading-6">
                {num}
              </span>
            ))}
          </div>

          {/* Editor Container with Overlay Pattern */}
          <div className="flex-1 relative overflow-hidden">
            {/* Highlighted Code Layer */}
            <div
              ref={highlightedRef}
              className="absolute inset-0 p-4 font-mono text-sm leading-6 whitespace-pre overflow-auto pointer-events-none z-10"
              suppressHydrationWarning
              style={{
                color: highlightedHtml ? "transparent" : "inherit",
              }}
            >
              {highlightedHtml ? (
                // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki generates trusted HTML
                <span dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
              ) : (
                <pre>{code}</pre>
              )}
            </div>

            {/* Textarea Layer */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onScroll={handleScroll}
              className="absolute inset-0 w-full h-full p-4 bg-transparent text-text-primary font-mono text-sm leading-6 resize-none focus:outline-none whitespace-pre overflow-auto z-20"
              style={{
                WebkitTextFillColor: "transparent",
                caretColor: "var(--color-accent-green)",
              }}
              placeholder="Paste your code here..."
              spellCheck={false}
            />
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
          <span>{code.split("\n").length} lines</span>
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
        <Button variant="primary">$ roast_my_code</Button>
      </section>
    </>
  );
}
