import { parse as csvParse } from 'csv-parse/sync';
import pdfParseLib from 'pdf-parse';
import xlsx from 'xlsx';

// pdf-parse has a quirky default export — handle both CJS and ESM shapes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pdfParse = (typeof (pdfParseLib as any) === 'function' ? pdfParseLib : (pdfParseLib as any).default) as (buf: Buffer) => Promise<{ text: string }>;

export async function parseCSV(buffer: Buffer) {
  const text = buffer.toString('utf-8');
  return csvParse(text, { columns: true, skip_empty_lines: true });
}

export async function parsePDF(buffer: Buffer) {
  const data = await pdfParse(buffer);
  // Basic PDF transaction extraction: look for lines with date, description, amount
  const lines = data.text.split(/\r?\n/);
  const transactions = [];
  const dateRegex = /\b(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})\b/;
  for (const line of lines) {
    // Example: 2025-12-01 Rent Payment -5000
    const match = line.match(dateRegex);
    if (match) {
      const [date] = match;
      // Try to extract amount (last number in line)
      const amountMatch = line.match(/(-?\d+[.,]?\d*)\s*$/);
      const amount = amountMatch ? amountMatch[1].replace(',', '') : null;
      // Description is everything between date and amount
      const descStart = line.indexOf(date) + date.length;
      const descEnd = amountMatch ? line.lastIndexOf(amountMatch[1]) : line.length;
      const description = line.slice(descStart, descEnd).trim();
      if (date && amount && description) {
        transactions.push({ date, description, amount });
      }
    }
  }
  return transactions;
}

export function parseXLSX(buffer: Buffer) {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
}
