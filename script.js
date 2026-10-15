const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealItems = document.querySelectorAll('.reveal');
if (reducedMotion) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.13, rootMargin: '0px 0px -45px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  mobileMenu.classList.remove('is-open');
  document.body.style.overflow = '';
}

menuButton.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(opening));
  mobileMenu.setAttribute('aria-hidden', String(!opening));
  mobileMenu.classList.toggle('is-open', opening);
  document.body.style.overflow = opening ? 'hidden' : '';
});
mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const navLinks = document.querySelectorAll('.desktop-nav a');
const sections = document.querySelectorAll('main section[id], footer[id]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { threshold: 0.43 });
sections.forEach((section) => sectionObserver.observe(section));

const tabs = [...document.querySelectorAll('.role-tab')];
const panels = [...document.querySelectorAll('.role-panel')];
const images = [...document.querySelectorAll('.role-image')];
const imageIndex = document.querySelector('.image-index');

function activateRole(role) {
  const selected = tabs.find((tab) => tab.dataset.role === role);
  if (!selected) return;
  tabs.forEach((tab) => {
    const active = tab === selected;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  panels.forEach((panel) => {
    const active = panel.dataset.rolePanel === role;
    panel.classList.toggle('is-active', active);
    panel.hidden = !active;
  });
  images.forEach((image) => image.classList.toggle('is-active', image.dataset.roleImage === role));
  imageIndex.textContent = `${String(tabs.indexOf(selected) + 1).padStart(2, '0')} / 03`;
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateRole(tab.dataset.role));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === 'ArrowRight' ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length;
    tabs[nextIndex].focus();
    activateRole(tabs[nextIndex].dataset.role);
  });
});

const reflectionCards = [...document.querySelectorAll('.chapter-card')];
const reflectionDialog = document.querySelector('#reflection-dialog');
const dialogNumber = document.querySelector('#dialog-number');
const dialogDate = document.querySelector('#dialog-date');
const dialogTitle = document.querySelector('#dialog-title');
const dialogCopy = document.querySelector('#dialog-copy');
const dialogCounter = document.querySelector('#dialog-counter');
let activeReflection = 0;

function renderReflection(index) {
  activeReflection = (index + reflectionCards.length) % reflectionCards.length;
  const card = reflectionCards[activeReflection];
  const template = document.querySelector(`#${card.dataset.reflection}`);
  dialogNumber.textContent = String(activeReflection + 1).padStart(2, '0');
  dialogDate.textContent = card.querySelector('time').textContent;
  dialogTitle.textContent = card.querySelector('h3').textContent;
  dialogCopy.replaceChildren(template.content.cloneNode(true));
  dialogCounter.textContent = `${String(activeReflection + 1).padStart(2, '0')} / ${reflectionCards.length}`;
}

function openReflection(index) {
  renderReflection(index);
  reflectionDialog.showModal();
  document.body.style.overflow = 'hidden';
}

reflectionCards.forEach((card, index) => card.addEventListener('click', () => openReflection(index)));
document.querySelector('.dialog-close').addEventListener('click', () => reflectionDialog.close());
document.querySelector('[data-dialog-prev]').addEventListener('click', () => renderReflection(activeReflection - 1));
document.querySelector('[data-dialog-next]').addEventListener('click', () => renderReflection(activeReflection + 1));
reflectionDialog.addEventListener('click', (event) => {
  const bounds = reflectionDialog.getBoundingClientRect();
  const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (outside) reflectionDialog.close();
});
reflectionDialog.addEventListener('close', () => { document.body.style.overflow = ''; });

const galleryItems = [
  {
    src: 'assets/nurse-portrait.webp',
    alt: 'Janjae in her nursing uniform',
    caption: 'Becoming the nurse I once imagined'
  },
  {
    src: 'assets/operating-room.webp',
    alt: 'Janjae with a surgical team in an operating room',
    caption: 'Care built through teamwork'
  },
  {
    src: 'assets/orthopedic-center.webp',
    alt: 'Janjae outside the Philippine Orthopedic Center',
    caption: 'Learning beyond familiar halls'
  },
  {
    src: 'assets/emergency-training.webp',
    alt: 'Janjae practicing emergency response skills',
    caption: 'Turning preparation into action'
  },
  {
    src: 'assets/clinical-duty.webp',
    alt: 'Janjae during clinical duty',
    caption: 'Quiet moments behind the calling'
  }
];
const galleryButtons = [...document.querySelectorAll('.memory-card')];
const lightbox = document.querySelector('#gallery-lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxCaption = document.querySelector('#gallery-caption');
const lightboxCounter = document.querySelector('#lightbox-counter');
let activePhoto = 0;

function renderPhoto(index) {
  activePhoto = (index + galleryItems.length) % galleryItems.length;
  const photo = galleryItems[activePhoto];
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt;
  lightboxCaption.textContent = photo.caption;
  lightboxCounter.textContent = `${String(activePhoto + 1).padStart(2, '0')} / ${String(galleryItems.length).padStart(2, '0')}`;
}

function openPhoto(index) {
  renderPhoto(index);
  lightbox.showModal();
  document.body.style.overflow = 'hidden';
}

galleryButtons.forEach((button, index) => button.addEventListener('click', () => openPhoto(index)));
document.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
document.querySelector('[data-gallery-prev]').addEventListener('click', () => renderPhoto(activePhoto - 1));
document.querySelector('[data-gallery-next]').addEventListener('click', () => renderPhoto(activePhoto + 1));
lightbox.addEventListener('click', (event) => {
  const bounds = lightbox.getBoundingClientRect();
  const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (outside) lightbox.close();
});
lightbox.addEventListener('close', () => { document.body.style.overflow = ''; });

document.addEventListener('keydown', (event) => {
  if (!lightbox.open) return;
  if (event.key === 'ArrowLeft') renderPhoto(activePhoto - 1);
  if (event.key === 'ArrowRight') renderPhoto(activePhoto + 1);
});

const termTabs = [...document.querySelectorAll('[data-select-term]')];
function selectJJTerm(term, updateUrl = true) {
  term = term === 'prelims' ? 'prelims' : 'midterms';
  document.querySelectorAll('[data-term]').forEach(panel => {
    panel.hidden = panel.dataset.term !== term;
    if (!panel.hidden) panel.querySelectorAll('.reveal').forEach(item => item.classList.add('is-visible'));
  });
  document.querySelectorAll('[data-reflection-term]').forEach(panel => {
    panel.hidden = panel.dataset.reflectionTerm !== term;
    if (!panel.hidden) panel.querySelectorAll('.reveal').forEach(item => item.classList.add('is-visible'));
  });
  termTabs.forEach(button => {
    const active = button.dataset.selectTerm === term;
    button.setAttribute('aria-selected',String(active));
    button.tabIndex = active ? 0 : -1;
  });
  document.querySelectorAll('[data-quick-term]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.quickTerm === term)));
  document.querySelector('.reading-label').textContent = `Reading / ${term === 'prelims' ? 'Prelims' : 'Midterms'}`;
  document.querySelectorAll('.desktop-nav a, .mobile-menu a').forEach(link => {
    if (['#reflection','#reflection-midterms'].includes(link.getAttribute('href'))) link.href = term === 'prelims' ? '#reflection' : '#reflection-midterms';
  });
  if (updateUrl) {
    const url = new URL(location.href);url.searchParams.set('term',term);
    if (['#reflection','#reflection-midterms'].includes(url.hash)) url.hash = '#journey';
    history.replaceState(null,'',url);
    const panel = document.querySelector(`[data-term="${term}"]`);
    if (!reducedMotion) { panel.getAnimations().forEach(a=>a.cancel()); panel.animate([{opacity:.25,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'ease-out'}); }
  }
}
termTabs.forEach((button,index) => {
  button.addEventListener('click',()=>selectJJTerm(button.dataset.selectTerm));
  button.addEventListener('keydown',event=> {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?1:1-index;
    termTabs[next].focus();selectJJTerm(termTabs[next].dataset.selectTerm);
  });
});
document.querySelectorAll('[data-quick-term]').forEach(button=>button.addEventListener('click',()=>selectJJTerm(button.dataset.quickTerm)));
selectJJTerm(new URLSearchParams(location.search).get('term'),false);
window.addEventListener('popstate',()=>selectJJTerm(new URLSearchParams(location.search).get('term'),false));
