"use client";

import { useState } from "react";

const languages = [
  { code: "EN", label: "English", angle: 0 },
  { code: "BM", label: "Bahasa Malaysia", angle: 90 },
  { code: "TA", label: "Tamil", angle: 180 },
  { code: "ZH", label: "Chinese", angle: 270 },
];

export function HeroVisual() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div
      className="relative mx-auto mt-14 flex h-64 w-64 items-center justify-center md:h-80 md:w-80"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 320 320"
        className="absolute inset-0 h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Orbit ring */}
        <circle
          cx="160"
          cy="160"
          r="110"
          stroke="var(--border)"
          strokeWidth="1"
          strokeDasharray="6 6"
          opacity="0.6"
        />
        {/* Connecting spokes */}
        {languages.map((lang) => {
          const rad = ((lang.angle - 90) * Math.PI) / 180;
          const x = 160 + 110 * Math.cos(rad);
          const y = 160 + 110 * Math.sin(rad);
          return (
            <line
              key={lang.code}
              x1="160"
              y1="160"
              x2={x}
              y2={y}
              stroke="var(--border)"
              strokeWidth="1"
            />
          );
        })}
        {/* Central hub */}
        <circle cx="160" cy="160" r="32" fill="var(--accent)" opacity="0.9" />
        <circle cx="160" cy="160" r="12" fill="var(--bg)" />
      </svg>

      {/* Language nodes */}
      {languages.map((lang) => {
        const rad = ((lang.angle - 90) * Math.PI) / 180;
        const x = 160 + 110 * Math.cos(rad);
        const y = 160 + 110 * Math.sin(rad);
        const isActive = active === lang.code;

        return (
          <button
            key={lang.code}
            type="button"
            onMouseEnter={() => setActive(lang.code)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(lang.code)}
            onBlur={() => setActive(null)}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center transition-transform duration-200 hover:scale-110 focus:outline-none"
            style={{
              left: `${(x / 320) * 100}%`,
              top: `${(y / 320) * 100}%`,
            }}
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-full border font-mono text-xs font-medium transition-colors duration-200 md:h-14 md:w-14 ${
                isActive
                  ? "border-accent bg-accent text-bg"
                  : "border-border bg-surface text-text-primary"
              }`}
            >
              {lang.code}
            </span>
            {isActive && (
              <span className="absolute -bottom-7 whitespace-nowrap rounded bg-surface px-2 py-1 text-xs text-text-secondary shadow-sm">
                {lang.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
