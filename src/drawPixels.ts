import Pixel from './pixel';

export const drawPixels = (
  pixels: Array<Pixel>,
  canvas: HTMLCanvasElement,
  rows: number,
  cols: number,
  serpentine: boolean,
  coordinates?: [number, number][]
) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { width, height } = canvas;
  ctx?.clearRect(0, 0, width, height);
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx?.fillRect(0, 0, width, height);

  let pixelWidth = width / cols;
  let pixelHeight = height / rows;

  if (coordinates) {
    pixelWidth = (width * height) / pixels.length / 40;
    pixelHeight = (width * height) / pixels.length / 40;
  }

  for (let i = 0; i < pixels.length; i++) {
    const pixel = pixels[i];
    let x, y;

    if (coordinates) {
      x = (coordinates[i][0] / 300) * 1.1 * width;
      y = (coordinates[i][1] / 300) * 1.1 * height;
    } else {
      if (!serpentine) {
        if (pixel.y % 2 == 0) {
          x = pixel.x * pixelWidth;
        } else {
          x = (cols - 1) * pixelWidth - pixel.x * pixelWidth;
        }
        y = (rows - 1) * pixelHeight - pixel.y * pixelHeight;
      } else {
        x = (cols - 1) * pixelWidth - pixel.x * pixelWidth;
        y = (rows - 1) * pixelHeight - pixel.y * pixelHeight;
      }
    }

    ctx.beginPath();
    ctx.rect(x, y, pixelWidth, pixelHeight);
    ctx.fillStyle = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
    ctx.shadowColor = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
    ctx.fill();
  }
};
