import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  ElementRef,
  QueryList,
  inject,
  OnDestroy,
} from '@angular/core';
import { PhotoCardComponent } from '../../shared/components/photo-card/photo-card.component';
import { PhotosService } from '../../core/services/photo.service';
import { IPhoto } from '../../core/models/photo.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FavoritesService } from '../../core/services/favorites.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    PhotoCardComponent,
    MatGridListModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  photosService = inject(PhotosService);
  photos$ = this.photosService.photos$;
  isLoading$ = this.photosService.loading$;

  favoritesService = inject(FavoritesService);

  @ViewChildren('photoCard', { read: ElementRef })
  photoCards?: QueryList<ElementRef>;

  private observer!: IntersectionObserver;

  ngOnInit(): void {
    this.photosService.loadMorePhotos(); // Initial load
  }

  ngAfterViewInit(): void {
    this?.photoCards?.changes.subscribe((cards: QueryList<ElementRef>) => {
      const last = cards.last;
      if (last) {
        this.setupObserver(last.nativeElement);
      }
    });
  }

  private setupObserver(element: HTMLElement): void {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.photosService.loadMorePhotos();
      }
    });

    this.observer.observe(element);
  }

  toggleFavorite(photo: IPhoto): void {
    this.favoritesService.isFavorite(photo.id)
      ? this.favoritesService.remove(photo.id)
      : this.favoritesService.add(photo);
  }

  trackByPhotoId(index: number, photo: IPhoto): string {
    return photo.id;
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

// import { Component, HostListener, inject, OnInit } from '@angular/core';
// import { NgFor, AsyncPipe, NgIf } from '@angular/common';
// import { Photo } from '../../core/models/photo.model';
// import { PhotosService } from '../../core/services/photo.service';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [NgFor, AsyncPipe, NgIf],
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss'],
// })
// export class HomeComponent implements OnInit {
//   photosService = inject(PhotosService);
//   photos$ = this.photosService.photos$;

//   ngOnInit(): void {
//     this.photosService.loadMorePhotos(); // initial load
//   }

//   @HostListener('window:scroll', [])
//   onWindowScroll(): void {
//     const scrollTop = window.scrollY;
//     const docHeight = document.documentElement.scrollHeight;
//     const winHeight = window.innerHeight;

//     const bottomOffset = 300;

//     if (scrollTop + winHeight + bottomOffset >= docHeight) {
//       this.photosService.loadMorePhotos();
//     }
//   }
// }
