// Manejo del estado del Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('mainSidebar');
    if (window.innerWidth <= 1024) {
        // Modo móvil
        sidebar.classList.toggle('active');
        document.querySelector('.sidebar-overlay').classList.toggle('active');
    } else {
        // Modo escritorio: toggle colapsar/expandir
        sidebar.classList.toggle('desktop-collapsed');
    }
}

// Desplazamiento y actualización visual al clickear el Sidebar
function scrollToSection(id, btn) {
    if(window.innerWidth <= 1024 && document.getElementById('mainSidebar').classList.contains('active')) {
        toggleSidebar();
    }
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active-filter'));
    if (btn) btn.classList.add('active-filter');
    
    const target = document.getElementById(id);
    if(target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}

// Lógica de copiado de enlace universal con Toast Notification
function copySectionLink(id) {
    const baseUrl = window.location.href.split('#')[0];
    const fullUrl = `${baseUrl}#${id}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
        const toast = document.getElementById('toastMsg');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    });
}

// Scroll Spy: Actualiza el enlace activo del Sidebar al hacer scroll
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section[id]");
    const scrollArea = document.getElementById("mainScrollArea");
    const mainHeader = document.querySelector("header");

    scrollArea.addEventListener("scroll", () => {
        let current = "";
        
        // Cálculo dinámico del offset por si la altura del header cambia en móvil vs desktop
        const headerOffset = mainHeader ? mainHeader.offsetHeight + 20 : 150;
        
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (scrollArea.scrollTop >= sectionTop - headerOffset) {
                current = section.getAttribute("id");
            }
        });

        // Si llegamos exactamente al final del contenedor, marcar la última sección
        if (scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 5) {
            current = sections[sections.length - 1].getAttribute("id");
        }

        document.querySelectorAll(".nav-link").forEach((link) => {
            link.classList.remove("active-filter");
            if (link.getAttribute("data-target") === current) {
                link.classList.add("active-filter");
            }
        });
    });
});