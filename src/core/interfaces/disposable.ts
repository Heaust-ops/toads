import { Observable } from "../math/observable";

export interface DisposableI {
  dispose: () => void;
  onDisposeObservable: Observable<unknown>;
}
