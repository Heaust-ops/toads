import { DisposableI } from "../interfaces/disposable";

export class UID {
  private curr = -1;
  private record = {} as Record<number, unknown>;

  getAllItems() {
    return Object.values(this.record);
  }

  gen(ref: DisposableI | unknown) {
    this.curr++;

    const id = this.curr;
    if (!(ref as DisposableI).onDisposeObservable) return id;

    this.record[id] = ref;
    (ref as DisposableI).onDisposeObservable.add(() => {
      delete this.record[id];
    });

    return id;
  }

  getItem(id: number) {
    return this.record[id] ?? null;
  }
}
