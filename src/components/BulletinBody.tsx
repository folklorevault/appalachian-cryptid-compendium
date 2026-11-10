import Image from "next/image";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image";
import type { BulletinFormat } from "@/types/sanity";

// Shapes written by the Studio's built-in table plugin and the bulletin
// body members (see sanity/appalachian-cryptid/schemaTypes).
interface TableCell {
  _key: string;
  value?: PortableTextBlock[];
}

interface TableValue {
  headerRows?: number;
  rows?: Array<{ _key: string; cells?: TableCell[] }>;
}

interface BodyImageValue {
  asset?: { _ref: string };
  alt?: string;
  caption?: string;
  credit?: string;
  placement?: "inline" | "margin";
  dimensions?: { width: number; height: number };
  lqip?: string;
}

interface MarginNoteValue {
  label?: string;
  text?: string;
}

// Cell content is real Portable Text, but paragraphs inside a cell render as
// spans so the page-level `[&_p]` prose margins don't pad every row.
const cellComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <span className="block">{children}</span>,
  },
};

function CellContent({ cell }: { cell?: TableCell }) {
  return cell?.value ? (
    <PortableText value={cell.value} components={cellComponents} />
  ) : null;
}

function splitRows(value: TableValue) {
  const rows = value.rows ?? [];
  const headerCount = Math.min(value.headerRows ?? 0, rows.length);
  return { headRows: rows.slice(0, headerCount), bodyRows: rows.slice(headerCount) };
}

function BulletinTable({ value }: { value: TableValue }) {
  const { headRows, bodyRows } = splitRows(value);
  if (headRows.length + bodyRows.length === 0) return null;

  return (
    <div className="not-prose my-8 overflow-x-auto border-y-2 border-bureau-ink-muted">
      <table className="w-full border-collapse text-sm">
        {headRows.length > 0 && (
          <thead>
            {headRows.map((row) => (
              <tr key={row._key} className="border-b border-bureau-ink-muted">
                {row.cells?.map((cell) => (
                  <th
                    key={cell._key}
                    scope="col"
                    className="py-2 pr-4 text-left align-bottom font-typewriter text-tag font-normal uppercase tracking-label text-muted-foreground"
                  >
                    <CellContent cell={cell} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        )}
        <tbody>
          {bodyRows.map((row) => (
            <tr key={row._key} className="border-b border-border last:border-b-0">
              {row.cells?.map((cell, i) =>
                // The first column labels its row (a field name, a year).
                i === 0 ? (
                  <th
                    key={cell._key}
                    scope="row"
                    className="py-2 pr-4 text-left align-top font-typewriter text-xs font-normal tracking-type text-muted-foreground"
                  >
                    <CellContent cell={cell} />
                  </th>
                ) : (
                  <td key={cell._key} className="py-2 pr-4 align-top text-foreground">
                    <CellContent cell={cell} />
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Specimen reports read a table as a dated record: column one is the year
// rail, column two the heading, column three a byline, the rest the note.
// A Year | Identification | Examiner | Notes table becomes a two-column
// timeline that fits a phone without scrolling.
function TimelineTable({ value }: { value: TableValue }) {
  const { headRows, bodyRows } = splitRows(value);
  if (bodyRows.length === 0) return null;
  const head = headRows[headRows.length - 1]?.cells;
  const headCell = "pb-2.5 align-bottom font-typewriter text-tag font-normal uppercase tracking-label text-muted-foreground";

  return (
    <table className="not-prose my-8 w-full border-collapse text-left">
      {head && (
        <thead>
          <tr>
            <th scope="col" className={`w-16 border-r border-bureau-border pr-3 text-right sm:w-22 sm:pr-5 ${headCell}`}>
              <CellContent cell={head[0]} />
            </th>
            <th scope="col" className={`pl-4 text-left sm:pl-6 ${headCell}`}>
              <CellContent cell={head[1]} />
            </th>
          </tr>
        </thead>
      )}
      <tbody>
        {bodyRows.map((row) => {
          const [rail, title, byline, ...notes] = row.cells ?? [];
          return (
            <tr key={row._key} className="align-top">
              <th
                scope="row"
                className="border-r border-bureau-border pt-1 pr-3 pb-7 text-right font-typewriter text-xs font-normal tracking-type text-primary sm:pr-5"
              >
                <CellContent cell={rail} />
              </th>
              <td className="pb-7 pl-4 sm:pl-6">
                <div className="font-display text-xl font-bold leading-tight text-foreground">
                  <CellContent cell={title} />
                </div>
                {byline && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    <CellContent cell={byline} />
                  </div>
                )}
                {notes.map((cell) => (
                  <div key={cell._key} className="mt-1.5 text-base leading-relaxed text-foreground">
                    <CellContent cell={cell} />
                  </div>
                ))}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function imageSrc(value: BodyImageValue, width: number) {
  return urlFor(value).width(width).fit("max").quality(80).url();
}

function BulletinImage({ value }: { value: BodyImageValue }) {
  if (!value.asset) return null;
  const { width = 1440, height = 960 } = value.dimensions ?? {};

  return (
    <figure className="not-prose my-8">
      <Image
        src={imageSrc(value, 1440)}
        alt={value.alt ?? ""}
        width={width}
        height={height}
        sizes="(min-width: 768px) 720px, 100vw"
        placeholder={value.lqip ? "blur" : "empty"}
        blurDataURL={value.lqip}
        className="h-auto w-full border border-border"
      />
      {(value.caption || value.credit) && (
        <figcaption className="mt-2 font-typewriter text-xs tracking-type text-muted-foreground">
          {value.caption}
          {value.credit && (
            <span className="block text-muted-foreground/80">{value.credit}</span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

// Sidenote placement: on wide screens a margin item floats into the gutter
// to the right of the text column (a negative right margin wider than the
// item, so it takes no room from the paragraph beside it). Below lg it falls
// inline, under the paragraph before it.
const marginItem =
  "not-prose my-6 lg:float-right lg:clear-right lg:-mr-64 lg:mt-1 lg:mb-8 lg:w-56";

function MarginFigure({ value }: { value: BodyImageValue }) {
  if (!value.asset) return null;
  const { width = 800, height = 800 } = value.dimensions ?? {};

  return (
    <figure className={`${marginItem} grid grid-cols-[6rem_minmax(0,1fr)] items-start gap-3.5 lg:block`}>
      <Image
        src={imageSrc(value, 600)}
        alt={value.alt ?? ""}
        width={width}
        height={height}
        sizes="(min-width: 1024px) 224px, 96px"
        placeholder={value.lqip ? "blur" : "empty"}
        blurDataURL={value.lqip}
        className="h-auto w-full"
      />
      {(value.caption || value.credit) && (
        <figcaption className="text-xs leading-relaxed text-muted-foreground lg:mt-2">
          {value.caption}
          {value.credit && <span className="block">{value.credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}

// Divs, not <p>: the specimen essay's `[&_p]:mb-5` would otherwise pad
// the label away from its note.
function MarginNote({ value }: { value: MarginNoteValue }) {
  if (!value.text) return null;
  return (
    <aside className={`${marginItem} border-t border-foreground pt-3`}>
      {value.label && (
        <div className="mb-1.5 font-typewriter text-tag uppercase tracking-label text-muted-foreground">
          {value.label}
        </div>
      )}
      <div className="text-sm leading-relaxed text-foreground">{value.text}</div>
    </aside>
  );
}

// Standard bulletins have no margin column, so notes sit in the text flow.
function InlineNote({ value }: { value: MarginNoteValue }) {
  if (!value.text) return null;
  return (
    <aside className="not-prose my-6 border-y border-border py-3">
      {value.label && (
        <p className="mb-1 font-typewriter text-tag uppercase tracking-label text-muted-foreground">
          {value.label}
        </p>
      )}
      <p className="text-sm leading-relaxed text-foreground">{value.text}</p>
    </aside>
  );
}

const standardComponents: PortableTextComponents = {
  types: {
    table: BulletinTable,
    bodyImage: BulletinImage,
    marginNote: InlineNote,
  },
};

const specimenComponents: PortableTextComponents = {
  types: {
    table: TimelineTable,
    bodyImage: ({ value }: { value: BodyImageValue }) =>
      value.placement === "margin" ? (
        <MarginFigure value={value} />
      ) : (
        <BulletinImage value={value} />
      ),
    marginNote: MarginNote,
  },
};

export function BulletinBody({
  value,
  variant = "standard",
}: {
  value: PortableTextBlock[];
  variant?: BulletinFormat;
}) {
  return (
    <PortableText
      value={value}
      components={variant === "specimen" ? specimenComponents : standardComponents}
    />
  );
}
