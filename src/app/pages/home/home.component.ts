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

  private IObserver?: IntersectionObserver;

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
    if (this.IObserver) {
      this.IObserver.disconnect();
    }

    this.IObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.photosService.loadMorePhotos();
      }
    });

    this.IObserver.observe(element);
  }

  toggleFavorite(photo: IPhoto): void {
    this.favoritesService.isFavorite(photo.id)
      ? this.favoritesService.remove(photo.id)
      : this.favoritesService.add(photo);
  }

  trackByPhotoId(_: number, photo: IPhoto): string {
    return photo.id;
  }

  ngOnDestroy(): void {
    this.IObserver?.disconnect();
  }
}
