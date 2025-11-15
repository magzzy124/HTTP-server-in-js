let pos = 0;
const buffer = Buffer.alloc(4096).fill(0);
buffer.set(Buffer.from("a\r\n"), 0);
const buffer2 = Buffer.alloc(10);
buffer.copy(buffer2, 0, 0, buffer.indexOf("\r\n") + 2);
console.log(buffer, buffer2);
// console.log(buffer.indexOf("\r\n"));
