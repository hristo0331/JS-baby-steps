async function generateInfo() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const ticketKeys = document.getElementById('ticketKeys').value.split(',').map(ticket => ticket.trim());

    // Validate empty username or password
    if (!username) {
        showToast("Please enter your Jira username.");
        return;
    }

    if (!password) {
        showToast("Please enter your Jira password.");
        return;
    }

    if (ticketKeys.length === 0 || !ticketKeys[0]) {
        showToast("Please enter ticket keys. Example: ABC-123");
        return;
    }

    const authToken = btoa(username + ':' + password); // Basic Auth Token
    
    const isServerUp = await checkServerStatus();
    if (!isServerUp) {
        showToast("The server is currently down. Please execute startServer.bat located in the main directory.");
        return;
    }

    for (let ticketKey of ticketKeys) {
        if (!isValidTicketKey(ticketKey)) {
            showToast(`Invalid ticket key format for "${ticketKey}". Expected format: ABC-123.`);
            continue; // Skip this ticket and move to the next one
        }

        const ticketInfo = await fetchJiraInfo(ticketKey, authToken);
        if (!ticketInfo) {
            // The specific reason for failure is handled within fetchJiraInfo itself.
            return;
        }
        await populateTable(ticketInfo, authToken);
    }
}


async function fetchJiraInfo(ticketKey, authToken) {
    try {
        const response = await fetch('http://localhost:4000/fetch-jira-info', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ticketKey, authToken })
        });

        return await response.json();
    } catch (error) {
        console.error("Error fetching Jira info:", error);
    }
}

function formatDate(input) {
    const date = new Date(input);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months start at 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

async function populateTable(ticketInfo, authToken) {
    const table = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    const links = extractLinksFromDescription(ticketInfo.fields.description);

    for (let link of links) {
        const linkedTicketInfo = await fetchJiraInfo(link, authToken);
        const row = table.insertRow();

        // Existing Columns
        row.insertCell(0).innerHTML = ticketInfo.fields.summary;
        row.insertCell(1).innerHTML = formatDate(ticketInfo.fields.created);
        row.insertCell(2).innerHTML = ticketInfo.fields.resolutiondate ? formatDate(ticketInfo.fields.resolutiondate) : "N/A";
        const linkURL = `https://jira.softwaregroup.com/browse/${link}`;
        row.insertCell(3).innerHTML = `<a href="${linkURL}" target="_blank">${link}</a>`;
        row.insertCell(4).innerHTML = linkedTicketInfo.fields.summary;

        // New columns
        const uLink = findULinkFromIssueLinks(linkedTicketInfo.fields.issuelinks);
        const uLinkURL = uLink ? `https://jira.softwaregroup.com/browse/${uLink}` : 'N/A';
        row.insertCell(5).innerHTML = uLink ? `<a href="${uLinkURL}" target="_blank">${uLink}</a>` : 'N/A';

        const uLinkPriority = uLink ? await fetchPriorityForTicket(uLink, authToken) : 'N/A';
        row.insertCell(6).innerHTML = uLinkPriority;
    }
}

function extractLinksFromDescription(description) {
    const regex = /CBI-\d+/g;
    return description.match(regex) || []; // Return an empty array if there are no matches
}

document.getElementById("showPassword").addEventListener("change", function() {
    let passwordField = document.getElementById("password");
    if (this.checked) {
        passwordField.type = "text";  // Show password
    } else {
        passwordField.type = "password";  // Hide password
    }
});

function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 5000); // Dismiss after 3 seconds
}

async function checkServerStatus() {
    try {
        const response = await fetch('http://localhost:4000/ping');
        if (response.ok) {
            const data = await response.json();
            return data.status === 'up';
        } else {
            console.error("Server returned non-OK status:", response.status);
            return false;
        }
    } catch (error) {
        console.error("Error checking server status:", error);
        return false;
    }
}

function isValidTicketKey(ticketKey) {
    const regex = /^[A-Z]{3}-\d+$/;
    return regex.test(ticketKey);
}

function findULinkFromIssueLinks(issueLinks) {
    for (let link of issueLinks) {
        // Check if the link has the required properties before evaluating the condition
        if (link.type && link.type.name === 'Relates' && link.inwardIssue && link.inwardIssue.key && link.inwardIssue.key.startsWith('U')) {
            return link.inwardIssue.key;
        }
    }
    return null;
}

async function fetchPriorityForTicket(ticketKey, authToken) {
    const ticketInfo = await fetchJiraInfo(ticketKey, authToken);
    return ticketInfo.fields && ticketInfo.fields.priority ? ticketInfo.fields.priority.name : 'N/A';
}
