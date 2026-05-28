import * as PIXI from "pixi.js";
import { castRay } from "./raycaster";
import { player } from "./player";

const FOV = Math.PI / 3; // 60 degrees
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const NUM_RAYS = SCREEN_WIDTH; // one ray per pixel column
const TEX_SIZE = 64;
let wallSprites: PIXI.Sprite[] = [];
let bgGraphics: PIXI.Graphics;

let wallFrames: PIXI.Texture[][] = []; // [frame][texSlice]
const FRAME_CELLS = [5, 7, 9, 11, 13,15, 13, 11, 9, 7]; // ping-pong

function generateGridTexture(cells: number): PIXI.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_SIZE;
  canvas.height = TEX_SIZE;
  const ctx = canvas.getContext("2d")!;

  const cellSize = TEX_SIZE / cells;
  const center = Math.floor(cells / 2);

  ctx.fillStyle = "#888";
  ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);

  // Rita diamantmönstret
  for (let cy = 0; cy < cells; cy++) {
    for (let cx = 0; cx < cells; cx++) {
      if (Math.abs(cx - center) + Math.abs(cy - center) === center) {
        ctx.fillStyle = "#000";
        ctx.fillRect(cx * cellSize, cy * cellSize, cellSize, cellSize);
      }
    }
  }

  // Gridlinjer
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= TEX_SIZE; i += cellSize) {
    ctx.moveTo(i, 0); ctx.lineTo(i, TEX_SIZE); ctx.stroke();
    ctx.moveTo(0, i); ctx.lineTo(TEX_SIZE, i); ctx.stroke();
  }

  return PIXI.Texture.from(canvas);
}

export async function initRenderer(stage: PIXI.Container): Promise<void> {
  for (const cells of FRAME_CELLS) {
    const tex = generateGridTexture(cells);
    const slices: PIXI.Texture[] = [];
    for (let x = 0; x < TEX_SIZE; x++) {
      slices.push(
        new PIXI.Texture({
          source: tex.source,
          frame: new PIXI.Rectangle(x, 0, 1, TEX_SIZE),
        }),
      );
    }
    wallFrames.push(slices);
  }
  bgGraphics = new PIXI.Graphics();
  stage.addChild(bgGraphics);

  for (let col = 0; col < SCREEN_WIDTH; col++) {
    const sprite = new PIXI.Sprite();
    sprite.x = col;
    sprite.width = 1;
    stage.addChild(sprite);
    wallSprites.push(sprite);
  }
}

export function renderScene(gt: number): void {
  bgGraphics.clear();

  const horizon = SCREEN_HEIGHT / 2 - player.verticalOffset * SCREEN_HEIGHT;

  // Ceiling
  bgGraphics.rect(0, 0, SCREEN_WIDTH, horizon).fill(0x1a1a4e);

  // Floor
  bgGraphics
    .rect(0, horizon, SCREEN_WIDTH, SCREEN_HEIGHT - horizon)
    .fill(0x444444);

  // Walls — one column per ray
  for (let col = 0; col < NUM_RAYS; col++) {
    // Angle for this column, spread across FOV
    const rayAngle = player.angle - FOV / 2 + (col / NUM_RAYS) * FOV;

    const { distance, side, wallX } = castRay(player.x, player.y, rayAngle);

    // Wall height based on distance
    const wallHeight = SCREEN_HEIGHT / distance;
    const wallTop = horizon - wallHeight / 2;

    const frame = Math.floor(gt / 200) % FRAME_CELLS.length;
    const texX = Math.floor(wallX * TEX_SIZE);

    const sprite = wallSprites[col];
    sprite.texture = wallFrames[frame][texX];
    sprite.y = wallTop;
    sprite.height = wallHeight;

    sprite.tint = side === 1 ? 0x999999 : 0xffffff;
  }
}
