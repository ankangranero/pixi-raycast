import { MAP } from "./map";

export interface RayHit {
  distance: number;
  side: 0 | 1; // 0 = hit a vertical wall (X-side), 1 = hit a horizontal wall (Y-side)
}

export function castRay(
  playerX: number,
  playerY: number,
  rayAngle: number,
): RayHit {
  const rayDirX = Math.cos(rayAngle);
  const rayDirY = Math.sin(rayAngle);

  // Current tile the player is in
  let mapX = Math.floor(playerX);
  let mapY = Math.floor(playerY);

  // Distance the ray travels to cross one full tile in X and Y
  const deltaDistX = Math.abs(1 / rayDirX);
  const deltaDistY = Math.abs(1 / rayDirY);

  // Step direction and initial side distance

  let stepX: number;
  let stepY: number;
  let sideDistX: number;
  let sideDistY: number;

  if (rayDirX < 0) {
    stepX = -1;
    sideDistX = (playerX - mapX) * deltaDistX;
  } else {
    stepX = 1;
    sideDistX = (mapX + 1 - playerX) * deltaDistX;
  }

  if (rayDirY < 0) {
    stepY = -1;
    sideDistY = (playerY - mapY) * deltaDistY;
  } else {
    stepY = 1;
    sideDistY = (mapY + 1 - playerY) * deltaDistY;
  }

  // DDA — step until we hit a wall
  let side: 0 | 1 = 0;
  let hit = false;

  while (!hit) {
    if (sideDistX < sideDistY) {
      sideDistX += deltaDistX;
      mapX += stepX;
      side = 0;
    } else {
      sideDistY += deltaDistY;
      mapY += stepY;
      side = 1;
    }

    if (MAP[mapY]?.[mapX] === 1) {
      hit = true;
    }
  }

  // Perpendicular distance to avoid fisheye effect
  const distance = side === 0 ? sideDistX - deltaDistX : sideDistY - deltaDistY;

  return { distance, side };
}
