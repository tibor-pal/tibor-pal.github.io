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

/*function showSection(id) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  if (id === 'estimates') {
    if (!timeChart) {
      createChart();
    } else {
      timeChart.resize();
    }
  }
}*/

function showSection(id) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
  // Show target section
  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  // Remove active class from all links
  document.querySelectorAll('.sidebar nav a').forEach(link => link.classList.remove('active'));

  // Add active to the correct link
  document.querySelectorAll('.sidebar nav a').forEach(link => {
    // Extract the id from the onclick attribute
    const onclickAttr = link.getAttribute('onclick');
    if (onclickAttr && onclickAttr.includes(`showSection('${id}')`)) {
      link.classList.add('active');
    }
  });

  history.replaceState({ section: id }, '', `?section=${id}`);

  if (id === 'estimates' && !window.timeChart) {
    setTimeout(() => createChart(), 50);
  }
}


document.querySelectorAll('.sidebar nav a').forEach(link => {
  link.classList.remove('active');
  if (link.dataset.section === id) {
    link.classList.add('active');
  }
});
