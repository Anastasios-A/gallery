import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IPhoto } from '../models/photo.model';
import { HttpClient } from '@angular/common/http';

export enum LocalStorageKey {
  FAVORITES = 'favorite_photos',
  SELECTED_PHOTO = 'selected_photo',
}

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<IPhoto[]>(
    this.loadFromStorage(LocalStorageKey.FAVORITES) // initialize stream from local storage
  );

  favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) {}

  private loadFromStorage(storageEnum: LocalStorageKey): IPhoto[] {
    const stored = localStorage.getItem(storageEnum);
    const parsed: IPhoto[] = stored ? JSON.parse(stored) : []; 
    return parsed.map((p) => ({
      ...p,
      dateFavorited: p.dateFavorited ? new Date(p.dateFavorited) : undefined,
    }));
  }

  private saveToStorage(
    photos: IPhoto[] | IPhoto, // saving favorite photos | selected photo
    localStorageKey: string
  ): void {
    localStorage.setItem(localStorageKey, JSON.stringify(photos));
  }

  // save selected photo
  selectedPhoto(selectedPhoto: IPhoto): void {
    this.saveToStorage(selectedPhoto, LocalStorageKey.SELECTED_PHOTO);
  }

  // get photo
  getPhotoById(id: string): IPhoto | undefined {
    return this.getFavorites().find((p) => p.id === id);
  }

  //get all fovorites via the observable stream
  getFavorites(): IPhoto[] {
    return this.favoritesSubject.value;
  }

  // add a photo to favorites
  add(photo: IPhoto): void {
    const updatedPhoto: IPhoto = {
      ...photo,
      dateFavorited: new Date(),
    };
    const updated = [...this.getFavorites(), updatedPhoto];
    this.favoritesSubject.next(updated);
    this.saveToStorage(updated, LocalStorageKey.FAVORITES);
  }

  // remove a photo from favorites
  remove(id: string): void {
    const updated = this.getFavorites().filter((p) => p.id !== id);
    this.favoritesSubject.next(updated);
    this.saveToStorage(updated, LocalStorageKey.FAVORITES);
  }

  // is it a favorite?
  isFavorite(id: string): boolean {
    return this.getFavorites().some((p) => p.id === id);
  }

  //fetching photo info OnInit of photo page
  fetchPhotoInfo(id: string): Observable<string> {
    return this.http
      .get<{ author: string }>(`https://picsum.photos/id/${id}/info/`)
      .pipe(map((data) => data.author));
  }
}
