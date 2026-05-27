import * as PIXI from 'pixi.js';
import { renderScene } from './renderer';
import { updatePlayer } from './movement';
import './input';

const app = new PIXI.Application();

await app.init({
  width: 800,
  height: 600,
  backgroundColor: 0x1a1a1a,
});

document.body.appendChild(app.canvas);

const graphics = new PIXI.Graphics();
app.stage.addChild(graphics);

app.ticker.add((ticker) => {
  updatePlayer(ticker.deltaMS);
  renderScene(graphics);
});