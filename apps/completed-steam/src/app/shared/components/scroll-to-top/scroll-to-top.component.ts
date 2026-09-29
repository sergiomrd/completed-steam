import { Component, HostListener, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'completed-steam-scroll-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss']
})
export class ScrollTopComponent {
  private readonly document = inject(DOCUMENT);
  windowScrolled: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollY > 500) {
      this.windowScrolled = true;
    } else if (scrollY < 10) {
      this.windowScrolled = false;
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
