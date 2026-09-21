import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { CommonModule } from '@angular/common';  // ← CORRECT PACKAGE
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';  // ← new import
import { App } from './app';
import { Navigation } from './core/navigation/navigation';
import { Footer } from './core/footer/footer';
import { Home } from './features/home/home';
import { About } from './features/about/about';
import { Projects } from './features/projects/projects';
import { Contact } from './features/contact/contact';

@NgModule({
  declarations: [App, Navigation, Footer, Home, About, Projects, Contact],
  imports: [BrowserModule, CommonModule, FormsModule, AppRoutingModule],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}