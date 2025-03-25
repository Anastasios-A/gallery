import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'back-to-top',
  standalone: true,
  imports: [CommonModule,MatButtonModule,MatIconModule],
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.scss'],
})
export class BackToTopComponent {
  showButton = false; 

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.showButton = window.scrollY > 600; 
  }

  backToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
