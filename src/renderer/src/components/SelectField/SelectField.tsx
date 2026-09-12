import type { SelectFieldProps } from '@/components/SelectField/SelectField.types';

export function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-panel-2 text-text border border-border rounded-lg px-2.5 py-1.5 text-sm cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
