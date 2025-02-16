import { Matrix3, Vector2 } from "@math.gl/core";
import { Observable } from "./observable";
import { Scene } from "../scene";
import { DisposableI } from "../interfaces/disposable";

class TransformNode implements DisposableI {
  protected width = 0;
  protected height = 0;
  /**
   * DISPOSE
   */
  onDisposeObservable = new Observable();
  dispose() {
    this.parent = null;
    this.onDisposeObservable.notifyObservers(null);
  }

  /**
   * TRANSFORMS
   */
  position = new Vector2();
  scaling = new Vector2(1, 1);
  rotation = 0;

  private wm = Matrix3.IDENTITY.clone();

  getWM() {
    return this.wm;
  }

  computeWM() {
    this.wm = Matrix3.IDENTITY.clone()
      .scale(this.scaling)
      .rotate(this.rotation)
      .translate(this.position);
  }

  setTransform(
    ctx: CanvasRenderingContext2D,
    view = false as Matrix3 | boolean,
  ) {
    if (view && typeof view === "boolean") {
      view = this.scene.camera.getViewMatrix();
    }

    view = view || Matrix3.IDENTITY;
    const m = this.getAbsoluteWM().multiplyRight(view);

    ctx.setTransform(
      m.getElement(0, 0),
      m.getElement(1, 0),
      m.getElement(0, 1),
      m.getElement(1, 1),
      m.getElement(0, 2),
      m.getElement(1, 2),
    );
  }

  getAbsoluteWM(): Matrix3 {
    const parentWM = this.parent
      ? this.parent.getAbsoluteWM()
      : Matrix3.IDENTITY;
    const currWM = parentWM.clone().multiplyRight(this.wm);
    return currWM;
  }

  /**
   * TRACKING
   */
  id: number;
  scene: Scene;
  constructor(scene: Scene) {
    this.id = scene.uid.gen(this);
    this.scene = scene;
    this.scene.onBeforeRenderObservable.add(() => {
      this.computeWM();
    });
  }

  /**
   * LINEAGE
   */
  private _parent = null as null | TransformNode;
  private children = new Set() as Set<number>;

  get parent() {
    return this._parent;
  }
  set parent(node: TransformNode | null) {
    if (!this._parent && !node) return;

    if (this._parent) {
      this._parent.children.delete(this.id);
    }

    if (node) {
      this._parent = node;
      node.children.add(this.id);
    }

    let curr = this as TransformNode | null;
    while (true) {
      curr = curr!.parent;
      if (!curr) break;
      if (curr.id !== this.id) continue;
      throw new Error("Circular Ancestry");
    }
  }

  getChildren() {
    return Array.from(this.children).map(this.scene.uid.getItem);
  }
}

export { TransformNode };
