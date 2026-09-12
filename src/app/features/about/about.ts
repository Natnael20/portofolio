import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: false,
  styleUrl: './about.css',
  templateUrl: './about.html',
})
export class About {
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 30;
  }
}
