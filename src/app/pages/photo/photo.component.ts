import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../core/services/favorites.service';
import { IPhoto } from '../../core/models/photo.model';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-photo',
  standalone: true,
  imports: [CommonModule, MatButtonModule, TranslateModule],
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})
export class PhotoComponent implements OnInit {
  favoritesService = inject(FavoritesService);
  photo?: IPhoto;
  author$?: Observable<string>;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const photoId = this.route.snapshot.paramMap.get('id');

    if (!photoId) {
      this.router.navigate(['/favorites']);
    } else {
      this.photo = this.favoritesService.getPhotoById(photoId);

      this.author$ = this.favoritesService.fetchPhotoAuthor(photoId);
    }
  }

  goBack(): void {
    this.router.navigate(['/favorites']);
  }

  removeFromFavorites(id: string): void {
    this.favoritesService.remove(id);
    this.router.navigate(['/favorites']);
  }
}
