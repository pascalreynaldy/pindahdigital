// sidebar.js
// Shared across all pages: injects the sidebar UI, a dummy petugas profile,
// and a lightweight page-transition loader so navigating between pages feels smooth.

(() => {
    // ------------------------------------------------------------------
    // Dummy Petugas (logged-in officer) — shared "session" for the demo
    // ------------------------------------------------------------------
    const CURRENT_OFFICER = {
        name: 'Ahmad Fauzi',
        role: 'Petugas Lapangan',
        branch: 'Cabang Pondok Indah',
        initials: 'AF'
    };

    // Friendly name lookup for dummy user ids used across the app's mock data
    const OFFICER_NAME_MAP = {
        current_user: 'Ahmad Fauzi',
        other_user_1: 'Siti Nurhaliza',
        other_user_2: 'Budi Santoso'
    };
    window.OFFICER_NAME_MAP = OFFICER_NAME_MAP;
    window.CURRENT_OFFICER = CURRENT_OFFICER;
    window.getOfficerName = function (id) {
        if (!id) return 'Tidak diketahui';
        return OFFICER_NAME_MAP[id] || id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };
    window.getOfficerInitials = function (id) {
        const name = window.getOfficerName(id);
        return name.split(' ').map(w => w[0]).filter(Boolean).join('').toUpperCase().slice(0, 2);
    };

    // ------------------------------------------------------------------
    // Inject shared styles (sidebar redesign + page transition loader)
    // ------------------------------------------------------------------
    const style = document.createElement('style');
    style.id = 'shared-sidebar-transition-styles';
    style.textContent = `
        /* ---- Sidebar visual refresh ---- */
        .sidebar {
            display: flex;
            flex-direction: column;
            background-color: var(--white, #fff);
        }
        .sidebar-header {
            background: linear-gradient(135deg, var(--navy, #0F2044) 0%, var(--navy-light, #223769) 100%) !important;
            padding: 24px 20px !important;
            position: relative;
            overflow: hidden;
        }
        .sidebar-header::after {
            content: '';
            position: absolute;
            width: 140px; height: 140px;
            background: rgba(246, 194, 67, 0.12);
            border-radius: 50%;
            top: -60px; right: -50px;
            pointer-events: none;
        }
        .sidebar-header-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            position: relative;
            z-index: 1;
        }
        .sidebar-header-brand .brand-icon {
            width: 34px; height: 34px;
            border-radius: 10px;
            background: rgba(246, 194, 67, 0.18);
            color: var(--yellow, #F6C243);
            display: flex; align-items: center; justify-content: center;
            font-size: 15px;
            flex-shrink: 0;
        }
        .sidebar-header-brand h2 {
            font-size: 16px !important;
            font-weight: 700 !important;
            margin: 0 !important;
            line-height: 1.25;
        }
        .sidebar-header-brand p {
            font-size: 10.5px;
            color: rgba(255,255,255,0.6);
            margin-top: 1px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .close-sidebar {
            position: relative;
            z-index: 1;
            width: 30px; height: 30px;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            background: rgba(255,255,255,0.08);
            transition: background 0.2s ease, transform 0.2s ease;
        }
        .close-sidebar:hover { background: rgba(255,255,255,0.18); transform: rotate(90deg); }

        .sidebar-content {
            padding: 14px 12px !important;
            flex: 1;
            overflow-y: auto;
        }
        .sidebar-section-label {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            color: #9CA3AF;
            padding: 8px 12px 6px;
        }
        .sidebar-link {
            padding: 11px 12px !important;
            border-radius: 12px !important;
            margin-bottom: 3px;
            font-size: 13.5px !important;
            font-weight: 600 !important;
            border-left: none !important;
            position: relative;
        }
        .sidebar-link .link-icon-wrap {
            width: 32px; height: 32px;
            border-radius: 9px;
            display: flex; align-items: center; justify-content: center;
            background: #F1F5F9;
            color: #64748B;
            font-size: 13px;
            flex-shrink: 0;
            transition: background 0.2s ease, color 0.2s ease;
        }
        .sidebar-link i { width: auto !important; }
        .sidebar-link:hover { background-color: #F8FAFC !important; }
        .sidebar-link:hover .link-icon-wrap { background: #E9EEF9; color: var(--navy-light, #223769); }
        .sidebar-link.active {
            background: linear-gradient(135deg, #EEF2FF, #F0F4FF) !important;
            color: var(--navy-light, #223769) !important;
        }
        .sidebar-link.active .link-icon-wrap {
            background: var(--navy, #0F2044);
            color: var(--yellow, #F6C243);
        }
        .sidebar-link.active::before {
            content: '';
            position: absolute;
            left: -12px; top: 50%; transform: translateY(-50%);
            width: 4px; height: 60%;
            border-radius: 0 4px 4px 0;
            background: var(--yellow, #F6C243);
        }

        .sidebar-footer {
            padding: 14px;
            border-top: 1px solid #F1F5F9;
            flex-shrink: 0;
        }
        .sidebar-profile-card {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #F8FAFC;
            border: 1px solid #EEF1F5;
            border-radius: 14px;
            padding: 10px 12px;
        }
        .sidebar-profile-avatar {
            width: 38px; height: 38px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--navy, #0F2044), var(--navy-light, #223769));
            color: var(--yellow, #F6C243);
            display: flex; align-items: center; justify-content: center;
            font-size: 13px; font-weight: 700;
            flex-shrink: 0;
        }
        .sidebar-profile-info { flex: 1; min-width: 0; }
        .sidebar-profile-info .p-name {
            font-size: 12.5px; font-weight: 700; color: var(--navy, #0F2044);
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sidebar-profile-info .p-role {
            font-size: 10.5px; color: #6B7280;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sidebar-profile-dot {
            width: 8px; height: 8px; border-radius: 50%;
            background: #27AE60;
            border: 2px solid #fff;
            box-shadow: 0 0 0 1px #DCFCE7;
            flex-shrink: 0;
        }

        /* ---- Navbar back button ---- */
        .navbar-back-btn {
            width: 30px; height: 30px;
            border-radius: 50%;
            background: rgba(255,255,255,0.08);
            color: #fff;
            display: flex; align-items: center; justify-content: center;
            font-size: 13px;
            text-decoration: none;
            flex-shrink: 0;
            transition: background 0.2s ease, transform 0.2s ease;
        }
        .navbar-back-btn:hover { background: rgba(255,255,255,0.18); transform: translateX(-2px); }

        /* ---- Page transition loader ---- */
        #pageTransitionLoader {
            position: fixed;
            inset: 0;
            z-index: 99999;
            background: var(--bg-body, #F4F6F9);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.25s ease;
        }
        #pageTransitionLoader.active { opacity: 1; visibility: visible; }
        #pageTransitionLoader .pt-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 14px;
        }
        #pageTransitionLoader .pt-spinner {
            width: 34px; height: 34px;
            border-radius: 50%;
            border: 3px solid #E5E7EB;
            border-top-color: var(--navy, #0F2044);
            animation: pt-spin 0.7s linear infinite;
        }
        #pageTransitionLoader .pt-label {
            font-size: 12px;
            font-weight: 600;
            color: #6B7280;
            letter-spacing: 0.2px;
        }
        @keyframes pt-spin { to { transform: rotate(360deg); } }

        #pageTransitionBar {
            position: fixed;
            top: 0; left: 0;
            height: 3px;
            width: 0%;
            background: linear-gradient(90deg, var(--yellow, #F6C243), var(--navy-light, #223769));
            z-index: 100000;
            transition: width 0.35s ease, opacity 0.3s ease;
            opacity: 0;
        }
        #pageTransitionBar.active { opacity: 1; }

        body.pt-fade-in { animation: pt-fadein 0.28s ease both; }
        @keyframes pt-fadein {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // ------------------------------------------------------------------
    // Page transition loader/overlay
    // ------------------------------------------------------------------
    const bar = document.createElement('div');
    bar.id = 'pageTransitionBar';
    document.body.appendChild(bar);

    const loader = document.createElement('div');
    loader.id = 'pageTransitionLoader';
    loader.innerHTML = `
        <div class="pt-inner">
            <div class="pt-spinner"></div>
            <div class="pt-label">Memuat halaman...</div>
        </div>
    `;
    document.body.appendChild(loader);

    function showPageTransition() {
        bar.classList.add('active');
        requestAnimationFrame(() => { bar.style.width = '70%'; });
        setTimeout(() => loader.classList.add('active'), 120);
    }

    function isInternalNavLink(link) {
        if (!link || !link.getAttribute) return false;
        const href = link.getAttribute('href');
        if (!href) return false;
        if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
        if (link.target === '_blank') return false;
        if (link.hasAttribute('download')) return false;
        // Only intercept same-site .html navigations (local multi-page app)
        return /\.html($|\?|#)/i.test(href) || href.endsWith('/');
    }

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!isInternalNavLink(link)) return;
        // Let the browser handle the navigation, just show the transition first
        showPageTransition();
    }, true);

    window.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('pt-fade-in');
    });

    window.addEventListener('pageshow', () => {
        // Hide loader if page was restored from bfcache with it still visible
        bar.classList.remove('active');
        bar.style.width = '0%';
        loader.classList.remove('active');
    });

    // ------------------------------------------------------------------
    // Sidebar logic
    // The sidebar markup now lives as plain, static HTML directly in each
    // page (no more runtime innerHTML injection) — this is more robust and
    // easier to debug than the old inject-on-load approach.
    // ------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', () => {
        // Confirm active link matches current page (belt-and-suspenders —
        // the HTML already marks the right link active server-side/statically).
        const currentPage = window.location.pathname.split('/').pop() || 'mandiri_spot.html';
        document.querySelectorAll('.sidebar-link').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        const sidebarToggle = document.getElementById('sidebarToggle');
        const closeSidebar = document.getElementById('closeSidebar');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const appContainer = document.querySelector('.app-container');

        if (!sidebar || !sidebarOverlay) return; // page has no sidebar (e.g. index.html)

        const DESKTOP_BREAKPOINT = 1024;
        function isDesktop() {
            return window.innerWidth >= DESKTOP_BREAKPOINT;
        }

        function openSidebar() {
            if (!isDesktop() && appContainer) {
                sidebar.style.top = appContainer.scrollTop + 'px';
                sidebarOverlay.style.top = appContainer.scrollTop + 'px';
                appContainer.style.overflow = 'hidden';
            }
            sidebar.classList.add('show');
            sidebarOverlay.classList.add('show');
        }

        function hideSidebar() {
            // On desktop the sidebar stays persistently open; ignore close attempts.
            if (isDesktop()) return;
            if (appContainer) appContainer.style.overflow = '';
            sidebar.classList.remove('show');
            sidebarOverlay.classList.remove('show');
        }

        // On desktop, the sidebar is always visible (pinned via CSS); make sure
        // its "show" state is in sync so it doesn't rely on JS-toggled classes.
        function syncLayoutForViewport() {
            if (isDesktop()) {
                sidebar.classList.add('show');
                sidebarOverlay.classList.remove('show');
                if (appContainer) appContainer.style.overflow = '';
                sidebar.style.top = '';
                sidebarOverlay.style.top = '';
            } else {
                sidebar.classList.remove('show');
                sidebarOverlay.classList.remove('show');
                if (appContainer) appContainer.style.overflow = '';
            }
        }

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(syncLayoutForViewport, 120);
        });

        if (sidebarToggle) sidebarToggle.addEventListener('click', (e) => { e.preventDefault(); openSidebar(); });
        if (closeSidebar) closeSidebar.addEventListener('click', (e) => { e.preventDefault(); hideSidebar(); });
        if (sidebarOverlay) sidebarOverlay.addEventListener('click', hideSidebar);
        // Escape key also closes it, for good measure
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') hideSidebar();
        });

        syncLayoutForViewport();
    });
})();