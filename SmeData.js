const fs = require('fs');
const csv = require('csv-parser');

const smeData = [];

fs.createReadStream('sim.csv')
  .pipe(csv())
  .on('data', (row) => {
    smeData.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully parsed.');
    // Continue with further processing or start the Express.js server here
  });

  module.exports = smeData;

