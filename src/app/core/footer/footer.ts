import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  styleUrl: './footer.css',
  templateUrl: './footer.html'
})
export class Footer {   // ← MUST be named 'Footer' and exported
  year = new Date().getFullYear();
}