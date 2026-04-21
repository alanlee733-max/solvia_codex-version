// Mock Data for Active Deals
const mockDeals = [
    {
        id: 1,
        company: "Bangkok Aesthetics Group",
        country: "Thailand",
        product: "Skin Booster",
        stage: "Negotiation",
        priority: "High",
        value: "$85,000",
        lastActive: "2 hours ago"
    },
    {
        id: 2,
        company: "Jakarta MedSpa Clinic",
        country: "Indonesia",
        product: "HA Filler",
        stage: "Contacted",
        priority: "Medium",
        value: "$42,000",
        lastActive: "1 day ago"
    },
    {
        id: 3,
        company: "Dubai Derma Partners",
        country: "UAE",
        product: "RF Device",
        stage: "Lead",
        priority: "High",
        value: "$120,000",
        lastActive: "Just now"
    },
    {
        id: 4,
        company: "KL Wellness Center",
        country: "Malaysia",
        product: "Microneedling Device",
        stage: "Won",
        priority: "Low",
        value: "$28,000",
        lastActive: "3 days ago"
    },
    {
        id: 5,
        company: "SG Premium Clinics",
        country: "Singapore",
        product: "OEM Inquiry",
        stage: "Contacted",
        priority: "High",
        value: "$150,000",
        lastActive: "5 hours ago"
    },
     {
        id: 6,
        company: "Phuket Beauty Hub",
        country: "Thailand",
        product: "HA Filler",
        stage: "Lead",
        priority: "Low",
        value: "$15,000",
        lastActive: "2 days ago"
    }
];

// Helper functions for badge styling
function getStageBadgeClass(stage) {
    switch(stage) {
        case "Lead": return "badge-gray";
        case "Contacted": return "badge-blue";
        case "Negotiation": return "badge-yellow";
        case "Won": return "badge-green";
        default: return "badge-gray";
    }
}

function getPriorityBadgeClass(priority) {
    switch(priority) {
        case "High": return "badge-red";
        case "Medium": return "badge-yellow";
        case "Low": return "badge-green";
        default: return "badge-gray";
    }
}

// Function to render the table body
function renderTableBody(deals) {
    const tableBody = document.getElementById('dealsTableBody');
    tableBody.innerHTML = ''; // Clear existing

    if (deals.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-tertiary);">No deals found matching criteria.</td></tr>`;
        return;
    }

    deals.forEach(deal => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td class="company-cell">${deal.company}</td>
            <td>${deal.country}</td>
            <td>${deal.product}</td>
            <td><span class="badge ${getStageBadgeClass(deal.stage)}">${deal.stage}</span></td>
            <td><span class="badge ${getPriorityBadgeClass(deal.priority)}">${deal.priority}</span></td>
            <td style="font-weight: 500;">${deal.value}</td>
            <td style="color: var(--text-tertiary);">${deal.lastActive}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    // Render initial data
    renderTableBody(mockDeals);

    // Setup search functionality
    const searchInput = document.getElementById('dealSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            const filteredDeals = mockDeals.filter(deal => {
                return deal.company.toLowerCase().includes(searchTerm) ||
                       deal.country.toLowerCase().includes(searchTerm) ||
                       deal.product.toLowerCase().includes(searchTerm) ||
                       deal.stage.toLowerCase().includes(searchTerm);
            });
            
            renderTableBody(filteredDeals);
        });
    }
});
