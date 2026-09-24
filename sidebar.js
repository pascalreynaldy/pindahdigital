// sidebar.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Sidebar HTML
    const sidebarHTML = `
        <div class="sidebar-overlay" id="sidebarOverlay"></div>
        <div class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <h2 style="font-size: 18px; font-weight: 700; margin: 0;">Menu Utama</h2>
                <button class="close-sidebar" id="closeSidebar"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="sidebar-content">
                <a href="mandiri_spot.html" class="sidebar-link"><i class="fa-solid fa-map-location-dot"></i> Peta & Spot</a>
                <a href="daily_assignment.html" class="sidebar-link"><i class="fa-solid fa-clipboard-list"></i> Daily Assignment</a>
                <a href="not_found.html" class="sidebar-link"><i class="fa-solid fa-chart-line"></i> Dashboard</a>
                <a href="not_found.html" class="sidebar-link"><i class="fa-solid fa-gear"></i> Pengaturan</a>
            </div>
        </div>
    `;
    
    const container = document.getElementById('sidebar-container');
    if (container) {
        container.innerHTML = sidebarHTML;
    }

    // 2. Set Active Class Based on Current URL
    const currentPage = window.location.pathname.split('/').pop() || 'mandiri_spot.html';
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // 3. Initialize Sidebar Logic
    const sidebarToggle = document.getElementById('sidebarToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const appContainer = document.querySelector('.app-container');

    function openSidebar() {
        if (sidebar && sidebarOverlay && appContainer) {
            sidebar.style.top = appContainer.scrollTop + 'px';
            sidebarOverlay.style.top = appContainer.scrollTop + 'px';
            appContainer.style.overflow = 'hidden';
            sidebar.classList.add('show');
            sidebarOverlay.classList.add('show');
        }
    }

    function hideSidebar() {
        if (sidebar && sidebarOverlay && appContainer) {
            appContainer.style.overflow = '';
            sidebar.classList.remove('show');
            sidebarOverlay.classList.remove('show');
        }
    }

    if (sidebarToggle) sidebarToggle.addEventListener('click', openSidebar);
    if (closeSidebar) closeSidebar.addEventListener('click', hideSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', hideSidebar);
});
