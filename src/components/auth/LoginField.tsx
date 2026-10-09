import type { HTMLInputTypeAttribute } from 'react';

interface LoginFieldProps {
  id: string;
  label: string;
  type: HTMLInputTypeAttribute;
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoFocus?: boolean;
  invalid?: boolean;
  errorId?: string;
}

// input bergaya xsolla user-id-modal__input dengan latar biru es dan bayangan dalam halus.
export function LoginField({
  id,
  label,
  type,
  autoComplete,
  value,
  onChange,
  placeholder,
  autoFocus = false,
  invalid = false,
  errorId,
}: LoginFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-black/80"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={errorId}
        spellCheck={false}
        className={`w-full rounded-[5px] bg-[#d9f8ff] hover:bg-[#c6e3e9] px-4 py-3.5 text-sm sm:text-base font-bold text-black placeholder:text-black/45 shadow-[inset_0_2px_4px_rgba(1,45,55,0.25)] outline-none transition-colors focus:ring-2 focus:ring-[#03afef] ${
          invalid ? 'ring-2 ring-red-500' : ''
        }`}
      />
    </div>
  );
}
