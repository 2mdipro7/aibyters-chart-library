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
            <th scope="col" style={{ width: '18%' }}>Prop</th>
            <th scope="col" style={{ width: '22%' }}>Type</th>
            <th scope="col" style={{ width: '13%' }}>Required</th>
            <th scope="col" style={{ width: '13%' }}>Default</th>
            <th scope="col" style={{ width: '34%' }}>Description</th>
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
      <dl className="props-list">
        {data.map(prop => (
          <div className="props-list-item" key={prop.name}>
            <dt><code className="prop-name">{prop.name}</code></dt>
            <dd>
              <p>{prop.description}</p>
              <dl className="props-metadata">
                <div><dt>Type</dt><dd><code className="prop-type">{prop.type}</code></dd></div>
                <div><dt>Required</dt><dd>{prop.required ? 'Yes' : 'No'}</dd></div>
                <div><dt>Default</dt><dd><code>{prop.default}</code></dd></div>
              </dl>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
