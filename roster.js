// Steelers 2024 Roster Viewer
// This script expects a file named Steelers.csv in the same directory as index.html
// It fetches and parses the CSV, then renders the roster by week and by unit/position

// --- CONFIG ---
const CSV_FILE = 'Steelers.csv';
const UNIT_MAP = {
  'QB': 'Offense', 'RB': 'Offense', 'FB': 'Offense', 'WR': 'Offense', 'TE': 'Offense',
  'C': 'Offense', 'OL': 'Offense', 'OT': 'Offense', 'OG': 'Offense', 'G': 'Offense', 'T': 'Offense',
  'DT': 'Defense', 'NT': 'Defense', 'DL': 'Defense', 'LB': 'Defense', 'ILB': 'Defense', 'OLB': 'Defense', 'MLB': 'Defense',
  'CB': 'Defense', 'S': 'Defense', 'FS': 'Defense', 'SS': 'Defense', 'DB': 'Defense',
  'K': 'Special Teams', 'P': 'Special Teams', 'LS': 'Special Teams'
};

// --- CSV PARSER ---
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines[0].split(',');
  return lines.slice(1).map(line => {
    const row = {};
    let inQuotes = false, val = '', col = 0, i = 0;
    for (let c = 0; c <= line.length; c++) {
      const char = line[c] || '';
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) { row[header[col++]] = val; val = ''; }
      else val += char;
    }
    if (col < header.length) row[header[col]] = val;
    return row;
  });
}

// --- GROUPING HELPERS ---
function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key] || 'Other';
    (acc[k] = acc[k] || []).push(item);
    return acc;
  }, {});
}

// --- RENDERING ---
function renderRoster(roster, week) {
  const display = document.getElementById('roster-display');
  display.innerHTML = '';
  if (!roster.length) {
    display.innerHTML = '<p>No roster data for this week.</p>';
    return;
  }
  // Assign unit
  roster.forEach(player => {
    player.unit = UNIT_MAP[player.position] || 'Other';
  });
  const units = ['Offense', 'Defense', 'Special Teams', 'Other'];
  units.forEach(unit => {
    const playersInUnit = roster.filter(p => p.unit === unit);
    if (!playersInUnit.length) return;
    const section = document.createElement('div');
    section.className = 'section';
    section.innerHTML = `<h2>${unit}</h2>`;
    // Group by position
    const byPos = groupBy(playersInUnit, 'position');
    const posWrap = document.createElement('div');
    posWrap.className = 'positions';
    Object.keys(byPos).sort().forEach(pos => {
      const posDiv = document.createElement('div');
      posDiv.className = 'position';
      posDiv.innerHTML = `<h3>${pos}</h3>`;
      const playersDiv = document.createElement('div');
      playersDiv.className = 'players';
      byPos[pos].forEach(player => {
        const img = player.headshot_url && player.headshot_url.startsWith('http') ? player.headshot_url : 'https://static.www.nfl.com/image/upload/f_auto,q_auto/league/ogd3oqp6j5j8r8h1qnvb';
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player';
        playerDiv.innerHTML = `
          <img src="${img}" alt="${player.player_name}">
          <div class="player-info">
            <span class="player-name">${player.player_name}</span>
            <span class="player-meta">#${player.jersey_number} &bull; ${player.position}</span>
          </div>
        `;
        playersDiv.appendChild(playerDiv);
      });
      posDiv.appendChild(playersDiv);
      posWrap.appendChild(posDiv);
    });
    section.appendChild(posWrap);
    display.appendChild(section);
  });
}

// --- MAIN ---
fetch(CSV_FILE)
  .then(r => r.text())
  .then(text => {
    const data = parseCSV(text);
    // Get all unique weeks (sorted numerically)
    const weeks = Array.from(new Set(data.map(row => row.week).filter(Boolean))).sort((a, b) => Number(a) - Number(b));
    const weekSelect = document.getElementById('week-select');
    weeks.forEach(week => {
      const opt = document.createElement('option');
      opt.value = week;
      opt.textContent = `Week ${week}`;
      weekSelect.appendChild(opt);
    });
    function update() {
      const week = weekSelect.value;
      const weekRoster = data.filter(row => row.week === week);
      renderRoster(weekRoster, week);
    }
    weekSelect.addEventListener('change', update);
    weekSelect.value = weeks[0];
    update();
  })
  .catch(err => {
    document.getElementById('roster-display').innerHTML = '<p style="color:red">Failed to load roster data.</p>';
    console.error(err);
  });
