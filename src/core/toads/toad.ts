import { drawRect } from "../drawing/rect";
import { RenderableI } from "../interfaces/renderable";
import { Observable } from "../math/observable";
import { TransformNode } from "../math/TransformNode";
import { Scene } from "../scene";

const defaultToadStyle = {
  header: {
    width: 20,
    height: 10,
    backgroundColor: "#1e5d3c",
    color: "#e3e3e3",
    borderRadius: 3,
    title: "Toad Title",
  },
};

export type ToadStyle = typeof defaultToadStyle;

class Toad extends TransformNode implements RenderableI {
  protected style: ToadStyle;
  isVisible = true;
  onBeforeRenderObservable = new Observable<null>();
  onAfterRenderObservable = new Observable<null>();

  constructor(scene: Scene) {
    super(scene);
    this.style = defaultToadStyle;
    this.width = 50;
    this.height = 8;
  }

  renderHeader(ctx: CanvasRenderingContext2D) {
    //rect
    ctx.fillStyle = this.style.header.backgroundColor;

    const br = this.style.header.borderRadius;
    drawRect(ctx, 0, 0, this.width, this.height, {
      topLeft: br,
      topRight: br,
    });

    //title
    ctx.fillStyle = this.style.header.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let fontSize = Math.min(this.height * 0.5, 40);
    ctx.font = `${fontSize}px Arial`;

    ctx.fillText(this.style.header.title, this.width / 2, this.height / 2);
  }

  render() {
    this.onBeforeRenderObservable.notifyObservers(null);

    const ctx = this.scene.ctx;
    this.setTransform(ctx, this.scene.camera.getViewMatrix());
    this.renderHeader(ctx);

    this.onAfterRenderObservable.notifyObservers(null);
  }
}

export { Toad };
