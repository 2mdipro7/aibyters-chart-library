import React from 'react';

export interface PropDef {
  name: string;
  type: string;
  required: boolean;
  default: string;
  description: string;
}

export function PropsTable({ data }: { data: PropDef[] }) {
  return (
    <div className="props-table-container">
      <h2 className="chart-page-section-title">Props API</h2>
      <table className="props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Required</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map(prop => (
            <tr key={prop.name}>
              <td><code className="prop-name">{prop.name}</code></td>
              <td><code className="prop-type">{prop.type}</code></td>
              <td>{prop.required ? <span className="prop-required">Yes</span> : 'No'}</td>
              <td><code>{prop.default}</code></td>
              <td>{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
