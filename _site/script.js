let timeChart = null;  // keep chart in global scope

function createChart() {
  const ctx = document.getElementById('timeChart').getContext('2d');
  timeChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          label: 'r',
          data: r,
          borderColor: '#0072BD',
          borderWidth: 2,
          fill: false,
          tension: 0.1,
          pointRadius: 0,
        },
        {
          label: 'r_sm',
          data: r_sm,
          borderColor: '#177245',
          borderWidth: 2,
          fill: false,
          tension: 0.1,
          pointRadius: 0,
        }
      ]
    },
    options: {
      responsive: true,
      scales: { /* same as before */ },
      plugins: { /* same as before */ },
      interaction: { /* same as before */ }
    },
    plugins: [recessionPlugin]
  });
}

function showSection(id) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  if (id === 'results') {
    if (!timeChart) {
      createChart();  // create chart only once when results shown first time
    } else {
      timeChart.resize();  // resize chart if already created
    }
  }
}
