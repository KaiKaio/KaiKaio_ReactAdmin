// eslint-disable-next-line import/no-extraneous-dependencies
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
        const json = XLSX.utils.sheet_to_json(sheet);
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
