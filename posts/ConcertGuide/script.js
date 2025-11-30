document.addEventListener('DOMContentLoaded', () => {
    (function () {
        const article = document.querySelector('article');
        const toc = document.getElementById('toc');
        const tocMobile = document.getElementById('tocMobile');

        if (!article || !toc) return;

        // Clear any existing content
        toc.innerHTML = '';
        if (tocMobile) tocMobile.innerHTML = '';

        const headings = article.querySelectorAll('h1[id],h2[id]');
        const items = [];
        headings.forEach(h => {
            const id = h.id || h.getAttribute('id');
            if (!id) return;
            const text = h.textContent.trim();
            const level = h.tagName.toLowerCase();
            items.push({ id, text, level });
        });

        items.forEach(({ id, text, level }) => {
            const a = document.createElement('a');
            a.href = `#${id}`;
            a.textContent = text;
            a.className = 'block hover:text-pink-600 truncate transition-all duration-200 rounded px-2 py-1.5 hover:bg-gradient-to-r hover:from-pink-200 hover:to-purple-200 hover:shadow-md';
            a.dataset.id = id;
            if (level === 'h1') a.classList.add('font-bold', 'text-purple-700', 'text-sm');
            if (level === 'h2') a.classList.add('pl-3', 'text-blue-600', 'font-semibold', 'text-xs');
            toc.appendChild(a);
        });

        // Build mobile TOC
        if (tocMobile) {
            items.forEach(({ id, text, level }) => {
                const a = document.createElement('a');
                a.href = `#${id}`;
                a.textContent = text;
                a.className = 'block hover:text-pink-600 truncate transition-all duration-200 rounded px-2 py-1.5 hover:bg-gradient-to-r hover:from-pink-200 hover:to-purple-200';
                a.dataset.id = id;
                if (level === 'h1') a.classList.add('font-bold', 'text-purple-700', 'text-sm');
                if (level === 'h2') a.classList.add('pl-3', 'text-blue-600', 'font-semibold', 'text-xs');
                tocMobile.appendChild(a);
            });
        }

        // Enhanced scrollspy with gradient highlighting
        const allLinks = [...toc.querySelectorAll('a'), ...(tocMobile ? tocMobile.querySelectorAll('a') : [])];

        const headerOffset = () => {
            const header = document.querySelector('header');
            return header ? header.offsetHeight : 80;
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    allLinks.forEach(l => {
                        l.classList.remove('bg-gradient-to-r', 'from-pink-500', 'to-purple-500', 'text-white', 'shadow-lg', 'scale-105');
                    });
                    const matchingLinks = allLinks.filter(l => l.dataset.id === entry.target.id);
                    matchingLinks.forEach(link => {
                        link.classList.add('bg-gradient-to-r', 'from-pink-500', 'to-purple-500', 'text-white', 'shadow-lg', 'scale-105', 'font-bold');
                    });
                }
            });
        }, { rootMargin: `-${headerOffset()}px 0px -70% 0px`, threshold: 0.1 });

        headings.forEach(h => observer.observe(h));
    })();

    // Mobile TOC Toggle
    (function () {
        const tocToggle = document.getElementById('tocToggle');
        const mobileToc = document.getElementById('mobileToc');

        if (tocToggle && mobileToc) {
            tocToggle.addEventListener('click', function (e) {
                e.stopPropagation();
                const isExpanded = tocToggle.getAttribute('aria-expanded') === 'true';
                tocToggle.setAttribute('aria-expanded', !isExpanded);

                if (isExpanded) {
                    mobileToc.classList.add('hidden');
                } else {
                    mobileToc.classList.remove('hidden');
                    // Scroll to top when opening TOC
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });

            // Close mobile TOC when clicking on a link
            mobileToc.addEventListener('click', function (e) {
                if (e.target.tagName === 'A') {
                    mobileToc.classList.add('hidden');
                    tocToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    })();

    // Music Player Functionality
    (function () {
        const bgMusic = document.getElementById('bgMusic');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const volumeSlider = document.getElementById('volumeSlider');

        if (!bgMusic || !playPauseBtn || !volumeSlider) return;

        // Set initial volume
        bgMusic.volume = 0.3;

        // Auto-play music on load (with fallback)
        let autoplayAttempted = false;

        function tryAutoPlay() {
            bgMusic.play().then(function () {
                playPauseBtn.textContent = '⏸';
                autoplayAttempted = true;
            }).catch(function () {
                playPauseBtn.textContent = '▶';
                // If autoplay blocked, play on first user interaction
                if (!autoplayAttempted) {
                    document.body.addEventListener('click', function () {
                        if (bgMusic.paused && !autoplayAttempted) {
                            bgMusic.play();
                            playPauseBtn.textContent = '⏸';
                            autoplayAttempted = true;
                        }
                    }, { once: true });
                }
            });
        }

        // Try to play immediately
        tryAutoPlay();

        // Play/Pause functionality
        playPauseBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (bgMusic.paused) {
                bgMusic.play();
                playPauseBtn.textContent = '⏸';
            } else {
                bgMusic.pause();
                playPauseBtn.textContent = '▶';
            }
        });

        // Volume control
        volumeSlider.addEventListener('input', function () {
            bgMusic.volume = this.value / 100;
        });
    })();

    // Convert [ ] to checkboxes
    (function () {
        const article = document.querySelector('article');
        if (!article) return;

        // Find all text nodes containing [ ]
        function replaceCheckboxes(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                if (text.includes('[ ]')) {
                    const span = document.createElement('span');
                    const parts = text.split('[ ]');

                    parts.forEach((part, index) => {
                        if (index > 0) {
                            const label = document.createElement('label');
                            label.className = 'checklist-item';

                            const checkbox = document.createElement('input');
                            checkbox.type = 'checkbox';
                            checkbox.className = 'custom-checkbox';

                            // Load saved state from localStorage
                            const checkboxId = `checkbox-${Date.now()}-${index}`;
                            checkbox.id = checkboxId;
                            const savedState = localStorage.getItem(checkboxId);
                            if (savedState === 'true') {
                                checkbox.checked = true;
                            }

                            // Save state on change
                            checkbox.addEventListener('change', function () {
                                localStorage.setItem(checkboxId, this.checked);
                            });

                            label.appendChild(checkbox);
                            span.appendChild(label);
                        }
                        if (part) {
                            span.appendChild(document.createTextNode(part));
                        }
                    });

                    node.parentNode.replaceChild(span, node);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                Array.from(node.childNodes).forEach(child => replaceCheckboxes(child));
            }
        }

        replaceCheckboxes(article);
    })();
});