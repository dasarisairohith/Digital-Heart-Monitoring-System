const slider = document.getElementById('bpmSlider');
const bpmValue = document.getElementById('bpmValue');
const heroBpm = document.getElementById('heroBpm');
const sliderOutput = document.getElementById('sliderOutput');
const zoneBar = document.getElementById('zoneBar');
const zoneText = document.getElementById('zoneText');
const twinState = document.getElementById('twinState');
const statusText = document.getElementById('statusText');
const sessionTime = document.getElementById('sessionTime');
const trendLine = document.getElementById('trendLine');
const trendArea = document.getElementById('trendArea');
const averageBpm = document.getElementById('averageBpm');
const trendDirection = document.getElementById('trendDirection');
const variabilityText = document.getElementById('variabilityText');
const variabilityBadge = document.getElementById('variabilityBadge');
const safetyText = document.getElementById('safetyText');
const safetyBadge = document.getElementById('safetyBadge');
const deviceBattery = document.getElementById('deviceBattery');
const deviceLatency = document.getElementById('deviceLatency');

let samples = [72, 75, 74, 77, 76, 79, 77, 78, 80, 78, 76, 78];
let seconds = 18;
let minutes = 42;

function getZone(bpm) {
  if (bpm < 70) return { label: 'Resting', state: 'quiet / grounded', color: '#b8d4a7' };
  if (bpm <= 100) return { label: 'Balanced', state: 'steady / present', color: '#b8d4a7' };
  return { label: bpm > 120 ? 'High stress' : 'Active', state: bpm > 120 ? 'alert / responsive' : 'energized / active', color: '#e9745d' };
}

function renderTrend() {
  const width = 680;
  const height = 180;
  const min = 45;
  const max = 150;
  const points = samples.map((value, index) => {
    const x = (index / (samples.length - 1)) * width;
    const y = height - ((value - min) / (max - min)) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const path = `M ${points.join(' L ')}`;
  trendLine.setAttribute('d', path);
  trendArea.setAttribute('d', `${path} L ${width},${height} L 0,${height} Z`);

  const average = Math.round(samples.reduce((sum, value) => sum + value, 0) / samples.length);
  const spread = Math.max(...samples) - Math.min(...samples);
  const change = samples[samples.length - 1] - samples[0];
  averageBpm.textContent = average;
  trendDirection.textContent = change > 3 ? 'rising' : change < -3 ? 'falling' : 'stable';
  variabilityText.textContent = spread > 25 ? 'High variation detected' : spread > 14 ? 'Moderate variation detected' : 'Low variation detected';
  variabilityBadge.textContent = spread > 25 ? 'WATCH' : spread > 14 ? 'ACTIVE' : 'CALM';
  variabilityBadge.className = spread > 14 ? 'good-text caution-text' : 'good-text';
  safetyText.textContent = samples.some((value) => value > 125) ? 'Elevated pattern detected' : 'No unusual pattern found';
  safetyBadge.textContent = samples.some((value) => value > 125) ? 'REVIEW' : 'CLEAR';
  safetyBadge.className = samples.some((value) => value > 125) ? 'good-text caution-text' : 'good-text';
}

function updateMonitor() {
  const bpm = Number(slider.value);
  const zone = getZone(bpm);
  bpmValue.textContent = bpm;
  heroBpm.textContent = bpm;
  sliderOutput.textContent = `${bpm} BPM`;
  zoneBar.style.width = `${Math.min(100, Math.max(8, ((bpm - 52) / 90) * 100))}%`;
  zoneBar.style.background = zone.color;
  zoneText.textContent = zone.label;
  twinState.textContent = zone.state;
  statusText.textContent = bpm > 120 ? 'Elevated signal' : 'System connected';
  samples.push(bpm);
  if (samples.length > 24) samples.shift();
  renderTrend();
  deviceLatency.textContent = `${Math.max(28, 64 - Math.abs(bpm - 78))} ms`;
  deviceBattery.textContent = `${Math.max(12, 87 - Math.floor(samples.length / 3))}%`;
}

slider.addEventListener('input', updateMonitor);
document.getElementById('resetSession').addEventListener('click', () => {
  samples = [72, 75, 74, 77, 76, 79, 77, 78, 80, 78, 76, 78];
  slider.value = 78;
  updateMonitor();
});

setInterval(() => {
  seconds += 1;
  if (seconds === 60) { seconds = 0; minutes += 1; }
  sessionTime.textContent = `00:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}, 1000);

updateMonitor();
