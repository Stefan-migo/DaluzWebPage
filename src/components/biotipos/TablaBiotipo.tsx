"use client";

export type TablaBiotipoProps = {
  title: string;
  columns: string[];
  rows: Array<Record<string, string>>;
};

export default function TablaBiotipo({ title, columns, rows }: TablaBiotipoProps) {
  return (
    <div className="tabla-biotipo">
      <div className="tabla-biotipo-header">
        <h3 className="tabla-biotipo-title">{title}</h3>
      </div>
      <div className="tabla-biotipo-body">
        <table className="tabla-biotipo-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col} data-label={col}>
                    {row[col] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
