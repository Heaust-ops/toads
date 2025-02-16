import { Observable } from "../math/observable";

export interface RenderableI {
  render: () => void;
  onBeforeRenderObservable: Observable<null>;
  onAfterRenderObservable: Observable<null>;
  isVisible: boolean;
}
