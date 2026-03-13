/* YAJUG — main.js */
(function () {
  'use strict';

  /* ── Burger / Mobile Nav ─────────────────────────────────── */
  var burger    = document.getElementById('burger-btn');
  var mobileNav = document.getElementById('mobile-nav');
  var header    = document.getElementById('site-header');

  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      var expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!expanded));
      mobileNav.setAttribute('aria-hidden', String(expanded));
      mobileNav.classList.toggle('is-open', !expanded);
    });

    /* Close mobile nav on link click */
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileNav.classList.remove('is-open');
      });
    });

    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (mobileNav.classList.contains('is-open') &&
          !header.contains(e.target)) {
        burger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileNav.classList.remove('is-open');
      }
    });
  }

  /* ── Header scroll effect ────────────────────────────────── */
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Active nav link (exact match) ──────────────────────── */
  var currentPath = window.location.pathname;
  document.querySelectorAll('.nav__link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href !== '/' && currentPath.startsWith(href)) {
      link.classList.add('nav__link--active');
    } else if (href === '/' && currentPath === '/') {
      link.classList.add('nav__link--active');
    }
  });

  /* ── Calendar (yearly view — 12 months grid) ────────────── */
  var btnList  = document.getElementById('btn-list');
  var btnCal   = document.getElementById('btn-cal');
  var viewList = document.getElementById('view-list');
  var viewCal  = document.getElementById('view-cal');

  if (btnList && btnCal && viewList && viewCal) {

    var MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin',
                  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    var MONTHS_SHORT = ['Jan','Fév','Mar','Avr','Mai','Jui',
                        'Juil','Aoû','Sep','Oct','Nov','Déc'];

    var events  = window.YAJUG_EVENTS || [];
    var today   = new Date();

    /* Default to the year of the first upcoming event */
    var curYear = today.getFullYear();
    var firstUpcoming = events.filter(function(e){ return !e.past; })
      .map(function(e){ return e.date; }).sort()[0];
    if (firstUpcoming) curYear = parseInt(firstUpcoming.split('-')[0], 10);

    function eventsForMonth(y, m) {
      /* m is 0-based */
      var prefix = y + '-' + (m < 9 ? '0' + (m + 1) : '' + (m + 1));
      return events.filter(function(e){ return e.date && e.date.indexOf(prefix) === 0; });
    }

    function render() {
      document.getElementById('cal-year-label').textContent = curYear;
      var grid  = document.getElementById('cal-grid');
      var panel = document.getElementById('cal-panel');
      grid.innerHTML = '';
      panel.hidden = true;

      for (var m = 0; m < 12; m++) {
        var evs = eventsForMonth(curYear, m);
        var isCurrentMonth = (m === today.getMonth() && curYear === today.getFullYear());

        var cell = document.createElement('div');
        cell.className = 'cal__month-cell' +
          (evs.length          ? ' cal__month-cell--has-event' : '') +
          (isCurrentMonth      ? ' cal__month-cell--current'   : '') +
          (evs.length && evs[0].past ? ' cal__month-cell--past' : '');

        var name = document.createElement('span');
        name.className = 'cal__month-name';
        name.textContent = MONTHS_SHORT[m];
        cell.appendChild(name);

        if (evs.length) {
          var badge = document.createElement('span');
          badge.className = 'cal__month-badge';
          badge.textContent = evs[0].past ? 'Passé' : 'Événement';
          cell.appendChild(badge);

          (function(monthEvs, monthIdx) {
            cell.addEventListener('click', function() {
              showPanel(monthIdx, monthEvs);
            });
          })(evs, m);
        }

        grid.appendChild(cell);
      }
    }

    function showPanel(m, evs) {
      var panel = document.getElementById('cal-panel');
      var html = '<div class="cal__panel-month">' + MONTHS[m] + ' ' + curYear + '</div>';
      evs.forEach(function(e) {
        html += '<div class="cal__panel-event">';
        html += '<a class="cal__panel-event-title" href="' + e.url + '">' + e.title + '</a>';
        var meta = [];
        if (e.date)  meta.push(e.date.split('-').reverse().join('/'));
        if (e.time)  meta.push(e.time);
        if (e.venue) meta.push(e.venue);
        if (meta.length) html += '<div class="cal__panel-event-meta">' + meta.join(' · ') + '</div>';
        html += '</div>';
      });
      panel.innerHTML = html;
      panel.hidden = false;
    }

    document.getElementById('cal-prev').addEventListener('click', function() {
      curYear--;
      render();
    });
    document.getElementById('cal-next').addEventListener('click', function() {
      curYear++;
      render();
    });

    function switchView(mode) {
      if (mode === 'cal') {
        viewList.hidden = true;
        viewCal.hidden  = false;
        btnList.classList.remove('is-active');
        btnCal.classList.add('is-active');
        btnList.setAttribute('aria-pressed', 'false');
        btnCal.setAttribute('aria-pressed', 'true');
        render();
      } else {
        viewCal.hidden  = true;
        viewList.hidden = false;
        btnCal.classList.remove('is-active');
        btnList.classList.add('is-active');
        btnCal.setAttribute('aria-pressed', 'false');
        btnList.setAttribute('aria-pressed', 'true');
      }
    }

    btnList.addEventListener('click', function() { switchView('list'); });
    btnCal.addEventListener('click',  function() { switchView('cal');  });
  }

})();
