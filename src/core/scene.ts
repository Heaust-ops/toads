import { Vector2 } from "@math.gl/core";
import { Camera } from "./math/Camera";
import { UID } from "./math/uid";
import { Observable } from "./math/observable";
import { drawGrid } from "./drawing/grid";
import { drawSelectionMarquee } from "./drawing/selection";

class Scene {
  uid = new UID();
  selected = new Set<number>();
  style = {
    grid: true,
  };
  //
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  camera: Camera;
  pointer: Vector2;
  //
  onBeforeRenderObservable = new Observable();
  onAfterRenderObservable = new Observable();
  //
  hardwareScale = 1;
  pointerDelta: Vector2;
  activePointer: { left: boolean; middle: boolean; right: boolean };
  selectionStart: Vector2;

  getPointerCoords() {
    const rect = this.canvas.getBoundingClientRect();

    return new Vector2(
      this.pointer.x / rect.width - 0.5,
      0.5 - this.pointer.y / rect.height,
    ).multiplyByScalar(2);
  }

  constructor(canvas: HTMLCanvasElement | string) {
    if (typeof canvas === "string") {
      const cnv = document.getElementById(canvas);
      if (!cnv) throw new Error("Canvas not found.");
      canvas = cnv as HTMLCanvasElement;
    }

    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d")!;
    if (!this.ctx) throw new Error("Failed to get context");
    this.camera = new Camera(this);

    /** pointer*/
    this.pointer = new Vector2();
    this.pointerDelta = new Vector2();
    this.activePointer = {
      left: false,
      middle: false,
      right: false,
    };
    this.selectionStart = new Vector2();

    this.attachControl();
  }

  render() {
    this.onBeforeRenderObservable.notifyObservers(null);

    const ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    /** background */
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.style.grid) drawGrid(this.ctx, this.camera);
    if (this.activePointer.left) {
      drawSelectionMarquee(this.ctx, this.selectionStart, this.pointer);
    }

    this.onAfterRenderObservable.notifyObservers(null);
  }

  runRenderLoop(fn: () => void) {
    const raf = () => {
      fn();
      window.requestAnimationFrame(raf);
    };
    raf();
  }

  getResolutionRatio = () => {
    return this.canvas.width / this.canvas.clientWidth;
  };

  setResolution(hwScale = null as null | number) {
    if (hwScale) {
      this.hardwareScale = hwScale;
    }

    const pixelRatio = window.devicePixelRatio || 1;

    const cssWidth = this.canvas.clientWidth;
    const cssHeight = this.canvas.clientHeight;

    this.canvas.width = cssWidth * pixelRatio * this.hardwareScale;
    this.canvas.height = cssHeight * pixelRatio * this.hardwareScale;
  }

  private attachControl() {
    this.camera.zoomTo(this.getResolutionRatio());

    this.setResolution();
    const resizeObs = new ResizeObserver(() => this.setResolution());
    resizeObs.observe(this.canvas);

    const updatePointer = (e: PointerEvent | MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      const ratio = this.canvas.width / rect.width;

      const x = (e.clientX - rect.left) * ratio;
      const y = (e.clientY - rect.top) * ratio;

      this.pointerDelta.x = x - this.pointer.x;
      this.pointerDelta.y = y - this.pointer.y;
      this.pointer.x = x;
      this.pointer.y = y;
    };

    this.canvas.addEventListener("pointermove", (e) => {
      updatePointer(e);

      if (this.activePointer.right) {
        this.camera.position.add(this.pointerDelta);
      }
    });
    this.canvas.oncontextmenu = () => {
      return false;
    };
    this.canvas.addEventListener("mousedown", (e) => {
      updatePointer(e);

      switch (e.button) {
        case 0:
          this.activePointer.left = true;
          this.selectionStart = this.pointer.clone();
          break;
        case 1:
          this.activePointer.middle = true;
          break;
        case 2:
          this.activePointer.right = true;
          break;
      }
    });
    this.canvas.addEventListener("mouseup", (e) => {
      updatePointer(e);

      switch (e.button) {
        case 0:
          this.activePointer.left = false;
          break;
        case 1:
          this.activePointer.middle = false;
          break;
        case 2:
          this.activePointer.right = false;
          break;
      }
    });
    this.canvas.addEventListener(
      "wheel",
      (e) => {
        this.camera.zoomTo(
          this.camera.getZoomLevel() +
            e.deltaY * 1e-3 * this.camera.zoomSensitivity,
        );
      },
      { passive: false },
    );
  }
}

export { Scene };
