"use client";

import { useState } from "react";

interface LeaderboardEntryCodeProps {
  preview: React.ReactNode;
  fullCode: React.ReactNode;
  lineCount: number;
}

export function LeaderboardEntryCode({
  preview,
  fullCode,
  lineCount,
}: LeaderboardEntryCodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const showToggle = lineCount > 5;

  if (!showToggle) {
    return <div>{fullCode}</div>;
  }

  return (
    <div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-none" : "max-h-[100px] relative"
        }`}
      >
        {isOpen ? fullCode : preview}

        {!isOpen && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-bg-page to-transparent pointer-events-none" />
        )}
      </div>

      <div className="flex justify-center my-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-text-tertiary text-xs hover:text-text-secondary transition-colors cursor-pointer select-none"
        >
          <span>{isOpen ? "show less" : "show more"}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
