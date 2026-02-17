import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from './core/services/theme.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SmartPopupComponent } from './shared/components/smart-popup/smart-popup.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, SmartPopupComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-angular');
  private themeService = inject(ThemeService);
  private router = inject(Router);

  showLayout = signal(true);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;

      // Only hide navbar and footer on admin, moderator, login and signup routes
      const isHidden = url.startsWith('/admin') ||
        url.startsWith('/moderator') ||
        url.startsWith('/super-admin') ||
        url.startsWith('/login') ||
        url.startsWith('/signup');

      this.showLayout.set(!isHidden);
    });
  }
}


