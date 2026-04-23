/*
  REFERENCE / LEGACY CANDIDATE NOTICE
  - This file is currently a reference/legacy candidate and is not the active runtime source.
  - Active runtime behavior currently lives in index.html.
  - Logic here may be selectively migrated later after the app shell stabilizes.
*/

// Sample Deals Data (used on first load only)
const sampleDeals = [
    {
        id: 1,
        company: "Bangkok Aesthetics Group",
        country: "Thailand",
        product: "Skin Booster",
        stage: "Negotiation",
        priority: "High",
        value: 85000,
        lastActive: "2 hours ago"
    },
    {
        id: 2,
        company: "Jakarta MedSpa Clinic",
        country: "Indonesia",
        product: "HA Filler",
        stage: "Contacted",
        priority: "Medium",
        value: 42000,
        lastActive: "1 day ago"
    },
    {
        id: 3,
        company: "Dubai Derma Partners",
        country: "UAE",
        product: "RF Device",
        stage: "Lead",
        priority: "High",
        value: 120000,
        lastActive: "Just now"
    },
    {
        id: 4,
        company: "KL Wellness Center",
        country: "Malaysia",
        product: "Microneedling Device",
        stage: "Won",
        priority: "Low",
        value: 28000,
        lastActive: "3 days ago"
    },
    {
        id: 5,
        company: "SG Premium Clinics",
        country: "Singapore",
        product: "OEM Inquiry",
        stage: "Contacted",
        priority: "High",
        value: 150000,
        lastActive: "5 hours ago"
    },
    {
        id: 6,
        company: "Phuket Beauty Hub",
        country: "Thailand",
        product: "HA Filler",
        stage: "Lead",
        priority: "Low",
        value: 15000,
        lastActive: "2 days ago"
    }
];

const samplePartners = [
    {
        id: 101,
        company: 'Seoul Beauty Trading',
        country: 'South Korea',
        contact: 'Mina Park',
        email: 'mina@seoulbeautytrading.kr',
        website: 'https://seoulbeautytrading.kr',
        productFocus: ['HA Filler', 'Skin Booster'],
        status: 'Active',
        priority: 'High',
        lastContact: '2026-04-20',
        nextAction: 'MOQ negotiation call',
        revenueYtd: 210000,
        needsAction: true,
        overview: 'Strong clinic channel partner with monthly repeat orders.',
        orderHistory: ['Mar 2026: USD 75,000', 'Jan 2026: USD 62,000', 'Nov 2025: USD 73,000'],
        contactLog: ['2026-04-20: Price revision sent', '2026-04-14: Forecast received'],
        samples: ['Skin Booster lot S-22 shipped', 'HA Filler vials approved'],
        notes: 'Prefers 60-day terms. Requesting bilingual product guide.'
    },
    {
        id: 102,
        company: 'Viva Estetica Distribution',
        country: 'Mexico',
        contact: 'Carlos Ruiz',
        email: 'carlos@vivaestetica.mx',
        website: 'https://vivaestetica.mx',
        productFocus: ['Laser Device', 'RF Device'],
        status: 'Prospect Partner',
        priority: 'Medium',
        lastContact: '2026-04-11',
        nextAction: 'Send distributor agreement draft',
        revenueYtd: 0,
        needsAction: true,
        overview: 'New prospect focused on private dermatology networks.',
        orderHistory: ['No order yet'],
        contactLog: ['2026-04-11: Intro meeting complete', '2026-04-06: Product deck shared'],
        samples: ['RF handpiece demo requested'],
        notes: 'Decision expected in May after legal review.'
    },
    {
        id: 103,
        company: 'Nordic Aesthetic Supply',
        country: 'Sweden',
        contact: 'Elin Dahl',
        email: 'elin@nordicaesthetic.se',
        website: 'https://nordicaesthetic.se',
        productFocus: ['Body Contouring', 'RF Device'],
        status: 'Dormant',
        priority: 'Low',
        lastContact: '2026-01-27',
        nextAction: 'Re-activate with Q3 promo kit',
        revenueYtd: 34000,
        needsAction: false,
        overview: 'Historically stable but paused purchases due to inventory.',
        orderHistory: ['Oct 2025: USD 34,000'],
        contactLog: ['2026-01-27: Pause confirmed'],
        samples: ['No active sample request'],
        notes: 'Target reactivation before September expo season.'
    },
    {
        id: 104,
        company: 'Gulf Dermatech LLC',
        country: 'UAE',
        contact: 'Amal Nasser',
        email: 'amal@gulfdermatech.ae',
        website: 'https://gulfdermatech.ae',
        productFocus: ['HA Filler', 'Laser Device'],
        status: 'On Hold',
        priority: 'High',
        lastContact: '2026-04-08',
        nextAction: 'Regulatory document update',
        revenueYtd: 56000,
        needsAction: true,
        overview: 'Commercial terms agreed, waiting for document completion.',
        orderHistory: ['Feb 2026: USD 56,000'],
        contactLog: ['2026-04-08: Docs gap identified'],
        samples: ['Laser consumables under review'],
        notes: 'Needs local compliance file before PO release.'
    }
];

const STORAGE_KEY = 'alan_crm_lite_deals';
const stageOrder = ['Lead', 'Contacted', 'Negotiation', 'Won'];
let deals = [];
let partners = [...samplePartners];
let selectedPartnerId = samplePartners[0].id;
let activePartnerTab = 'overview';

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(amount || 0);
}

function getStageBadgeClass(stage) {
    switch (stage) {
        case 'Lead': return 'badge-gray';
        case 'Contacted': return 'badge-blue';
        case 'Negotiation': return 'badge-yellow';
        case 'Won': return 'badge-green';
        default: return 'badge-gray';
    }
}

function getPriorityBadgeClass(priority) {
    switch (priority) {
        case 'High': return 'badge-red';
        case 'Medium': return 'badge-yellow';
        case 'Low': return 'badge-green';
        default: return 'badge-gray';
    }
}

function getPartnerStatusBadgeClass(status) {
    switch (status) {
        case 'Active': return 'badge-green';
        case 'Prospect Partner': return 'badge-blue';
        case 'Dormant': return 'badge-gray';
        case 'On Hold': return 'badge-yellow';
        default: return 'badge-gray';
    }
}

function loadDeals() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        deals = [...sampleDeals];
        saveDeals();
        return;
    }

    try {
        const parsed = JSON.parse(saved);
        deals = Array.isArray(parsed) ? parsed : [...sampleDeals];
    } catch (error) {
        deals = [...sampleDeals];
        saveDeals();
    }
}

function saveDeals() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
}

function renderSummaryCards() {
    const totalPipeline = deals.reduce((sum, deal) => sum + Number(deal.value || 0), 0);
    const wonDeals = deals.filter(deal => deal.stage === 'Won').length;
    const avgDealSize = deals.length ? Math.round(totalPipeline / deals.length) : 0;

    document.getElementById('totalPipelineValue').textContent = formatCurrency(totalPipeline);
    document.getElementById('dealsWonValue').textContent = String(wonDeals);
    document.getElementById('avgDealSizeValue').textContent = formatCurrency(avgDealSize);
}

function renderPipeline() {
    const stageCounts = {
        Lead: 0,
        Contacted: 0,
        Negotiation: 0,
        Won: 0
    };

    deals.forEach(deal => {
        if (stageCounts[deal.stage] !== undefined) {
            stageCounts[deal.stage] += 1;
        }
    });

    const maxCount = Math.max(...Object.values(stageCounts), 1);
    const container = document.getElementById('pipelineStages');
    container.innerHTML = '';

    stageOrder.forEach(stage => {
        const count = stageCounts[stage];
        const widthPercent = Math.round((count / maxCount) * 100);

        const stageElement = document.createElement('div');
        stageElement.className = 'funnel-stage';
        stageElement.innerHTML = `
            <div class="stage-info">
                <span class="stage-name">${stage}</span>
                <span class="stage-count">${count}</span>
            </div>
            <div class="stage-bar" style="width: ${widthPercent}%"></div>
        `;

        container.appendChild(stageElement);
    });
}

function renderTableBody(dealsToRender) {
    const tableBody = document.getElementById('dealsTableBody');
    tableBody.innerHTML = '';

    if (dealsToRender.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-tertiary);">No deals found matching criteria.</td></tr>';
        return;
    }

    dealsToRender.forEach(deal => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td class="company-cell">${deal.company}</td>
            <td>${deal.country}</td>
            <td>${deal.product}</td>
            <td><span class="badge ${getStageBadgeClass(deal.stage)}">${deal.stage}</span></td>
            <td><span class="badge ${getPriorityBadgeClass(deal.priority)}">${deal.priority}</span></td>
            <td style="font-weight: 500;">${formatCurrency(Number(deal.value || 0))}</td>
            <td style="color: var(--text-tertiary);">${deal.lastActive}</td>
        `;

        tableBody.appendChild(row);
    });
}

function renderDealsView() {
    renderSummaryCards();
    renderPipeline();
    renderTableBody(deals);
}

function openModal() {
    const modal = document.getElementById('newDealModal');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    const modal = document.getElementById('newDealModal');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
}

function setupSearch() {
    const searchInput = document.getElementById('dealSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', (event) => {
        const term = event.target.value.toLowerCase().trim();

        const filteredDeals = deals.filter(deal => {
            return deal.company.toLowerCase().includes(term)
                || deal.country.toLowerCase().includes(term)
                || deal.product.toLowerCase().includes(term)
                || deal.stage.toLowerCase().includes(term)
                || deal.priority.toLowerCase().includes(term);
        });

        renderTableBody(filteredDeals);
    });
}

function setupNewDealModal() {
    const openButton = document.getElementById('openNewDealBtn');
    const closeButton = document.getElementById('closeNewDealBtn');
    const cancelButton = document.getElementById('cancelNewDealBtn');
    const modal = document.getElementById('newDealModal');
    const form = document.getElementById('newDealForm');

    openButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const newDeal = {
            id: Date.now(),
            company: String(formData.get('company') || '').trim(),
            country: String(formData.get('country') || '').trim(),
            product: String(formData.get('product') || '').trim(),
            stage: String(formData.get('stage') || 'Lead'),
            priority: String(formData.get('priority') || 'Medium'),
            value: Number(formData.get('value') || 0),
            lastActive: 'Just now'
        };

        deals.unshift(newDeal);
        saveDeals();
        renderDealsView();

        form.reset();
        closeModal();
    });
}

function fillSelectOptions(selectId, values) {
    const select = document.getElementById(selectId);
    if (!select) return;

    values.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });
}

function renderPartnersKPIs() {
    const totalPartners = partners.length;
    const activePartners = partners.filter(partner => partner.status === 'Active').length;
    const revenueYtd = partners.reduce((sum, partner) => sum + Number(partner.revenueYtd || 0), 0);
    const needsAction = partners.filter(partner => partner.needsAction).length;

    document.getElementById('partnersTotalValue').textContent = String(totalPartners);
    document.getElementById('partnersActiveValue').textContent = String(activePartners);
    document.getElementById('partnersRevenueValue').textContent = formatCurrency(revenueYtd);
    document.getElementById('partnersNeedsActionValue').textContent = String(needsAction);
}

function getPartnerFilters() {
    return {
        search: document.getElementById('partnerSearch').value.toLowerCase().trim(),
        country: document.getElementById('partnerCountryFilter').value,
        category: document.getElementById('partnerCategoryFilter').value,
        status: document.getElementById('partnerStatusFilter').value,
        priority: document.getElementById('partnerPriorityFilter').value
    };
}

function getFilteredPartners() {
    const filters = getPartnerFilters();

    return partners.filter(partner => {
        const matchesSearch = !filters.search
            || partner.company.toLowerCase().includes(filters.search)
            || partner.country.toLowerCase().includes(filters.search)
            || partner.contact.toLowerCase().includes(filters.search)
            || partner.email.toLowerCase().includes(filters.search);

        const matchesCountry = !filters.country || partner.country === filters.country;
        const matchesCategory = !filters.category || partner.productFocus.includes(filters.category);
        const matchesStatus = !filters.status || partner.status === filters.status;
        const matchesPriority = !filters.priority || partner.priority === filters.priority;

        return matchesSearch && matchesCountry && matchesCategory && matchesStatus && matchesPriority;
    });
}

function renderPartnersTable() {
    const filteredPartners = getFilteredPartners();
    const tableBody = document.getElementById('partnersTableBody');
    tableBody.innerHTML = '';

    if (!filteredPartners.some(partner => partner.id === selectedPartnerId) && filteredPartners.length > 0) {
        selectedPartnerId = filteredPartners[0].id;
    }

    if (filteredPartners.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="9" style="text-align:center; color: var(--text-tertiary);">No partners match your filters.</td></tr>';
        renderPartnerDetail(null);
        return;
    }

    filteredPartners.forEach(partner => {
        const row = document.createElement('tr');
        if (partner.id === selectedPartnerId) {
            row.classList.add('selected-row');
        }

        row.innerHTML = `
            <td class="company-cell">${partner.company}</td>
            <td>${partner.country}</td>
            <td>${partner.contact}</td>
            <td><a href="mailto:${partner.email}">${partner.email}</a></td>
            <td><a href="${partner.website}" target="_blank" rel="noopener noreferrer">${partner.website.replace('https://', '')}</a></td>
            <td><div class="focus-tags">${partner.productFocus.map(item => `<span class="focus-tag">${item}</span>`).join('')}</div></td>
            <td><span class="badge ${getPartnerStatusBadgeClass(partner.status)}">${partner.status}</span></td>
            <td>${partner.lastContact}</td>
            <td>${partner.nextAction}</td>
        `;

        row.addEventListener('click', () => {
            selectedPartnerId = partner.id;
            renderPartnersTable();
            renderPartnerDetail(partner);
        });

        tableBody.appendChild(row);
    });

    const selectedPartner = filteredPartners.find(partner => partner.id === selectedPartnerId) || filteredPartners[0];
    renderPartnerDetail(selectedPartner);
}

function renderPartnerDetail(partner) {
    const title = document.getElementById('partnerDetailTitle');
    const content = document.getElementById('partnerDetailContent');

    if (!partner) {
        title.textContent = 'Partner Detail';
        content.innerHTML = '<p class="detail-note">Select a partner row to see details.</p>';
        return;
    }

    title.textContent = `${partner.company} Detail`;

    if (activePartnerTab === 'overview') {
        content.innerHTML = `
            <p class="detail-note">${partner.overview}</p>
            <div class="detail-grid">
                <div class="detail-item"><div class="detail-item-label">Country</div><div class="detail-item-value">${partner.country}</div></div>
                <div class="detail-item"><div class="detail-item-label">Email</div><div class="detail-item-value">${partner.email}</div></div>
                <div class="detail-item"><div class="detail-item-label">Website</div><div class="detail-item-value">${partner.website}</div></div>
                <div class="detail-item"><div class="detail-item-label">Priority</div><div class="detail-item-value">${partner.priority}</div></div>
            </div>
        `;
        return;
    }

    if (activePartnerTab === 'orders') {
        content.innerHTML = `<div class="detail-list">${partner.orderHistory.map(item => `<div>• ${item}</div>`).join('')}</div>`;
        return;
    }

    if (activePartnerTab === 'contact') {
        content.innerHTML = `<div class="detail-list">${partner.contactLog.map(item => `<div>• ${item}</div>`).join('')}</div>`;
        return;
    }

    if (activePartnerTab === 'samples') {
        content.innerHTML = `<div class="detail-list">${partner.samples.map(item => `<div>• ${item}</div>`).join('')}</div>`;
        return;
    }

    content.innerHTML = `<p class="detail-note">${partner.notes}</p>`;
}

function setupPartnerFilters() {
    const countries = [...new Set(partners.map(partner => partner.country))].sort();
    const categories = [...new Set(partners.flatMap(partner => partner.productFocus))].sort();
    const statuses = [...new Set(partners.map(partner => partner.status))].sort();
    const priorities = [...new Set(partners.map(partner => partner.priority))].sort();

    fillSelectOptions('partnerCountryFilter', countries);
    fillSelectOptions('partnerCategoryFilter', categories);
    fillSelectOptions('partnerStatusFilter', statuses);
    fillSelectOptions('partnerPriorityFilter', priorities);

    ['partnerSearch', 'partnerCountryFilter', 'partnerCategoryFilter', 'partnerStatusFilter', 'partnerPriorityFilter'].forEach(id => {
        const element = document.getElementById(id);
        const eventName = id === 'partnerSearch' ? 'input' : 'change';
        element.addEventListener(eventName, renderPartnersTable);
    });
}

function setupPartnerDetailTabs() {
    const tabButtons = document.querySelectorAll('.detail-tab');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(tab => tab.classList.remove('active'));
            button.classList.add('active');
            activePartnerTab = button.dataset.partnerTab;

            const selectedPartner = partners.find(partner => partner.id === selectedPartnerId) || null;
            renderPartnerDetail(selectedPartner);
        });
    });
}

function switchMainView(viewName) {
    const dashboardView = document.getElementById('dashboardView');
    const partnersView = document.getElementById('partnersView');
    const headerTitle = document.getElementById('headerTitle');
    const newDealButton = document.getElementById('openNewDealBtn');

    const isPartners = viewName === 'partners';
    dashboardView.classList.toggle('hidden', isPartners);
    partnersView.classList.toggle('hidden', !isPartners);

    headerTitle.textContent = isPartners ? 'Partners Management' : 'Overseas Sales Control Board';
    newDealButton.style.display = isPartners ? 'none' : 'inline-flex';

    if (isPartners) {
        renderPartnersKPIs();
        renderPartnersTable();
    }
}

function setupSidebarViewSwitching() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            const targetView = item.dataset.view;
            if (!targetView) {
                return;
            }

            event.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            switchMainView(targetView);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadDeals();
    renderDealsView();
    setupSearch();
    setupNewDealModal();

    setupPartnerFilters();
    setupPartnerDetailTabs();
    setupSidebarViewSwitching();
});
