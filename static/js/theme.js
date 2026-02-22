/**
 * Theme switch: light / dark. Persists to localStorage and applies to <html data-theme="...">.
 * No dependencies. Works with navbar in templates/inc/nav/navbar.html.
 */
(function () {
  'use strict';
  var STORAGE_KEY = 'portolio-theme';
  var THEME_BTN_ID = 'theme-toggle-btn';

  function getStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStored(value) {
    try {
      if (value) {
        localStorage.setItem(STORAGE_KEY, value);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {}
  }

  function getPreferred() {
    var stored = getStored();
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(theme) {
    var root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    var next = (current === 'dark') ? 'light' : 'dark';
    setStored(next);
    applyTheme(next);
  }

  function handleThemeClick(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    toggleTheme();
  }

  function init() {
    applyTheme(getPreferred());

    // 1) Direct button listener (navbar is in DOM via include)
    var btn = document.getElementById(THEME_BTN_ID);
    if (btn) {
      btn.addEventListener('click', handleThemeClick);
    }

    // 2) Delegated listener (in case button is re-rendered or inside dynamic content)
    document.body.addEventListener('click', function (e) {
      var target = e.target;
      if (!target) return;
      var toggleBtn = target.closest ? target.closest('.js-theme-toggle') : null;
      if (toggleBtn) {
        handleThemeClick(e);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
