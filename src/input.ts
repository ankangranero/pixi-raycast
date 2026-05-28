export const keys: Record<string, boolean> = {};

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

document.querySelectorAll('[data-key]').forEach((btn) => {
  const key = (btn as HTMLElement).dataset.key!;
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys[key] = true;
  });
  btn.addEventListener('touchend',   () => { keys[key] = false; });
  btn.addEventListener('touchcancel',() => { keys[key] = false; });
});