const games = [
  {
    title: "Sandboxels",
    path: "sandboxels/",
    accent: "#42d392",
  },
  {
    title: "Basketball Legends 2020",
    path: "games/basketball-legends-2020/",
    thumbnail: "games/basketball-legends-2020/assets/images/logo.png",
  },
  {
    title: "Retro Bowl",
    path: "games/retro-bowl/",
    thumbnail: "games/retro-bowl/img/splash.png",
  },
  {
    title: "Soccer Random",
    path: "games/soccer-random/",
    thumbnail: "games/soccer-random/images/titlebg-sheet0.png",
  },
  {
    title: "Five Nights at Epstein's",
    path: "games/five-nights-at-epstein/",
    thumbnail: "games/five-nights-at-epstein/assets/images/menubackground.png",
  },
  {
    title: "Moto.js",
    path: "games/moto-js/",
    thumbnail: "games/moto-js/assets/img/title.png",
    accent: "#f97316",
  },
];

const gameGrid = document.querySelector("#gameGrid");
const searchInput = document.querySelector("#searchInput");
const gameCount = document.querySelector("#gameCount");
const emptyState = document.querySelector("#emptyState");
const modal = document.querySelector("#gameModal");
const modalPanel = document.querySelector(".modal-panel");
const modalTitle = document.querySelector("#modalTitle");
const gameFrame = document.querySelector("#gameFrame");
const closeButton = document.querySelector("#closeButton");
const fullscreenButton = document.querySelector("#fullscreenButton");
const iframeWrap = document.querySelector("#iframeWrap");
const muteButtons = document.querySelectorAll("[data-mute-toggle]");

const MUTE_STORAGE_KEY = "gameHubMuted";
let fallbackMuteState = true;
let isMuted = readStoredMute();

function readStoredMute() {
  try {
    const storedMute = localStorage.getItem(MUTE_STORAGE_KEY);
    return storedMute === null ? true : storedMute === "true";
  } catch (error) {
    return fallbackMuteState;
  }
}

function saveStoredMute(nextMuted) {
  fallbackMuteState = nextMuted;

  try {
    localStorage.setItem(MUTE_STORAGE_KEY, String(nextMuted));
  } catch (error) {}
}

function updateMuteButtons() {
  muteButtons.forEach((button) => {
    button.textContent = isMuted ? "Muted" : "Mute";
    button.setAttribute("aria-pressed", String(isMuted));
    button.setAttribute("aria-label", isMuted ? "Sound is muted" : "Mute sound");
    button.classList.toggle("is-muted", isMuted);
  });
}

function applyMuteToFrame() {
  const frameWindow = gameFrame.contentWindow;

  if (!frameWindow) {
    return;
  }

  frameWindow.postMessage(
    {
      type: "game-hub-mute",
      muted: isMuted,
    },
    "*",
  );

  try {
    if (frameWindow.GameHubMute) {
      frameWindow.GameHubMute.setMuted(isMuted);
    }

    frameWindow.document.querySelectorAll("audio, video").forEach((media) => {
      media.muted = isMuted;
      media.volume = isMuted ? 0 : 1;
    });
  } catch (error) {}
}

function setMuteState(nextMuted) {
  isMuted = Boolean(nextMuted);
  saveStoredMute(isMuted);
  updateMuteButtons();
  applyMuteToFrame();
}

function toggleMute() {
  setMuteState(!isMuted);
}

function createThumbnail(title, accent) {
  const initials = title
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${accent}"/>
          <stop offset="100%" stop-color="#111827"/>
        </linearGradient>
      </defs>
      <rect width="640" height="400" fill="url(#bg)"/>
      <circle cx="520" cy="82" r="118" fill="rgba(255,255,255,0.14)"/>
      <circle cx="102" cy="336" r="148" fill="rgba(0,0,0,0.18)"/>
      <rect x="74" y="74" width="492" height="252" rx="28" fill="rgba(10,14,22,0.56)" stroke="rgba(255,255,255,0.18)" stroke-width="4"/>
      <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="110" font-weight="800">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function renderGames(gameList) {
  gameGrid.replaceChildren();

  gameList.forEach((game) => {
    const card = document.createElement("button");
    card.className = "game-card";
    card.type = "button";
    card.setAttribute("aria-label", `Open ${game.title}`);

    const thumbnail = document.createElement("img");
    thumbnail.className = "thumb";
    thumbnail.src = game.thumbnail || createThumbnail(game.title, game.accent || "#42d392");
    thumbnail.alt = "";
    thumbnail.loading = "lazy";

    const title = document.createElement("h3");
    title.className = "game-title";
    title.textContent = game.title;

    card.append(thumbnail, title);
    card.addEventListener("click", () => openGame(game));
    gameGrid.append(card);
  });

  gameCount.textContent = `${gameList.length} ${gameList.length === 1 ? "game" : "games"}`;
  emptyState.hidden = gameList.length > 0;
}

function filterGames() {
  const query = searchInput.value.trim().toLowerCase();
  const filteredGames = games.filter((game) => game.title.toLowerCase().includes(query));
  renderGames(filteredGames);
}

function openGame(game) {
  modalTitle.textContent = game.title;
  gameFrame.src = game.path;
  applyMuteToFrame();
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-lock");
  closeButton.focus();
}

async function closeGame() {
  if (document.fullscreenElement) {
    await document.exitFullscreen().catch(() => {});
  }

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modalPanel.classList.remove("is-expanded");
  document.body.classList.remove("modal-lock");
  gameFrame.src = "";
}

async function toggleFullscreen() {
  if (document.fullscreenElement) {
    await document.exitFullscreen().catch(() => {});
    modalPanel.classList.remove("is-expanded");
    return;
  }

  modalPanel.classList.add("is-expanded");

  if (iframeWrap.requestFullscreen) {
    await iframeWrap.requestFullscreen().catch(() => {
      modalPanel.classList.add("is-expanded");
    });
  }
}

searchInput.addEventListener("input", filterGames);
closeButton.addEventListener("click", closeGame);
fullscreenButton.addEventListener("click", toggleFullscreen);
gameFrame.addEventListener("load", applyMuteToFrame);
muteButtons.forEach((button) => button.addEventListener("click", toggleMute));

modal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-modal]")) {
    closeGame();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeGame();
  }
});

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    modalPanel.classList.remove("is-expanded");
  }
});

window.addEventListener("storage", (event) => {
  if (event.key === MUTE_STORAGE_KEY) {
    isMuted = event.newValue === "true";
    updateMuteButtons();
    applyMuteToFrame();
  }
});

updateMuteButtons();
renderGames(games);
