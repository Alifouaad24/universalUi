import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AlbumStateService {
  private _countOfFolders = signal<number>(0);

  countOfFolders = this._countOfFolders.asReadonly();

  setCount(count: number) {
    this._countOfFolders.set(count);
  }

  reset() {
    this._countOfFolders.set(0);
  }
}