import { newsCategories, type NewsCategory } from "@/config/news-categories";

export type NewsFilter = NewsCategory | "all";

const filters = [
  "all",
  ...Object.keys(newsCategories),
] as readonly NewsFilter[];

export function NewsCategoryNav({
  active,
  onSelect,
}: {
  active: NewsFilter;
  onSelect: (category: NewsFilter) => void;
}) {
  return (
    <nav
      aria-label="News categories"
      className="min-w-0 overflow-x-auto overscroll-x-contain"
    >
      <ul className="flex min-w-max gap-1 border-b">
        {filters.map((category) => (
          <li key={category}>
            <button
              type="button"
              aria-pressed={active === category}
              aria-controls="latest-news-list"
              onClick={() => onSelect(category)}
              className="min-h-11 rounded-t-sm border-b-2 border-transparent px-3 text-xs font-semibold whitespace-nowrap text-muted-foreground outline-offset-[-3px] hover:bg-accent hover:text-foreground aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-primary sm:text-sm"
            >
              {category === "all" ? "All News" : newsCategories[category]}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
