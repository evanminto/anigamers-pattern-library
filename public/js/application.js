(function setUpApplication() {
  'use strict';

  var GaEvents;
  var LinkToggle;

  var hashId;
  var menuTarget;
  var menuToggle;
  var searchTarget;
  var searchToggle;
  var skipToMainContentLink;

  /**
   * @param {Element} el
   * @return {Boolean}
   */
  function getGaLabel(el) {
    var label = el.id;

    if (!label && el instanceof HTMLAnchorElement) {
      label = el.getAttribute('href');
    }

    if (!label) {
      label = el.getAttribute('aria-label') || el.textContent;
    }

    return label.trim();
  }

  function getDefaultFontSize() {
    if (!('getComputedStyle' in window)) {
      return null;
    }

    return window.getComputedStyle(document.documentElement).getPropertyValue('font-size');
  }

  function getDisplayMode() {
    function isDisplayMode(mode) {
      return window.matchMedia('(display-mode: ' + mode + ')').matches;
    }

    if ('matchMedia' in window) {
      if (isDisplayMode('fullscreen')) {
        return 'fullscreen';
      } else if (isDisplayMode('standalone')) {
        return 'standalone';
      } else if (isDisplayMode('minimal-ui')) {
        return 'minimal-ui';
      }
    }

    return 'browser';
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js?v=4');
  }

  GaEvents = {
    /**
     * @param {String|Element} el
     * @param {String}         eventName
     * @param {String}         category
     * @param {String}         action
     * @param {String}         customLabel
     */
    listen: function listen(el, eventName, category, action, customLabel) {
      if (typeof el === 'string') {
        el = document.getElementById(el);
      }

      if (!el || !eventName || !category || !action) {
        return;
      }

      el.addEventListener(eventName, function sendGaEvent(event) {
        var label = customLabel || getGaLabel(el);
        if (ga) {
          ga('send', 'event', category, action, label);
        }
      });
    },

    /**
     * @param {String|Element} el
     * @param {String}         eventName
     * @param {String}         selector
     * @param {String}         category
     * @param {String}         action
     * @param {String}         customLabel
     */
    delegate: function delegate(el, eventName, selector, category, action, customLabel) {
      if (typeof el === 'string') {
        el = document.getElementById(el);
      }

      if (!el || !selector || !eventName || !category || !action) {
        return;
      }

      el.addEventListener(eventName, function sendGaEvent(event) {
        if (event.target.matches(selector)) {
          var label = customLabel || getGaLabel(event.target);
          if (ga) {
            ga('send', 'event', category, action, label);
          }
        }
      });
    },
  };

  LinkToggle = (function defineLinkToggle() {
    function LinkToggle() {
      this.toggleLink = null;
      this.closeLink = null;
      this.onChange = null;
    }

    LinkToggle.prototype.attachListeners = function attachListeners() {
      var toggle = this;

      if (this.toggleLink) {
        this.toggleLink.addEventListener('click', function (event) {
          event.preventDefault();

          if (event.currentTarget.getAttribute('aria-expanded') !== 'true') {
            toggle.open();
          } else {
            toggle.close();
          }
        });
      }

      if (this.closeLink) {
        this.closeLink.addEventListener('click', function (event) {
          event.preventDefault();
          toggle.close();
        });
      }
    };

    LinkToggle.prototype.open = function open(only) {
      var controlled;
      var autofocus;
      var focusTarget;

      if (!this.toggleLink) {
        return;
      }

      this.toggleLink.setAttribute('aria-expanded', 'true');

      if (!only) {
        controlled = document.getElementById(this.toggleLink.getAttribute('aria-controls'));
        autofocus = controlled ? controlled.querySelector('[autofocus]') : null;
        focusTarget = autofocus || controlled;

        if (focusTarget) {
          focusTarget.focus();
        }

        if (this.onChange) {
          this.onChange(true);
        }
      }
    };

    LinkToggle.prototype.close = function close(only) {
      if (!this.toggleLink) {
        return;
      }

      this.toggleLink.setAttribute('aria-expanded', 'false');

      if (!only) {
        this.toggleLink.focus();

        if (this.onChange) {
          this.onChange(false);
        }
      }
    };

    return LinkToggle;
  })();

  menuToggle = new LinkToggle();
  searchToggle = new LinkToggle();
  hashId = location.hash.length ? location.hash.substr(1) : '';

  window.aniGamers = window.aniGamers || {};

  menuToggle.toggleLink = document.querySelector('.js-main-menu-link');
  menuToggle.closeLink = document.querySelector('.js-main-menu-close-link');
  menuToggle.onChange = function onMenuChange(isOpening) {
    searchToggle.close(true);

    if (isOpening) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    document.getElementById('site_header').classList.remove('-search-open');
  };

  searchToggle.toggleLink = document.querySelector('.js-header-search-link');
  searchToggle.closeLink = document.querySelector('.js-header-search-form-close-link');
  searchToggle.onChange = function onSearchChange(isOpening) {
    menuToggle.close(true);

    if (isOpening) {
      document.getElementById('site_header').classList.add('-search-open');
    } else {
      document.getElementById('site_header').classList.remove('-search-open');
    }

    document.body.classList.remove('menu-open');
  };

  menuToggle.attachListeners();
  menuTarget = menuToggle.toggleLink ? document.getElementById(menuToggle.toggleLink.getAttribute('aria-controls')) : null;
  if (menuTarget && menuTarget.id === hashId) {
    menuToggle.open();
  } else {
    menuToggle.close(true);
  }

  searchToggle.attachListeners();
  searchTarget = searchToggle.toggleLink ? document.getElementById(searchToggle.toggleLink.getAttribute('aria-controls')) : null;
  if (searchTarget && searchTarget.id === hashId) {
    searchToggle.open();
  } else {
    searchToggle.close(true);
  }

  document.body.addEventListener('change', function handleChange(event) {
    var className;
    var input;
    var target;

    if (
      event.target.tagName === 'INPUT' &&
      event.target.type === 'checkbox' &&
      event.target.className.contains('js-class-toggle')
    ) {
      input = event.target,
      target = input.getAttribute('data-class-toggle-target'),
      className = input.getAttribute('data-class-toggle-class');

      target.classList.toggle(className);
    }
  });

  window.aniGamers.setUpMediaSession = function setUpMediaSession(audio, options) {
    if ('mediaSession' in navigator) {
      audio.addEventListener('playing', function() {
        navigator.mediaSession.metadata = new MediaMetadata(options);

        navigator.mediaSession.setActionHandler('play', function() {
          audio.play();
        });

        navigator.mediaSession.setActionHandler('pause', function() {
          audio.pause();
        });

        navigator.mediaSession.setActionHandler('seekbackward', function() {
          if (audio.currentTime >= 10) {
            audio.currentTime -= 10;
          } else {
            audio.currentTime = 0;
          }
        });

        navigator.mediaSession.setActionHandler('seekforward', function() {
          audio.currentTime += 10;
        });
      });
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
    var audioElements;
    var displayMode;
    var fontSize;
    var i;
    var pageViewConfig = {};

    if (ga) {
      audioElements = document.querySelectorAll('audio');

      GaEvents.delegate('main_menu', 'click', 'a[href]', 'Main Menu Link', 'click');
      GaEvents.listen('entry_title_link', 'click', 'Entry Title Link', 'click');
      GaEvents.delegate('entry_byline', 'click', 'a[href][rel="author"]', 'Entry Byline Author Link', 'click');
      GaEvents.delegate('entry_body', 'click', 'a[href]', 'Entry Body Link', 'click');
      GaEvents.delegate('entry_topics_list', 'click', 'a[href]', 'Entry Topic Link', 'click');
      GaEvents.delegate('suggested_entries_list', 'click', 'a[href]', 'Suggested Entry Link', 'click');

      fontSize = getDefaultFontSize();
      displayMode = getDisplayMode();

      if (fontSize) {
        pageViewConfig.dimension1 = fontSize;
      }

      if ('devicePixelRatio' in window) {
        pageViewConfig.dimension2 = window.devicePixelRatio;
      }

      if (displayMode) {
        pageViewConfig.dimension3 = displayMode;
      }

      ga('send', 'pageview', pageViewConfig);

      for (i = 0; i < audioElements.length; i++) {
        (function attachAudioEventListener(audio) {
          audio.addEventListener('play', function handlePlayAudio() {
            ga('send', 'event', 'Audio', 'play', audio.src);
          });
        })(audioElements[i]);
      }
    }
  });

  skipToMainContentLink = document.querySelector('.js-skip-to-main-content');

  if (skipToMainContentLink) {
    skipToMainContentLink.addEventListener('click', function() {
      ga('send', 'event', 'Link', 'click', 'Skip to Main Content');
    });
    skipToMainContentLink.addEventListener('focus', function() {
      ga('send', 'event', 'Link', 'focus', 'Skip to Main Content');
    });
  }
})();
