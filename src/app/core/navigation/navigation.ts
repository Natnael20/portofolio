import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone : false,
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css']
})
export class Navigation implements DoCheck {
  isHome = false;
  isScrolled = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isHome = this.router.url === '/' || this.router.url === '';
    });
  }

  ngDoCheck() {
    this.isScrolled = window.scrollY > 300;
  }
}