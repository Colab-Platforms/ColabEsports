// Tournament data
const tournaments = [
    {
        id: 't1',
        title: 'BGMI Championship',
        type: 'Squad',
        date: '25 Sep 2023',
        time: '7:00 PM IST',
        prize: '₹5,00,000',
        teams: '4 vs 4',
        region: 'Asia',
        map: 'Erangel',
        image: 'https://res.cloudinary.com/dlmcpmdpn/image/upload/v1/tournaments/tournament-images/hhplqzudnsrdmwssrtkz.png',
        category: 'squad',
        badge: 'Featured',
        slots: '50/100',
        entryFee: '₹500'
    },
    {
        id: 't2',
        title: 'Solo Showdown',
        type: 'Solo',
        date: '28 Sep 2023',
        time: '8:00 PM IST',
        prize: '₹1,00,000',
        teams: '1 vs 1',
        region: 'India',
        map: 'Livik',
        image: 'https://res.cloudinary.com/dlmcpmdpn/image/upload/v1/tournaments/tournament-images/hhplqzudnsrdmwssrtkz.png',
        category: 'solo',
        badge: 'New',
        slots: '75/100',
        entryFee: '₹200'
    },
    {
        id: 't3',
        title: 'Duo Domination',
        type: 'Duo',
        date: '30 Sep 2023',
        time: '9:00 PM IST',
        prize: '₹2,50,000',
        teams: '2 vs 2',
        region: 'South Asia',
        map: 'Miramar',
        image: 'https://res.cloudinary.com/dlmcpmdpn/image/upload/v1/tournaments/tournament-images/hhplqzudnsrdmwssrtkz.png',
        category: 'duo',
        badge: 'Popular',
        slots: '60/100',
        entryFee: '₹300'
    },
    {
        id: 't4',
        title: 'Weekly Squad Clash',
        type: 'Squad',
        date: '1 Oct 2023',
        time: '7:30 PM IST',
        prize: '₹3,00,000',
        teams: '4 vs 4',
        region: 'Global',
        map: 'Sanhok',
        image: 'https://res.cloudinary.com/dlmcpmdpn/image/upload/v1/tournaments/tournament-images/hhplqzudnsrdmwssrtkz.png',
        category: 'squad',
        badge: 'Hot',
        slots: '40/100',
        entryFee: '₹400'
    },
    {
        id: 't5',
        title: 'Solo Warriors',
        type: 'Solo',
        date: '2 Oct 2023',
        time: '8:30 PM IST',
        prize: '₹75,000',
        teams: '1 vs 1',
        region: 'India',
        map: 'Vikendi',
        image: 'https://res.cloudinary.com/dlmcpmdpn/image/upload/v1/tournaments/tournament-images/hhplqzudnsrdmwssrtkz.png',
        category: 'solo',
        badge: 'New',
        slots: '90/100',
        entryFee: '₹150'
    },
    {
        id: 't6',
        title: 'Duo Mayhem',
        type: 'Duo',
        date: '3 Oct 2023',
        time: '9:30 PM IST',
        prize: '₹1,50,000',
        teams: '2 vs 2',
        region: 'Asia',
        map: 'Erangel',
        image: 'https://res.cloudinary.com/dlmcpmdpn/image/upload/v1/tournaments/tournament-images/hhplqzudnsrdmwssrtkz.png',
        category: 'duo',
        badge: 'Featured',
        slots: '55/100',
        entryFee: '₹250'
    }
];

// DOM Elements
const tournamentContainer = document.getElementById('tournamentContainer');
const filterButtons = document.querySelectorAll('.filter-btn');

// Render tournaments
function renderTournaments(category = 'all') {
    // Clear container
    tournamentContainer.innerHTML = '';
    
    // Filter tournaments
    const filteredTournaments = category === 'all' 
        ? [...tournaments] 
        : tournaments.filter(tournament => tournament.category === category);
    
    // Check if no tournaments found
    if (filteredTournaments.length === 0) {
        tournamentContainer.innerHTML = `
            <div class="no-tournaments" style="grid-column: 1 / -1; text-align: center; padding: 50px;">
                <i class="fas fa-trophy" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 20px;"></i>
                <h3>No tournaments found</h3>
                <p>Check back later for upcoming tournaments in this category.</p>
            </div>
        `;
        return;
    }
    
    // Render tournaments
    filteredTournaments.forEach((tournament, index) => {
        const tournamentCard = document.createElement('div');
        tournamentCard.className = 'tournament-card';
        tournamentCard.style.animationDelay = `${index * 0.1}s`;
        
        // Set badge color based on badge type
        let badgeColor = '#ff6b35'; // Default color
        if (tournament.badge === 'New') badgeColor = '#0099ff';
        if (tournament.badge === 'Popular') badgeColor = '#9c27b0';
        if (tournament.badge === 'Hot') badgeColor = '#ff3e3e';
        
        tournamentCard.innerHTML = `
            <div class="tournament-image" style="background-image: url('${tournament.image}');">
                <span class="tournament-badge" style="background: ${badgeColor};">
                    ${tournament.badge}
                </span>
            </div>
            <div class="tournament-content">
                <h3 class="tournament-title">${tournament.title}</h3>
                <div class="tournament-meta">
                    <span>${tournament.type} Tournament</span>
                    <span class="tournament-prize">${tournament.prize} Prize</span>
                </div>
                
                <div class="tournament-details">
                    <div class="detail-item">
                        <div class="detail-icon">
                            <i class="fas ${tournament.type === 'Solo' ? 'fa-user' : 'fa-users'}"></i>
                        </div>
                        <div class="detail-text">
                            <div class="detail-label">${tournament.type === 'Solo' ? 'Mode' : 'Team Size'}</div>
                            <div class="detail-value">${tournament.teams}</div>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-icon">
                            <i class="fas fa-calendar-day"></i>
                        </div>
                        <div class="detail-text">
                            <div class="detail-label">Date & Time</div>
                            <div class="detail-value">${tournament.date} • ${tournament.time}</div>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-icon">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <div class="detail-text">
                            <div class="detail-label">Region</div>
                            <div class="detail-value">${tournament.region}</div>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-icon">
                            <i class="fas fa-map"></i>
                        </div>
                        <div class="detail-text">
                            <div class="detail-label">Map</div>
                            <div class="detail-value">${tournament.map}</div>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="detail-text">
                            <div class="detail-label">Slots</div>
                            <div class="detail-value">${tournament.slots}</div>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-icon">
                            <i class="fas fa-ticket-alt"></i>
                        </div>
                        <div class="detail-text">
                            <div class="detail-label">Entry Fee</div>
                            <div class="detail-value">${tournament.entryFee}</div>
                        </div>
                    </div>
                </div>
                
                <button class="register-btn" onclick="openRegistration('${tournament.id}')">
                    <i class="fas fa-sign-in-alt"></i> Register Now
                </button>
            </div>
        `;
        
        tournamentContainer.appendChild(tournamentCard);
    });
    
    // Animate cards
    animateCards();
}

// Animate cards on scroll
function animateCards() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.tournament-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Filter tournaments
function filterTournaments(category) {
    // Update active button
    filterButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.filter === category);
    });
    
    // Render filtered tournaments
    renderTournaments(category);
}

// Open registration modal
function openRegistration(tournamentId) {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (tournament) {
        // You can implement a modal or redirect to registration page
        alert(`Registration for ${tournament.title} will open soon!`);
        // Example: window.location.href = `register.html?tournament=${tournamentId}`;
    }
}

// Initialize
function init() {
    // Add event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.filter;
            filterTournaments(category);
        });
    });
    
    // Initial render
    renderTournaments();
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
