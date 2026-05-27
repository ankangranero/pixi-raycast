import { player } from './player';
import { MAP } from './map';
import { keys } from './input';

function isWall(x: number, y: number): boolean {
  return MAP[Math.floor(y)]?.[Math.floor(x)] === 1;
}

export function updatePlayer(): void {
  const { moveSpeed, rotSpeed } = player;

  if (keys['ArrowLeft'] || keys['a']) {
    player.angle -= rotSpeed;
  }
  if (keys['ArrowRight'] || keys['d']) {
    player.angle += rotSpeed;
  }

  const dx = Math.cos(player.angle) * moveSpeed;
  const dy = Math.sin(player.angle) * moveSpeed;

  if (keys['ArrowUp'] || keys['w']) {
    if (!isWall(player.x + dx, player.y)) player.x += dx;
    if (!isWall(player.x, player.y + dy)) player.y += dy;
  }
  if (keys['ArrowDown'] || keys['s']) {
    if (!isWall(player.x - dx, player.y)) player.x -= dx;
    if (!isWall(player.x, player.y - dy)) player.y -= dy;
  }

  const GRAVITY = 0.008;
  const JUMP_FORCE = -0.11;

  if(keys[' '] && player.verticalOffset === 0) {
    player.velocityY = JUMP_FORCE;
  }

if (player.verticalOffset < 0 || player.velocityY < 0) {
  player.velocityY += GRAVITY;
  player.verticalOffset += player.velocityY;

  if (player.verticalOffset >= 0) {
    player.verticalOffset = 0;
    player.velocityY = 0;
  }
}
}