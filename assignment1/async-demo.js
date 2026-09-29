const fs = require('fs');
const path = require('path');

const dirName = path.join(__dirname, 'sample-files');
const filename = 'sample.txt';
const filePath = path.join(dirName, filename);
const fileContent = 'Hello, async world!';

if (!fs.existsSync(dirName)) {
  fs.mkdirSync(dirName);
}

fs.writeFileSync(filePath, fileContent, 'utf8');

// Write a sample file for demonstration

// 1. Callback style
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`callback error: ${err}`);
    return;
  }
  console.log(`callback: ${data}`);
});


  // Callback hell example (test and leave it in comments):
  
  // fs.readFile(filePath, 'utf8', (err, data1) => {
  //   fs.readFile(filePath, 'utf8', (err, data2) => {
  //     fs.readFile(filePath, 'utf8', (err, data3) => {
  //       console.log('Nested: ',data1, data2, data3);
  //     });
  //   })
  // });


  // 2. Promise style
  fs.promises
    .readFile(filePath, 'utf8')
    .then(data => console.log(`promise: ${data}`))
    .catch(err => console.error(`promise error: ${err}`));

  // 3. Async/Await style

  async function runAsyncAwait () {
    try {
      const data = await fs.promises.readFile(filePath, 'utf8');
      console.log(`async/await: ${data}`);
    } catch (err) {
      console.error(`async/await error: ${err}`);
    }
  }

  runAsyncAwait();