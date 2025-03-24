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
    MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class NavBarComponent {
  translateService = inject(TranslationService);

  changeLanguage(lang: string): void {
    this.translateService.changeLanguage(lang);
  }
  currentLanguage(): string {
    return this.translateService.currentLanguage();
  }
}
