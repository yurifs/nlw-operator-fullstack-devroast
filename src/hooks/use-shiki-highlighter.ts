"use client";

import { useCallback, useEffect, useState } from "react";
import type { Highlighter } from "shiki";
import { LANGUAGES } from "@/lib/languages";

const THEME = "vesper";

let highlighterInstance: Highlighter | null = null;
let initPromise: Promise<Highlighter> | null = null;

async function createHighlighter(): Promise<Highlighter> {
  const { createHighlighter } = await import("shiki");

  const langs = [
    LANGUAGES.javascript,
    LANGUAGES.typescript,
    LANGUAGES.tsx,
    LANGUAGES.python,
    LANGUAGES.go,
    LANGUAGES.rust,
  ];

  const loadedLangs = await Promise.all(
    langs.map(async (lang) => {
      const mod = (await lang.src()) as { default: unknown };
      return mod.default;
    }),
  );

  return createHighlighter({
    themes: [THEME],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    langs: loadedLangs as any,
  });
}

function getHighlighter(): Promise<Highlighter> {
  if (highlighterInstance) {
    return Promise.resolve(highlighterInstance);
  }

  if (!initPromise) {
    initPromise = createHighlighter().then((h) => {
      highlighterInstance = h;
      return h;
    });
  }

  return initPromise;
}

export function useShikiHighlighter() {
  const [isReady, setIsReady] = useState(false);
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);

  useEffect(() => {
    getHighlighter().then((h) => {
      setHighlighter(h);
      setIsReady(true);
    });
  }, []);

  const highlight = useCallback(
    async (code: string, lang: string): Promise<string> => {
      if (!highlighter) {
        const h = await getHighlighter();
        setHighlighter(h);

        const langConfig = LANGUAGES[lang] || LANGUAGES.plaintext;

        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await h.loadLanguage(langConfig.src as any);
        } catch {
          // Language not available, fallback to plaintext
        }

        return h.codeToHtml(code, {
          lang: langConfig.shikiId,
          theme: THEME,
        });
      }

      const langConfig = LANGUAGES[lang] || LANGUAGES.plaintext;

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await highlighter.loadLanguage(langConfig.src as any);
      } catch {
        // Language not available
      }

      return highlighter.codeToHtml(code, {
        lang: langConfig.shikiId,
        theme: THEME,
      });
    },
    [highlighter],
  );

  return {
    highlight,
    isReady,
  };
}
