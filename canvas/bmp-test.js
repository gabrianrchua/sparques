const fs = require('fs');
const bmpjs = require('bmp-js');
const crypto = require('crypto');

// data is ARGB format, 8 bpp
let data = Buffer.alloc(512 * 512 * 4);

crypto.randomFill(data, (err, data) => {
  if (err) {
    console.error("error", err);
    return;
  }

  const rawData = bmpjs.encode({
    data: data,
    width: 512,
    height: 512,
    bitPP: 24
  });

  fs.writeFileSync("./test.bmp", rawData.data);
});