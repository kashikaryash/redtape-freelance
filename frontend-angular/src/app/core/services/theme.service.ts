import { Injectable, signal, effect } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'theme';

    // Signal for theme state
    isDarkMode = signal<boolean>(this.getInitialTheme());

    constructor() {
        // Effect to apply theme changes to the document
        effect(() => {
            const darkMode = this.isDarkMode();
            localStorage.setItem(this.THEME_KEY, darkMode ? 'dark' : 'light');

            if (darkMode) {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.body.style.backgroundColor = '#0f0f1a';
                document.body.style.color = '#ffffff';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                document.body.style.backgroundColor = '#ffffff';
                document.body.style.color = '#1a1a2e';
            }
        });
    }

    toggleTheme() {
        this.isDarkMode.update(prev => !prev);
    }

    private getInitialTheme(): boolean {
        const saved = localStorage.getItem(this.THEME_KEY);
        if (saved) {
            return saved === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
}
