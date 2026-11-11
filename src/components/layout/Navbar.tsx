"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ScrollTrigger } from "@/lib/gsap";
import { navItems } from "@/data/watch";
import { useLenis, useScrollTo } from "@/hooks/useLenis";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const header = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const scrollTo = useScrollTo();
  const lenis = useLenis();

  // Background state + active section, without re-rendering on every scroll.
  useEffect(() => {
    const triggers = [
      ScrollTrigger.create({
        start: "top -60",
        end: "max",
        onToggle: (self) => header.current?.toggleAttribute("data-scrolled", self.isActive),
      }),
      ...navItems.map((item) => {
        const el = document.querySelector(item.href);
        return ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) =>
            setActive((cur) => (self.isActive ? item.href : cur === item.href ? null : cur)),
        });
      }),
    ];
    return () => triggers.forEach((t) => t.kill());
  }, []);

  // Lock smooth scroll + allow Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  const go = (href: string) => (e: MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // Let the menu close (and Lenis restart) before scrolling.
    requestAnimationFrame(() => scrollTo(href));
  };

  return (
    <>
      <header
        ref={header}
        className="group/nav fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-700 data-[scrolled]:border-b data-[scrolled]:border-line data-[scrolled]:bg-ink/85"
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-[1680px] items-center justify-between px-5 sm:px-8 lg:h-20 lg:px-12"
        >
          <a href="#top" onClick={go("#top")} className="text-[1.6rem] text-fg" aria-label="WatchQ — back to top">
            <Logo />
          </a>

          <ul className="hidden items-center gap-12 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={go(item.href)}
                  aria-current={active === item.href ? "true" : undefined}
                  className="nav-link relative py-2 text-[11px] uppercase tracking-[0.3em] text-muted transition-colors duration-500 hover:text-fg aria-[current]:text-fg"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden md:block">
              <Button href="#details" variant="text" icon={<ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />}>
                Explore
              </Button>
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="-mr-2 p-2 text-fg md:hidden"
            >
              {open ? <X className="h-5 w-5" strokeWidth={1.25} /> : <Menu className="h-5 w-5" strokeWidth={1.25} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-5 pb-10 pt-28 sm:px-8 md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="space-y-2">
              {[...navItems, { label: "Explore", href: "#details" as const }].map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-line"
                >
                  <a href={item.href} onClick={go(item.href)} className="flex items-baseline justify-between py-5 font-serif text-4xl uppercase text-fg">
                    {item.label}
                    <span className="font-sans text-[10px] tracking-[0.3em] text-muted">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="text-[10px] uppercase tracking-[0.35em] text-muted">Timeless. Beyond time.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
