import * as XLSX from 'xlsx';

const readExcel = (file: File): Promise<any[]> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = e.target?.result;
    if (data) {
      try {
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Strategy 3: Dynamic Header Detection
        // Convert to array of arrays first to find the header row
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

        let headerRowIndex = 0;
        // Look for common headers（为了命中首行 TableHead 设定关键词）
        const knownHeaders = ['日期', '时间', '交易时间', 'Date', 'Time'];

        // 黑名单关键词，避免误判（eg. 关键词：日期； 命中了“起始时间”、“终止时间” 直接跳过）
        const blacklistHeaders = [
          // Wx
          '起始时间',
          '终止时间',
          '导出时间',
          '生成时间',
          '时间段',
          '所有时间均为UTC+08:00时间'
          // Wx-End
        ];

        for (let i = 0; i < Math.min(rows.length, 50); i++) { // Check first 50 rows
          const row = rows[i];
          if (row && row.some((cell: any) => typeof cell === 'string' && blacklistHeaders.some(bh => cell.includes(bh)))) {
            continue; // Skip rows with blacklisted keywords
          }

          if (row && row.some((cell: any) => typeof cell === 'string' && knownHeaders.some(h => cell.includes(h)))) {
            headerRowIndex = i;
            break;
          }
        }

        // Parse starting from the found header row
        const json = XLSX.utils.sheet_to_json(sheet, { range: headerRowIndex, raw: false, dateNF: 'yyyy-mm-dd hh:mm:ss' });
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
