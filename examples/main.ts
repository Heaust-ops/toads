import { Scene } from "../src";

const scene = new Scene("demo");
scene.runRenderLoop(() => {
  scene.render();
});
(window as any).scene = scene;
