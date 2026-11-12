import rawSections from "@/content/sections.json";

export type Section = {
  id: string;
  label: string;
  order: number;
  description: string;
};

export const sections: Section[] = [...rawSections].sort((a, b) => a.order - b.order);

export function getSection(id: string): Section | undefined {
  return sections.find((section) => section.id === id);
}
