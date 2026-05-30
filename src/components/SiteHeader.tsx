"use client";

import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SearchIcon } from "@/components/icons";
import { YLogoMark } from "@/components/YLogoMark";

const Y = <YLogoMark height="0.82em" />;

const NAV_LINKS: Array<{ label: ReactNode; href: string }> = [
  { label: "What's On",  href: "/whats-on"   },
  { label: "Venues",     href: "/venues"      },
  { label: "Venue Hire", href: "/venue-hire"  },
  { label: "Members",    href: "/members"     },
  { label: <>About {Y}</>,  href: "/about"    },
];

const MENU_ITEMS: Array<{ label: ReactNode; href: string }> = [
  { label: "Venues",                   href: "/venues"               },
  { label: <>{Y} Club</>,              href: "/venues/y-club"        },
  { label: <>{Y} Terrace</>,           href: "/venues/y-terrace"     },
  { label: <>{Y} Bar &amp; Lounge</>,  href: "/venues/y-bar-lounge"  },
  { label: "What's On",                href: "/whats-on"             },
  { label: "Venue Hire",               href: "/venue-hire"           },
  { label: "Members",                  href: "/members"              },
  { label: <>About {Y}</>,             href: "/about"                },
  { label: "FAQs",                     href: "/faqs"                 },
  { label: "Contact",                  href: "/about#contact"        },
];

// Helper: returns true if the current pathname matches the link (or is a sub-route of it).
// Special-cased so "/" only matches the home page exactly.
function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  // Strip hash for comparison
  const cleanHref = href.split("#")[0];
  if (cleanHref === "/") return false;
  return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const router   = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuCloseRef = useRef<HTMLButtonElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const wasMenuOpenRef = useRef(false);

  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const searchCloseRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchOverlayRef = useRef<HTMLDivElement>(null);
  const wasSearchOpenRef = useRef(false);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  function closeMenu() { setIsMenuOpen(false); }
  function closeSearch() { setIsSearchOpen(false); }
  function rememberFocus() {
    lastFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
  }
  function restoreFocus() {
    lastFocusRef.current?.focus();
    lastFocusRef.current = null;
  }
  function openMenu() { rememberFocus(); setIsSearchOpen(false); setIsMenuOpen(true); }
  function openSearch() { rememberFocus(); setIsMenuOpen(false); setIsSearchOpen(true); }

  function handleSearchSubmit(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return;
    closeSearch();
    const routes: { keywords: string[]; href: string }[] = [
      { keywords: ["y club", "club", "dance floor", "dancefloor", "rave"], href: "/venues/y-club" },
      { keywords: ["terrace", "y terrace", "outdoor", "outside"],          href: "/venues/y-terrace" },
      { keywords: ["bar", "lounge", "y bar", "cocktail"],                  href: "/venues/y-bar-lounge" },
      { keywords: ["hire", "private", "book", "birthday", "corporate", "party", "event hire"], href: "/venue-hire" },
      { keywords: ["member", "membership", "vip"],                         href: "/members" },
      { keywords: ["faq", "faqs", "help", "question"],                     href: "/faqs" },
      { keywords: ["about", "history", "story", "team"],                   href: "/about" },
      { keywords: ["what's on", "whats on", "events", "tickets", "gig", "night", "friday", "saturday"], href: "/whats-on" },
      { keywords: ["venue", "venues"],                                      href: "/venues" },
    ];
    const match = routes.find(({ keywords }) => keywords.some((kw) => q.includes(kw)));
    router.push(match ? match.href : `/whats-on`);
  }

  // Body scroll lock — locked when either overlay is open
  useEffect(() => {
    document.body.style.overflow = (isMenuOpen || isSearchOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen, isSearchOpen]);

  // Focus management — menu overlay
  useEffect(() => {
    if (isMenuOpen) {
      menuCloseRef.current?.focus();
    } else if (wasMenuOpenRef.current && !isSearchOpen) {
      restoreFocus();
    }
    wasMenuOpenRef.current = isMenuOpen;
  }, [isMenuOpen, isSearchOpen]);

  // Focus management — search overlay
  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    } else if (wasSearchOpenRef.current && !isMenuOpen) {
      restoreFocus();
    }
    wasSearchOpenRef.current = isSearchOpen;
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

  // ESC key + focus trap for search overlay
  useEffect(() => {
    if (!isSearchOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { closeSearch(); return; }
      if (e.key !== "Tab" || !searchOverlayRef.current) return;

      const focusable = Array.from(
        searchOverlayRef.current.querySelectorAll<HTMLElement>(
          'input, button:not([disabled]), a[href]'
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
  }, [isSearchOpen]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 flex flex-row items-center justify-between px-5 md:px-16 h-[72px] md:h-[128px]"
        style={{
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

        {/* Logo container — fixed width on desktop reserves left gutter.
            On mobile, auto width; logo shrinks to 42px. */}
        <div className="flex items-center h-auto md:h-[80px] w-auto md:w-[184px]">
          <Link
            href="/"
            aria-label="Y home"
            onClick={(e) => {
              e.preventDefault();
              // Use router.push with scroll:false then force top manually —
              // prevents App Router scroll-restoration landing mid-page.
              router.push("/", { scroll: false });
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
          >
            <Image
              src="/images/logo/y-white-no-background.webp"
              alt="Y Guildford"
              width={80}
              height={60}
              className="h-[42px] md:h-[60px] w-auto"
              style={{ height: undefined, width: "auto" }}
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
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActiveRoute(pathname ?? "/", href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`underline underline-offset-[6px] decoration-[2px] transition-[text-decoration-color,color] duration-200 ease-in-out hover:text-white ${active ? "decoration-white" : "decoration-transparent hover:decoration-white"}`}
                  style={{
                    fontSize: "22px",
                    fontWeight: 500,
                    // Inactive items dim to 0.7; active stays pure white so
                    // the current page reads at a glance even without the
                    // underline as the only cue.
                    color: active ? "#FAFAFA" : "rgba(255,255,255,0.7)",
                    letterSpacing: "-0.01em",
                    lineHeight: "24px",
                  }}
                >
                  {label}
                </Link>
              );
            })}

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
        inert={!isMenuOpen}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          backgroundColor: "rgb(0,0,0)",
          overflowY: "auto",
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
          className="absolute flex items-center justify-center bg-transparent border-0 cursor-pointer p-0 top-5 right-5 md:top-11 md:right-16"
          style={{ width: "40px", height: "40px" }}
        >
          <X size={24} color="white" strokeWidth={1.5} />
        </button>

        <nav
          aria-label="Overlay navigation"
          className="flex flex-col pt-[100px] pb-16 pl-8 pr-8 lg:pt-[120px] lg:pl-[120px]"
          style={{ gap: "16px" }}
        >
          {MENU_ITEMS.map(({ label, href }) => {
            const active = isActiveRoute(pathname ?? "/", href);
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                aria-current={active ? "page" : undefined}
                className="block text-[40px] md:text-[48px] lg:text-[80px] hover:opacity-50 transition-opacity duration-200 ease-in-out"
                style={{
                  fontFamily: '"haas", Arial, sans-serif',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "#FAFAFA",
                  textDecoration: "none",
                  opacity: active ? 0.55 : 1,
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Search overlay ── */}
      <div
        ref={searchOverlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        aria-hidden={!isSearchOpen}
        inert={!isSearchOpen}
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
          className="absolute flex items-center justify-center bg-transparent border-0 cursor-pointer p-0 top-5 right-5 md:top-11 md:right-32"
          style={{ width: "40px", height: "40px" }}
        >
          <X size={24} color="white" strokeWidth={1.5} />
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchSubmit(searchInputRef.current?.value ?? "");
          }}
          className="w-[85vw] md:w-[60vw]"
          style={{ maxWidth: "800px" }}
        >
          {/* Search input */}
          <input
            ref={searchInputRef}
            type="search"
            placeholder="Search Y..."
            aria-label="Search Y"
            className="w-full placeholder:text-white/40 outline-none"
            style={{
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
        </form>
      </div>
    </>
  );
}
