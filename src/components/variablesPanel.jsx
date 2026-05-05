import { useState } from 'react';

export function VariablesPanel({ variables }) {
  // variables shape: { local: {x: 1, y: 2}, global: {count: 5} }
  const scopes = Object.keys(variables);

  if (scopes.length === 0) {
    return (
      <div style={containerStyle}>
        <p style={{ color: '#4b5563', fontSize: '13px' }}>No variable data yet.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {scopes.map(scope => (
        <ScopeBlock key={scope} scope={scope} vars={variables[scope]} />
      ))}
    </div>
  );
}

function ScopeBlock({ scope, vars }) {
  const [open, setOpen] = useState(true);
  const entries = Object.entries(vars);

  return (
    <div style={{ marginBottom: '8px' }}>

      {/* Scope header — clickable to collapse */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          padding: '4px 0',
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: '11px', color: '#6b7280' }}>{open ? '▼' : '▶'}</span>
        <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {scope}
        </span>
        <span style={{ fontSize: '11px', color: '#4b5563' }}>({entries.length})</span>
      </div>

      {/* Key → value rows */}
      {open && (
        <div style={{ paddingLeft: '16px' }}>
          {entries.map(([key, value]) => (
            <div key={key} style={{
              display: 'flex',
              gap: '12px',
              padding: '4px 0',
              borderBottom: '1px solid #1e293b',
              fontFamily: 'monospace',
              fontSize: '13px',
            }}>
              <span style={{ color: '#7dd3fc', minWidth: '100px' }}>{key}</span>
              <span style={{ color: '#4b5563', marginRight: '4px' }}>=</span>
              <span style={{ color: getValueColor(value) }}>
                {formatValue(value)}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

// Color-code by JS type
function getValueColor(value) {
  if (typeof value === 'string')  return '#34d399';
  if (typeof value === 'number')  return '#fb923c';
  if (typeof value === 'boolean') return '#f472b6';
  if (value === null)             return '#6b7280';
  return '#e2e8f0';
}

// Readable display
function formatValue(value) {
  if (typeof value === 'string') return `"${value}"`;
  if (value === null)            return 'null';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

const containerStyle = {
  background: '#0f172a',
  borderRadius: '8px',
  padding: '12px',
  minHeight: '80px',
};