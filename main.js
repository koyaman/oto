const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.6;

const startButton = document.getElementById('start');
const downloadButton = document.getElementById('download');
const colorSchemeSelect = document.getElementById('colorScheme');
const shapeTypeSelect = document.getElementById('shapeType');
const sensitivityRange = document.getElementById('sensitivity');

let audioContext;
let analyser;
let dataArray;
let bufferLength;

startButton.addEventListener('click', async () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    source.connect(analyser);
  }
  visualize();
});

downloadButton.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'soundwave.png';
  link.href = canvas.toDataURL();
  link.click();
});

function visualize() {
  requestAnimationFrame(visualize);
  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const colorScheme = colorSchemeSelect.value;
  const shapeType = shapeTypeSelect.value;
  const sensitivity = sensitivityRange.value;

  // Example visualization logic
  for (let i = 0; i < bufferLength; i++) {
    const value = dataArray[i];
    const percent = value / 256;
    const height = canvas.height * percent;
    const offset = canvas.height - height - 1;
    const barWidth = canvas.width / bufferLength;
    const hue = i / bufferLength * 360;

    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(i * barWidth, offset, barWidth, height);
  }
}
