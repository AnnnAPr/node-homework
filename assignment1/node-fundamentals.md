# Node.js Fundamentals

## What is Node.js?
Node.js is a JavaScript runtime environment which allows execute JavaScript outside of browser, for example in terminal on my laptop.

## How does Node.js differ from running JavaScript in the browser?
Node.js run directly on computer on server system; uses to build APIs, backend services; 
has a global object as "global" (not "window" compare to browser); no DOM access; 
has full access to file system (read, write, delete files);
read env variables; use backend libraries; run server;

## What is the V8 engine, and how does Node use it?
V8 engine is a program which read JavaScript and turn it into instruction computer runs. 

## What are some key use cases for Node.js?
WebApi and servers which response to requests from browser;
Command-line tools which we run in our computer terminal;
Real-time app like chats which push updates instantly;

## Explain the difference between CommonJS and ES Modules. Give a code example of each.

**CommonJS (default in Node.js):**
```js
CommonJS import modules with 'require()' syntax; require() loads files or packages;

const math = require('./math.js');

```

**ES Modules (supported in modern Node.js):**
```js
ES Modules use 'import' keyword to import packages

import { useState, useEffect } from "react";
``` 