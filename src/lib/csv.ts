/** Exporta uma lista para CSV e dispara o download no navegador. */
export const downloadCsv = <T extends Record<string, unknown>>(
  filename: string,
  columns: { key: keyof T; label: string }[],
  rows: T[]
) => {
  const escape = (value: unknown) => {
    const text = value === null || value === undefined ? "" : String(value);
    return `"${text.replace(/"/g, '""')}"`;
  };

  const csv = [
    columns.map((c) => escape(c.label)).join(";"),
    ...rows.map((r) => columns.map((c) => escape(r[c.key])).join(";")),
  ].join("\r\n");

  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
