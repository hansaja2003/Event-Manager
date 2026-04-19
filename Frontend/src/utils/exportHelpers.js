export const downloadBlobFile = (data, fileName, mimeType = "application/octet-stream") => {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
  const objectUrl = window.URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  window.URL.revokeObjectURL(objectUrl);
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const exportTableToPdf = ({ title = "Report", columns = [], rows = [] }) => {
  const printableWindow = window.open("", "_blank", "width=1000,height=700");

  if (!printableWindow) {
    throw new Error("Popup blocked. Please allow popups to export PDF.");
  }

  const headerCells = columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");
  const statusColumnIndex = columns.findIndex((column) => String(column).toLowerCase() === "status");
  const formatStatusClass = (value) => {
    const normalized = String(value || "").toLowerCase();
    if (normalized.includes("complete") || normalized.includes("approved")) return "status-ok";
    if (normalized.includes("pending") || normalized.includes("draft")) return "status-warn";
    if (normalized.includes("reject") || normalized.includes("cancel")) return "status-danger";
    return "status-neutral";
  };

  const bodyRows = rows
    .map((row) => {
      const cells = row
        .map((cell, index) => {
          if (index === statusColumnIndex) {
            return `<td><span class="status-pill ${formatStatusClass(cell)}">${escapeHtml(cell)}</span></td>`;
          }
          return `<td>${escapeHtml(cell)}</td>`;
        })
        .join("");

      return `<tr>${cells}</tr>`;
    })
    .join("");

  const generatedAt = new Date().toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <style>
      body {
        font-family: "Segoe UI", Arial, sans-serif;
        margin: 0;
        padding: 24px;
        color: #1f2937;
        background: #f8fafc;
      }

      .report-shell {
        background: #ffffff;
        border: 1px solid #dbeafe;
        border-radius: 14px;
        padding: 20px;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.07);
      }

      .report-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 16px;
      }

      h1 {
        margin: 0;
        font-size: 24px;
        line-height: 1.2;
        color: #1d4ed8;
      }

      .meta {
        margin-top: 6px;
        color: #64748b;
        font-size: 12px;
      }

      .count-chip {
        background: #eff6ff;
        color: #1e40af;
        font-size: 12px;
        font-weight: 600;
        border: 1px solid #bfdbfe;
        border-radius: 999px;
        padding: 6px 12px;
      }

      table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        font-size: 12px;
        border: 1px solid #bfdbfe;
        border-radius: 10px;
        overflow: hidden;
      }

      th, td {
        border-right: 1px solid #dbeafe;
        border-bottom: 1px solid #dbeafe;
        padding: 10px 8px;
        text-align: left;
        vertical-align: top;
      }

      th:last-child, td:last-child {
        border-right: none;
      }

      tbody tr:last-child td {
        border-bottom: none;
      }

      th {
        background: #eff6ff;
        color: #1e3a8a;
        font-weight: 700;
        letter-spacing: 0.02em;
      }

      tbody tr:nth-child(even) {
        background: #f8fbff;
      }

      .status-pill {
        display: inline-block;
        border-radius: 999px;
        padding: 3px 8px;
        font-size: 10px;
        font-weight: 700;
        border: 1px solid transparent;
      }

      .status-ok {
        color: #166534;
        background: #dcfce7;
        border-color: #86efac;
      }

      .status-warn {
        color: #92400e;
        background: #fef3c7;
        border-color: #fcd34d;
      }

      .status-danger {
        color: #991b1b;
        background: #fee2e2;
        border-color: #fca5a5;
      }

      .status-neutral {
        color: #334155;
        background: #e2e8f0;
        border-color: #cbd5e1;
      }

      @page {
        size: A4 landscape;
        margin: 12mm;
      }
    </style>
  </head>
  <body>
    <div class="report-shell">
      <div class="report-header">
        <div>
          <h1>${escapeHtml(title)}</h1>
          <div class="meta">Generated on ${escapeHtml(generatedAt)}</div>
        </div>
        <div class="count-chip">${rows.length} rows</div>
      </div>

      <table>
        <thead>
          <tr>${headerCells}</tr>
        </thead>
        <tbody>
          ${bodyRows}
        </tbody>
      </table>
    </div>
  </body>
</html>`;

  printableWindow.document.open();
  printableWindow.document.write(html);
  printableWindow.document.close();

  let hasPrinted = false;

  const printWhenReady = () => {
    if (hasPrinted) return;
    hasPrinted = true;
    printableWindow.focus();
    printableWindow.print();
  };

  // Ensure the new document fully loads before invoking the browser print dialog.
  printableWindow.onload = printWhenReady;
  setTimeout(printWhenReady, 300);
};