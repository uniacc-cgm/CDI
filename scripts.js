// ==========================================
// 1. CONTROL DE VISTAS (SINGLE PAGE APPLICATION - SPA)
// ==========================================
let isRepoViewActive = true; // Variable global para aislar y pausar el Scroll-Spy del menú principal

function switchView(viewName, btnRef) {
    const repoView = document.getElementById("viewRepositorio");
    const procesoView = document.getElementById("viewProcesoDiseno");
    const aulaView = document.getElementById("viewConoceAula");
    
    const titleRepo = document.getElementById("headerTitleRepo");
    const titleProceso = document.getElementById("headerTitleProceso");
    const titleAula = document.getElementById("headerTitleAula");
    const searchWrapper = document.getElementById("headerSearchWrapper");
    const btnBack = document.getElementById("btnBackToRepo");

    const allNavLinks = document.querySelectorAll(".nav-link");
    allNavLinks.forEach(l => l.classList.remove("active-filter"));

    // Reset de vistas
    repoView.classList.add("hidden");
    procesoView.classList.add("hidden");
    aulaView.classList.add("hidden");
    titleRepo.classList.add("hidden");
    titleProceso.classList.add("hidden");
    titleAula.classList.add("hidden");

    if (viewName === "proceso-diseno") {
        isRepoViewActive = false; // Pausamos el Scroll-Spy al entrar a otra vista
        procesoView.classList.remove("hidden");
        titleProceso.classList.remove("hidden");
        searchWrapper.classList.add("hidden");
        btnBack.classList.remove("hidden");
        btnBack.classList.add("flex");

        if (btnRef) btnRef.classList.add("active-filter");
        else {
            const btnNavProc = document.getElementById("btnNavProceso");
            if (btnNavProc) btnNavProc.classList.add("active-filter");
        }

        if (window.innerWidth <= 1024) {
            document.getElementById("mainSidebar").classList.remove("active");
            document.querySelector(".sidebar-overlay").classList.remove("active");
        }
    } else if (viewName === "conoce-aula") {
        isRepoViewActive = false; // Pausamos el Scroll-Spy al entrar a otra vista
        aulaView.classList.remove("hidden");
        titleAula.classList.remove("hidden");
        searchWrapper.classList.add("hidden");
        btnBack.classList.remove("hidden");
        btnBack.classList.add("flex");

        if (btnRef) btnRef.classList.add("active-filter");
        else {
            const btnNavAula = document.getElementById("btnNavAula");
            if (btnNavAula) btnNavAula.classList.add("active-filter");
        }

        if (window.innerWidth <= 1024) {
            document.getElementById("mainSidebar").classList.remove("active");
            document.querySelector(".sidebar-overlay").classList.remove("active");
        }
    } else {
        // Volver a la vista del repositorio principal
        isRepoViewActive = true; // Reactivamos la detección de Scroll-Spy para los anclas del menú
        repoView.classList.remove("hidden");
        titleRepo.classList.remove("hidden");
        searchWrapper.classList.remove("hidden");
        btnBack.classList.add("hidden");
        btnBack.classList.remove("flex");

        const firstNav = document.querySelector(".nav-link[data-target='unidad-0']");
        if (firstNav) firstNav.classList.add("active-filter");
        
        if (window.innerWidth <= 1024) {
            document.getElementById("mainSidebar").classList.remove("active");
            document.querySelector(".sidebar-overlay").classList.remove("active");
        }
    }
}

// ==========================================
// 2. MANEJO DEL SIDEBAR Y PERSISTENCIA (localStorage)
// ==========================================
function toggleSidebar() {
    const sidebar = document.getElementById('mainSidebar');
    if (window.innerWidth <= 1024) {
        sidebar.classList.toggle('active');
        document.querySelector('.sidebar-overlay').classList.toggle('active');
    } else {
        sidebar.classList.toggle('desktop-collapsed');
        const isCollapsed = sidebar.classList.contains('desktop-collapsed');
        localStorage.setItem('davda_sidebar_collapsed', isCollapsed);
    }
}

function loadSidebarPreference() {
    if (window.innerWidth > 1024) {
        const isCollapsed = localStorage.getItem('davda_sidebar_collapsed') === 'true';
        if (isCollapsed) {
            document.getElementById('mainSidebar').classList.add('desktop-collapsed');
        }
    }
}

function scrollToSection(id, btn) {
    // Si estamos en una vista SPA independiente, regresamos al Repositorio primero
    const procesoView = document.getElementById("viewProcesoDiseno");
    const aulaView = document.getElementById("viewConoceAula");
    if ((procesoView && !procesoView.classList.contains("hidden")) || (aulaView && !aulaView.classList.contains("hidden"))) {
        switchView("repositorio");
    }

    if (window.innerWidth <= 1024 && document.getElementById('mainSidebar').classList.contains('active')) {
        toggleSidebar();
    }
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==========================================
// 3. PANEL DESLIZANTE REGISTRO DE CAMBIOS (CHANGELOG)
// ==========================================
function toggleChangelog() {
    const drawer = document.getElementById('changelogDrawer');
    const overlay = document.querySelector('.changelog-overlay');
    if (drawer && overlay) {
        drawer.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// ==========================================
// 4. SISTEMA DE NOTIFICACIÓN TOAST
// ==========================================
function copySectionLink(id) {
    const baseUrl = window.location.href.split('#')[0];
    const fullUrl = `${baseUrl}#${id}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
        const toast = document.getElementById('toastMsg');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    });
}

// ==========================================
// 5. REPRODUCTOR MODAL NATIVO DE YOUTUBE
// ==========================================
function openVideoModal(youtubeUrl) {
    const videoModal = document.getElementById('videoModal');
    const videoIframe = document.getElementById('videoIframe');
    
    const videoIdMatch = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (videoIdMatch && videoIdMatch[1]) {
        videoIframe.src = `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1`;
        videoModal.showModal();
    } else {
        window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
    }
}

function closeVideoModal() {
    const videoModal = document.getElementById('videoModal');
    const videoIframe = document.getElementById('videoIframe');
    if (videoIframe && videoModal) {
        videoIframe.src = "";
        videoModal.close();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const videoModal = document.getElementById("videoModal");
    if (videoModal) {
        videoModal.addEventListener("click", (e) => {
            const rect = videoModal.getBoundingClientRect();
            const isInDialog = (
                rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX && e.clientX <= rect.left + rect.width
            );
            if (!isInDialog) closeVideoModal();
        });
    }

    document.querySelectorAll(".btn-moodle-tutorial").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            openVideoModal(btn.href);
        });
    });
});

// ==========================================
// 6. BUSCADOR Y FILTROS POR CATEGORÍA EN TIEMPO REAL
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const filterChips = document.querySelectorAll(".filter-chip");
    const allCards = document.querySelectorAll(".card-asset");
    let currentCategory = "all";

    function filterCards() {
        const query = searchInput.value.toLowerCase().trim();

        allCards.forEach((card) => {
            const cardTitle = (card.getAttribute("data-title") || "").toLowerCase() + " " + card.innerText.toLowerCase();
            const cardCategory = card.getAttribute("data-category") || "";

            const matchesSearch = query === "" || cardTitle.includes(query);
            const matchesCategory = currentCategory === "all" || cardCategory === currentCategory;

            if (matchesSearch && matchesCategory) {
                card.classList.remove("hidden-card");
            } else {
                card.classList.add("hidden-card");
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterCards);
    }

    filterChips.forEach((chip) => {
        chip.addEventListener("click", () => {
            filterChips.forEach((c) => c.classList.remove("active"));
            chip.classList.add("active");
            currentCategory = chip.getAttribute("data-filter");
            filterCards();
        });
    });
});

// ==========================================
// 7. SCROLL-SPY REFACTORIZADO Y BLINDADO PARA VISTAS SPA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    loadSidebarPreference();

    const scrollArea = document.getElementById("mainScrollArea");
    const sections = document.querySelectorAll("#viewRepositorio section[id]");
    const navLinks = document.querySelectorAll(".nav-link[data-target]");

    const observerOptions = {
        root: scrollArea,
        rootMargin: "-10% 0px -75% 0px",
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        // Validar primero que estamos en la vista de Repositorio TR principal
        if (!isRepoViewActive) return;

        const isAtBottom = (scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight) < 20;
        
        if (isAtBottom && sections.length > 0) {
            const lastSectionId = sections[sections.length - 1].getAttribute("id");
            navLinks.forEach((link) => {
                link.classList.remove("active-filter");
                if (link.getAttribute("data-target") === lastSectionId) {
                    link.classList.add("active-filter");
                }
            });
            return;
        }

        entries.forEach((entry) => {
            if (entry.isIntersecting && isRepoViewActive) {
                const id = entry.target.getAttribute("id");
                navLinks.forEach((link) => {
                    link.classList.remove("active-filter");
                    if (link.getAttribute("data-target") === id) {
                        link.classList.add("active-filter");
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));

    // Refuerzo en evento scroll condicionado a la vista activa para el fondo del contenedor
    if (scrollArea) {
        scrollArea.addEventListener("scroll", () => {
            if (!isRepoViewActive) return;
            const isAtBottom = (scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight) < 20;
            if (isAtBottom && sections.length > 0) {
                const lastSectionId = sections[sections.length - 1].getAttribute("id");
                navLinks.forEach((link) => {
                    link.classList.remove("active-filter");
                    if (link.getAttribute("data-target") === lastSectionId) {
                        link.classList.add("active-filter");
                    }
                });
            }
        });
    }
});