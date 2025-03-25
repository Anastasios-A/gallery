// src/app/shared/components/nav-bar.component.ts
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../../core/services/translation.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { FavoritesService } from '../../../core/services/favorites.service';
import { Observable } from 'rxjs';
import { IPhoto } from '../../../core/models/photo.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    TranslateModule,
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  translateService = inject(TranslationService);
  favoritesSerive = inject(FavoritesService)

  changeLanguage(lang: string): void {
    this.translateService.changeLanguage(lang);
  }
  currentLanguage(): string {
    return this.translateService.currentLanguage();
  }

  favorites$:Observable<IPhoto[]> = this.favoritesSerive.favorites$
}
