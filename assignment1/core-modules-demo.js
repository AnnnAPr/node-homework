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
