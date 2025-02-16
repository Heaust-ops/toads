const defaultRadii = { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 };
const drawRect = (
  ctx: CanvasRenderingContext2D,
  x = 0,
  y = 0,
  width = 20,
  height = 20,
  radius: Partial<typeof defaultRadii> = {},
  isStroke = false,
) => {
  radius = {
    ...defaultRadii,
    ...radius,
  };

  ctx.beginPath();

  ctx.moveTo(x + radius.topLeft!, y);
  ctx.lineTo(x + width - radius.topRight!, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.topRight!);
  ctx.lineTo(x + width, y + height - radius.bottomRight!);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.bottomRight!,
    y + height,
  );
  ctx.lineTo(x + radius.bottomLeft!, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bottomLeft!);
  ctx.lineTo(x, y + radius.topLeft!);
  ctx.quadraticCurveTo(x, y, x + radius.topLeft!, y);

  ctx.closePath();

  if (isStroke) ctx.stroke();
  else ctx.fill();
};

export { drawRect };
