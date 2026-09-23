import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

declare var translate: any;

@Component({
  selector: 'app-navigation',
  standalone: false,
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css']
})
export class Navigation implements OnInit, AfterViewInit, OnDestroy {
  isHome = false;
  currentLang: 'en' | 'sv' = 'en';
  showLangIntro = false;
  private routerSub!: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
  this.isHome = this.router.url === '/' || this.router.url === '';

  this.routerSub = this.router.events
    .pipe(filter(e => e instanceof NavigationEnd))
    .subscribe((e: any) => {
      this.isHome = e.url === '/' || e.url === '';
    });

  const saved = localStorage.getItem('lang');
  if (saved === 'sv' || saved === 'en') {
    this.currentLang = saved;
  }

  if (!sessionStorage.getItem('langIntroShown')) {
    this.showLangIntro = true;
    sessionStorage.setItem('langIntroShown', 'true');
  }
}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (typeof translate === 'undefined') {
        console.error('translate.js not loaded');
        return;
      }

      translate.ignore.class.push('tech-tag'); //tech tag will not will never translate
      translate.ignore.class.push('project-titles')

      translate.language.setLocal('english');

      translate.selectLanguageTag.show = false;

      translate.listener.start();

      if (this.currentLang === 'sv') {
        translate.changeLanguage('swedish');
      }
    }, 300);
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  toggleLanguage(): void {
    this.currentLang = this.currentLang === 'en' ? 'sv' : 'en';
    localStorage.setItem('lang', this.currentLang);
    sessionStorage.setItem('skipLangIntro', 'true');

    if (typeof translate === 'undefined') {
      console.error('translate.js not loaded');
      return;
    }

    const targetId = this.currentLang === 'sv' ? 'swedish' : 'english';
    translate.changeLanguage(targetId);
  }

  dismissIntro(): void {
    this.showLangIntro = false;
  }
}