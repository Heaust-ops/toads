import { Observable } from "./observable";

export interface DisposableI {
  dispose: () => void;
  onDisposeObservable: Observable<unknown>;
}
