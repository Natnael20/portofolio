import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: false,
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css']
})
export class Navigation implements OnInit {
  isHome = false;
  isScrolled = false;
  currentLang = 'en';
  showLangIntro = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isHome = this.router.url === '/' || this.router.url === '';
    });
  }

  ngOnInit(): void {
    const match = document.cookie.match(/googtrans=\/en\/(\w+)/);
    this.currentLang = match ? match[1] : 'en';

    const skipIntro = sessionStorage.getItem('skipLangIntro');

    if (skipIntro) {
      // This reload came from the translate button
      sessionStorage.removeItem('skipLangIntro');
      this.showLangIntro = false;
    } else {
      // Normal browser reload
      this.showLangIntro = true;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }

  toggleLanguage(): void {
    const newLang = this.currentLang === 'en' ? 'sv' : 'en';

    if (newLang === 'en') {
      this.deleteGoogleCookie();
    } else {
      document.cookie = 'googtrans=/en/sv; path=/';
    }

    // The next reload is caused by the translate button
    sessionStorage.setItem('skipLangIntro', 'true');

    window.location.reload();
  }

  dismissIntro(): void {
    this.showLangIntro = false;
  }

  private deleteGoogleCookie(): void {
    document.cookie =
      'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';

    document.cookie =
      `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${location.hostname}`;
  }
}
