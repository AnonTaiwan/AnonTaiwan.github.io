// Generate stable slug from text
function slugify(text) {
    return text
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-\u4e00-\u9fa5]/g, '')
        .replace(/\-+/g, '-')
        .replace(/^-+|-+$/g, '').slice(0, 50);
}

// Ensure headings have ids and build TOC
const headings = Array.from(document.querySelectorAll('article h1, article h2, article h3'));
const tocContainer = document.getElementById('toc');
const tocMobile = document.getElementById('tocMobile') ? document.getElementById('tocMobile') : null;
const tocMobileNav = document.getElementById('tocMobile') ? document.getElementById('tocMobile').querySelector('#tocMobile') : null;

const listDesktop = document.createElement('div');
const listMobile = document.createElement('div');

headings.forEach(h => {
    if (!h.id) {
        const s = slugify(h.textContent || 'section');
        let id = s;
        let i = 1;
        while (document.getElementById(id)) { id = `${s}-${i++}`; }
        h.id = id;
    }
    const level = h.tagName.toLowerCase();
    const link = document.createElement('a');
    link.href = `#${h.id}`;
    link.textContent = h.textContent;
    link.className = level === 'h1' ? 'block font-medium text-gray-800' : level === 'h2' ? 'block pl-3 text-gray-700' : 'block pl-6 text-gray-600';
    listDesktop.appendChild(link.cloneNode(true));
    listMobile.appendChild(link);
});
if (tocContainer) tocContainer.appendChild(listDesktop);
if (tocMobileNav) tocMobileNav.appendChild(listMobile);

// Mobile TOC toggle
const tocToggle = document.getElementById('tocToggle');
if (tocToggle && tocMobile) {
    tocToggle.addEventListener('click', () => {
        const isHidden = tocMobile.classList.contains('hidden');
        tocMobile.classList.toggle('hidden');
        tocToggle.setAttribute('aria-expanded', String(!isHidden));
    });
}

// Smooth scroll with offset for sticky header
function headerOffset() {
    const header = document.querySelector('header');
    return header ? header.getBoundingClientRect().height + 12 : 0;
}
function smoothScrollTo(el) {
    const rect = el.getBoundingClientRect();
    const y = window.scrollY + rect.top - headerOffset();
    window.scrollTo({ top: y, behavior: 'smooth' });
}
document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (target) {
        e.preventDefault();
        smoothScrollTo(target);
        // Close mobile TOC after navigating
        if (tocMobile && !tocMobile.classList.contains('hidden')) {
            tocMobile.classList.add('hidden');
            tocToggle && tocToggle.setAttribute('aria-expanded', 'false');
        }
    }
});

// Scrollspy: highlight current section in desktop TOC
const links = tocContainer ? tocContainer.querySelectorAll('a') : [];
const idToLink = new Map(Array.from(links).map(l => [l.getAttribute('href').slice(1), l]));
const observer = new IntersectionObserver((entries) => {
    let activeId = null;
    entries.forEach(entry => {
        if (entry.isIntersecting) activeId = entry.target.id;
    });
    if (activeId) {
        idToLink.forEach(l => l.classList.remove('text-blue-600'));
        const active = idToLink.get(activeId);
        if (active) active.classList.add('text-blue-600');
    }
}, { rootMargin: `-${headerOffset()}px 0px -70% 0px`, threshold: 0.1 });
headings.forEach(h => observer.observe(h));