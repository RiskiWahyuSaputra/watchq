import { craftsmanship } from "@/data/watch";
import HorizontalScroll from "@/components/animations/HorizontalScroll";
import SafeImage from "@/components/ui/SafeImage";

export default function CraftsmanshipSection() {
  return (
    <HorizontalScroll
      id="craftsmanship"
      className="bg-ink-2"
      trackClassName="lg:items-center"
      overlay={
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-12 bottom-10 hidden items-center gap-6 lg:flex motion-reduce:lg:hidden">
          <span className="text-[10px] uppercase tracking-[0.35em] text-muted">The Art of Perfection</span>
          <span className="relative h-px flex-1 bg-line">
            <span data-h-progress className="absolute inset-0 origin-left scale-x-0 bg-silver" />
          </span>
          <span className="text-[10px] uppercase tracking-[0.35em] text-muted">01 — 04</span>
        </div>
      }
    >
      {/* Intro panel */}
      <div className="h-panel flex shrink-0 flex-col justify-center px-5 pb-16 pt-28 sm:px-8 lg:w-[46vw] lg:px-12 lg:py-0">
        <div data-h-reveal>
          <p className="eyebrow mb-8">05 — Craftsmanship</p>
          <h2 className="font-serif text-[clamp(2.75rem,6.5vw,7rem)] font-light uppercase leading-[0.92] text-fg">
            The art <span className="block pl-[0.8em] italic text-silver">of perfection.</span>
          </h2>
          <p className="mt-10 max-w-sm text-[15px] leading-relaxed text-muted">
            Four studies in stainless steel — the material, its finish, its structure, and the details that complete it.
          </p>
          <p className="mt-12 hidden items-center gap-4 text-[10px] uppercase tracking-[0.35em] text-silver lg:flex motion-reduce:lg:hidden">
            Continue scrolling <span className="h-px w-16 bg-silver/60" />
          </p>
        </div>
      </div>

      {craftsmanship.map((panel, i) => (
        <article
          key={panel.index}
          className={`h-panel relative flex shrink-0 flex-col gap-8 px-5 py-14 sm:px-8 lg:h-full lg:w-[min(64vw,980px)] lg:flex-row lg:items-center lg:gap-12 lg:px-10 lg:py-0 ${
            i % 2 === 1 ? "lg:flex-row-reverse" : ""
          }`}
        >
          <div className="h-panel-media relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-surface lg:aspect-auto lg:h-[64vh] lg:w-[52%]">
            <div data-h-parallax className="absolute -inset-x-[12%] inset-y-0">
              <SafeImage src={panel.image} alt={panel.alt} fill sizes="(min-width: 1024px) 34vw, 100vw" className="img-hover object-cover" />
            </div>
          </div>
          <div data-h-reveal className="lg:max-w-xs">
            <p className="font-serif text-[clamp(5rem,9vw,9rem)] italic leading-none text-outline">{panel.index}</p>
            <h3 className="mt-4 text-[11px] uppercase tracking-[0.4em] text-silver">{panel.index} — {panel.title}</h3>
            <p className="mt-6 font-serif text-3xl uppercase leading-tight text-fg lg:text-4xl">{panel.title}</p>
            <p className="mt-5 text-[15px] leading-relaxed text-muted">{panel.copy}</p>
          </div>
        </article>
      ))}

      <div aria-hidden="true" className="hidden shrink-0 lg:block lg:w-[8vw]" />
    </HorizontalScroll>
  );
}
