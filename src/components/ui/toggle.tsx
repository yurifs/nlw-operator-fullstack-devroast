"use client";

import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { useState } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const toggle = tv({
  base: [
    "flex items-center gap-3",
    "cursor-pointer",
    "select-none",
    "font-mono text-sm",
    "transition-colors duration-150",
  ],
  variants: {
    checked: {
      true: ["text-accent-green"],
      false: ["text-text-secondary"],
    },
  },
});

type ToggleVariants = VariantProps<typeof toggle>;

export interface ToggleProps extends ToggleVariants {
  label: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function Toggle({
  label,
  defaultChecked = false,
  checked: controlledChecked,
  onChange,
  className,
}: ToggleProps) {
  const [uncontrolledChecked, setUncontrolledChecked] =
    useState(defaultChecked);

  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : uncontrolledChecked;

  const handleChange = (nextChecked: boolean) => {
    if (!isControlled) {
      setUncontrolledChecked(nextChecked);
    }
    onChange?.(nextChecked);
  };

  return (
    <div className={toggle({ checked: isChecked, className })}>
      <BaseToggle
        defaultPressed={defaultChecked}
        pressed={isControlled ? controlledChecked : undefined}
        onPressedChange={handleChange}
        className={`relative inline-block rounded-full transition-colors duration-150 cursor-pointer ${
          isChecked ? "bg-accent-green" : "bg-border-primary"
        }`}
        style={{ width: 40, height: 22, padding: 3 }}
      >
        <span
          className={`block rounded-full bg-white shadow-sm transition-transform duration-150 ${
            isChecked ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
          style={{ width: 16, height: 16, display: "block" }}
        />
      </BaseToggle>
      <span>{label}</span>
    </div>
  );
}
