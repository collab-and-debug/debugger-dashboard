import { useState } from 'react';

export function VariablesPanel({ variables }) {
  const scopes = Object.keys(variables);

  return (
    <div style={containerStyle}>
      {scopes.length === 0 ? (
        <p style={{ color: '#8a6a43' }}>Waiting for a debug session to start...</p>
      ) : (
        scopes.map((scope) => <ScopeBlock key={scope} scope={scope} vars={variables[scope]} />)
      )}
    </div>
  );
}

function ScopeBlock({ scope, vars }) {
  const [open, setOpen] = useState(true);
  const entries = Object.entries(vars);

  return (
    <div style={{ marginBottom: '8px' }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          padding: '4px 0',
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: '11px', color: '#8a6a43' }}>{open ? '▼' : '▶'}</span>
        <span
          style={{
            fontSize: '12px',
            color: '#15803d',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {scope}
        </span>
        <span style={{ fontSize: '11px', color: '#9a7b57' }}>({entries.length})</span>
      </div>

      {open && (
        <div style={{ paddingLeft: '16px' }}>
          {entries.map(([key, value]) => (
            <div
              key={key}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '4px 0',
                borderBottom: '1px solid #f3dfc2',
                fontFamily: 'monospace',
                fontSize: '13px',
              }}
            >
              <span style={{ color: '#15803d', minWidth: '100px' }}>{key}</span>
              <span style={{ color: '#9a7b57', marginRight: '4px' }}>=</span>
              <span style={{ color: getValueColor(value) }}>{formatValue(value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getValueColor(value) {
  if (typeof value === 'string') return '#15803d';
  if (typeof value === 'number') return '#ea580c';
  if (typeof value === 'boolean') return '#b45309';
  if (value === null) return '#9a7b57';
  return '#3f2f1e';
}

function formatValue(value) {
  if (typeof value === 'string') return `"${value}"`;
  if (value === null) return 'null';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

const containerStyle = {
  background: '#fffaf3',
  borderRadius: '8px',
  padding: '12px',
  minHeight: '80px',
  border: '1px solid #f5c48b',
};