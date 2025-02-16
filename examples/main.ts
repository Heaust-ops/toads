import { Scene, Toad } from "../src";

const scene = new Scene("demo");
scene.runRenderLoop(() => {
  scene.render();
});

const testToad = new Toad(scene);

(window as any).scene = scene;
