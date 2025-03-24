import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {  NavBarComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'gallery';
}
