// js/script.js - Complete code to replace existing file
document.addEventListener('DOMContentLoaded', function() {
    // --- Existing Email Modal/Mailto Functionality ---
    const openEmailBtn = document.getElementById('openEmailModal');

    const emailAddress = 'ihelper.staff@navitas.com';
    const emailSubject = 'Assistance Request';
    const emailBody = 'Hello iHelp Team,\n\nI need assistance with:\n\nRegards,\n[Your Name]';

    function buildMailtoLink() {
        const subjectEncoded = encodeURIComponent(emailSubject);
        const bodyEncoded = encodeURIComponent(emailBody);
        return `mailto:${emailAddress}?subject=${subjectEncoded}&body=${bodyEncoded}`;
    }

    if (openEmailBtn) {
        openEmailBtn.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = buildMailtoLink();
            console.log("Direct mailto link triggered for:", emailAddress);
        });
    }

    // --- Google Sheets Announcements Integration ---

    // **YOUR GOOGLE SHEETS API KEY AND SPREADSHEET ID**
    const API_KEY = 'AIzaSyCno4X1CS8tXOP_GHXS28Yx44wf63Y-qPs'; // Your actual API Key
    const SPREADSHEET_ID = '1z8lBcT3ngDCJKKJZ5ikfB8yGgcDrXDY-OOU6mI69HnI'; // Your actual Spreadsheet ID
    const RANGE = 'Announcements Data!A:G'; // Corrected: Match your Google Sheet tab name exactly

    const ANNOUNCEMENTS_CONTAINER_ID = 'dynamic-announcements';

    async function fetchAnnouncements() {
        const container = document.getElementById(ANNOUNCEMENTS_CONTAINER_ID);
        if (!container) {
            console.error('Announcements container not found.');
            return;
        }

        // Clear loading message
        container.innerHTML = '';

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const rows = data.values;

            if (rows && rows.length > 1) { // Assuming the first row is headers
                // Reverse the order to show newest first, as sheets often append
                // If your sheet is ordered oldest to newest, remove .reverse()
                rows.slice(1).reverse().forEach(row => { // Slice to skip header row
                    const date = row[0] || '';
                    const title = row[1] || 'No Title';
                    const content = row[2] || 'No content provided.';
                    const link = row[3] || '';
                    const linkText = row[4] || 'Read More';
                    const iconClass = row[5] || ''; // e.g., 'fas fa-exclamation-triangle'
                    const iconColorVar = row[6] || ''; // e.g., 'var(--color-danger)'

                    const announcementItem = document.createElement('div');
                    announcementItem.className = 'announcement-item'; // Use existing CSS class

                    let titleHtml = `<h4>`;
                    if (iconClass) {
                        titleHtml += `<i class="${iconClass}" style="color: ${iconColorVar || 'var(--color-arc-reactor-blue)'};"></i> `;
                    }
                    titleHtml += `${title}</h4>`;

                    announcementItem.innerHTML = `
                        <span class="announcement-date">${date}</span>
                        ${titleHtml}
                        <p>${content}</p>
                        ${link ? `<a href="${link}" class="read-more" ${link.startsWith('http') ? 'target="_blank"' : ''}>${linkText}</a>` : ''}
                    `;
                    container.appendChild(announcementItem);
                });
            } else {
                container.innerHTML = '<p style="text-align: center; color: var(--color-text-muted);">No announcements available at this time.</p>';
            }

        } catch (error) {
            console.error('Error fetching announcements:', error);
            container.innerHTML = '<p style="text-align: center; color: var(--color-danger);">Failed to load announcements. Please try again later.</p>';
        }
    }

    // Call the function when the page loads
    fetchAnnouncements();

});