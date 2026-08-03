import { lessons } from './lessons';

const base = import.meta.env.BASE_URL;
const current = location.pathname.replace(/\/$/, '');

function isActive(href: string): boolean {
  return current === href.replace(/\/$/, '');
}

const NAV_VISIBLE_KEY = 'nav-visible';

function renderNav(): void {
  const isVisible = localStorage.getItem(NAV_VISIBLE_KEY) !== 'false';

  const nav = document.createElement('nav');
  nav.className = isVisible ? 'nav visible' : 'nav';
  nav.id = 'site-nav';

  const title = document.createElement('div');
  title.className = 'nav-title';
  const logo = document.createElement('a');
  logo.href = base;
  logo.className = 'nav-logo';
  logo.textContent = 'ThreeJS Journey';
  title.appendChild(logo);
  nav.appendChild(title);

  const ul = document.createElement('ul');
  ul.className = 'nav-menu';
  for (const lesson of lessons) {
    if (lesson.hidden) continue;
    const href = `${base}${lesson.slug}/`;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = href;
    a.className = 'nav-link' + (isActive(href) ? ' active' : '');
    a.textContent = lesson.number ? `${lesson.number} - ${lesson.title}` : lesson.title;
    li.appendChild(a);
    ul.appendChild(li);
  }
  nav.appendChild(ul);

  const footer = document.createElement('div');
  footer.className = 'nav-footer';
  const repoLink = document.createElement('a');
  repoLink.href = 'https://github.com/phucbm/threejs-journey';
  repoLink.target = '_blank';
  repoLink.rel = 'noopener';
  repoLink.textContent = 'GitHub ↗';
  footer.appendChild(repoLink);
  nav.appendChild(footer);

  const toggle = document.createElement('button');
  toggle.id = 'nav-toggle';
  toggle.className = 'nav-toggle';
  toggle.setAttribute('aria-label', 'Toggle menu');
  toggle.innerHTML = '<span class="nav-toggle__inner"><i></i><i></i><i></i></span>';
  toggle.addEventListener('click', () => {
    const visible = nav.classList.toggle('visible');
    localStorage.setItem(NAV_VISIBLE_KEY, String(visible));
  });
  nav.appendChild(toggle);

  document.body.prepend(nav);
}

renderNav();
