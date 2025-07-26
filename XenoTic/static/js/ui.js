/**
 * XenoTic - UI Management and Theme System
 * Simple theme management for minimalist design
 */

class UIManager {
    constructor() {
        this.currentTheme = 'light';
        this.initializeTheme();
        this.setupThemeToggle();
    }
    
    /**
     * Initialize theme system
     */
    initializeTheme() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('xenotic-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        this.currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.applyTheme(this.currentTheme);
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!savedTheme) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(this.currentTheme);
            }
        });
    }
    
    /**
     * Setup theme toggle functionality
     */
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
            
            // Update icon based on current theme
            this.updateThemeIcon();
        }
    }
    
    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.saveThemePreference();
        this.updateThemeIcon();
    }
    
    /**
     * Apply theme to document
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    /**
     * Update theme toggle icon
     */
    updateThemeIcon() {
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            const isDark = this.currentTheme === 'dark';
            themeIcon.textContent = isDark ? '☀️' : '🌙';
        }
    }
    
    /**
     * Save theme preference to localStorage
     */
    saveThemePreference() {
        localStorage.setItem('xenotic-theme', this.currentTheme);
    }
}

// Initialize UI manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.uiManager = new UIManager();
});
