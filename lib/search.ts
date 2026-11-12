export type SearchHeading = {
  id: string;
  text: string;
  depth: number;
};

export type SearchRecord = {
  title: string;
  description: string;
  section: string;
  sectionId: string;
  href: string;
  headings: SearchHeading[];
  content: string;
  words: number;
  order: number;
};

export type SearchIndex = {
  generatedAt: string;
  count: number;
  records: SearchRecord[];
};

export type SearchResult = {
  id: string;
  title: string;
  section: string;
  href: string;
  snippet: string;
  score: number;
  heading?: string;
};

export function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^\p{L}\p{N}_+.#-]+/u)
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .slice(0, 8);
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    count += 1;
    index = haystack.indexOf(needle, index + needle.length);
  }
  return count;
}

function snippetFor(content: string, tokens: string[]): string {
  const lower = content.toLowerCase();
  let position = -1;
  for (const token of tokens) {
    const found = lower.indexOf(token);
    if (found !== -1 && (position === -1 || found < position)) position = found;
  }
  if (position === -1) {
    return content.slice(0, 170).trim() + (content.length > 170 ? "…" : "");
  }
  const start = Math.max(0, position - 65);
  const end = Math.min(content.length, position + 130);
  return `${start > 0 ? "…" : ""}${content.slice(start, end).trim()}${end < content.length ? "…" : ""}`;
}

export function searchIndex(index: SearchIndex, query: string, limit = 12): SearchResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const results: SearchResult[] = [];

  for (const record of index.records) {
    const title = record.title.toLowerCase();
    const description = record.description.toLowerCase();
    const section = record.section.toLowerCase();
    const content = record.content.toLowerCase();

    let score = 0;
    let allMatch = true;

    for (const token of tokens) {
      let tokenScore = 0;
      if (title === token) tokenScore += 40;
      else if (title.startsWith(token)) tokenScore += 24;
      else if (title.includes(token)) tokenScore += 14;
      if (section.includes(token)) tokenScore += 4;
      if (description.includes(token)) tokenScore += 5;

      let headingMatches = 0;
      for (const heading of record.headings) {
        if (heading.text.toLowerCase().includes(token)) headingMatches += 1;
      }
      tokenScore += Math.min(15, headingMatches * 6);

      const occurrences = countOccurrences(content, token);
      if (occurrences > 0) tokenScore += Math.min(8, 1 + Math.log2(occurrences));

      if (tokenScore === 0) {
        allMatch = false;
        break;
      }
      score += tokenScore;
    }

    if (!allMatch) continue;

    const phrase = tokens.join(" ");
    if (title.includes(phrase)) score += 24;
    if (description.includes(phrase)) score += 8;

    results.push({
      id: record.href,
      title: record.title,
      section: record.section,
      href: record.href,
      snippet: snippetFor(record.content, tokens),
      score,
    });

    for (const heading of record.headings) {
      const headingText = heading.text.toLowerCase();
      if (!tokens.every((token) => headingText.includes(token) || content.includes(token))) continue;
      const headingHits = tokens.filter((token) => headingText.includes(token)).length;
      if (headingHits === 0) continue;
      results.push({
        id: `${record.href}#${heading.id}`,
        title: record.title,
        section: record.section,
        href: `${record.href}#${heading.id}`,
        snippet: heading.text,
        score: score * 0.72 + headingHits * 9,
        heading: heading.text,
      });
    }
  }

  const seen = new Set<string>();
  return results
    .sort((a, b) => b.score - a.score)
    .filter((result) => {
      if (seen.has(result.href)) return false;
      seen.add(result.href);
      return true;
    })
    .slice(0, limit);
}

export type HighlightPart = { text: string; hit: boolean };

export function highlight(text: string, query: string): HighlightPart[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [{ text, hit: false }];
  const escaped = tokens
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts: HighlightPart[] = [];
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) parts.push({ text: text.slice(last, index), hit: false });
    parts.push({ text: match[0], hit: true });
    last = index + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), hit: false });
  return parts;
}
