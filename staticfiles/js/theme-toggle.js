/**
 * Theme Toggle - Light/Dark Mode Switcher
 * 
 * Manages theme switching with:
 * - localStorage persistence
 * - prefers-color-scheme fallback
 * - smooth transitions between themes
 * - button state updates
 * 
 * Usage:
 * - Add a button with id="theme-toggle" in the navigation
 * - Add data attributes to track current theme
 * - Script will handle switching on click
 */

(function() {
  'use strict';

  // Configuration
  const THEME_CONFIG = {
    storageKey: 'theme-preference',
    defaultTheme: 'light',
    darkTheme: 'dark',
    lightTheme: 'light',
    toggleButtonSelector: '#theme-toggle'
  };

  /**
   * Get the current theme from localStorage or system preference
   * @returns {string} - Current theme ('light' or 'dark')
   */
  function getCurrentTheme() {
    // Check localStorage first
    const stored = localStorage.getItem(THEME_CONFIG.storageKey);
    if (stored && (stored === THEME_CONFIG.darkTheme || stored === THEME_CONFIG.lightTheme)) {
      return stored;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEME_CONFIG.darkTheme;
    }

    return THEME_CONFIG.defaultTheme;
  }

  /**
   * Set the theme on the document and update button state
   * @param {string} theme - The theme to set ('light' or 'dark')
   */
  function setTheme(theme) {
    const html = document.documentElement;
    const button = document.querySelector(THEME_CONFIG.toggleButtonSelector);

    // Set data-theme attribute on html element
    html.setAttribute('data-theme', theme);

    // Save to localStorage
    localStorage.setItem(THEME_CONFIG.storageKey, theme);

    // Update button attribute for styling
    if (button) {
      button.setAttribute('data-theme', theme);
      
      // Update button text/icon
      const isDark = theme === THEME_CONFIG.darkTheme;
      button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      button.title = isDark ? 'Light mode' : 'Dark mode';
    }

    // Dispatch custom event for other scripts to listen to
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  /**
   * Toggle between light and dark themes
   */
  function toggleTheme() {
    const current = getCurrentTheme();
    const newTheme = current === THEME_CONFIG.darkTheme 
      ? THEME_CONFIG.lightTheme 
      : THEME_CONFIG.darkTheme;
    setTheme(newTheme);
  }

  /**
   * Initialize theme system
   */
  function initializeTheme() {
    // Get current theme
    const theme = getCurrentTheme();

    // Set initial theme
    setTheme(theme);

    // Add click listener to toggle button if it exists
    const button = document.querySelector(THEME_CONFIG.toggleButtonSelector);
    if (button) {
      button.addEventListener('click', toggleTheme);
    }

    // Listen for system preference changes
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeQuery.addEventListener('change', (e) => {
        // Only apply if user hasn't set preference manually
        const stored = localStorage.getItem(THEME_CONFIG.storageKey);
        if (!stored) {
          setTheme(e.matches ? THEME_CONFIG.darkTheme : THEME_CONFIG.lightTheme);
        }
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTheme);
  } else {
    initializeTheme();
  }

  // Export for external use
  window.ThemeToggle = {
    getCurrentTheme,
    setTheme,
    toggleTheme
  };
})();
