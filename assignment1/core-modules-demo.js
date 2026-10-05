const os = require('os');
const path = require('path');
const fs = require('fs');

const sampleFilesDir = path.join(__dirname, 'sample-files');
if (!fs.existsSync(sampleFilesDir)) {
  fs.mkdirSync(sampleFilesDir, { recursive: true });
}

// OS module
console.log('Platform:', os.platform());
console.log('CPU:', os.cpus()[0].model);
console.log('Total Memory:', os.totalmem() / 1024 ** 2, 'GB');


// Path module
console.log('Joined path:', path.join(__dirname, 'sample-files', 'sample.txt'));

// fs.promises API
async function writeRead() {
  try {
    await fs.promises.writeFile(path.join(sampleFilesDir, 'demo.txt'), 'Hello from fs.promises!', 'utf8');
    const data = await fs.promises.readFile(path.join(sampleFilesDir, 'demo.txt'), 'utf8');
    console.log('fs.promises read:', data);
  }
  catch (err){
    console.error('fs.promises error: ', err);
  }
}

writeRead();

// Streams for large files- log first 40 chars of each chunk
const largeFilePath = path.join(sampleFilesDir, 'largefile.txt');

// Add lines to the lines array
const lines = [];
for (let i = 1; i <= 100; i++) {
  lines.push(`Line ${i}: This is a line in a large file used to demonstrate streaming.`);
}

// Add 100 lines to the large file
fs.writeFileSync(largeFilePath, lines.join('\n'), 'utf8');

// Streams for large files - log first 40 chars of each chunk
const readStream = fs.createReadStream(largeFilePath, { highWaterMark: 1024 });

readStream.on('data', (chunk) => {
  console.log('Read chunk:', chunk.toString().substring(0, 40));
});

readStream.on('end', () => {
  console.log('Finished reading large file with streams.');
});

readStream.on('error', (err) => {
  console.error('Error reading large file with streams:', err);
});