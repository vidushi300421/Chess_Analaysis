// js/main.js

async function loadJSON(path) {
    const res = await fetch(path);
    if (!res.ok) {
      console.error("Failed to load", path, res.status);
      return null;
    }
    return res.json();
  }
  
  /* ------------------------- ACT 1 ------------------------- */
  
  async function renderAct1() {
    // load all three JSONs
    const heat = await loadJSON('data/act1_outcome_heatmap.json');
    const total = await loadJSON('data/act1_total_wins.json');
    const upset = await loadJSON('data/act1_upset_wins.json');
  
    if (!heat || !total || !upset) return;
  
    // ---- Visual 1: outcome heatmap ----
    const resultLabels = ['Win', 'Loss', 'Draw'];
  
    const customData = heat.values.map(row =>
      row.map(v => resultLabels[v])
    );
  
    Plotly.newPlot('act1-heatmap', [{
      z: heat.values,
      x: heat.games,
      y: heat.players,
      type: 'heatmap',
      colorscale: [
        [0.00, '#4ea5ff'], [0.33, '#4ea5ff'],   // win
        [0.34, '#ff5c5c'], [0.66, '#ff5c5c'],   // loss
        [0.67, '#6ed36e'], [1.00, '#6ed36e']    // draw
      ],
      showscale: false,
      xgap: 1,
      ygap: 1,
      customdata: customData,
      hovertemplate:
        'Player: %{y}<br>' +
        'Game: %{x}<br>' +
        'Result: %{customdata}<extra></extra>'
    }], {
      margin: {l: 150, r: 20, t: 30, b: 40},
      xaxis: {
        title: 'Game Number',
        tickmode: 'linear',
        tick0: 1,
        dtick: 2
      },
      yaxis: {
        title: 'Player (F = Fast, P = Plateau)',
        automargin: true
      }
    }, {responsive: true});
  
    // ---- Visual 2: total wins bar chart ----
    const totalFastX = [];
    const totalFastY = [];
    const totalPlateauX = [];
    const totalPlateauY = [];
  
    total.players.forEach((p, i) => {
      if (total.group[i] === 'Fast') {
        totalFastX.push(p);
        totalFastY.push(total.wins[i]);
      } else {
        totalPlateauX.push(p);
        totalPlateauY.push(total.wins[i]);
      }
    });
  
    const totalFastTrace = {
      x: totalFastX,
      y: totalFastY,
      type: 'bar',
      name: 'Fast Improver',
      marker: {color: '#4ea5ff'}
    };
  
    const totalPlateauTrace = {
      x: totalPlateauX,
      y: totalPlateauY,
      type: 'bar',
      name: 'Plateau Player',
      marker: {color: '#ff9d57'}
    };
  
    Plotly.newPlot('act1-total-wins', [totalFastTrace, totalPlateauTrace], {
      barmode: 'group',
      margin: {l: 60, r: 20, t: 30, b: 140},
      xaxis: {tickangle: -45},
      yaxis: {
        title: 'Wins (First 30 Games)',
        rangemode: 'tozero'
      },
      legend: {orientation: 'h', y: 1.12}
    }, {responsive: true});
  
    // ---- Visual 3: upset wins bar chart ----
    const upsetFastX = [];
    const upsetFastY = [];
    const upsetPlateauX = [];
    const upsetPlateauY = [];
  
    upset.players.forEach((p, i) => {
      if (upset.group[i] === 'Fast') {
        upsetFastX.push(p);
        upsetFastY.push(upset.upset_wins[i]);
      } else {
        upsetPlateauX.push(p);
        upsetPlateauY.push(upset.upset_wins[i]);
      }
    });
  
    const upsetFastTrace = {
      x: upsetFastX,
      y: upsetFastY,
      type: 'bar',
      name: 'Fast Improver',
      marker: {color: '#4ea5ff'}
    };
  
    const upsetPlateauTrace = {
      x: upsetPlateauX,
      y: upsetPlateauY,
      type: 'bar',
      name: 'Plateau Player',
      marker: {color: '#ff9d57'}
    };
  
    Plotly.newPlot('act1-upset-wins', [upsetFastTrace, upsetPlateauTrace], {
      barmode: 'group',
      margin: {l: 60, r: 20, t: 30, b: 140},
      xaxis: {tickangle: -45},
      yaxis: {
        title: 'Upset Wins (vs Higher-Rated)',
        rangemode: 'tozero'
      },
      legend: {orientation: 'h', y: 1.12}
    }, {responsive: true});
  }
  
  /* ------------------------- ACT 2 ------------------------- */
  
  async function renderAct2() {
    const phase = await loadJSON('data/act2_winrate_phase.json');
    const depth = await loadJSON('data/act2_opening_depth.json');
    if (!phase || !depth) return;
  
    // Visual 4 – phase heatmap
    Plotly.newPlot('act2-phase-heatmap', [{
      z: phase.win_rates,
      x: phase.phases,
      y: phase.groups,
      type: 'heatmap',
      colorscale: 'Blues',
      zmin: 0,
      zmax: 1,
      hovertemplate: '%{y}<br>%{x}<br>Win rate: %{z:.1%}<extra></extra>'
    }], {
      margin: {l: 110, r: 20, t: 30, b: 60},
      xaxis: {tickangle: -25},
      yaxis: {automargin: true}
    }, {responsive: true});
  
    // Visual 5 – opening depth grouped bars
    const buckets = depth.buckets;
    const fastRates = depth.win_rates[0];
    const plateauRates = depth.win_rates[1];
  
    const traceFast = {
      x: buckets,
      y: fastRates,
      type: 'bar',
      name: 'Fast Improvers',
      marker: {color: '#4ea5ff'},
      hovertemplate: '%{x}<br>Fast: %{y:.1%}<extra></extra>'
    };
  
    const tracePlateau = {
      x: buckets,
      y: plateauRates,
      type: 'bar',
      name: 'Plateau Players',
      marker: {color: '#ff9d57'},
      hovertemplate: '%{x}<br>Plateau: %{y:.1%}<extra></extra>'
    };
  
    Plotly.newPlot('act2-opening-depth', [traceFast, tracePlateau], {
      barmode: 'group',
      margin: {l: 70, r: 20, t: 30, b: 80},
      xaxis: {tickangle: -15},
      yaxis: {
        title: 'Win Rate',
        tickformat: '.0%',
        range: [0, 1]
      },
      legend: {orientation: 'h', y: 1.12}
    }, {responsive: true});
  }
  
  /* ------------------------- ACT 3 ------------------------- */
  
  async function renderAct3() {
    const offbookWin = await loadJSON('data/act3_offbook_winrate.json');
    const offbookUpset = await loadJSON('data/act3_offbook_upset.json');
    const bounce = await loadJSON('data/act3_bounce_back.json');
    if (!offbookWin || !offbookUpset || !bounce) return;
  
    const buckets = offbookWin.buckets;
    const group1 = offbookWin.groups[0];
    const group2 = offbookWin.groups[1];
  
    // Visual 6 – off-book win rate
    const traceOWFast = {
      x: buckets,
      y: offbookWin.win_rates[0],
      type: 'scatter',
      mode: 'lines+markers',
      name: group1,
      marker: {size: 9},
      line: {shape: 'spline'},
      hovertemplate: '%{x}<br>' + group1 + ': %{y:.1%}<extra></extra>'
    };
  
    const traceOWPlateau = {
      x: buckets,
      y: offbookWin.win_rates[1],
      type: 'scatter',
      mode: 'lines+markers',
      name: group2,
      marker: {size: 9},
      line: {shape: 'spline'},
      hovertemplate: '%{x}<br>' + group2 + ': %{y:.1%}<extra></extra>'
    };
  
    Plotly.newPlot('act3-offbook-winrate', [traceOWFast, traceOWPlateau], {
      margin: {l: 70, r: 20, t: 30, b: 70},
      xaxis: {tickangle: -10},
      yaxis: {
        title: 'Win Rate',
        tickformat: '.0%',
        range: [0, 1]
      },
      legend: {orientation: 'h', y: 1.12}
    }, {responsive: true});
  
    // Visual 7 – off-book upset rate
    const traceUFast = {
      x: buckets,
      y: offbookUpset.upset_rates[0],
      type: 'scatter',
      mode: 'lines+markers',
      name: group1,
      marker: {size: 9},
      line: {shape: 'spline'},
      hovertemplate: '%{x}<br>' + group1 + ': %{y:.1%}<extra></extra>'
    };
  
    const traceUPlateau = {
      x: buckets,
      y: offbookUpset.upset_rates[1],
      type: 'scatter',
      mode: 'lines+markers',
      name: group2,
      marker: {size: 9},
      line: {shape: 'spline'},
      hovertemplate: '%{x}<br>' + group2 + ': %{y:.1%}<extra></extra>'
    };
  
    Plotly.newPlot('act3-offbook-upset', [traceUFast, traceUPlateau], {
      margin: {l: 70, r: 20, t: 30, b: 70},
      xaxis: {tickangle: -10},
      yaxis: {
        title: 'Upset Win Rate (vs Higher-Rated)',
        tickformat: '.0%',
        range: [0, 1]
      },
      legend: {orientation: 'h', y: 1.12}
    }, {responsive: true});
  
    // Visual 8 – bounce-back resilience
    const bbGroups = bounce.groups;
    const bbRates = bounce.bounce_rate;
  
    const bbTrace = {
      x: bbGroups,
      y: bbRates,
      type: 'bar',
      marker: {color: ['#4ea5ff', '#ff9d57']},
      hovertemplate: '%{x}<br>Win rate after a loss: %{y:.1%}<extra></extra>'
    };
  
    Plotly.newPlot('act3-bounce-back', [bbTrace], {
      margin: {l: 70, r: 20, t: 30, b: 60},
      yaxis: {
        title: 'Win Rate After a Loss',
        tickformat: '.0%',
        range: [0, 1]
      }
    }, {responsive: true});
  }
  
  /* ------------------------- SCROLL ANIMATIONS ------------------------- */
  
  function setupScrollAnimations() {
    const cards = document.querySelectorAll('.chart-card');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {threshold: 0.2}
    );
  
    cards.forEach(card => observer.observe(card));
  }
  
  /* ------------------------- BOOT ------------------------- */
  
  window.addEventListener('DOMContentLoaded', () => {
    renderAct1();
    renderAct2();
    renderAct3();
    setupScrollAnimations();
  });
  