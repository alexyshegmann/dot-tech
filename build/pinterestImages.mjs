import { createCanvas, loadImage } from "canvas";
import fs from "fs/promises";
import path from "path";
import { glob } from "glob";
import frontmatter from "front-matter";

const WIDTH = 1200;
const HEIGHT = 1800;
const GRADIENT_HEIGHT = 350;

const DARK_BLUE = "#101828";
const TRANSPARENT_DARK_BLUE = "rgba(16, 24, 40, 0.20)";
const WHITE = "#F9FAFB";
const GRAY = "#d1d5dc";

const FONT_SIZE_TITLE = 48;
const FONT_SIZE_CONTENT = 32;
const FONT_FAMILY = "sans-serif";
const LINE_HEIGHT = 1.50;

async function main() {
  console.log("Pinterest image generation script started.");
  console.log("Fetching data from the file system...");
  const posts = await glob("./src/content/blog/**/*.{md,mdx}");
  console.log(posts.length, "blog posts found.");
  await fs.mkdir("./dist/pinterest", { recursive: true });
  await Promise.all(posts.map(async (post) => {
    console.log("Processing post:", post);
    const content = await fs.readFile(post, "utf-8");
    const data = frontmatter(content);
    const title = data.attributes.title || "No title";
    const excerpt = data.attributes.excerpt || "No excerpt available.";
    const image = data.attributes.image;
    const fixedImage = path.resolve(path.dirname(post), image);
    const pinterestImage = await buildImage(title, excerpt, fixedImage);
    const buffer = pinterestImage.toBuffer("image/png");
    const outputPath = `./dist/pinterest/${path.basename(post, path.extname(post))}.png`;
    await fs.writeFile(outputPath, buffer);
    console.log("Image saved successfully.");
  }));
  console.log("All images processed successfully.");
  console.log("Pinterest image generation script completed.");
  console.log("You can find the images in the ./dist/pinterest directory.");
  console.log("Exiting script.");
  process.exit(0);
}
main();

export async function buildImage(title, excerpt, imagePath) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = DARK_BLUE;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const img = await loadImage(imagePath);

  const imgHeight = WIDTH - 20;

  ctx.save();
  drawRoundedRectangle(ctx, 10, 10, WIDTH - 20, imgHeight, 16);
  ctx.clip();
  ctx.drawImage(img, 10, 10, WIDTH - 20, imgHeight);
  ctx.restore();
  
  ctx.save();
  drawRoundedRectangle(ctx, 32, 1024, (WIDTH - 64) / 3 * 2, HEIGHT - 1040, 16);
  ctx.fillStyle = DARK_BLUE;
  ctx.globalAlpha = 0.75;
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.textBaseline = "top";
  ctx.fillStyle = WHITE;
  ctx.font = `bold ${FONT_SIZE_TITLE}px ${FONT_FAMILY}`;
  ctx.textAlign = "left";
  const titleLines = wrapText(ctx, title, 50, 1054, 730, FONT_SIZE_TITLE);
  ctx.restore();
  
  ctx.save();
  ctx.textBaseline = "top";
  ctx.fillStyle = GRAY;
  ctx.font = `normal ${FONT_SIZE_CONTENT}px ${FONT_FAMILY}`;
  ctx.textAlign = "left";
  wrapText(ctx, excerpt, 50, (titleLines * FONT_SIZE_TITLE * LINE_HEIGHT) + 1074, 730, FONT_SIZE_CONTENT);
  ctx.restore();

  ctx.save();
  const gradient = ctx.createLinearGradient(0, HEIGHT - GRADIENT_HEIGHT, 0, HEIGHT);
  gradient.addColorStop(0, TRANSPARENT_DARK_BLUE);
  gradient.addColorStop(1, DARK_BLUE);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, HEIGHT - GRADIENT_HEIGHT, (WIDTH - 64) / 3 * 2 + 16, GRADIENT_HEIGHT);
  ctx.restore();

  ctx.save();
  const logo = await loadImage("./src/assets/full-logo.svg");
  ctx.drawImage(logo, 864, 1630, 286, 115);
  ctx.restore();

  return canvas;
}

function drawRoundedRectangle(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath(); 
}

function wrapText(ctx, text, x, y, maxWidth, fontSize = FONT_SIZE_CONTENT) {
  let lineCount = 0;
  const words = text.split(" ");
  let line = "";
  const lineHeight = fontSize * LINE_HEIGHT;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = word + " ";
      y += lineHeight;
      lineCount++;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);

  return lineCount + 1; // Return the number of lines drawn
}
