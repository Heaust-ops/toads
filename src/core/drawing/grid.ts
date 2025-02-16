import { Vector2 } from "@math.gl/core";
import { Camera } from "../math/Camera";

export const drawGrid = (ctx: CanvasRenderingContext2D, camera: Camera) => {
  let gridSpacing = 50;
  gridSpacing /= camera.getZoomLevel();

  const gridStartOffset = new Vector2(0, 0);
  gridStartOffset.subtract(camera.position);
  gridStartOffset.x %= gridSpacing;
  gridStartOffset.y %= gridSpacing;

  const dimensions = new Vector2(ctx.canvas.width, ctx.canvas.height);
  const steps = dimensions.clone();
  steps.multiplyByScalar(1 / gridSpacing);

  const start = dimensions.clone().multiplyByScalar(0.5);
  start.x %= gridSpacing;
  start.y %= gridSpacing;
  start.add(gridStartOffset);
  if (start.x < 0) start.x += gridSpacing;
  if (start.y < 0) start.y += gridSpacing;
  start.x %= gridSpacing;
  start.y %= gridSpacing;

  ctx.strokeStyle = "#262626";
  ctx.lineWidth = 1;
  ctx.beginPath();

  for (let i = 0; i < steps.x; i++) {
    const x = start.x + i * gridSpacing;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, ctx.canvas.height);
  }

  for (let i = 0; i < steps.y; i++) {
    const y = start.y + i * gridSpacing;
    ctx.moveTo(0, y);
    ctx.lineTo(ctx.canvas.width, y);
  }

  ctx.stroke();
};
