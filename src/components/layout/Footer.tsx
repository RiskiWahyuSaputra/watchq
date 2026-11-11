"use client";

import type { MouseEvent } from "react";
import { ArrowUp } from "lucide-react";
import { brand, footerNav } from "@/data/watch";
import { useScrollTo } from "@/hooks/useLenis";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  const scrollTo = useScrollTo();
  const go = (href: string) => (e: MouseEvent) => {
    e.preventDefault();
    scrollTo(href);
  };

  return (
    <footer id="contact" className="relative bg-ink px-5 pb-10 pt-24 sm:px-8 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[1680px]">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <p className="max-w-sm font-serif text-2xl leading-snug text-fg/90 md:text-3xl">
            {brand.tagline}
          </p>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-14 gap-y-4 sm:flex sm:gap-12">
              {footerNav.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={go(item.href)}
                    className="footer-link text-[11px] uppercase tracking-[0.3em] text-muted transition-colors duration-500 hover:text-fg"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-20 h-px w-full bg-line" />

        <div className="select-none overflow-hidden pt-8 text-[clamp(5rem,22vw,22rem)] leading-[0.85] text-fg/95">
          <Logo className="-ml-[0.04em]" />
        </div>

        <div className="mt-10 flex flex-col-reverse gap-6 border-t border-line pt-6 text-[10px] uppercase tracking-[0.3em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {brand.year} WatchQ. All Rights Reserved.</p>
          <a href="#top" onClick={go("#top")} className="inline-flex items-center gap-2 transition-colors duration-500 hover:text-fg">
            Back to top <ArrowUp className="h-3 w-3" strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </footer>
  );
}
