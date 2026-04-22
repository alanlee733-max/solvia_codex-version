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

const STORAGE_KEY = 'alan_crm_lite_deals';
const stageOrder = ['Lead', 'Contacted', 'Negotiation', 'Won'];
let deals = [];

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

function renderAll() {
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
        renderAll();

        form.reset();
        closeModal();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadDeals();
    renderAll();
    setupSearch();
    setupNewDealModal();
});
