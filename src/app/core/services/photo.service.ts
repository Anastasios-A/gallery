import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { IPhoto } from '../models/photo.model';

const FAVORITES_KEY = 'favorite_photos';

@Injectable({
  providedIn: 'root',
})
export class PhotosService {
  private photosSubject = new BehaviorSubject<IPhoto[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  private preventCahe = 1;

  photos$ = this.photosSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor() {}

  private getRandomDelay(): number {
    return 200 + Math.floor(Math.random() * 100);
  }

  loadMorePhotos(count: number = 3): void {
    if (this.loadingSubject.value) return;

    this.loadingSubject.next(true);

    const newPhotos: IPhoto[] = Array.from({ length: count }, () => {
      const id = this.preventCahe++;
      return {
        id: id.toString(),
        url: `https://picsum.photos/400/350?random=${id}`,
      };
    });

    of(newPhotos)
      .pipe(
        delay(this.getRandomDelay()),
        tap((photos) => {
          const current = this.photosSubject.value ?? [];
          this.photosSubject.next([...current, ...photos]);
          this.loadingSubject.next(false);
        })
      )
      .subscribe();
  }
}
