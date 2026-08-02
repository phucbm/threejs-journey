import { lessons } from './lessons';

const base = import.meta.env.BASE_URL;
const current = location.pathname.replace(/\/$/, '');

function isActive(href: string): boolean {
  return current === href.replace(/\/$/, '');
}

function renderNav(): void {
  const nav = document.createElement('nav');
  nav.className = 'nav visible';
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

  const toggle = document.createElement('button');
  toggle.id = 'nav-toggle';
  toggle.className = 'nav-toggle';
  toggle.setAttribute('aria-label', 'Toggle menu');
  toggle.innerHTML = '<span class="nav-toggle__inner"><i></i><i></i><i></i></span>';
  toggle.addEventListener('click', () => nav.classList.toggle('visible'));
  nav.appendChild(toggle);

  document.body.prepend(nav);
}

renderNav();
