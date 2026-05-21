import type { ReactNode } from "react";

/**
 * Form field wrapper that associates an uppercase label with its
 * input(s) and renders an aria-hidden asterisk when required.
 *
 * Pair with the `.form-input` utility class (defined in globals.css)
 * for consistent input styling across forms.
 */
export interface FieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
}

export function Field({ label, required, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span
        style={{
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.5)",
        }}
      >
        {label}
        {required && (
          <span aria-hidden="true" style={{ color: "rgba(0,0,0,0.4)", marginLeft: 4 }}>
            *
          </span>
        )}
      </span>
      {children}
    </label>
  );
}
