import 'regenerator-runtime/runtime';
import LEDuino from '@elliottkember/leduino';
import build from './build';

new LEDuino({
  rows: 14,
  cols: 14,
  serpentine: true,
  hex: build.hex,
  canvas: document.getElementById('canvas'),
  // onPixels: (pixels) => console.log(pixels.length),
  // onSerial: (text) => console.log(text),
});
