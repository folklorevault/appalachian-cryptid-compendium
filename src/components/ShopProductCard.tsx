import Image from "next/image";

const STRIPE_URL = "https://buy.stripe.com/3cI4gzfhjbjd8fS8Fx3ZK00";

const SPECS: [string, string][] = [
  ["Diameter", '2.5″'],
  ["Material", "Vinyl with matte laminate"],
  ["Print", "Eco-friendly inks"],
  ["Rated", "Weather / water / scratch / UV resistant"],
  ["Use", "Laptops, bottles, notebooks, vehicles, outdoor gear"],
];

const GALLERY = [
  { src: "/products/doorpic.jpg", alt: "Decal applied to a surface" },
  { src: "/products/laptop.jpg", alt: "Decal on a laptop" },
  { src: "/products/outdoor.jpg", alt: "Decal in an outdoor setting" },
  { src: "/products/upclose.jpg", alt: "Decal close-up detail" },
];

export const ShopProductCard = () => (
  <div
    className="mx-auto max-w-[640px]"
    style={{ transform: "rotate(0.8deg)" }}
  >
    <div className="supply-card-inner border border-border/40 rounded-sm p-6 sm:p-8 relative overflow-hidden">
      {/* Form reference */}
      <span className="absolute top-3 right-4 font-typewriter text-[8px] text-muted-foreground tracking-wider z-3">
        Form SRD-09
      </span>

      {/* Header */}
      <div className="border-b-[3px] border-double border-foreground/40 pb-2 mb-5 relative z-2">
        <p className="font-typewriter text-[9px] tracking-eyebrow uppercase text-muted-foreground text-center">
          Field Supply Drop
        </p>
      </div>

      {/* Hero image */}
      <div className="relative z-2 mb-5 flex justify-center">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-sm border border-border overflow-hidden">
          <Image
            src="/products/sticker.png"
            alt="Appalachian Cryptid vinyl decal"
            fill
            sizes="(max-width: 640px) 256px, 320px"
            className="object-cover sepia-[0.2] saturate-75 contrast-[1.05]"
          />
        </div>
      </div>

      {/* Title + item number */}
      <div className="text-center mb-4 relative z-2">
        <h2 className="font-display font-bold text-xl text-foreground leading-tight">
          Appalachian Cryptid Decal
        </h2>
        <p className="font-typewriter text-[10px] tracking-wider text-muted-foreground mt-1">
          Item No. BFC-001
        </p>
      </div>

      {/* Description */}
      <p className="font-typewriter text-xs text-foreground/75 leading-relaxed text-center mb-5 relative z-2 max-w-md mx-auto">
        A durable vinyl sticker featuring the Appalachian Cryptid emblem.
        Built for field use.
      </p>

      {/* Gallery */}
      <div className="relative z-2 mb-5">
        <p className="font-typewriter text-[9px] tracking-label uppercase text-muted-foreground mb-2 text-center">
          Field Photographs
        </p>
        <div className="grid grid-cols-2 gap-2">
          {GALLERY.map(({ src, alt }) => (
            <div
              key={src}
              className="relative aspect-4/3 overflow-hidden rounded-sm border border-border"
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 640px) 45vw, 280px"
                className="object-cover sepia-[0.15] saturate-[0.9] contrast-[1.02]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-foreground/15 mb-4 relative z-2" />

      {/* Specs */}
      <div className="space-y-1.5 mb-5 relative z-2">
        {SPECS.map(([label, value]) => (
          <div
            key={label}
            className="flex gap-3 font-typewriter text-[10px] sm:text-xs"
          >
            <span className="uppercase tracking-wider text-muted-foreground shrink-0 w-16">
              {label}
            </span>
            <span className="text-foreground/80 border-b border-dotted border-foreground/20 flex-1">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Price + Buy */}
      <div className="pt-3 border-t border-dashed border-foreground/15 relative z-2 text-center">
        <div className="mb-3">
          <span className="font-display font-bold text-2xl text-foreground">
            $4.00
          </span>
          <span className="font-typewriter text-[10px] text-muted-foreground ml-2 tracking-wider uppercase">
            Free shipping
          </span>
        </div>
        <a
          href={STRIPE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="supply-stamp-btn inline-flex items-center px-6 py-2 border-[3px] border-accent rounded-sm font-bold uppercase tracking-widest text-xs font-display text-accent bg-[hsl(var(--bureau-manila)/0.85)] shadow-[inset_0_0_0_2px_hsl(var(--accent))] hover:bg-accent/10 active:bg-accent/20 transition-colors duration-200"
          style={{ transform: "rotate(-1deg)" }}
        >
          <span style={{ filter: "url(#__svg-stamp-texture)" }}>
            Buy Now &rarr;
          </span>
        </a>
      </div>
    </div>
  </div>
);
