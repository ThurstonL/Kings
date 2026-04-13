import type { RuleDefinition } from '../engine/types';

interface RuleEditorProps {
  rule: RuleDefinition;
  onChange: (updated: RuleDefinition) => void;
  isModified: boolean;
}

export default function RuleEditor({ rule, onChange, isModified }: RuleEditorProps) {
  return (
    <div className={`rule-editor ${isModified ? 'rule-editor--modified' : ''}`}>
      <div className="rule-editor__rank">
        <span className="rule-editor__rank-value">{rule.rank}</span>
      </div>
      <div className="rule-editor__content">
        <input
          className="rule-editor__label"
          type="text"
          value={rule.label}
          onChange={(e) => onChange({ ...rule, label: e.target.value })}
          placeholder="Rule name"
          aria-label={`Rule name for ${rule.rank}`}
        />
        <textarea
          className="rule-editor__prompt"
          value={rule.prompt}
          onChange={(e) => onChange({ ...rule, prompt: e.target.value })}
          placeholder="Rule description"
          rows={2}
          aria-label={`Rule prompt for ${rule.rank}`}
        />
      </div>
      {isModified && <span className="rule-editor__modified-dot" title="Modified">●</span>}
    </div>
  );
}
