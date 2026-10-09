export const ClassificationStripe = () => (
  <div aria-hidden="true" className="bg-primary border-b border-primary/80 py-2 px-4 text-center overflow-hidden whitespace-nowrap">
    <span className="font-typewriter text-tag tracking-eyebrow uppercase text-primary-foreground/75">
      {/* "Appalachian" drops on phones so Field Office No. 7 isn't clipped; the header names the region */}
      <span className="hidden sm:inline">Appalachian </span>Cryptid Division
      <span className="inline-block mx-3 text-primary-foreground/35 text-tag">
        ◆
      </span>
      <span className="hidden sm:inline">
        Dept. of Unexplained Phenomena
        <span className="inline-block mx-3 text-primary-foreground/35 text-tag">
          ◆
        </span>
      </span>
      Field Office No. 7
    </span>
  </div>
);
