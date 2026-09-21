import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {

  @ViewChild('contactForm') contactForm!: ElementRef<HTMLFormElement>;

  private readonly FORMSPREE_URL = 'https://formspree.io/f/mgavaleb';

  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 30;
  }

  constructor(private http: HttpClient) {}

  onSubmit(): void {
    if (this.isSubmitting) return;

    const formElement = this.contactForm.nativeElement;

    if (!formElement.checkValidity()) {
      formElement.reportValidity();
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;

    const formData = new FormData(formElement);

    this.http.post(this.FORMSPREE_URL, formData, {
      headers: { 'Accept': 'application/json' }
    }).subscribe({
      next: (res) => {
        console.log('Success:', res);
        this.isSubmitting = false;
        this.submitSuccess = true;
        formElement.reset();
        setTimeout(() => (this.submitSuccess = false), 5000);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error:', error);
        this.isSubmitting = false;
        this.submitError = true;
        setTimeout(() => (this.submitError = false), 5000);
      }
    });
  }
}