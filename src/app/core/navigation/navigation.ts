import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: false,
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css']
})
export class Navigation implements OnInit {
  isHome = false;
  currentLang = 'en';
  showLangIntro = false;
  private translationRetries = 0;

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

  private retriggerTranslation(): void {
    // Check if a translation is currently active
    const activeLang = this.getActiveTranslateLang();
    if (!activeLang || activeLang === 'en') {
      return; // No translation active, nothing to do
    }

    // Method 1: Re-dispatch a change event on the hidden Google dropdown
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) {
      combo.value = activeLang;
      combo.dispatchEvent(new Event('change'));
      return;
    }

    // Method 2: Fallback — reload the Google Translate script
    this.retriesOrReload();
  }

  private getActiveTranslateLang(): string | null {
    const match = document.cookie.match(/googtrans=\/en\/(\w+)/);
    return match ? match[1] : null;
  }

  private retriesOrReload(): void {
    this.translationRetries++;

    if (this.translationRetries > 5) {
      // Give up after 5 tries to avoid infinite loops
      this.translationRetries = 0;
      return;
    }

    // Retry after a short delay (Google Translate may still be loading)
    setTimeout(() => this.retriggerTranslation(), 500);
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