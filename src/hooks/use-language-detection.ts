"use client";

import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import css from "highlight.js/lib/languages/css";
import dart from "highlight.js/lib/languages/dart";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import kotlin from "highlight.js/lib/languages/kotlin";
import markdown from "highlight.js/lib/languages/markdown";
import php from "highlight.js/lib/languages/php";
import plaintext from "highlight.js/lib/languages/plaintext";
import python from "highlight.js/lib/languages/python";
import ruby from "highlight.js/lib/languages/ruby";
import rust from "highlight.js/lib/languages/rust";
import sql from "highlight.js/lib/languages/sql";
import swift from "highlight.js/lib/languages/swift";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

import { useCallback, useEffect, useRef, useState } from "react";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("go", go);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("java", java);
hljs.registerLanguage("ruby", ruby);
hljs.registerLanguage("php", php);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("shell", bash);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("json", json);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("c", c);
hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("swift", swift);
hljs.registerLanguage("kotlin", kotlin);
hljs.registerLanguage("dart", dart);
hljs.registerLanguage("plaintext", plaintext);

const CONFIDENCE_THRESHOLD = 10;
const DEBOUNCE_MS = 100;

function mapHljsToShiki(hljsLang: string | undefined): string {
  if (!hljsLang) return "plaintext";

  const mapping: Record<string, string> = {
    javascript: "javascript",
    typescript: "typescript",
    python: "python",
    go: "go",
    rust: "rust",
    java: "java",
    ruby: "ruby",
    php: "php",
    sql: "sql",
    bash: "bash",
    shell: "bash",
    xml: "html",
    html: "html",
    css: "css",
    json: "json",
    yaml: "yaml",
    markdown: "markdown",
    cpp: "cpp",
    c: "c",
    csharp: "csharp",
    swift: "swift",
    kotlin: "kotlin",
    dart: "dart",
    plaintext: "plaintext",
  };

  return mapping[hljsLang] || "plaintext";
}

export function useLanguageDetection(code: string) {
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const detectLanguage = useCallback((input: string) => {
    if (!input || input.trim().length < 5) {
      setDetectedLanguage(null);
      setConfidence(0);
      setIsDetecting(false);
      return;
    }

    setIsDetecting(true);

    try {
      const result = hljs.highlightAuto(input);

      if (result.language && result.relevance >= CONFIDENCE_THRESHOLD) {
        const shikiLang = mapHljsToShiki(result.language);
        setDetectedLanguage(shikiLang);
        setConfidence(result.relevance);
      } else {
        setDetectedLanguage("plaintext");
        setConfidence(0);
      }
    } catch {
      setDetectedLanguage(null);
      setConfidence(0);
    } finally {
      setIsDetecting(false);
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsDetecting(true);

    timeoutRef.current = setTimeout(() => {
      detectLanguage(code);
    }, DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [code, detectLanguage]);

  return {
    detectedLanguage,
    confidence,
    isDetecting,
  };
}
