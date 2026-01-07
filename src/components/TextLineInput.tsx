interface TextLineInputProps {
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function TextLineInput({
  value = '',
  placeholder,
  onChange,
}: TextLineInputProps) {
  return (
    <input
      type="text"
      className="text-line-input"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
    />
  );
}
