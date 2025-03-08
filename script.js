// Efeito de Digitação nas Mensagens
const messages = document.querySelectorAll('.messages p');
let index = 0;

function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

messages.forEach((message, i) => {
  setTimeout(() => {
    typeWriter(message, message.textContent);
  }, i * 2000); // Atraso entre cada mensagem
});

// Surpresa com Confetes
const surpresaBtn = document.getElementById('surpresaBtn');
const surpresaText = document.getElementById('surpresaText');

surpresaBtn.addEventListener('click', () => {
  surpresaText.style.display = 'block';
  surpresaText.classList.add('animate__bounceIn');
  surpresaBtn.textContent = 'Surpresa revelada! 🎉';

  // Efeito de confetes
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
});

// Player de Música
const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const volumeControl = document.getElementById('volumeControl');
const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');

// Play/Pause
playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    startAudioAnalysis(); // Inicia a análise de áudio após o play
  } else {
    audio.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
});

// Barra de Progresso
audio.addEventListener('timeupdate', () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progress;

  // Atualiza o tempo atual
  const minutes = Math.floor(audio.currentTime / 60);
  const seconds = Math.floor(audio.currentTime % 60);
  currentTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Avançar/Retroceder música
progressBar.addEventListener('input', () => {
  const seekTime = (progressBar.value / 100) * audio.duration;
  audio.currentTime = seekTime;
});

// Volume
volumeControl.addEventListener('input', () => {
  audio.volume = volumeControl.value;
});

// Duração total da música
audio.addEventListener('loadedmetadata', () => {
  const totalMinutes = Math.floor(audio.duration / 60);
  const totalSeconds = Math.floor(audio.duration % 60);
  duration.textContent = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
});

// Quando a música terminar
audio.addEventListener('ended', () => {
  playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
});

// Áudio de Fundo
const backgroundAudio = document.getElementById('backgroundAudio');
backgroundAudio.volume = 0.3; // Volume baixo
backgroundAudio.play();

// Mensagem Personalizada no Título da Aba
const titles = ["❤️ Para Minha Namorada ❤️", "Feliz Dia das Mulheres!"];
let titleIndex = 0;

setInterval(() => {
  document.title = titles[titleIndex];
  titleIndex = (titleIndex + 1) % titles.length;
}, 2000);

// Inicializa Partículas
particlesJS.load('particles-js', 'particles.json', function () {
  console.log('Partículas carregadas!');
});

// Sincronização das Partículas com o Som
let audioContext, analyser, source;

function startAudioAnalysis() {
  // Cria o contexto de áudio e o analisador
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  source = audioContext.createMediaElementSource(audio);

  // Conecta o áudio ao analisador
  source.connect(analyser);
  analyser.connect(audioContext.destination);

  // Configura o analisador
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // Função para atualizar as partículas com base no áudio
  function updateParticles() {
    analyser.getByteFrequencyData(dataArray);

    // Calcula a média do volume
    let volume = 0;
    for (let i = 0; i < bufferLength; i++) {
      volume += dataArray[i];
    }
    volume /= bufferLength;

    // Ajusta o tamanho das partículas com base no volume
    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS.particles) {
      window.pJSDom[0].pJS.particles.array.forEach((particle) => {
        particle.size = 10 + (volume / 10); // Ajuste o tamanho conforme o volume
      });
    }

    requestAnimationFrame(updateParticles);
  }

  // Inicia a sincronização
  updateParticles();
}