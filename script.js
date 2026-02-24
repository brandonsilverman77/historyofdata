/* ========================================
   THE CLOSING WINDOW — Scripts
   ======================================== */

// --- Scroll-triggered fade-in animations ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// --- Animated number counters ---
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      if (el.dataset.counted) return;
      el.dataset.counted = 'true';

      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();

      function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }

      requestAnimationFrame(animate);
    }
  });
}, {
  threshold: 0.5
});

document.querySelectorAll('.big-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});

// --- Chart.js: The Paradox Chart ---
function createParadoxChart() {
  const canvas = document.getElementById('paradoxChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Data
  const years = ['2006', '2008', '2010', '2012', '2014', '2016', '2018', '2020', '2022', '2024', '2025'];

  // Social media users (billions)
  const users = [0.15, 0.45, 0.97, 1.40, 1.91, 2.49, 3.19, 3.96, 4.59, 5.17, 5.66];

  // Research access index (normalized 0-100, representing composite of:
  // API availability, tools, funding programs, data partnerships)
  // This is an editorial/narrative index, not raw data
  const access = [30, 45, 60, 70, 78, 85, 55, 70, 60, 15, 10];

  // Event annotations
  const events = {
    3: { label: 'Twitter Data Grants', y: 70 },
    5: { label: 'CrowdTangle acquired', y: 85 },
    6: { label: 'Cambridge Analytica', y: 55 },
    7: { label: 'Academic API launches', y: 70 },
    9: { label: 'APIs shut down', y: 15 },
  };

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Social Media Users (billions)',
          data: users,
          borderColor: '#b8860b',
          backgroundColor: 'rgba(184, 134, 11, 0.08)',
          borderWidth: 3,
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: '#b8860b',
          yAxisID: 'y',
        },
        {
          label: 'Research Access Index',
          data: access,
          borderColor: '#c23b22',
          backgroundColor: 'rgba(194, 59, 34, 0.08)',
          borderWidth: 3,
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: '#c23b22',
          borderDash: [],
          yAxisID: 'y1',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              family: "'Inter', sans-serif",
              size: 13
            },
            padding: 24,
            usePointStyle: true,
            pointStyleWidth: 12,
          }
        },
        tooltip: {
          backgroundColor: '#1a1a1f',
          titleFont: {
            family: "'Inter', sans-serif",
            size: 13,
            weight: '600'
          },
          bodyFont: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          padding: 14,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function(context) {
              if (context.datasetIndex === 0) {
                return ' Users: ' + context.parsed.y.toFixed(2) + 'B';
              } else {
                return ' Research Access: ' + context.parsed.y + '/100';
              }
            }
          }
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              family: "'Inter', sans-serif",
              size: 12
            },
            color: '#888'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Users (billions)',
            font: {
              family: "'Inter', sans-serif",
              size: 12,
              weight: '500'
            },
            color: '#b8860b'
          },
          grid: {
            color: 'rgba(0,0,0,0.04)',
          },
          ticks: {
            font: {
              family: "'Inter', sans-serif",
              size: 11
            },
            color: '#888',
            callback: function(value) {
              return value + 'B';
            }
          },
          min: 0,
          max: 6,
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Research Access',
            font: {
              family: "'Inter', sans-serif",
              size: 12,
              weight: '500'
            },
            color: '#c23b22'
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            font: {
              family: "'Inter', sans-serif",
              size: 11
            },
            color: '#888'
          },
          min: 0,
          max: 100,
        }
      }
    },
    plugins: [{
      id: 'eventAnnotations',
      afterDraw: function(chart) {
        const ctx = chart.ctx;
        const xAxis = chart.scales.x;
        const y1Axis = chart.scales.y1;

        ctx.save();
        ctx.font = "500 11px 'Inter', sans-serif";
        ctx.textAlign = 'center';

        Object.entries(events).forEach(([index, event]) => {
          const x = xAxis.getPixelForValue(parseInt(index));
          const y = y1Axis.getPixelForValue(event.y);

          // Draw dashed vertical line
          ctx.beginPath();
          ctx.setLineDash([3, 3]);
          ctx.strokeStyle = 'rgba(0,0,0,0.12)';
          ctx.lineWidth = 1;
          ctx.moveTo(x, y - 16);
          ctx.lineTo(x, chart.scales.x.top);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw label
          ctx.fillStyle = 'rgba(0,0,0,0.45)';
          ctx.fillText(event.label, x, y - 22);
        });

        ctx.restore();
      }
    }]
  });
}

// Initialize chart when it scrolls into view
const chartObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      createParadoxChart();
      chartObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const chartEl = document.getElementById('paradoxChart');
if (chartEl) {
  chartObserver.observe(chartEl);
}

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
