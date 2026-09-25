// sidebar.js — PinDah Digital shared sidebar (self-contained: injects its own CSS + HTML)
document.addEventListener('DOMContentLoaded', () => {

    // 1. Inject sidebar CSS (namespaced with pd- prefix so it never clashes with old page styles)
    if (!document.getElementById('pd-sidebar-style')) {
        const style = document.createElement('style');
        style.id = 'pd-sidebar-style';
        style.textContent = `
            .pd-sidebar-overlay{position:fixed;inset:0;background:rgba(15,32,68,.55);z-index:3000;opacity:0;visibility:hidden;transition:opacity .25s ease;}
            .pd-sidebar-overlay.show{opacity:1;visibility:visible;}
            .pd-sidebar{position:fixed;top:0;left:0;width:280px;max-width:82vw;height:100vh;height:100dvh;background:#fff;z-index:3001;box-shadow:4px 0 24px rgba(15,32,68,.18);transform:translateX(-100%);transition:transform .28s ease;display:flex;flex-direction:column;font-family:'Inter',sans-serif;}
            .pd-sidebar.show{transform:translateX(0);}
            .pd-sidebar-header{padding:22px 44px 18px 20px;background:linear-gradient(135deg,#0F2044,#223769);color:#fff;position:relative;flex-shrink:0;}
            .pd-sidebar-brand{font-weight:800;font-size:18px;font-style:italic;letter-spacing:-.3px;}
            .pd-sidebar-brand .accent{color:#F6C243;}
            .pd-sidebar-sub{font-size:11px;color:rgba(255,255,255,.75);margin-top:3px;}
            .pd-close-btn{position:absolute;top:16px;right:14px;background:rgba(255,255,255,.14);border:none;color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;}
            .pd-close-btn:active{background:rgba(255,255,255,.3);}
            .pd-sidebar-content{padding:10px 0;flex:1;overflow-y:auto;}
            .pd-sidebar-link{padding:13px 20px;color:#0F2044;text-decoration:none;font-weight:600;font-size:14px;display:flex;align-items:center;gap:12px;border-left:4px solid transparent;}
            .pd-sidebar-link i{width:18px;text-align:center;color:#6B7280;}
            .pd-sidebar-link.active{background:#F0F4FF;color:#223769;border-left-color:#F6C243;}
            .pd-sidebar-link.active i{color:#223769;}
            .pd-sidebar-footer{padding:14px 20px 20px;border-top:1px solid #E5E7EB;flex-shrink:0;}
            .pd-home-btn{display:flex;align-items:center;justify-content:center;gap:8px;background:#F6C243;color:#0F2044;font-weight:700;font-size:13px;padding:11px;border-radius:9999px;text-decoration:none;}
            .pd-navback-btn{background:none;border:none;color:#fff;font-size:16px;cursor:pointer;padding:4px 6px;display:inline-flex;align-items:center;text-decoration:none;}
            @media (min-width:1024px){
                .pd-sidebar-overlay{display:none !important;}
                .pd-sidebar{transform:translateX(0) !important;box-shadow:none;border-right:1px solid #E5E7EB;}
                #sidebarToggle{display:none !important;}
                .pd-navback-btn{display:none !important;}
            }
        `;
        document.head.appendChild(style);
    }

    // 2. Menu + active state
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menu = [
        { href: 'mandiri_spot.html', icon: 'fa-map-location-dot', label: 'Peta & Spot' },
        { href: 'daily_assignment.html', icon: 'fa-clipboard-list', label: 'Daily Assignment' },
        { href: 'not_found.html', icon: 'fa-chart-line', label: 'Dashboard' },
        { href: 'branch_manager.html', icon: 'fa-user-tie', label: 'Kepala Cabang' },
        { href: 'coming_soon.html', icon: 'fa-gear', label: 'Pengaturan' }
    ];
    const linksHTML = menu.map(m =>
        `<a href="${m.href}" class="pd-sidebar-link${currentPage === m.href ? ' active' : ''}"><i class="fa-solid ${m.icon}"></i>${m.label}</a>`
    ).join('');

    const sidebarHTML = `
        <div class="pd-sidebar-overlay" id="pdSidebarOverlay"></div>
        <div class="pd-sidebar" id="pdSidebar">
            <div class="pd-sidebar-header">
                <button class="pd-close-btn" id="pdCloseSidebar" aria-label="Tutup menu"><i class="fa-solid fa-xmark"></i></button>
                <div class="pd-sidebar-brand">PinDah <span class="accent">Digital</span></div>
                <div class="pd-sidebar-sub">KC Pondok Indah Jakarta</div>
            </div>
            <div class="pd-sidebar-content">${linksHTML}</div>
            <div class="pd-sidebar-footer">
                <a href="index.html" class="pd-home-btn"><i class="fa-solid fa-house"></i> Kembali ke Home</a>
            </div>
        </div>
    `;

    const container = document.getElementById('sidebar-container');
    if (container) container.innerHTML = sidebarHTML;

    // 3. Inject a back-to-home button next to the hamburger, on every page except index.html
    if (currentPage !== 'index.html' && currentPage !== '') {
        const toggleBtn = document.getElementById('sidebarToggle');
        if (toggleBtn && !document.getElementById('pdBackBtn')) {
            const back = document.createElement('a');
            back.id = 'pdBackBtn';
            back.href = 'index.html';
            back.className = 'pd-navback-btn';
            back.title = 'Kembali ke Home';
            back.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
            toggleBtn.insertAdjacentElement('afterend', back);
        }
    }

    // 4. Open/close logic — simple fixed positioning, no scroll-offset math (that's what made the old sidebar unclosable)
    const sidebar = document.getElementById('pdSidebar');
    const overlay = document.getElementById('pdSidebarOverlay');
    const toggleBtn = document.getElementById('sidebarToggle');
    const closeBtn = document.getElementById('pdCloseSidebar');

    function isDesktop() { return window.innerWidth >= 1024; }

    function openSidebar() {
        if (!sidebar || !overlay) return;
        sidebar.classList.add('show');
        overlay.classList.add('show');
        if (!isDesktop()) document.body.style.overflow = 'hidden';
    }

    function closeSidebarFn() {
        if (!sidebar || !overlay) return;
        if (isDesktop()) return; // pinned open on desktop
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebarFn);
    if (overlay) overlay.addEventListener('click', closeSidebarFn);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSidebarFn(); });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (isDesktop()) { document.body.style.overflow = ''; }
        }, 120);
    });
});