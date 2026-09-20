import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: false,
  styleUrl: './contact.css',
  templateUrl: './contact.html',
})
export class Contact {
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 30;
  }
}
