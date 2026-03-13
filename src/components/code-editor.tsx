"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

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
        </div>
        <div className="flex min-h-[360px] bg-bg-input">
          <div className="flex flex-col gap-1 py-4 px-3 border-r border-border-primary bg-bg-surface text-text-tertiary text-xs font-mono text-right select-none">
            {lineNumbers.map((num) => (
              <span key={num} className="leading-6">
                {num}
              </span>
            ))}
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-4 bg-transparent text-text-primary font-mono text-sm leading-6 resize-none focus:outline-none"
            placeholder="Paste your code here..."
            spellCheck={false}
          />
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
