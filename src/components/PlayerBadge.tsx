interface PlayerBadgeProps {
  name: string;
  active?: boolean;
  onRemove?: () => void;
}

export default function PlayerBadge({ name, active = false, onRemove }: PlayerBadgeProps) {
  return (
    <div className={`player-badge ${active ? 'player-badge--active' : ''}`}>
      <span className="player-badge__name">{name}</span>
      {onRemove && (
        <button
          className="player-badge__remove"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
}
