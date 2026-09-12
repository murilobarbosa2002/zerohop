import { LogCategory } from '@shared/logEntry';
import { categoryPillVariants } from '@/components/LogsScreen/LogsScreen.variants';
import { LOG_STRINGS } from '@/strings/logs.strings';
import type { CategoryFilterProps } from '@/components/LogsScreen/LogsScreen.types';

const CATEGORIES = Object.values(LogCategory);

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button onClick={() => onSelect(null)} className={categoryPillVariants({ active: selected === null })}>
        {LOG_STRINGS.allCategoriesFilter}
      </button>
      {CATEGORIES.map((category) => (
        <button key={category} onClick={() => onSelect(category)} className={categoryPillVariants({ active: selected === category })}>
          {LOG_STRINGS.categoryLabels[category]}
        </button>
      ))}
    </div>
  );
}
