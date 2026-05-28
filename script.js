let timeChart = null;

/* =========================
   MAIN CHART
========================= */

// Force 2 decimal places globally across all Chart.js tooltips
Chart.components.get('plugin.tooltip').prototype.defaults.callbacks.label = function(context) {
  let label = context.dataset.label || '';
  if (label) label += ': ';
  if (context.parsed.y !== null) {
    label += context.parsed.y.toFixed(2);
  }
  return label;
};

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
          display: true,
          position: 'top'
        }
      },

      interaction: {
        mode: 'index',
        intersect: false
      }
    },

    plugins: [
      recessionPlugin
    //  ,staticTooltipPlugin
    ]
  });
}


async function createInflationChart() {

  const ctx = document
    .getElementById('chart-inflation')
    .getContext('2d');

  const data = await fetchAndParseExcel();

  if (!data) return;

  if (window.inflationChart) {
    window.inflationChart.destroy();
  }

  window.inflationChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        // upper IQR
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

        // lower IQR
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
              ticks: {
                maxTicksLimit: 10, // Added missing comma here to fix syntax crash
                callback: function(value) {
                  return Number(value).toFixed(2);
                }
              }
            },
            y: {
              beginAtZero: false
            }
          },
          plugins: {
            legend: {
              position: 'top'
            },
            title: {
              display: true,
              text: 'Time-Varying Phillips Curve Slopes'
            },

            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0,0,0,0.65)',
        borderColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1,
        cornerRadius: 8,

        titleColor: '#fff',
        bodyColor: '#fff',
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) label += ': ';
                  if (context.parsed.y !== null) label += context.parsed.y.toFixed(2);
                  return label;
                }
              }
            }
          },
          interaction: {
            mode: 'index',
            intersect: false
          }
        },

        plugins: [
          recessionPlugin
    //      ,staticTooltipPlugin
        ]
  });
}

async function createPhillipsCurveChart() {

  const ctx = document
    .getElementById('chart-phillipscurve')
    .getContext('2d');

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
          borderDash: [6,4],
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
          bodyColor: '#fff',
          callbacks: {

            title: function(items) {

              const date = new Date(items[0].parsed.x);

              const quarter =
                Math.floor(date.getMonth() / 3) + 1;

              return `${date.getFullYear()} Q${quarter}`;
            },

            label: function(context) {

              let label = context.dataset.label || '';

              if (label) {
                label += ': ';
              }

              return label + context.parsed.y.toFixed(3);
            }
          }
        }
      },


      interaction: {
        mode: 'index',
        intersect: false
      }
    },

    plugins: [
      recessionPlugin
    //  ,staticTooltipPlugin
    ]
  });
}


/* =========================
   SECTION SWITCHING
========================= */

function showSection(id) {

  // hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });

  // show target section
  const target = document.getElementById(id);

  if (target) {
    target.classList.add('active');
  }

  // sidebar active link
  document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.classList.remove('active');

    const onclickAttr = link.getAttribute('onclick');

    if (
      onclickAttr &&
      onclickAttr.includes(`showSection('${id}')`)
    ) {
      link.classList.add('active');
    }
  });

  // update URL
  history.replaceState(
    { section: id },
    '',
    `?section=${id}`
  );

  // lazy load charts
  if (id === 'estimates' && !timeChart) {
    setTimeout(() => {
      createChart();
    }, 50);
  }
}


/* =========================
   RESIZE HANDLING
========================= */

function resizeAllCharts() {

  Chart.helpers.each(Chart.instances, function(instance) {
    instance.resize();
  });
}

window.addEventListener('resize', resizeAllCharts);


/* =========================
   OPTIONAL GLOBALS
========================= */

const seriesKeys = ['rstar', 'estimate'];
const labels = ['r*', 'Estimate'];
