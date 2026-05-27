import { player } from "./player";
import { MAP } from "./map";
import { keys } from "./input";

function isWall(x: number, y: number): boolean {
  return MAP[Math.floor(y)]?.[Math.floor(x)] === 1;
}

export function updatePlayer(dt: number): void {
  const { moveSpeed, rotSpeed } = player;

  const speed = moveSpeed * dt;
  const rot = rotSpeed * dt;

  if (keys["ArrowLeft"] || keys["a"]) {
    player.angle -= rot;
  }
  if (keys["ArrowRight"] || keys["d"]) {
    player.angle += rot;
  }

  const dx = Math.cos(player.angle) * speed;
  const dy = Math.sin(player.angle) * speed;

  if (keys["ArrowUp"] || keys["w"]) {
    if (!isWall(player.x + dx, player.y)) player.x += dx;
    if (!isWall(player.x, player.y + dy)) player.y += dy;
  }
  if (keys["ArrowDown"] || keys["s"]) {
    if (!isWall(player.x - dx, player.y)) player.x -= dx;
    if (!isWall(player.x, player.y - dy)) player.y -= dy;
  }

  const GRAVITY = 0.00003 * dt;
  const JUMP_FORCE = -0.007;

  if (keys[" "] && player.verticalOffset === 0) {
    player.velocityY = JUMP_FORCE;
  }

  if (player.verticalOffset < 0 || player.velocityY < 0) {
    player.velocityY += GRAVITY;
    player.verticalOffset += player.velocityY * dt;

    if (player.verticalOffset >= 0) {
      player.verticalOffset = 0;
      player.velocityY = 0;
    }
  }
}
