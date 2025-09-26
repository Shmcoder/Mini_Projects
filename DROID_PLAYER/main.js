const tracks = [
  { id: 1, name: "Thaensudare", artist: "Sean Roldan", movie: "Lover", genre: " Indian Film Pop", duration: "2:24" },
  { id: 2, name: "Naatu Naatu", artist: "Rahul Sipligunj, Kaala Bhairava", movie: "RRR", genre: "Indian Classical", duration: "2:58" },
  { id: 3, name: "Blinding Lights", artist: "The Weeknd", movie: "None", genre: "Synth-pop", duration: "2:20" },
  { id: 4, name: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee", movie: "None", genre: "Reggaeton", duration: "2:48" },
  { id: 5, name: "Shallow", artist: "Lady Gaga, Bradley Cooper", movie: "A Star Is Born", genre: "Country Rock", duration: "3:00" }
];

const trackListElement = document.getElementById('trackList');

let currentTrackIndex = -1;
let isPlaying = false;
let playbackIntervals = {};
let isSeeking = false;
let isShuffle = false;
let shuffledTracks = [];

function initPlayer() {
  renderTrackList();
  setupEventListeners();
  togglePlay(0);
}

function renderTrackList() {
  trackListElement.innerHTML = '';

  tracks.forEach((track, index) => {
    const trackCard = document.createElement('div');
    trackCard.classList.add('track-card');
    trackCard.dataset.index = index;

    trackCard.innerHTML = `
      <div class="track-card-header">
        <div class="track-card-title">${track.name}</div>
        <div class="track-card-duration">${track.duration}</div>
      </div>
      <div class="track-card-details">
        <div class="track-card-artist">Artist: ${track.artist}</div>
        <div class="track-card-movie">Movie: ${track.movie !== 'None' ? track.movie : 'N/A'}</div>
        <div class="track-card-genre">${track.genre}</div>
      </div>
      <div class="track-card-player">
        <div class="player-controls">
          <i class="prev-btn">⏮️</i>
          <i class="play-btn">▶️</i>
          <i class="next-btn">⏭️</i>
          <i class="shuffle-btn">🔀</i>
        </div>
        <div class="progress-container">
          <div class="progress-bar"></div>
          <div class="time-display">
            <span class="current-time">00:00</span>
            <span class="duration">${track.duration}</span>
          </div>
        </div>
      </div>
    `;

    trackListElement.appendChild(trackCard);
  });
}

function setupEventListeners() {
  trackListElement.addEventListener('click', (e) => {
    const trackCard = e.target.closest('.track-card');
    if (!trackCard) return;

    const index = parseInt(trackCard.dataset.index);

    if (e.target.closest('.play-btn')) {
      togglePlay(index);
      return;
    } else if (e.target.closest('.prev-btn')) {
      playPrevious(index);
      return;
    } else if (e.target.closest('.next-btn')) {
      playNext(index);
      return;
    } else if (e.target.closest('.shuffle-btn')) {
      toggleShuffle();
      return;
    } else if (e.target.closest('.progress-bar')) {
      const progressBar = e.target.closest('.progress-bar');
      const rect = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      updateProgressBar(index, percent);
      return;
    }

    selectTrack(index);
  });

  trackListElement.addEventListener('mousedown', (e) => {
    if (e.target.closest('.progress-bar')) {
      isSeeking = true;
      const progressBar = e.target.closest('.progress-bar');
      const rect = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const index = parseInt(progressBar.closest('.track-card').dataset.index);
      updateProgressBar(index, percent);
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (isSeeking) {
      const progressBar = document.querySelector('.progress-bar');
      if (progressBar) {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const index = parseInt(progressBar.closest('.track-card').dataset.index);
        updateProgressBar(index, percent);
      }
    }
  });

  document.addEventListener('mouseup', () => {
    if (isSeeking) {
      isSeeking = false;
      if (isPlaying) {
        const index = currentTrackIndex;
        simulatePlayback(index);
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay(currentTrackIndex);
    } else if (e.code === 'ArrowLeft') {
      playPrevious(currentTrackIndex);
    } else if (e.code === 'ArrowRight') {
      playNext(currentTrackIndex);
    }
  });
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  if (isShuffle) {
    shuffledTracks = [...tracks].sort(() => Math.random() - 0.5);
  } else {
    shuffledTracks = [];
  }
}

function selectTrack(index) {
  if (currentTrackIndex >= 0 && currentTrackIndex !== index) {
    stopPlayback(currentTrackIndex);
  }

  document.querySelectorAll('.track-card').forEach(card => {
    card.classList.remove('active');
  });

  const selectedCard = document.querySelector(`.track-card[data-index="${index}"]`);
  if (selectedCard) {
    selectedCard.classList.add('active');
    selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  currentTrackIndex = index;

  const playBtn = selectedCard.querySelector('.play-btn');
  playBtn.innerHTML = `<i class="play-btn">▶️</i>`;

  updateProgressBar(index, 0);

  const currentTimeElement = selectedCard.querySelector('.current-time');
  currentTimeElement.textContent = '00:00';

  isPlaying = false;
}

function togglePlay(index) {
  if (currentTrackIndex !== index) {
    selectTrack(index);
  }

  isPlaying = !isPlaying;
  updatePlayButton(index);
  if (isPlaying) {
    simulatePlayback(index);
  } else {
    clearInterval(playbackIntervals[index]);
  }
}

function updatePlayButton(index) {
  const trackCard = document.querySelector(`.track-card[data-index="${index}"]`);
  const playBtn = trackCard.querySelector('.play-btn');
  playBtn.innerHTML = `<i class="icon">${isPlaying ? '⏸️' : '▶️'}</i>`;
}

function playPrevious(index) {
  stopPlayback(index);

  let newIndex;
  if (isShuffle && shuffledTracks.length > 0) {
    newIndex = tracks.indexOf(shuffledTracks[(shuffledTracks.indexOf(tracks[index]) - 1 + shuffledTracks.length) % shuffledTracks.length]);
  } else {
    newIndex = index <= 0 ? tracks.length - 1 : index - 1;
  }

  selectTrack(newIndex);
  togglePlay(newIndex);
}

function playNext(index) {
  stopPlayback(index);

  let newIndex;
  if (isShuffle && shuffledTracks.length > 0) {
    newIndex = tracks.indexOf(shuffledTracks[(shuffledTracks.indexOf(tracks[index]) + 1) % shuffledTracks.length]);
  } else {
    newIndex = (index + 1) % tracks.length;
  }

  selectTrack(newIndex);
  togglePlay(newIndex);
}

function updateProgressBar(index, percent) {
  const trackCard = document.querySelector(`.track-card[data-index="${index}"]`);
  const progressBar = trackCard.querySelector('.progress-bar');
  progressBar.style.setProperty('--progress', `${percent * 100}%`);

  if (percent > 0) {
    const track = tracks[index];
    const totalSeconds = convertTimeToSeconds(track.duration);
    const currentSeconds = Math.floor(totalSeconds * percent);
    const currentTimeElement = trackCard.querySelector('.current-time');
    currentTimeElement.textContent = formatTime(currentSeconds);
  }
}

function stopPlayback(index) {
  clearInterval(playbackIntervals[index]);

  const trackCard = document.querySelector(`.track-card[data-index="${index}"]`);
  if (trackCard) {
    const playBtn = trackCard.querySelector('.play-btn');
    playBtn.innerHTML = `<i class="icon">▶️</i>`;
  }
}

function simulatePlayback(index) {
  const trackCard = document.querySelector(`.track-card[data-index="${index}"]`);
  const currentTimeElement = trackCard.querySelector('.current-time');
  const track = tracks[index];
  const totalSeconds = convertTimeToSeconds(track.duration);
  let currentSeconds = convertTimeToSeconds(currentTimeElement.textContent);

  clearInterval(playbackIntervals[index]);

  playbackIntervals[index] = setInterval(() => {
    if (!isPlaying) {
      clearInterval(playbackIntervals[index]);
      return;
    }

    currentSeconds++;
    if (currentSeconds > totalSeconds) {
      clearInterval(playbackIntervals[index]);
      playNext(index);
      return;
    }

    currentTimeElement.textContent = formatTime(currentSeconds);

    const percent = currentSeconds / totalSeconds;
    updateProgressBar(index, percent);
  }, 1000);
}

function convertTimeToSeconds(timeString) {
  const [minutes, seconds] = timeString.split(':').map(Number);
  return minutes * 60 + seconds;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

document.addEventListener('DOMContentLoaded', initPlayer);