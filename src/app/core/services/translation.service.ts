import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private translate = inject(TranslateService);

  constructor() {
    this.translate.addLangs(['en', 'gr']);
    this.translate.setDefaultLang('en');
    const savedLang = localStorage.getItem('language') || 'en';
    console.log(savedLang)
    this.translate.use(savedLang);

    console.log('Current Language:', this.translate.currentLang);
  }

  changeLanguage(lang: string) {
    console.log('Changing language to:', lang);
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }

  currentLanguage():string {
    return localStorage.getItem('language') || 'en';
  }
}
