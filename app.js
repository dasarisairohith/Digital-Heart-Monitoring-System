const slider = document.getElementById('bpmSlider');
const bpmValue = document.getElementById('bpmValue');
const heroBpm = document.getElementById('heroBpm');
const sliderOutput = document.getElementById('sliderOutput');
const zoneBar = document.getElementById('zoneBar');
const zoneText = document.getElementById('zoneText');
const twinState = document.getElementById('twinState');
const statusText = document.getElementById('statusText');
const sessionTime = document.getElementById('sessionTime');

function updateMonitor() {
  const bpm = Number(slider.value);
  bpmValue.textContent = bpm;
  heroBpm.textContent = bpm;
  sliderOutput.textContent = `${bpm} BPM`;
  const progress = Math.min(100, Math.max(8, ((bpm - 52) / 90) * 100));
  zoneBar.style.width = `${progress}%`;

  if (bpm < 70) {
    zoneText.textContent = 'Resting';
    twinState.textContent = 'quiet / grounded';
    zoneBar.style.background = '#b8d4a7';
    statusText.textContent = 'System connected';
  } else if (bpm <= 100) {
    zoneText.textContent = 'Balanced';
    twinState.textContent = 'steady / present';
    zoneBar.style.background = '#b8d4a7';
    statusText.textContent = 'System connected';
  } else {
    zoneText.textContent = bpm > 120 ? 'High stress' : 'Active';
    twinState.textContent = bpm > 120 ? 'alert / responsive' : 'energized / active';
    zoneBar.style.background = '#e9745d';
    statusText.textContent = bpm > 120 ? 'Elevated signal' : 'System connected';
  }
}

slider.addEventListener('input', updateMonitor);
let seconds = 18;
let minutes = 42;
setInterval(() => {
  seconds += 1;
  if (seconds === 60) { seconds = 0; minutes += 1; }
  sessionTime.textContent = `00:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}, 1000);
updateMonitor();
