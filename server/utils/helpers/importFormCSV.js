import fs from 'fs';
import csv from 'csv-parser';

// Path to the CSV file


// Read and parse the CSV file


export const readCSV = async (path) => {
  const csvFilePath = path;
  fs.createReadStream(csvFilePath)
    .pipe(csv()) // Parse the CSV file
    .on('data', (row) => {
      console.log(row);
      // Process each row
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });

}




export const readCsvAsync = async (filePath) => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}


