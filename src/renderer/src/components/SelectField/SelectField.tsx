import { selectFieldVariants } from '@/components/SelectField/SelectField.variants';
import type { SelectFieldProps } from '@/components/SelectField/SelectField.types';

export function SelectField({ label, value, onChange, options, wide }: SelectFieldProps) {
  return (
    <label className={selectFieldVariants({ wide })}>
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full max-w-full bg-panel-2 text-text border border-border rounded-lg px-2.5 py-1.5 text-sm cursor-pointer"
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
