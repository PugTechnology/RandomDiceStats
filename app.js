const winsElement = document.getElementById('wins');
const lossesElement = document.getElementById('losses');
const winPercentageElement = document.getElementById('win-percentage');
const addWinsButton = document.getElementById('add-wins-btn');
const addLossesButton = document.getElementById('add-losses-btn');
const updateButton = document.getElementById('update-btn');
const statsFilePath = 'stats.json';

function updateWinPercentage() {
  const currentWins = parseInt(winsElement.innerText);
  const currentLosses = parseInt(lossesElement.innerText);
  const totalGames = currentWins + currentLosses;

  const winPercentage =
    totalGames > 0 ? ((currentWins / totalGames) * 100).toFixed(1) + '%' : 'N/A';
  winPercentageElement.innerText = winPercentage;
}

function updateStats(wins, losses) {
  const stats = { wins, losses };
  fetch(statsFilePath, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stats),
  })
    .then(() => {
      winsElement.innerText = wins;
      lossesElement.innerText = losses;
      updateWinPercentage();
    })
    .catch((error) => console.error(error));
}

function loadStats() {
  fetch(statsFilePath)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Stats file not found');
      }
    })
    .then((stats) => {
      winsElement.innerText = stats.wins || 0;
      lossesElement.innerText = stats.losses || 0;
      updateWinPercentage();
    })
    .catch((error) => {
      console.error(error);
      const defaultStats = { wins: 0, losses: 0 };
      updateStats(defaultStats.wins, defaultStats.losses);
    });
}

addWinsButton.addEventListener('click', () => {
  const currentWins = parseInt(winsElement.innerText);
  updateStats(currentWins + 1, parseInt(lossesElement.innerText));
});

addLossesButton.addEventListener('click', () => {
  const currentLosses = parseInt(lossesElement.innerText);
  updateStats(parseInt(winsElement.innerText), currentLosses + 1);
});

updateButton.addEventListener('click', () => {
  loadStats();
});

loadStats();
