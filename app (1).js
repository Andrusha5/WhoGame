// ============================================================================
// 1. ИНИЦИАЛИЗАЦИЯ FIREBASE
// ============================================================================
const firebaseConfig = {
  apiKey: "AIzaSyDE6GU2eTql3LTBzJjmCCap6FQ56-STEr4",
  authDomain: "whogame-9d9ad.firebaseapp.com",
  projectId: "whogame-9d9ad",
  storageBucket: "whogame-9d9ad.firebasestorage.app",
  messagingSenderId: "406180903972",
  appId: "1:406180903972:web:5be3c921dbf7f0e78eacb1",
  measurementId: "G-GQRX2DTNQG"
};

if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
} else {
  alert("Ошибка загрузки сетевых библиотек!");
}

const auth = firebase.auth();
const db = firebase.database();

// ============================================================================
// 2. РЕЕСТР ПАКОВ И ФАЙЛОВ
// ============================================================================
const PACK_REGISTRY = {
  cars: [
    { name: "Audi", file: "audi.png" }, { name: "BMW", file: "bmw.png" },
    { name: "Bugatti", file: "bugati.png" }, { name: "Ferrari", file: "ferrari.png" },
    { name: "Ford", file: "ford.png" }, { name: "Geely", file: "geely.png" },
    { name: "Honda", file: "honda.png" }, { name: "Hyundai", file: "hundai.png" },
    { name: "Jeep", file: "jeep.png" }, { name: "Kia", file: "kia.png" },
    { name: "Lada", file: "lada.png" }, { name: "Lamborghini", file: "lamborghini.png" },
    { name: "Lexus", file: "lexus.png" }, { name: "Mercedes", file: "mercedes.png" },
    { name: "Peugeot", file: "peugeot.png" }, { name: "Porsche", file: "porsche.png" },
    { name: "Renault", file: "renault.png" }, { name: "Chevrolet", file: "shevrolet.png" },
    { name: "Skoda", file: "skoda.png" }, { name: "Subaru", file: "subaru.png" },
    { name: "Suzuki", file: "suzuki.png" }, { name: "Tesla", file: "tesla.png" },
    { name: "Toyota", file: "toyota.png" }, { name: "Volkswagen", file: "volkswagen.png" },
    { name: "Volvo", file: "volvo.png" }
  ],
  ufc: [
    { name: "Адесанья", file: "Adesanya.jfif" }, { name: "Чимаев", file: "Chimaev.jfif" },
    { name: "Конор", file: "Conor.jfif" }, { name: "Кормье", file: "DC.jfif" },
    { name: "Деметриус", file: "DJ.jfif" }, { name: "Евлоев", file: "Evloev.jfif" },
    { name: "Гейджи", file: "Gaethji.jfif" }, { name: "Гэрри", file: "Garry.jfif" },
    { name: "Холлоуэй", file: "Holloway.jfif" }, { name: "Махачев", file: "Islam.jfif" },
    { name: "Джон Джонс", file: "John.jfif" }, { name: "Хабиб", file: "Khabib.jfif" },
    { name: "Двалишвили", file: "Merab.jfif" }, { name: "Оливейра", file: "Oliveira.jfif" },
    { name: "О'Мэлли", file: "Omelli.jfif" }, { name: "Павлович", file: "Pavlovich.jfif" },
    { name: "Перейра", file: "Pereira.jfif" }, { name: "Порье", file: "Porier.jfif" },
    { name: "Сехудо", file: "Sejudo.jfif" }, { name: "Стрикленд", file: "Stricklend.jfif" },
    { name: "Усман", file: "Usman.jfif" }, { name: "Волкановски", file: "Volkanovski.jfif" },
    { name: "Уиттакер", file: "Wittaker.jfif" }, { name: "Ян", file: "Yan.jfif" },
    { name: "Забит", file: "Zabit.jfif" }
  ],
  emoji: [
    { name: "Эмодзи 1", file: "1.jfif" }, { name: "Эмодзи 2", file: "2.jfif" },
    { name: "Эмодзи 3", file: "3.jfif" }, { name: "Эмодзи 4", file: "4.jfif" },
    { name: "Эмодзи 5", file: "5.jfif" }, { name: "Эмодзи 6", file: "6.jfif" },
    { name: "Эмодзи 7", file: "7.jfif" }, { name: "Эмодзи 8", file: "8.jfif" },
    { name: "Эмодзи 9", file: "9.jfif" }, { name: "Эмодзи 10", file: "10.jfif" },
    { name: "Эмодзи 11", file: "11.jfif" }, { name: "Эмодзи 12", file: "12.jfif" },
    { name: "Эмодзи 13", file: "13.png" }, { name: "Эмодзи 14", file: "14.png" },
    { name: "Эмодзи 15", file: "15.jfif" }, { name: "Эмодзи 16", file: "16.png" },
    { name: "Эмодзи 17", file: "17.jfif" }, { name: "Эмодзи 18", file: "18.jfif" },
    { name: "Эмодзи 19", file: "19.jfif" }, { name: "Эмодзи 20", file: "20.jfif" },
    { name: "Эмодзи 21", file: "21.jfif" }, { name: "Эмодзи 22", file: "22.jfif" },
    { name: "Эмодзи 23", file: "23.jfif" }, { name: "Эмодзи 24", file: "24.jfif" },
    { name: "Эмодзи 25", file: "25.jfif" }
  ]
};

function getPackItems(packKey) {
  if (PACK_REGISTRY[packKey]) {
    return PACK_REGISTRY[packKey];
  }
  const items = [];
  for (let i = 1; i <= 25; i++) {
    items.push({ name: `#${i}`, file: `${i}.jpg` });
  }
  return items;
}

// ============================================================================
// 3. СИСТЕМНЫЕ ПЕРЕМЕННЫЕ
// ============================================================================
let myNickname = "";
let currentRoomId = null;
let isHost = false;
let currentAuthMode = "login";
let activePack = "cars";

let mySecretCardIdx = -1;
let opponentSecretCardIdx = -1;
let isMyTurn = false;
let gameTimerValue = 30;
let gameTimerInterval = null;
let cardsStateArray = [];
let gameStartedOnce = false;

const $ = (id) => document.getElementById(id);

function showScreen(screenId) {
  const screens = ["authScreen", "lobbyScreen", "roomScreen", "gameScreen"];
  screens.forEach(id => {
    const el = $(id);
    if (el) el.classList.toggle("hidden", id !== screenId);
  });
}

// ============================================================================
// 4. АВТОРИЗАЦИЯ
// ============================================================================
auth.onAuthStateChanged(async (user) => {
  if (user) {
    try {
      const snapshot = await db.ref(`users/${user.uid}/nickname`).once('value');
      if (snapshot.exists()) {
        myNickname = snapshot.val();
        $("userBadgeLabel").innerText = `👤 ${myNickname}`;
        showScreen("lobbyScreen");
      } else {
        showScreen("authScreen");
      }
    } catch (e) {
      showScreen("authScreen");
    }
  } else {
    showScreen("authScreen");
  }
});

function switchAuthMode(mode) {
  currentAuthMode = mode;
  $("tabLogin").classList.toggle("active", mode === "login");
  $("tabRegister").classList.toggle("active", mode === "register");
  $("authSubmitBtn").innerText = mode === "login" ? "Войти" : "Зарегистрироваться";
  $("authMessage").innerText = "";
}

async function handleAuth() {
  const nick = $("authNick").value.trim();
  const pass = $("authPass").value.trim();
  const msgEl = $("authMessage");
  msgEl.innerText = "";

  if (!nick || pass.length < 6) {
    msgEl.innerText = "Ник и пароль (мин. 6 символов) обязательны!";
    return;
  }

  $("authSubmitBtn").disabled = true;
  $("authSubmitBtn").innerText = "Загрузка...";

  const normalizedNick = nick.toLowerCase().replace(/\s+/g, '');

  try {
    if (currentAuthMode === "register") {
      const nicknameCheck = await db.ref(`taken_nicknames/${normalizedNick}`).once('value');
      if (nicknameCheck.exists()) {
        throw new Error("Этот никнейм уже занят!");
      }

      const userCredential = await auth.createUserWithEmailAndPassword(`${normalizedNick}@whogame.local`, pass);
      const uid = userCredential.user.uid;

      await db.ref(`taken_nicknames/${normalizedNick}`).set(uid);
      await db.ref(`users/${uid}`).set({ nickname: nick });

      myNickname = nick;
    } else {
      const userCredential = await auth.signInWithEmailAndPassword(`${normalizedNick}@whogame.local`, pass);
      const uid = userCredential.user.uid;

      const nickSnap = await db.ref(`users/${uid}/nickname`).once('value');
      myNickname = nickSnap.val();
    }

    $("userBadgeLabel").innerText = `👤 ${myNickname}`;
    showScreen("lobbyScreen");

  } catch (error) {
    msgEl.innerText = error.message;
  } finally {
    $("authSubmitBtn").disabled = false;
    $("authSubmitBtn").innerText = currentAuthMode === "login" ? "Войти" : "Зарегистрироваться";
  }
}

async function handleLogout() {
  await auth.signOut();
  myNickname = "";
  $("authNick").value = "";
  $("authPass").value = "";
  showScreen("authScreen");
}

// ============================================================================
// 5. КОМНАТЫ
// ============================================================================
async function createNewRoom() {
  isHost = true;
  gameStartedOnce = false;
  currentRoomId = Math.floor(1000 + Math.random() * 9000).toString();
  
  await db.ref(`rooms/${currentRoomId}`).set({
    roomId: currentRoomId,
    host: myNickname,
    guest: "",
    pack: "cars",
    state: "waiting",
    hostScore: 0,
    guestScore: 0
  });

  $("roomCodeDisplay").innerText = currentRoomId;
  $("packSelector").disabled = false;
  $("playerStatusBadge").innerText = "⏳ Ожидаем соперника... (1/2)";
  $("startMatchBtn").disabled = true;

  showScreen("roomScreen");
  listenRoom();
}

async function joinRoomByCode() {
  const code = $("roomJoinInput").value.trim();
  if (code.length !== 4) {
    $("lobbyMessage").innerText = "Введите 4-значный код!";
    return;
  }

  isHost = false;
  gameStartedOnce = false;
  currentRoomId = code;

  const snapshot = await db.ref(`rooms/${currentRoomId}`).once('value');
  if (!snapshot.exists()) {
    $("lobbyMessage").innerText = "Комната не найдена!";
    return;
  }

  await db.ref(`rooms/${currentRoomId}`).update({ guest: myNickname });
  $("roomCodeDisplay").innerText = currentRoomId;
  $("packSelector").disabled = true;
  $("playerStatusBadge").innerText = "⏳ Ожидаем запуск от создателя...";
  $("startMatchBtn").disabled = true;

  showScreen("roomScreen");
  listenRoom();
}

function listenRoom() {
  db.ref(`rooms/${currentRoomId}`).on('value', (snapshot) => {
    const room = snapshot.val();
    if (!room) return;

    if (!isHost && room.pack) {
      activePack = room.pack;
      $("packSelector").value = room.pack;
    }

    if (room.guest) {
      if (isHost) {
        $("playerStatusBadge").innerText = `✅ Подключен: ${room.guest}`;
        $("startMatchBtn").disabled = false;
      } else {
        $("playerStatusBadge").innerText = `✅ Вы в комнате у ${room.host}`;
      }
    }

    if (room.state === "playing") {
      activePack = room.pack || "cars";
      if (!gameStartedOnce) {
        gameStartedOnce = true;
        setupGameScene(room);
      } else {
        updateGameState(room);
      }
    }
  });
}

function onPackSelectionChanged() {
  if (isHost) {
    activePack = $("packSelector").value;
    db.ref(`rooms/${currentRoomId}`).update({ pack: activePack });
  }
}

function startMatch() {
  if (isHost) {
    db.ref(`rooms/${currentRoomId}`).update({
      state: "playing",
      pack: activePack
    });
  }
}

// ============================================================================
// 6. ИГРОВОЕ ПОЛЕ (ГЕНЕРАЦИЯ 25 КАРТОЧЕК)
// ============================================================================
function setupGameScene(room) {
  showScreen("gameScreen");
  clearInterval(gameTimerInterval);

  mySecretCardIdx = -1;
  opponentSecretCardIdx = -1;
  isMyTurn = false;

  $("gameScoreLabel").innerText = `${room.hostScore || 0} : ${room.guestScore || 0}`;
  $("gamePhaseLabel").innerText = "ФАЗА ВЫБОРА";
  $("gameTurnLabel").innerText = "НАЖМИТЕ НА СВОЮ ТАЙНУЮ КАРТУ";

  const grid = $("boardGrid");
  grid.innerHTML = "";
  cardsStateArray = [];

  const items = getPackItems(activePack);

  items.forEach((item, index) => {
    cardsStateArray.push({ closed: false, selected: false });

    const card = document.createElement('div');
    card.className = 'card-item';
    card.id = `card-${index + 1}`;
    card.onclick = () => onCardClicked(index + 1);

    const primarySrc = `packs/${activePack}/${item.file}`;

    card.innerHTML = `
      <img src="${primarySrc}" onerror="handleImgError(this, '${activePack}', ${index + 1})" alt="${item.name}">
      <div class="card-label">${item.name}</div>
    `;
    grid.appendChild(card);
  });

  startSelectionTimer();
  listenToChat();
}

function handleImgError(imgElement, packKey, index) {
  const fallbacks = [".png", ".jfif", ".jpg", ".webp"];
  let step = parseInt(imgElement.getAttribute("data-error-step") || "0");

  if (step < fallbacks.length) {
    imgElement.setAttribute("data-error-step", (step + 1).toString());
    imgElement.src = `packs/${packKey}/${index}${fallbacks[step]}`;
  } else {
    imgElement.src = `https://via.placeholder.com/150/141d2f/00f2fe?text=%23${index}`;
  }
}

function onCardClicked(idx) {
  const items = getPackItems(activePack);
  const cardData = items[idx - 1];

  // Выбор тайной карты
  if (mySecretCardIdx === -1 && $("gamePhaseLabel").innerText === "ФАЗА ВЫБОРА") {
    mySecretCardIdx = idx;
    $("secretCardImg").innerHTML = `<img src="packs/${activePack}/${cardData.file}" style="width:100%;height:100%;object-fit:cover;">`;
    $("secretCardName").innerText = cardData.name;

    const updateData = {};
    updateData[isHost ? "hostCard" : "guestCard"] = idx;
    db.ref(`rooms/${currentRoomId}`).update(updateData);
    return;
  }

  // Игра
  if ($("gamePhaseLabel").innerText !== "ИГРА") return;
  if (cardsStateArray[idx - 1].closed) return;
  if (!isMyTurn) return;

  cardsStateArray[idx - 1].selected = !cardsStateArray[idx - 1].selected;
  $("card-" + idx).classList.toggle("selected", cardsStateArray[idx - 1].selected);

  const selectedCount = cardsStateArray.filter(c => c.selected).length;
  $("closeCardsBtn").disabled = selectedCount === 0;
  $("makeGuessBtn").disabled = selectedCount !== 1;
}

// ============================================================================
// 7. ТАЙМЕРЫ И ХОДЫ
// ============================================================================
function startSelectionTimer() {
  gameTimerValue = 30;
  $("gameTimerLabel").innerText = gameTimerValue;

  gameTimerInterval = setInterval(() => {
    gameTimerValue--;
    $("gameTimerLabel").innerText = gameTimerValue;

    if (gameTimerValue <= 0) {
      clearInterval(gameTimerInterval);
      if (mySecretCardIdx === -1) {
        onCardClicked(Math.floor(Math.random() * 25) + 1);
      }
      startTurnSystem();
    }
  }, 1000);
}

function startTurnSystem() {
  $("gamePhaseLabel").innerText = "ИГРА";
  isMyTurn = isHost;
  updateTurnVisuals();

  if (isHost) {
    db.ref(`rooms/${currentRoomId}`).update({ turn: "host" });
  }
  startTurnTimer();
}

function startTurnTimer() {
  clearInterval(gameTimerInterval);
  gameTimerValue = 60;
  $("gameTimerLabel").innerText = gameTimerValue;

  gameTimerInterval = setInterval(() => {
    gameTimerValue--;
    $("gameTimerLabel").innerText = gameTimerValue;

    if (gameTimerValue <= 0) {
      clearInterval(gameTimerInterval);
      if (isMyTurn) confirmClosedCards();
    }
  }, 1000);
}

function updateTurnVisuals() {
  $("gameTurnLabel").innerText = isMyTurn ? "ВАШ ХОД! (Исключите карты или угадайте)" : "ХОД СОПЕРНИКА...";
  $("gameTurnLabel").style.color = isMyTurn ? "var(--cyan)" : "var(--red)";
  $("closeCardsBtn").disabled = true;
  $("makeGuessBtn").disabled = true;
}

function updateGameState(room) {
  opponentSecretCardIdx = isHost ? room.guestCard : room.hostCard;

  if (room.turn) {
    isMyTurn = (isHost && room.turn === "host") || (!isHost && room.turn === "guest");
    updateTurnVisuals();
  }

  if (room.roundWinner) {
    showRoundResult(room.roundWinner);
  }
}

function confirmClosedCards() {
  if (!isMyTurn) return;

  cardsStateArray.forEach((state, i) => {
    if (state.selected) {
      state.closed = true;
      state.selected = false;
      const el = $("card-" + (i + 1));
      if (el) {
        el.classList.remove("selected");
        el.classList.add("closed");
      }
    }
  });

  db.ref(`rooms/${currentRoomId}`).update({
    turn: isHost ? "guest" : "host"
  });

  startTurnTimer();
}

function triggerFinalGuess() {
  if (!isMyTurn) return;

  const guessedCardIdx = cardsStateArray.findIndex(c => c.selected) + 1;
  if (guessedCardIdx <= 0) return;

  const isCorrect = (guessedCardIdx === opponentSecretCardIdx);
  const winnerSymbol = isCorrect ? (isHost ? "host" : "guest") : (isHost ? "guest" : "host");

  db.ref(`rooms/${currentRoomId}`).update({
    roundWinner: winnerSymbol
  });
}

function showRoundResult(winner) {
  clearInterval(gameTimerInterval);
  const modal = $("gameResultModal");
  const iWon = (isHost && winner === "host") || (!isHost && winner === "guest");

  $("modalEmoji").innerText = iWon ? "🏆" : "😢";
  $("modalTitle").innerText = iWon ? "ПОБЕДА!" : "ПОРАЖЕНИЕ";
  $("modalDesc").innerText = iWon ? "Вы угадали карту соперника!" : "Соперник победил в этом раунде!";

  modal.classList.add("active");
}

async function restartNewRound() {
  if (!isHost) {
    alert("Ожидайте, пока создатель перезапустит раунд!");
    return;
  }

  const roomRef = db.ref(`rooms/${currentRoomId}`);
  const snap = await roomRef.once('value');
  const room = snap.val();

  let hScore = room.hostScore || 0;
  let gScore = room.guestScore || 0;

  if (room.roundWinner === "host") hScore++;
  else gScore++;

  gameStartedOnce = false;

  await roomRef.update({
    state: "playing",
    hostCard: -1,
    guestCard: -1,
    turn: "host",
    roundWinner: null,
    hostScore: hScore,
    guestScore: gScore
  });

  $("gameResultModal").classList.remove("active");
}

function sendChatMessage() {
  const input = $("chatInput");
  const text = input.value.trim();
  if (!text || !currentRoomId) return;

  db.ref(`rooms/${currentRoomId}/chat`).push({
    sender: myNickname,
    text: text
  });

  input.value = "";
}

function listenToChat() {
  const chatBox = $("chatMessages");
  db.ref(`rooms/${currentRoomId}/chat`).on('child_added', (snap) => {
    const msg = snap.val();
    const div = document.createElement("div");
    div.innerHTML = `<strong>${msg.sender}:</strong> ${msg.text}`;
    div.style.padding = "2px 0";
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}
