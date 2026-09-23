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

    // Ignore tech tags
    translate.ignore.class.push('tech-tag');
    translate.ignore.class.push('project-titles');


    // Set source language
    translate.language.setLocal('english');

    // 1. SWITCH TO THE SERVICE CHANNEL (Often faster for Swedish)
    translate.service.use('translate.service'); 

    // 2. Enable a LONGER cache to prevent re-translation on every visit
    translate.cache = 1000 * 60 * 60 * 24; // Cache for 24 hours

    // Hide default UI
    if (translate.selectLanguageTag) {
      translate.selectLanguageTag.show = false;
    }

    // Start monitoring and translate
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