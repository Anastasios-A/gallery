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
    this.loadFromStorage(LocalStorageKey.FAVORITES)
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
    photos: IPhoto[] | IPhoto,
    localStorageKey: string
  ): void {
    localStorage.setItem(localStorageKey, JSON.stringify(photos));
  }

  selectedPhoto(selectedPhoto: IPhoto): void {
    this.saveToStorage(selectedPhoto, LocalStorageKey.SELECTED_PHOTO);
  }

  // getSelectedPhoto(): IPhoto | null {
  //   const stored = localStorage.getItem(LocalStorageKey.SELECTED_PHOTO);
  //   return stored ? JSON.parse(stored) : null;
  // }

  getPhotoById(id: string): IPhoto | undefined {
    return this.getFavorites().find((p) => p.id === id);
  }

  getFavorites(): IPhoto[] {
    return this.favoritesSubject.value;
  }

  add(photo: IPhoto): void {
    // add a photo to favorites
    const updatedPhoto: IPhoto = {
      ...photo,
      dateFavorited: new Date(), // ← now a Date object
    };
    const updated = [...this.getFavorites(), updatedPhoto];
    this.favoritesSubject.next(updated);
    this.saveToStorage(updated, LocalStorageKey.FAVORITES);
  }

  remove(id: string): void {
    // remove a photo from favorites
    const updated = this.getFavorites().filter((p) => p.id !== id);
    this.favoritesSubject.next(updated);
    this.saveToStorage(updated, LocalStorageKey.FAVORITES);
  }

  isFavorite(id: string): boolean {
    // to see if its a favorite
    return this.getFavorites().some((p) => p.id === id);
  }

  fetchPhotoAuthor(id: string): Observable<string> {
    return this.http
      .get<{ author: string }>(`https://picsum.photos/id/${id}/info`)
      .pipe(map((data) => data.author));
  }
}
