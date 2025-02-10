import { Vector2 } from "@math.gl/core";

export const drawSelectionMarquee = (
  ctx: CanvasRenderingContext2D,
  selectionStart: Vector2,
  pointer: Vector2,
) => {
  ctx.strokeStyle = "#ffefa6";
  ctx.lineWidth = 1;

  if (selectionStart.x > pointer.x) ctx.setLineDash([5, 3]);

  ctx.strokeRect(
    Math.min(selectionStart.x, pointer.x),
    Math.min(selectionStart.y, pointer.y),
    Math.abs(selectionStart.x - pointer.x),
    Math.abs(selectionStart.y - pointer.y),
  );

  ctx.setLineDash([]);
};
