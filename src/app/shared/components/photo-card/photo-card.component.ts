import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPhoto } from '../../../core/models/photo.model';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FavoritesService } from '../../../core/services/favorites.service';
import { PhotosService } from '../../../core/services/photo.service';

@Component({
  selector: 'app-photo-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule],
  templateUrl: './photo-card.component.html',
  styleUrls: ['./photo-card.component.scss'],
})
export class PhotoCardComponent {
  favoriteService = inject(FavoritesService);
  photosService = inject(PhotosService);

  @Input() photo?: IPhoto;
  @Input() isFavorite = false;
  @Input() onFavoritePage: boolean = true;

  @Output() photoClick = new EventEmitter<IPhoto>();

  onCardClick(): void {
    this.onFavoritePage
      ? this.photoClick.emit(this.photo)
      : this.favoriteService;
  }

  handleBrokenImg() {
    if (this.photo) {
      this.photosService.replaceBrokenImage(this.photo);
    }
  }
}
