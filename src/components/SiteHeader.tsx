"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SearchIcon } from "@/components/icons";

const NAV_LINKS = [
  { label: "What's On", href: "/" },
  { label: "Venues", href: "/" },
  { label: "Venue Hire", href: "/" },
  { label: "Members", href: "/" },
  { label: "About", href: "/" },
] as const;

const MENU_ITEMS = [
  { label: "Y Club", href: "#y-club" },
  { label: "Y Terrace", href: "#y-terrace" },
  { label: "Y Bar & Lounge", href: "#y-bar-lounge" },
  { label: "What's On", href: "#whats-on" },
  { label: "Venue Hire", href: "#venue-hire" },
  { label: "Members", href: "/" },
  { label: "About Y", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuCloseRef = useRef<HTMLButtonElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);

  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const searchCloseRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  function closeMenu() { setIsMenuOpen(false); }
  function closeSearch() { setIsSearchOpen(false); }
  function openMenu() { setIsSearchOpen(false); setIsMenuOpen(true); }
  function openSearch() { setIsMenuOpen(false); setIsSearchOpen(true); }

  // Body scroll lock — locked when either overlay is open
  useEffect(() => {
    document.body.style.overflow = (isMenuOpen || isSearchOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen, isSearchOpen]);

  // Focus management — menu overlay
  useEffect(() => {
    if (isMenuOpen) {
      menuCloseRef.current?.focus();
    } else if (!isSearchOpen) {
      hamburgerRef.current?.focus();
    }
  }, [isMenuOpen, isSearchOpen]);

  // Focus management — search overlay
  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    } else if (!isMenuOpen) {
      searchButtonRef.current?.focus();
    }
  }, [isSearchOpen, isMenuOpen]);

  // ESC key + focus trap for menu overlay
  useEffect(() => {
    if (!isMenuOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { closeMenu(); return; }

      if (e.key !== "Tab" || !menuOverlayRef.current) return;

      const focusable = Array.from(
        menuOverlayRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        )
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  // ESC key for search overlay
  useEffect(() => {
    if (!isSearchOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeSearch();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-10 flex flex-row items-center justify-between"
        style={{
          height: "128px",
          padding: "24px 64px",
          backgroundColor: "rgba(0,0,0,0)",
          color: "#FAFAFA",
          fontFamily: '"haas", Arial, sans-serif',
          fontSize: "16px",
          fontWeight: 450,
          letterSpacing: "0.48px",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-61px",
            left: 0,
            right: 0,
            height: "189px",
            backgroundImage:
              "linear-gradient(rgb(0,0,0) 0%, rgba(30,30,28,0.8) 70%, rgba(30,30,28,0) 100%)",
            zIndex: -1,
          }}
        />

        <div style={{ width: "184px", height: "80px", display: "flex", alignItems: "center" }}>
          <Link href="/" aria-label="Y home">
            <Image
              src="/images/logo/y-white-no-background.webp"
              alt="Y"
              width={80}
              height={60}
              style={{ height: "60px", width: "auto" }}
              priority
            />
          </Link>
        </div>

        <nav aria-label="Main navigation" className="flex flex-row items-center" style={{ gap: "32px" }}>
          {/* Desktop text links — hidden below 1024px */}
          <div
            className="hidden min-[1024px]:flex flex-row items-center"
            style={{ gap: "32px" }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="underline underline-offset-[6px] decoration-[1.5px] decoration-transparent hover:decoration-white transition-[text-decoration-color] duration-200 ease-in-out"
                style={{
                  fontSize: "22px",
                  fontWeight: 500,
                  color: "#FAFAFA",
                  letterSpacing: "-0.01em",
                  lineHeight: "24px",
                }}
              >
                {label}
              </a>
            ))}

            {/* Search icon — desktop only */}
            <button
              ref={searchButtonRef}
              type="button"
              aria-label="Open search"
              onClick={openSearch}
              className="flex items-center justify-center bg-transparent border-0 cursor-pointer p-0"
            >
              <SearchIcon width={24} height={24} />
            </button>
          </div>

          {/* Hamburger — visible on all screen sizes */}
          <button
            ref={hamburgerRef}
            type="button"
            aria-label="Open menu"
            onClick={openMenu}
            className="flex items-center justify-center bg-transparent border-0 cursor-pointer p-0"
            style={{ width: "40px", height: "40px" }}
          >
            <Menu size={24} color="white" strokeWidth={1.5} />
          </button>
        </nav>
      </header>

      {/* ── Menu overlay ── */}
      <div
        ref={menuOverlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!isMenuOpen}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          backgroundColor: "rgb(0,0,0)",
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? "auto" : "none",
          transition: isMenuOpen ? "opacity 300ms ease-out" : "opacity 200ms ease-in",
        }}
      >
        <button
          ref={menuCloseRef}
          type="button"
          aria-label="Close menu"
          onClick={closeMenu}
          className="absolute flex items-center justify-center bg-transparent border-0 cursor-pointer p-0"
          style={{ top: "44px", right: "64px", width: "40px", height: "40px" }}
        >
          <X size={24} color="white" strokeWidth={1.5} />
        </button>

        <nav
          aria-label="Overlay navigation"
          className="flex flex-col pt-[100px] pb-16 pl-8 pr-8 lg:pt-[120px] lg:pl-[120px]"
          style={{ gap: "16px" }}
        >
          {MENU_ITEMS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className="block text-[40px] md:text-[48px] lg:text-[80px] hover:opacity-50 transition-opacity duration-200 ease-in-out"
              style={{
                fontFamily: '"haas", Arial, sans-serif',
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#FAFAFA",
                textDecoration: "none",
              }}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      {/* ── Search overlay ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        aria-hidden={!isSearchOpen}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          backgroundColor: "rgb(0,0,0)",
          opacity: isSearchOpen ? 1 : 0,
          pointerEvents: isSearchOpen ? "auto" : "none",
          transition: isSearchOpen ? "opacity 300ms ease-out" : "opacity 200ms ease-in",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Close button — positioned to sit where the search icon was */}
        <button
          ref={searchCloseRef}
          type="button"
          aria-label="Close search"
          onClick={closeSearch}
          className="absolute flex items-center justify-center bg-transparent border-0 cursor-pointer p-0"
          style={{ top: "44px", right: "128px", width: "40px", height: "40px" }}
        >
          <X size={24} color="white" strokeWidth={1.5} />
        </button>

        {/* Search input */}
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search Y..."
          className="w-[85vw] md:w-[60vw] placeholder:text-white/40 outline-none"
          style={{
            maxWidth: "800px",
            fontFamily: '"haas", Arial, sans-serif',
            fontSize: "clamp(24px, 3vw, 48px)",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: "#FAFAFA",
            background: "transparent",
            border: "none",
            borderBottom: "1px solid rgba(255,255,255,0.3)",
            padding: "16px 0",
            outline: "none",
          }}
        />
      </div>
    </>
  );
}
