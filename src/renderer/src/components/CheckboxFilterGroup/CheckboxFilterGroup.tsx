import type { CheckboxFilterGroupProps } from '@/components/CheckboxFilterGroup/CheckboxFilterGroup.types';

export function CheckboxFilterGroup({ label, options, selected, onToggle }: CheckboxFilterGroupProps) {
  return (
    <div className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold">
      {label}
      <div className="flex flex-col gap-1.5 bg-panel-2 border border-border rounded-lg p-2 min-w-[180px]">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-accent flex-shrink-0"
              checked={selected.includes(option.value)}
              onChange={() => onToggle(option.value)}
            />
            <span className="font-bold text-body-sm truncate">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
