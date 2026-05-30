"use client";

import { useState } from "react";
import { ChevronRightIcon } from "@/components/icons";

type SubmitState = "idle" | "submitting" | "success" | "error";

/**
 * Client-side membership sign-up form. POSTs to /api/members/signup which
 * currently logs the submission server-side; wire that route to a real CRM
 * (Mailchimp / Brevo / Resend) when ready.
 */
export function MembersSignupForm() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "submitting" || !email) return;

    setState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/members/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Signup failed");
      }

      setState("success");
      setEmail("");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (state === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full text-left"
        style={{
          maxWidth: "520px",
          padding: "24px 28px",
          border: "1px solid rgba(0,0,0,0.15)",
          background: "rgba(0,0,0,0.04)",
        }}
      >
        <p style={{ fontSize: "18px", color: "#080808", fontWeight: 700, marginBottom: "10px" }}>
          You&apos;re in.
        </p>
        <p style={{ fontSize: "15px", color: "rgba(0,0,0,0.7)", lineHeight: 1.6, marginBottom: "16px" }}>
          We&apos;ve sent a welcome email to confirm your membership. It usually arrives
          in a few minutes — check your spam folder if you don&apos;t see it.
        </p>
        <ol
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {[
            "Confirm your email when the welcome message arrives.",
            "Show that email at the bar — perks unlock instantly.",
            "Watch your inbox for monthly drink offers and event drops.",
          ].map((step, i) => (
            <li
              key={step}
              style={{
                fontSize: "14px",
                color: "rgba(0,0,0,0.7)",
                lineHeight: 1.55,
                display: "flex",
                gap: "10px",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "rgba(0,0,0,0.45)",
                  minWidth: "16px",
                }}
              >
                {i + 1}.
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col sm:flex-row w-full"
        style={{ maxWidth: "520px" }}
      >
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          aria-hidden="true"
          style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", opacity: 0 }}
        />
        <input
          type="email"
          placeholder="Your email address"
          aria-label="Email address"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === "submitting"}
          className="w-full sm:flex-1 border border-black/40 focus:border-black focus:outline-none transition-[border-color] duration-200 motion-reduce:transition-none placeholder:text-black/35 disabled:opacity-60"
          style={{
            height: "72px", padding: "0 20px",
            background: "transparent", color: "#080808",
            fontFamily: "inherit", fontSize: "17px", borderRadius: 0, minWidth: 0,
          }}
        />
        <button
          type="submit"
          disabled={state === "submitting"}
          className="group inline-flex items-center justify-center gap-2 bg-black text-white text-[15px] font-bold hover:bg-white hover:text-black transition-colors duration-200 motion-reduce:transition-none cursor-pointer disabled:opacity-60"
          style={{
            height: "72px", padding: "0 28px",
            border: "1px solid #080808",
            borderRadius: 0,
            whiteSpace: "nowrap",
            letterSpacing: "0.04em", textTransform: "uppercase",
          }}
        >
          {state === "submitting" ? "Joining…" : "Sign Up"}
          <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
        </button>
      </form>
      {state === "error" && (
        <p
          role="alert"
          style={{ fontSize: "13px", color: "rgba(160,40,40,0.9)", marginTop: "10px" }}
        >
          {errorMsg || "Couldn't sign you up — please try again."}
        </p>
      )}
    </>
  );
}
