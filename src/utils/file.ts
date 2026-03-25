import * as XLSX from 'xlsx';

const readExcel = (file: File): Promise<any[]> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = e.target?.result;
    if (data) {
      try {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Strategy 3: Dynamic Header Detection
        // Convert to array of arrays first to find the header row
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

        let headerRowIndex = 0;
        // Look for common headers
        const knownHeaders = ['日期', '交易时间', 'Date', 'Time'];

        for (let i = 0; i < Math.min(rows.length, 50); i++) { // Check first 50 rows
          const row = rows[i];
          if (row && row.some((cell: any) => typeof cell === 'string' && knownHeaders.some(h => cell.includes(h)))) {
            headerRowIndex = i;
            break;
          }
        }

        // Parse starting from the found header row
        const json = XLSX.utils.sheet_to_json(sheet, { range: headerRowIndex });
        resolve(json);
      } catch (error) {
        reject(error);
      }
    } else {
      reject(new Error('File reading failed'));
    }
  };
  reader.onerror = error => reject(error);
  reader.readAsArrayBuffer(file);
});

export default readExcel;
