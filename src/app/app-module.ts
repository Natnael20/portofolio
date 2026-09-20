import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { CommonModule } from '@angular/common';  // ← CORRECT PACKAGE
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navigation } from './core/navigation/navigation';
import { Footer } from './core/footer/footer';
import { Home } from './features/home/home';
import { About } from './features/about/about';
import { Projects } from './features/projects/projects';
import { Contact } from './features/contact/contact';

@NgModule({
  declarations: [App, Navigation, Footer, Home, About, Projects, Contact],
  imports: [BrowserModule, CommonModule, AppRoutingModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}