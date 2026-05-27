import * as PIXI from "pixi.js";
import { castRay } from "./raycaster";
import { player } from "./player";

const FOV = Math.PI / 3; // 60 degrees
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const NUM_RAYS = SCREEN_WIDTH; // one ray per pixel column

export function renderScene(graphics: PIXI.Graphics): void {
  graphics.clear();

  const horizon = SCREEN_HEIGHT / 2 - player.verticalOffset * SCREEN_HEIGHT;

  // Ceiling
  graphics.rect(0, 0, SCREEN_WIDTH, horizon);
  graphics.fill(0x1a1a4e);

  // Floor
  graphics.rect(0, horizon, SCREEN_WIDTH, SCREEN_HEIGHT - horizon);
  graphics.fill(0x444444);

  // Walls — one column per ray
  for (let col = 0; col < NUM_RAYS; col++) {
    // Angle for this column, spread across FOV
    const rayAngle = player.angle - FOV / 2 + (col / NUM_RAYS) * FOV;

    const { distance, side } = castRay(player.x, player.y, rayAngle);

    // Wall height based on distance
    const wallHeight = SCREEN_HEIGHT / distance;
    const wallTop = horizon - wallHeight / 2;

    // Darker color on Y-sides for depth
    const brightness = side === 1 ? 0.6 : 1.0;
    const r = Math.floor(200 * brightness);
    const g = Math.floor(100 * brightness);
    const b = Math.floor(50 * brightness);
    const color = (r << 16) | (g << 8) | b;

    graphics.rect(col, wallTop, 1, wallHeight);
    graphics.fill(color);
  }
}
