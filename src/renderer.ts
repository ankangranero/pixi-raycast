import * as PIXI from "pixi.js";
import { castRay } from "./raycaster";
import { player } from "./player";

const FOV = Math.PI / 3; // 60 degrees
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const NUM_RAYS = SCREEN_WIDTH; // one ray per pixel column
const TEX_SIZE = 64;
let wallSprites: PIXI.Sprite[] = [];
let texSlices: PIXI.Texture[] = [];
let bgGraphics: PIXI.Graphics;

export async function initRenderer(stage: PIXI.Container): Promise<void> {
  const wallTexture = await PIXI.Assets.load("/wall_brick.png");

  for (let x = 0; x < TEX_SIZE; x++) {
    const slice = new PIXI.Texture({
      source: wallTexture.source,
      frame: new PIXI.Rectangle(x, 0, 1, TEX_SIZE),
    });
    texSlices.push(slice);
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


export function renderScene(): void {
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

    const texX = Math.floor(wallX * TEX_SIZE);

    const sprite = wallSprites[col];
    sprite.texture = texSlices[texX];
    sprite.y = wallTop;
    sprite.height = wallHeight;

    sprite.tint = side === 1 ? 0x999999 : 0xffffff;
  }
}
