// DOM elements
const reloadBtn = document.getElementById('reloadBtn');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const usersGrid = document.getElementById('usersGrid');

// API endpoint
const API_URL = 'https://jsonplaceholder.typicode.com/users';

// State management
let isLoading = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Load users on page load
    fetchUsers();
    
    // Add reload button event listener
    reloadBtn.addEventListener('click', fetchUsers);
});

// Main function to fetch users from API
async function fetchUsers() {
    // Prevent multiple simultaneous requests
    if (isLoading) return;
    
    try {
        setLoadingState(true);
        hideError();
        clearUsers();
        
        console.log('Fetching users from:', API_URL);
        
        // Fetch data from API with timeout
        const response = await fetchWithTimeout(API_URL, 10000);
        
        // Check if response is successful
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
        
        // Parse JSON response
        const users = await response.json();
        console.log('Fetched users:', users);
        
        // Validate data
        if (!Array.isArray(users) || users.length === 0) {
            throw new Error('No users data received from API');
        }
        
        // Display users
        displayUsers(users);
        
    } catch (error) {
        console.error('Error fetching users:', error);
        handleError(error);
    } finally {
        setLoadingState(false);
    }
}

// Fetch with timeout to handle network issues
function fetchWithTimeout(url, timeout = 8000) {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout - Please check your internet connection')), timeout)
        )
    ]);
}

// Display users in the grid
function displayUsers(users) {
    // Clear existing content
    usersGrid.innerHTML = '';
    
    // Loop through users and create cards
    users.forEach((user, index) => {
        const userCard = createUserCard(user, index);
        usersGrid.appendChild(userCard);
    });
    
    console.log(`Displayed ${users.length} users`);
}

// Create individual user card
function createUserCard(user, index) {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Format address
    const address = formatAddress(user.address);
    
    card.innerHTML = `
        <div class="user-name">${escapeHtml(user.name)}</div>
        <div class="user-email">${escapeHtml(user.email)}</div>
        <div class="user-address">${escapeHtml(address)}</div>
    `;
    
    return card;
}

// Format address object into readable string
function formatAddress(address) {
    if (!address) return 'Address not available';
    
    const parts = [
        address.street,
        address.suite,
        address.city,
        address.zipcode
    ].filter(part => part && part.trim());
    
    return parts.join(', ') || 'Address not available';
}

// Escape HTML to prevent XSS attacks
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle different types of errors
function handleError(error) {
    let errorText = 'An unexpected error occurred';
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorText = 'Network Error: Unable to connect to the server. Please check your internet connection.';
    } else if (error.message.includes('timeout')) {
        errorText = 'Request Timeout: The server is taking too long to respond. Please try again.';
    } else if (error.message.includes('HTTP Error')) {
        errorText = `Server Error: ${error.message}`;
    } else if (error.message.includes('No users data')) {
        errorText = 'Data Error: No user data received from the server.';
    } else {
        errorText = `Error: ${error.message}`;
    }
    
    showError(errorText);
}

// UI state management functions
function setLoadingState(loading) {
    isLoading = loading;
    reloadBtn.disabled = loading;
    reloadBtn.textContent = loading ? '🔄 Loading...' : '🔄 Load Users';
    
    if (loading) {
        loadingDiv.style.display = 'block';
    } else {
        loadingDiv.style.display = 'none';
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    errorDiv.style.display = 'none';
}

function clearUsers() {
    usersGrid.innerHTML = '';
}

// Add some CSS animations for hybrid retro futurism + skeumorphism
const style = document.createElement('style');
style.textContent = `
    .user-card {
        opacity: 0;
        transform: translateY(30px) rotateX(10deg);
        animation: materializeCard 0.8s ease forwards;
        position: relative;
        overflow: hidden;
    }
    
    .user-card::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.03), transparent);
        animation: holographicShimmer 4s ease-in-out infinite;
        pointer-events: none;
        border-radius: 20px;
    }
    
    @keyframes materializeCard {
        to {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
        }
    }
    
    @keyframes holographicShimmer {
        0%, 100% { 
            transform: translateX(-100%) skewX(-15deg); 
            opacity: 0;
        }
        50% { 
            transform: translateX(100%) skewX(-15deg); 
            opacity: 1;
        }
    }
    
    .user-name {
        animation: nameGlow 3s ease-in-out infinite alternate;
    }
    
    @keyframes nameGlow {
        from { 
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.2);
            filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3));
        }
        to { 
            text-shadow: 0 0 8px rgba(0, 255, 255, 0.4), 0 0 12px rgba(255, 0, 128, 0.2);
            filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.4));
        }
    }
    
    .reload-btn {
        animation: buttonPulse 4s ease-in-out infinite;
    }
    
    @keyframes buttonPulse {
        0%, 100% { 
            box-shadow: 
                0 8px 20px rgba(0, 0, 0, 0.3),
                0 4px 10px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                inset 0 -1px 0 rgba(0, 0, 0, 0.2);
        }
        50% { 
            box-shadow: 
                0 12px 30px rgba(0, 0, 0, 0.4),
                0 6px 15px rgba(0, 255, 255, 0.2),
                0 3px 8px rgba(255, 0, 128, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 rgba(0, 0, 0, 0.3);
        }
    }
    
    /* Realistic material interaction */
    .user-card:active {
        transform: translateY(-5px) scale(0.98);
        box-shadow: 
            0 5px 15px rgba(0, 0, 0, 0.4),
            inset 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    /* Parallax effect for background elements */
    @keyframes backgroundFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-10px) rotate(1deg); }
        66% { transform: translateY(5px) rotate(-1deg); }
    }
    
    .container {
        animation: backgroundFloat 20s ease-in-out infinite;
    }
    
    /* Realistic button press effect */
    .reload-btn:active {
        transform: translateY(2px) scale(0.95);
        box-shadow: 
            inset 0 4px 10px rgba(0, 0, 0, 0.4),
            0 2px 5px rgba(0, 0, 0, 0.2);
    }
    
    /* Glass morphism effect for cards */
    .user-email, .user-address {
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    }
`;
document.head.appendChild(style);

// Add keyboard support for accessibility
document.addEventListener('keydown', (event) => {
    if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
        event.preventDefault();
        fetchUsers();
    }
});

// Log initialization
console.log('User Data Fetcher initialized');
console.log('Press F5 or Ctrl+R to reload data');
console.log('Disable your internet connection to test error handling');