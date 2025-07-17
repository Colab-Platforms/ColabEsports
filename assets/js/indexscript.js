//Model and Steam Link JS
  function openCS2SetupModal() {
      document.getElementById('cs2SetupModal').classList.add('show');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeCS2SetupModal() {
      document.getElementById('cs2SetupModal').classList.remove('show');
      document.body.style.overflow = 'auto'; // Restore scrolling
    }

    function redirectToGamePage() {
      // Close the modal first
      closeCS2SetupModal();
      // Redirect to the Steam game link
      window.location.href = 'steam://connect/31.97.206.108:27015?appid=730';
    }

    // Close modal when clicking outside of it
    window.onclick = function(event) {
      const modal = document.getElementById('cs2SetupModal');
      if (event.target === modal) {
        closeCS2SetupModal();
      }
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        closeCS2SetupModal();
      }
    });




//leaderboard script

let currentType = 'today';

     async function fetchLeaderboardData() {
       try {
         const response = await fetch(`/api/leaderboard?type=${currentType}`);
         const data = await response.json();
         renderTable(data);
       } catch (error) {
         console.error('Failed to load leaderboard:', error);
       }
     }

     function renderTable(rows) {
       const tbody = document.getElementById('leaderboard-body');
       tbody.innerHTML = '';

       if (!rows || rows.length === 0) {
         for (let i = 0; i < 9; i++) {
           tbody.innerHTML += `<tr><td colspan="6" style="height:78px;"></td></tr>`;
         }
         return;
       }

       rows.forEach(row => {
         tbody.innerHTML += `<tr>
           <td>${row.rank}</td>
           <td><img src="https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=5047b1&color=fff&rounded=true&size=64" alt="${row.name}" class="avatar"> <b>${row.name}</b></td>
           <td>${row.kills}</td>
           <td>${row.deaths}</td>
           <td>${row.assists}</td>
           <td>${row.kda}</td>
         </tr>`;
       });

       for (let i = rows.length; i < 9; i++) {
         tbody.innerHTML += `<tr><td colspan="6" style="height:78px;"></td></tr>`;
       }
     }

     function updateActiveButton(groupId, value, attr) {
       const group = document.getElementById(groupId);
       Array.from(group.children).forEach(btn => {
         btn.classList.toggle('active', btn.getAttribute(attr) === value);
       });
     }

     document.getElementById('type-filters').addEventListener('click', function(e) {
       if (e.target.tagName === 'BUTTON') {
         currentType = e.target.getAttribute('data-type');
         updateActiveButton('type-filters', currentType, 'data-type');
         fetchLeaderboardData();
       }
     });

     fetchLeaderboardData();


//leaderboard script end here


//real time date and time script
 function updateDateTime() {
    const now = new Date();

    const options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      
    };

    const formattedDate = now.toLocaleString('en-US', options);
    document.getElementById("realTimeDisplay").textContent = formattedDate;
  }

 
  updateDateTime();

  
  setInterval(updateDateTime, 30000);

  //

  const scrollContainer = document.getElementById('scrollableContainer');
  const scrollContent = scrollContainer.querySelector('.custom-scroll-content');
  let scrollTop = 0;

  scrollContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    scrollTop -= e.deltaY;
    const maxScroll = scrollContent.scrollHeight - scrollContainer.clientHeight;

    if (scrollTop < 0) scrollTop = 0;
    if (scrollTop > maxScroll) scrollTop = maxScroll;

    scrollContent.style.transform = `translateY(-${scrollTop}px)`;
  }, { passive: false });
