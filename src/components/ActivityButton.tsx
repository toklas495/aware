interface ActivityButtonProps {
  label: string;
  onSelect: () => void;
}

export function ActivityButton({
  label,
  onSelect,
}: ActivityButtonProps) {
  return (
    <button
      className="activity-button"
      onClick={onSelect}
    >
      {label}
    </button>
  );
}
