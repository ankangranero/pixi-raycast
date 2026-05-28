import * as PIXI from "pixi.js";
import { initRenderer, renderScene } from "./renderer";
import { updatePlayer } from "./movement";
import "./input";
import "./style.css";

const app = new PIXI.Application();

await app.init({
  width: 800,
  height: 600,
  backgroundColor: 0x1a1a1a,
});

document.getElementById("canvas")!.appendChild(app.canvas);

await initRenderer(app.stage);

app.ticker.add((ticker) => {
  updatePlayer(ticker.deltaMS);
  renderScene();
});
