// ============================================================================
// 1. ИНИЦИАЛИЗАЦИЯ FIREBASE (ЗАМЕНИ НА СВОИ КЛЮЧИ ИЗ СООБЩЕНИЯ!)
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

// Запуск Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// ============================================================================
// 2. СИСТЕМНЫЕ ПЕРЕМЕННЫЕ ИГРЫ
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
let cardsStateArray = []; // { closed: bool, selected: bool }

// Помощник для быстрого выбора элементов
const $ = (id) => document.getElementById(id);

// Смена игровых экранов
function showScreen(screenId) {
  const screens = ["authScreen", "lobbyScreen", "roomScreen", "gameScreen"];
  screens.forEach(id => $(id).classList.toggle("hidden", id !== screenId));
}

// ============================================================================
// 3. АВТОРИЗАЦИЯ: ВХОД, РЕГИСТРАЦИЯ, ТЕХНИЧЕСКАЯ УНИКАЛЬНОСТЬ
// ============================================================================

// Проверка сохраненной сессии в браузере при входе
auth.onAuthStateChanged(async (user) => {
  if (user) {
    // Получаем реальный ник пользователя из базы данных
    const snapshot = await db.ref(`users/${user.uid}/nickname`).once('value');
    if (snapshot.exists()) {
      myNickname = snapshot.val();
      $("userBadgeLabel").innerText = `👤 ${myNickname}`;
      showScreen("lobbyScreen");
    } else {
      handleLogout();
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
    msgEl.innerText = "Ник не должен быть пустым, а пароль — минимум 6 символов!";
    return;
  }

  $("authSubmitBtn").disabled = true;
  $("authSubmitBtn").innerText = "Загрузка...";

  const normalizedNick = nick.toLowerCase();

  try {
    if (currentAuthMode === "register") {
      // 1. Проверяем в Базе Данных, занят ли ник
      const nicknameCheck = await db.ref(`taken_nicknames/${normalizedNick}`).once('value');
      if (nicknameCheck.exists()) {
        throw new Error("Этот никнейм уже занят! Выберите другой.");
      }

      // 2. Создаем пользователя в Firebase Auth с использованием скрытого тех. адреса
      const userCredential = await auth.createUserWithEmailAndPassword(`${normalizedNick}@whogame.local`, pass);
      const uid = userCredential.user.uid;

      // 3. Записываем ник в базу
      await db.ref(`taken_nicknames/${normalizedNick}`).set(uid);
      await db.ref(`users/${uid}`).set({ nickname: nick });

      myNickname = nick;
    } else {
      // Обычный вход по нику и паролю
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
// 4. СЕТЕВОЙ ЦИКЛ: СОЗДАНИЕ И ВХОД В КОМНАТУ
// ============================================================================

async function createNewRoom() {
  isHost = true;
  currentRoomId = Math.floor(1000 + Math.random() * 9000).toString();
  
  const roomData = {
    roomId: currentRoomId,
    host: myNickname,
    guest: "",
    pack: "cars",
    state: "waiting",
    hostScore: 0,
    guestScore: 0
  };

  await db.ref(`rooms/${currentRoomId}`).set(roomData);
  $("roomCodeDisplay").innerText = currentRoomId;
  $("packSelector").disabled = false;
  $("playerStatusBadge").innerText = "⏳ Ожидаем соперника... (1/2)";
  $("startMatchBtn").disabled = true;

  showScreen("roomScreen");
  listenToRoomEvents();
}

async function joinRoomByCode() {
  const code = $("roomJoinInput").value.trim();
  if (code.length !== 4) {
    $("lobbyMessage").innerText = "Введите правильный 4-значный код!";
    return;
  }

  isHost = false;
  currentRoomId = code;

  const roomRef = db.ref(`rooms/${currentRoomId}`);
  const snapshot = await roomRef.once('value');

  if (!snapshot.exists()) {
    $("lobbyMessage").innerText = "Комната не найдена!";
    return;
  }

  const room = snapshot.val();
  if (room.guest && room.guest !== myNickname) {
    $("lobbyMessage").innerText = "Комната уже заполнена!";
    return;
  }

  await roomRef.update({ guest: myNickname });
  $("roomCodeDisplay").innerText = currentRoomId;
  $("packSelector").disabled = true;
  $("playerStatusBadge").innerText = "⏳ Ожидаем запуска игры хостом...";
  $("startMatchBtn").disabled = true;

  showScreen("roomScreen");
  listenToRoomEvents();
}

function listenToRoomEvents() {
  const roomRef = db.ref(`rooms/${currentRoomId}`);
  roomRef.on('value', (snapshot) => {
    const room = snapshot.val();
    if (!room) return;

    // Синхронизация выбора пака
    if (!isHost) {
      activePack = room.pack;
      $("packSelector").value = room.pack;
    }

    // Соперник зашел в комнату
    if (room.guest) {
      if (isHost) {
        $("playerStatusBadge").innerText = `✅ Соперник ${room.guest} вошел!`;
        $("startMatchBtn").disabled = false;
      } else {
        $("playerStatusBadge").innerText = `✅ Вы подключились к ${room.host}. Ожидание старта...`;
      }
    }

    // Игра началась!
    if (room.state === "playing") {
      setupGameScene(room);
    }
  });
}

function onPackSelectionChanged() {
  if (!isHost) return;
  activePack = $("packSelector").value;
  db.ref(`rooms/${currentRoomId}`).update({ pack: activePack });
}

function startMatch() {
  if (!isHost) return;
  db.ref(`rooms/${currentRoomId}`).update({ state: "playing" });
}

// ============================================================================
// 5. ИГРОВОЙ ПРОЦЕСС: ГЕНЕРАЦИЯ СЕТКИ, ТАЙМЕРЫ, ПРОВЕРКА ОТВЕТОВ
// ============================================================================

function setupGameScene(room) {
  showScreen("gameScreen");
  clearInterval(gameTimerInterval);

  mySecretCardIdx = -1;
  opponentSecretCardIdx = -1;
  isMyTurn = false;

  $("gameScoreLabel").innerText = `${room.hostScore} : ${room.guestScore}`;
  $("gamePhaseLabel").innerText = "ФАЗА ВЫБОРА";
  $("gameTurnLabel").innerText = "НАЖМИТЕ НА СВОЮ ТАЙНУЮ КАРТУ";

  // Генерируем 25 карт
  const grid = $("boardGrid");
  grid.innerHTML = "";
  cardsStateArray = [];

  for (let i = 1; i <= 25; i++) {
    cardsStateArray.push({ closed: false, selected: false });

    const card = document.createElement('div');
    card.className = 'card-item';
    card.id = `card-${i}`;
    card.onclick = () => onCardClicked(i);

    // Ссылка на картинку из папки Packs на GitHub
    const imgUrl = `Packs/${activePack}/${i}.jpg`;

    card.innerHTML = `
      <img src="${imgUrl}" onerror="this.src='https://via.placeholder.com/150/111827/00f2fe?text=${i}'">
      <div class="card-label">Карта #${i}</div>
    `;
    grid.appendChild(card);
  }

  startSelectionTimer();
  listenToGameUpdates();
}

function onCardClicked(idx) {
  // Выбор карты перед игрой
  if (mySecretCardIdx === -1 && $("gamePhaseLabel").innerText === "ФАЗА ВЫБОРА") {
    mySecretCardIdx = idx;
    $("secretCardImg").innerHTML = `<img src="Packs/${activePack}/${idx}.jpg" onerror="this.innerHTML='❓'">`;
    $("secretCardName").innerText = `Карта #${idx}`;

    // Отправляем секретную карту в базу данных
    const updateData = {};
    updateData[isHost ? "hostCard" : "guestCard"] = idx;
    db.ref(`rooms/${currentRoomId}`).update(updateData);
    return;
  }

  // Клики во время игры
  if ($("gamePhaseLabel").innerText !== "ИГРА") return;
  if (cardsStateArray[idx - 1].closed) return;

  // Менять выделение можно только в свой ход
  if (!isMyTurn) return;

  cardsStateArray[idx - 1].selected = !cardsStateArray[idx - 1].selected;
  $("card-" + idx).classList.toggle("selected", cardsStateArray[idx - 1].selected);

  // Обновляем состояние кнопок
  const selectedCount = cardsStateArray.filter(c => c.selected).length;
  $("closeCardsBtn").disabled = selectedCount === 0;
  $("makeGuessBtn").disabled = selectedCount !== 1;
}

// 30 секунд на выбор карты
function startSelectionTimer() {
  gameTimerValue = 30;
  $("gameTimerLabel").innerText = gameTimerValue;

  gameTimerInterval = setInterval(() => {
    gameTimerValue--;
    $("gameTimerLabel").innerText = gameTimerValue;

    if (gameTimerValue <= 0) {
      clearInterval(gameTimerInterval);
      
      // Если игрок ничего не выбрал сам — даем случайную
      if (mySecretCardIdx === -1) {
        onCardClicked(Math.floor(Math.random() * 25) + 1);
      }

      startTurnSystem();
    }
  }, 1000);
}

// Переход в фазу ходов
function startTurnSystem() {
  $("gamePhaseLabel").innerText = "ИГРА";
  
  // По умолчанию первый ходит Хост
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
      if (isMyTurn) {
        // Пропускаем ход / автозакрытие
        confirmClosedCards();
      }
    }
  }, 1000);
}

function updateTurnVisuals() {
  $("gameTurnLabel").innerText = isMyTurn ? "ВАШ ХОД! Исключите карты или сделайте догадку" : "ХОД СОПЕРНИКА...";
  $("gameTurnLabel").style.color = isMyTurn ? "var(--cyan)" : "var(--red)";
  
  $("closeCardsBtn").disabled = true;
  $("makeGuessBtn").disabled = true;
}

function listenToGameUpdates() {
  db.ref(`rooms/${currentRoomId}`).on('value', (snapshot) => {
    const room = snapshot.val();
    if (!room) return;

    // Синхронизация секретных карт игроков
    opponentSecretCardIdx = isHost ? room.guestCard : room.hostCard;

    // Переключение ходов
    if (room.turn) {
      isMyTurn = (isHost && room.turn === "host") || (!isHost && room.turn === "guest");
      updateTurnVisuals();
    }

    // Проверка победы раунда
    if (room.roundWinner) {
      showRoundResult(room.roundWinner);
    }
  });
}

function confirmClosedCards() {
  if (!isMyTurn) return;

  cardsStateArray.forEach((state, i) => {
    if (state.selected) {
      state.closed = true;
      state.selected = false;
      const el = $("card-" + (i + 1));
      el.classList.remove("selected");
      el.classList.add("closed");
    }
  });

  // Передаем ход сопернику через базу
  db.ref(`rooms/${currentRoomId}`).update({
    turn: isHost ? "guest" : "host"
  });

  startTurnTimer();
}

// Досрочное угадывание
function triggerFinalGuess() {
  if (!isMyTurn) return;

  const guessedCardIdx = cardsStateArray.findIndex(c => c.selected) + 1;
  if (guessedCardIdx <= 0) return;

  const isCorrect = (guessedCardIdx === opponentSecretCardIdx);
  let winnerSymbol = "";

  if (isCorrect) {
    winnerSymbol = isHost ? "host" : "guest";
  } else {
    // Если угадал неверно — побеждает соперник
    winnerSymbol = isHost ? "guest" : "host";
  }

  db.ref(`rooms/${currentRoomId}`).update({
    roundWinner: winnerSymbol
  });
}

// ============================================================================
// 6. ФИНАЛЫ И СБРОС
// ============================================================================

function showRoundResult(winner) {
  clearInterval(gameTimerInterval);
  const modal = $("gameResultModal");
  const iWon = (isHost && winner === "host") || (!isHost && winner === "guest");

  $("modalEmoji").innerText = iWon ? "🏆" : "😢";
  $("modalTitle").innerText = iWon ? "ПОБЕДА!" : "ПОРАЖЕНИЕ";
  $("modalDesc").innerText = iWon ? "Вы отлично разгадали карту соперника!" : "Увы, соперник победил в этом раунде!";

  modal.classList.add("active");
}

async function restartNewRound() {
  if (!isHost) {
    alert("Ожидайте, пока хост перезапустит игру!");
    return;
  }

  const roomRef = db.ref(`rooms/${currentRoomId}`);
  const snap = await roomRef.once('value');
  const room = snap.val();

  let hScore = room.hostScore;
  let gScore = room.guestScore;

  if (room.roundWinner === "host") hScore++;
  else gScore++;

  // Очищаем раунд в БД
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