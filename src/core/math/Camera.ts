import { TransformNode } from "./TransformNode";

class Camera extends TransformNode {
  zoomSensitivity = 1;
  getZoomLevel() {
    return (this.scaling.x + this.scaling.y) / 2;
  }
  zoomTo(a: number) {
    if (a < 1e-9) a = 1e-9;
    this.scaling.x = a;
    this.scaling.y = a;
  }

  getViewMatrix() {
    const m = this.getAbsoluteWM().clone().invert();
    return m;
  }
  setTransform(ctx: CanvasRenderingContext2D) {
    const m = this.getViewMatrix();

    ctx.setTransform(
      m.getElement(0, 0),
      m.getElement(1, 0),
      m.getElement(0, 1),
      m.getElement(1, 1),
      m.getElement(0, 2),
      m.getElement(1, 2),
    );
  }
}

export { Camera };
