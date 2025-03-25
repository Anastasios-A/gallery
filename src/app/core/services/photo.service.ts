import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { IPhoto } from '../models/photo.model';
import { HttpClient, HttpContext } from '@angular/common/http';
import { SKIP_INTERCEPTOR } from '../interceptors/error-interceptor';

const FAVORITES_KEY = 'favorite_photos';

@Injectable({
  providedIn: 'root',
})
export class PhotosService {
  private http = inject(HttpClient);
  private photosSubject = new BehaviorSubject<IPhoto[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  photos$ = this.photosSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor() {}

  private getRandomDelay(): number {
    return 200 + Math.floor(Math.random() * 100);
  }

  //random photo id to fetch different photos every time
  private getRandomPhotosId(): number {
    return Math.floor(Math.random() * 1000) + 1;
  }

  //adding 3 new photos at scroll, called by IntersectionObserver
  loadMorePhotos(count: number = 3): void {
    if (this.loadingSubject.value) return; //if its loading then return

    this.loadingSubject.next(true);

    const newPhotos: IPhoto[] = [];

    for (let i = 0; i < count; i++) {
      const id = this.getRandomPhotosId();
      newPhotos.push({
        id: id.toString(),
        url: `https://picsum.photos/id/${id}/400/350`, //using static url to bring back allways the same photo
      });
    }
    of(newPhotos) //making a new stream
      .pipe(
        delay(this.getRandomDelay()),
        tap((photos) => {
          const current = this.photosSubject.value ?? [];
          this.photosSubject.next([...current, ...photos]);
          this.loadingSubject.next(false);
        })
      )
      .subscribe(); //dont forget to subscibe!
  }

  private checkImageExists(url: string): Observable<boolean> {
    return this.http
      .get(url, {
        responseType: 'blob',
        context: new HttpContext().set(SKIP_INTERCEPTOR, true), //Skip error interceptor for this request
      })
      .pipe(
        map(() => true),
        catchError(() => of(false)) //If request fails, return false (image does not exist)
      );
  }

  replaceBrokenImage(brokenPhoto: IPhoto): void {
    const attemptReplace = () => {
      const newId = this.getRandomPhotosId();
      const newUrl = `https://picsum.photos/id/${newId}/400/350`;

      this.checkImageExists(newUrl).subscribe((exists) => {
        if (exists) {
          // making new array with broken ulrs replaced
          const updatedPhotos = this.photosSubject.value.map((p) =>
            p.id === brokenPhoto.id ? { id: newId.toString(), url: newUrl } : p
          );

          this.photosSubject.next(updatedPhotos);
        } else {
          attemptReplace(); //if new ulr is broken too, repeat the process
        }
      });
    };

    attemptReplace(); 
  }
}
