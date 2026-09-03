/**
 * Structured data for a species page.
 *
 * Two nodes, and only two, because only two are supported by what the record
 * actually holds:
 *
 * - a `Taxon`, which is what the page is *about* — the fish, its scientific
 *   name and the common names people search for;
 * - an `Article`, which is what the page *is* — a reviewed document with an
 *   author, a review date and named citations.
 *
 * Everything emitted below is copied from the record. There is no `image`
 * unless a reviewed image exists, no `aggregateRating` (there is nothing to
 * rate), no `FAQPage` markup wrapped around prose that is not a FAQ, and no
 * `HowTo` — this app does not publish instructions for catching a fish and
 * saying so in JSON-LD would be a claim the visible page refuses to make.
 *
 * `citation` carries the real sources. A structured-data block that invented a
 * citation would be worse than none: it would launder an unsourced claim into
 * a machine-readable one.
 */

import { SITE_ORIGIN } from "../site.ts";
import type { SpeciesPageModel } from "./species-page.ts";

type Json = Record<string, unknown>;

export function speciesJsonLd(model: SpeciesPageModel): Json {
  const url = `${SITE_ORIGIN}${model.path}`;

  const taxon: Json = {
    "@type": "Taxon",
    "@id": `${url}#taxon`,
    name: model.scientificName,
    alternateName: [model.commonName, ...model.alsoCalled],
    taxonRank: "species",
    description: model.standfirst,
  };
  if (model.image) {
    taxon.image = `${SITE_ORIGIN}${model.image.canonical}`;
  }

  const citations = model.sources.map((source) => {
    const entry: Json = {
      "@type": "CreativeWork",
      name: source.label,
    };
    if (source.url) entry.url = source.url;
    return entry;
  });

  const article: Json = {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: model.commonName,
    name: model.meta.title,
    description: model.meta.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    about: { "@id": `${url}#taxon` },
    isAccessibleForFree: true,
    inLanguage: "en",
    dateModified: model.reviewedAt,
    author: {
      "@type": "Organization",
      name: "Hook the Horizon",
      url: "https://hookthehorizon.blog",
    },
    publisher: {
      "@type": "Organization",
      name: "Hook the Horizon",
      url: "https://hookthehorizon.blog",
    },
  };
  if (citations.length > 0) article.citation = citations;

  return {
    "@context": "https://schema.org",
    "@graph": [taxon, article],
  };
}

/** The index page: a list of the documents, nothing more. */
export function speciesIndexJsonLd(entries: { path: string; name: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_ORIGIN}/species`,
    url: `${SITE_ORIGIN}/species`,
    name: "Reviewed species records",
    description:
      "Every reviewed species record in Species & Presentation Analyst, with the water it is documented in, its target status and what the record does not know.",
    isPartOf: { "@type": "WebSite", name: "Hook the Horizon", url: SITE_ORIGIN },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: entries.length,
      itemListElement: entries.map((entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: entry.name,
        url: `${SITE_ORIGIN}${entry.path}`,
      })),
    },
  };
}
