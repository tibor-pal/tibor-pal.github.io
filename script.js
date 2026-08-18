let timeChart = null;

/* =========================
   GLOBAL CHART DEFAULTS
========================= */
Chart.defaults.plugins.tooltip.callbacks.label = function(context) {
  let label = context.dataset.label || '';
  if (label) label += ': ';
  if (context.parsed.y !== null) {
    label += context.parsed.y.toFixed(2);
  }
  return label;
};

/* =========================
   MAIN CHART
========================= */
function createChart() {
  const canvas = document.getElementById('timeChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

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
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { maxTicksLimit: 10 }
        },
        y: { beginAtZero: false }
      },
      plugins: {
        legend: { display: true, position: 'top' }
      },
      interaction: {
        mode: 'index',
        intersect: false
      }
    },
    plugins: [recessionPlugin, staticTooltipPlugin]
  });
}

/* =========================
   INFLATION CHART
========================= */
async function createInflationChart() {
  const canvas = document.getElementById('chart-inflation');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const data = await fetchAndParseExcel();
  if (!data) return;

  if (window.inflationChart) {
    window.inflationChart.destroy();
  }

  window.inflationChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: '𝜏 = 0.75',
          data: data.q75,
          borderColor: 'transparent',
          backgroundColor: 'rgba(120,180,180,0.25)',
          pointRadius: 0,
          fill: '+1',
          borderWidth: 2,
          tension: 0.1
        },
        {
          label: '𝜏 = 0.25',
          data: data.q25,
          borderColor: 'transparent',
          backgroundColor: 'rgba(120,180,180,0.25)',
          pointRadius: 0,
          fill: false
        },
        {
          label: '𝜏 = 0.95',
          data: data.q95,
          borderColor: '#3b2418',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.1
        },
        {
          label: '𝜏 = 0.50',
          data: data.q50,
          borderColor: '#ff4d4d',
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.1
        },
        {
          label: '𝜏 = 0.05',
          data: data.q05,
          borderColor: '#e6a400',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.1
        },
        {
          label: 'Core PCE',
          data: data.corePCE,
          borderColor: '#0072BD',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { maxTicksLimit: 10 }
        },
        y: { beginAtZero: false }
      },
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Inflation Quantiles' },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0,0,0,0.65)',
          borderColor: 'rgba(255,255,255,0.12)',
          borderWidth: 1,
          cornerRadius: 8,
          titleColor: '#fff',
          bodyColor: '#fff'
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      }
    },
    plugins: [recessionPlugin, staticTooltipPlugin]
  });

  setTimeout(() => {
    if (window.innerWidth <= 768) {
      scrollChartRight('#inflation .chart-wrapper');
    }
  }, 250);
}

/* =========================
   PHILLIPS CURVE CHART
========================= */
async function createPhillipsCurveChart() {
  const canvas = document.getElementById('chart-phillipscurve');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const data = await fetchAndParseExcel();
  if (!data) return;

  if (window.phillipsChart) {
    window.phillipsChart.destroy();
  }

  window.phillipsChart = new Chart(ctx, {
    type: 'line',

    data: {
      datasets: [
        {
          label: '𝜏 = 0.95',
          data: data.k95,
          borderColor: '#3b2418',
          borderWidth: 2.5,
          pointRadius: 0,
          tension: 0.1
        },
        {
          label: '𝜏 = 0.75',
          data: data.k75,
          borderColor: '#d95f02',
          borderWidth: 2.5,
          pointRadius: 0,
          tension: 0.1
        },
        {
          label: '𝜏 = 0.50',
          data: data.k50,
          borderColor: '#0072BD',
          borderDash: [6, 4],
          borderWidth: 2.5,
          pointRadius: 0,
          tension: 0.1
        },
        {
          label: '𝜏 = 0.25',
          data: data.k25,
          borderColor: '#66a61e',
          borderWidth: 2.5,
          pointRadius: 0,
          tension: 0.1
        },
        {
          label: '𝜏 = 0.05',
          data: data.k05,
          borderColor: '#e6a400',
          borderWidth: 2.5,
          pointRadius: 0,
          tension: 0.1
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'quarter',
            displayFormats: {
              quarter: "yyyy 'Q'q"
            }
          },
          ticks: {
            maxTicksLimit: 10
          }
        },
        y: {
          beginAtZero: false
        }
      },

      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 14
            }
          }
        },

        title: {
          display: true,
          text: 'Time-Varying Phillips Curve Slopes',
          font: {
            size: 18,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        },

        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0,0,0,0.65)',
          borderColor: 'rgba(255,255,255,0.12)',
          borderWidth: 1,
          cornerRadius: 8,
          titleColor: '#fff',
          bodyColor: '#fff'
        }
      },

      interaction: {
        mode: 'index',
        intersect: false
      }
    },

    plugins: [
      recessionPlugin,
      staticTooltipPlugin
    ]
  });

  // Hide τ = 0.75 and τ = 0.25
  window.phillipsChart.setDatasetVisibility(1, false);
  window.phillipsChart.setDatasetVisibility(3, false);

  window.phillipsChart.update();

  setTimeout(() => {
    if (window.innerWidth <= 768) {
      scrollChartRight('#phillipscurve .chart-wrapper');
    }
  }, 250);
}



/* =========================
   SECTION SWITCHING
========================= */
function showSection(id) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });

  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
  }

  document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.classList.remove('active');
    const onclickAttr = link.getAttribute('onclick');
    if (onclickAttr && onclickAttr.includes(`showSection('${id}')`)) {
      link.classList.add('active');
    }
  });

  history.replaceState({ section: id }, '', `?section=${id}`);

  // Lazy load charts depending on the target section
  if (id === 'estimates' && !timeChart) {
    setTimeout(() => { createChart(); }, 50);
  } else if (id === 'phillipscurve' && !window.phillipsChart) {
    setTimeout(() => { createPhillipsCurveChart(); }, 50);
  } else if (id === 'inflation' && !window.inflationChart) {
    setTimeout(() => { createInflationChart(); }, 50);
  }
}

/* =========================
   RESIZE & SCROLLING
========================= */
function resizeAllCharts() {
  Chart.helpers.each(Chart.instances, function(instance) {
    instance.resize();
  });
}
window.addEventListener('resize', resizeAllCharts);

function scrollChartRight(selector) {
  const wrapper = document.querySelector(selector);
  if (!wrapper) return;

  const doScroll = () => { wrapper.scrollLeft = wrapper.scrollWidth; };
  doScroll();
  requestAnimationFrame(doScroll);
  setTimeout(doScroll, 100);
  setTimeout(doScroll, 300);
}

/* =========================
   INITIAL LOAD HANDLING
========================= */
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const initialSection = urlParams.get('section') || 'estimates';
  showSection(initialSection);
});
