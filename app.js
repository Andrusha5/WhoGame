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
}

const auth = firebase.auth();
const db = firebase.database();

// ============================================================================
// 2. РЕЕСТР КАТЕГОРИЙ И ФАЙЛОВ
// ============================================================================
const PACK_REGISTRY = {
  cars: [
    { name: "Audi", file: "audi.png" }, { name: "BMW", file: "bmw.png" },
    { name: "Bugatti", file: "bugati.png" }, { name: "Ferrari", file: "ferrari.png" },
    { name: "Ford", file: "ford.png" }, { name: "Geely", file: "geely.png" },
    { name: "Honda", file: "honda.png" }, { name: "Hyundai", file: "hundai.png" },
    { name: "Jeep", file: "jeep.png" }, { name: "Kia", file: "kia.png" },
    { name: "Lada", file: "lada.png" }, { name: "Lamborghini", file: "lamba.png" },
    { name: "Lexus", file: "lexus.png" }, { name: "Mercedes", file: "mers.png" },
    { name: "Peugeot", file: "pejo.png" }, { name: "Porsche", file: "porshe.png" },
    { name: "Renault", file: "reno.png" }, { name: "Chevrolet", file: "shevrolet.png" },
    { name: "Skoda", file: "skoda.png" }, { name: "Subaru", file: "subaru.png" },
    { name: "Suzuki", file: "suzuki.png" }, { name: "Tesla", file: "tesla.png" },
    { name: "Toyota", file: "toyota.png" }, { name: "Volkswagen", file: "wolswagen.png" },
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
    { name: "О'Мэлли", file: "Omelli.jfif" }, { name: "Уокер", file: "Walker.jfif" },
    { name: "Перейра", file: "Pereira.jfif" }, { name: "Петр Ян", file: "Petr.jfif" },
    { name: "Порье", file: "Porier.jfif" }, { name: "Рахмонов", file: "Shavkat.jfif" },
    { name: "Шовхал", file: "Shovhal.jfif" }, { name: "Стрикленд", file: "Strik.jfif" },
    { name: "Топурия", file: "Topuria.jfif" }, { name: "Царукян", file: "Tsarukyan.jfif" },
    { name: "Волкановски", file: "Volk.jfif" }
  ],
  bloggers: [
    { name: "Влад А4", file: "1.jfif" }, { name: "Глент", file: "2.jfif" },
    { name: "Кобяков", file: "3.jfif" }, { name: "Ивангай", file: "4.jfif" },
    { name: "Мармок", file: "5.jfif" }, { name: "Куплинов", file: "6.jfif" },
    { name: "Даня Милохин", file: "7.jfif" }, { name: "Субо", file: "8.jfif" },
    { name: "Литвин", file: "9.jfif" }, { name: "Тамаев", file: "10.jfif" },
    { name: "Мистер Макс", file: "11.jfif" }, { name: "Мисс Кэти", file: "12.jfif" },
    { name: "Эдисон", file: "13.jfif" }, { name: "Райтраун", file: "14.jfif" },
    { name: "Ералаш", file: "15.jfif" }, { name: "Бустер", file: "16.jfif" },
    { name: "Братишкин", file: "17.jfif" }, { name: "Хесус", file: "18.jfif" },
    { name: "Егорик", file: "19.jfif" }, { name: "Мамикс", file: "20.jfif" },
    { name: "Масленников", file: "21.jfif" }, { name: "Хабиб", file: "22.jfif" },
    { name: "Влад Бумага", file: "23.jfif" }, { name: "Эксп", file: "24.jfif" },
    { name: "А4 Команда", file: "25.jfif" }
  ],
  celebrities: [
    { name: "Нагиев", file: "1.jpg" }, { name: "Харламов", file: "2.jpg" },
    { name: "Воля", file: "3.jpg" }, { name: "Бузова", file: "4.jpg" },
    { name: "Моргенштерн", file: "5.jpg" }, { name: "Тимати", file: "6.jpg" },
    { name: "Егор Крид", file: "7.jpg" }, { name: "Дима Билан", file: "8.jpg" },
    { name: "Сергей Лазарев", file: "9.jpg" }, { name: "Джиган", file: "10.jpg" },
    { name: "Настя Ивлеева", file: "11.jpg" }, { name: "Собчак", file: "12.jpg" },
    { name: "Юрий Дудь", file: "13.jpg" }, { name: "Ургант", file: "14.jpg" },
    { name: "Петров", file: "15.jpg" }, { name: "Козловский", file: "16.jpg" },
    { name: "Прилучный", file: "17.jpg" }, { name: "Охлобыстин", file: "18.jpg" },
    { name: "Бондарчук", file: "19.jpg" }, { name: "Шаман", file: "20.jpg" },
    { name: "Баста", file: "21.jpg" }, { name: "Самойлова", file: "22.jpg" },
    { name: "Инстасамка", file: "23.jpg" }, { name: "Клава Кока", file: "24.jpg" },
    { name: "Глюкоза", file: "25.jpg" }
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
    { name: "Эмодзи 21", file: "21.jfif" }, { name: "Эмодзи 22", file: "22.webp" },
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
    items.push({ name: `Карта #${i}`, file: `${i}.png` });
  }
  return items;
}

// ============================================================================
// 3. ПЕРЕМЕННЫЕ
// ============================================================================
let myNickname = "";
let myAvatarData = "";
let myStats = { wins: 0, games: 0 };

let currentRoomId = null;
let isHost = false;
let currentAuthMode = "login";
let activePack = "cars";

let mySecretCardIdx = -1;
let opponentSecretCardIdx = -1;
let opponentNickname = "Соперник";
let opponentAvatarData = "";

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

window.addEventListener('DOMContentLoaded', () => {
  showScreen("authScreen");
});

// ============================================================================
// 4. АВТОРИЗАЦИЯ И ПРОФИЛЬ
// ============================================================================
auth.onAuthStateChanged(async (user) => {
  if (user) {
    try {
      const snapshot = await db.ref(`users/${user.uid}`).once('value');
      if (snapshot.exists()) {
        const uData = snapshot.val();
        myNickname = uData.nickname || uData.name || "Игрок";
        myAvatarData = uData.avatar || "";
        myStats = uData.stats || { wins: 0, games: 0 };

        updateMyProfileUI();
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

function updateMyProfileUI() {
  $("userBadgeLabel").innerText = myNickname;
  $("userStatsLabel").innerText = `Побед: ${myStats.wins || 0} | Игр: ${myStats.games || 0}`;

  const avEl = $("myAvatarImg");
  if (myAvatarData) {
    avEl.innerHTML = `<img src="${myAvatarData}">`;
  } else {
    avEl.innerHTML = myNickname.charAt(0).toUpperCase();
  }
}

function triggerAvatarUpload() {
  $("avatarFileInput").click();
}

function handleAvatarFileSelected(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 128, 128);

      myAvatarData = canvas.toDataURL('image/jpeg', 0.8);
      updateMyProfileUI();

      const user = auth.currentUser;
      if (user) {
        db.ref(`users/${user.uid}/avatar`).set(myAvatarData);
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function switchAuthMode(mode) {
  currentAuthMode = mode;
  $("tabLogin").classList.toggle("active", mode === "login");
  $("tabRegister").classList.toggle("active", mode === "register");
  $("authSubmitBtn").innerText = mode === "login" ? "Войти в аккаунт" : "Зарегистрироваться";
  $("authMessage").innerText = "";
}

async function handleAuth() {
  const nick = $("authNick").value.trim();
  const pass = $("authPass").value.trim();
  const msgEl = $("authMessage");
  msgEl.innerText = "";

  if (!nick || pass.length < 6) {
    msgEl.innerText = "Ник обязателен, пароль от 6 символов!";
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

      const initUserData = {
        nickname: nick,
        avatar: "",
        stats: { wins: 0, games: 0 }
      };

      await db.ref(`taken_nicknames/${normalizedNick}`).set(uid);
      await db.ref(`users/${uid}`).set(initUserData);

      myNickname = nick;
      myAvatarData = "";
      myStats = { wins: 0, games: 0 };
    } else {
      const userCredential = await auth.signInWithEmailAndPassword(`${normalizedNick}@whogame.local`, pass);
      const uid = userCredential.user.uid;

      const snapshot = await db.ref(`users/${uid}`).once('value');
      const uData = snapshot.val();
      myNickname = uData.nickname || uData.name || "Игрок";
      myAvatarData = uData.avatar || "";
      myStats = uData.stats || { wins: 0, games: 0 };
    }

    updateMyProfileUI();
    showScreen("lobbyScreen");

  } catch (error) {
    msgEl.innerText = error.message;
  } finally {
    $("authSubmitBtn").disabled = false;
    $("authSubmitBtn").innerText = currentAuthMode === "login" ? "Войти в аккаунт" : "Зарегистрироваться";
  }
}

async function handleLogout() {
  await auth.signOut();
  myNickname = "";
  myAvatarData = "";
  showScreen("authScreen");
}

// ============================================================================
// 5. КОМНАТЫ С АВТОУДАЛЕНИЕМ
// ============================================================================
async function createNewRoom() {
  isHost = true;
  gameStartedOnce = false;
  currentRoomId = Math.floor(1000 + Math.random() * 9000).toString();
  
  const roomRef = db.ref(`rooms/${currentRoomId}`);
  await roomRef.set({
    roomId: currentRoomId,
    host: myNickname,
    hostAvatar: myAvatarData,
    guest: "",
    guestAvatar: "",
    pack: activePack || "cars",
    state: "waiting",
    hostCard: -1,
    guestCard: -1,
    hostScore: 0,
    guestScore: 0,
    createdAt: firebase.database.ServerValue.TIMESTAMP
  });
  
  // Автоудаление комнаты через 30 минут, если никто не играл
  roomRef.onDisconnect().remove();

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

  const roomRef = db.ref(`rooms/${currentRoomId}`);
  const snapshot = await roomRef.once('value');
  if (!snapshot.exists()) {
    $("lobbyMessage").innerText = "Комната не найдена или уже завершена!";
    return;
  }

  await roomRef.update({
    guest: myNickname,
    guestAvatar: myAvatarData
  });

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
        $("playerStatusBadge").innerText = `✅ Соперник: ${room.guest}`;
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
// 6. ИГРОВОЕ ПОЛЕ И НАДЕЖНАЯ ПОДГРУЗКА
// ============================================================================
function setupGameScene(room) {
  showScreen("gameScreen");
  clearInterval(gameTimerInterval);

  mySecretCardIdx = -1;
  opponentSecretCardIdx = -1;
  isMyTurn = false;

  $("secretCardImg").innerHTML = "❓";
  $("secretCardName").innerText = "Выберите карту в сетке ниже";

  opponentNickname = isHost ? (room.guest || "Соперник") : (room.host || "Соперник");
  opponentAvatarData = isHost ? (room.guestAvatar || "") : (room.hostAvatar || "");

  $("hudMyName").innerText = myNickname;
  $("hudMyScore").innerText = `Счет: ${isHost ? (room.hostScore || 0) : (room.guestScore || 0)}`;

  const myAvEl = $("hudMyAvatar");
  if (myAvatarData) myAvEl.innerHTML = `<img src="${myAvatarData}">`;
  else myAvEl.innerText = myNickname.charAt(0).toUpperCase();

  $("hudOpponentName").innerText = opponentNickname;
  $("hudOpponentScore").innerText = `Счет: ${isHost ? (room.guestScore || 0) : (room.hostScore || 0)}`;

  const oppAvEl = $("hudOpponentAvatar");
  if (opponentAvatarData) oppAvEl.innerHTML = `<img src="${opponentAvatarData}">`;
  else oppAvEl.innerText = opponentNickname.charAt(0).toUpperCase();

  $("gamePhaseLabel").innerText = "ФАЗА ВЫБОРА";
  $("gameTurnBar").innerText = "НАЖМИТЕ НА СВОЮ ТАЙНУЮ КАРТУ В СЕТКЕ";
  $("gameTurnBar").className = "turn-banner";

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
      <img src="${primarySrc}" onerror="handleImgError(this, '${activePack}', '${item.file}', ${index + 1})" alt="${item.name}">
      <div class="card-label">${item.name}</div>
    `;
    grid.appendChild(card);
  });

  startSelectionTimer();
  listenToChat();
}

function handleImgError(imgElement, packKey, origFile, index) {
  let step = parseInt(imgElement.getAttribute("data-error-step") || "0");
  let rawName = origFile ? origFile.replace(/\.[^/.]+$/, "") : index.toString();

  const variations = [
    `${rawName}.jfif`,
    `${rawName}.png`,
    `${rawName}.jpg`,
    `${rawName}.webp`,
    `${rawName.charAt(0).toUpperCase() + rawName.slice(1)}.jfif`,
    `${rawName.charAt(0).toUpperCase() + rawName.slice(1)}.png`,
    `${rawName.charAt(0).toUpperCase() + rawName.slice(1)}.jpg`,
    `${index}.jfif`,
    `${index}.png`,
    `${index}.jpg`
  ];

  if (step < variations.length) {
    imgElement.setAttribute("data-error-step", (step + 1).toString());
    imgElement.src = `packs/${packKey}/${variations[step]}`;
  } else {
    imgElement.src = `https://via.placeholder.com/150/141d2f/00f2fe?text=${index}`;
  }
}

function onCardClicked(idx) {
  const items = getPackItems(activePack);
  const cardData = items[idx - 1];

  // ВЫБОР СЕКРЕТНОЙ КАРТЫ С ЗАЩИТОЙ ОТ ПОВТОРНОГО НАЖАТИЯ
  if (mySecretCardIdx === -1 && $("gamePhaseLabel").innerText === "ФАЗА ВЫБОРА") {
    mySecretCardIdx = idx;
    $("secretCardImg").innerHTML = `<img src="packs/${activePack}/${cardData.file}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='https://via.placeholder.com/150/141d2f/00f2fe?text=${idx}'">`;
    $("secretCardName").innerText = cardData.name;

    const updateData = {};
    updateData[isHost ? "hostCard" : "guestCard"] = idx;
    db.ref(`rooms/${currentRoomId}`).update(updateData);
    return;
  }

  if ($("gamePhaseLabel").innerText !== "ИГРА") return;
  if (cardsStateArray[idx - 1].closed) return;
  // Нельзя выбирать свою тайную карту для исключения
  if (idx === mySecretCardIdx) return;
  if (!isMyTurn) return;

  cardsStateArray[idx - 1].selected = !cardsStateArray[idx - 1].selected;
  $("card-" + idx).classList.toggle("selected", cardsStateArray[idx - 1].selected);

  const selectedCount = cardsStateArray.filter(c => c.selected).length;
  $("closeCardsBtn").disabled = selectedCount === 0;
  $("makeGuessBtn").disabled = selectedCount !== 1;
}

// ============================================================================
// 7. ТАЙМЕРЫ И МГНОВЕННЫЙ СТАРТ
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
  clearInterval(gameTimerInterval);
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
  const turnBanner = $("gameTurnBar");
  if (isMyTurn) {
    turnBanner.innerText = "ВАШ ХОД! (Исключите карты или угадайте)";
    turnBanner.className = "turn-banner";
  } else {
    turnBanner.innerText = `ХОД СОПЕРНИКА (${opponentNickname})...`;
    turnBanner.className = "turn-banner red";
  }

  $("closeCardsBtn").disabled = true;
  $("makeGuessBtn").disabled = true;
}

function updateGameState(room) {
  opponentSecretCardIdx = isHost ? room.guestCard : room.hostCard;

  if ($("gamePhaseLabel").innerText === "ФАЗА ВЫБОРА") {
    if (room.hostCard && room.hostCard !== -1 && room.guestCard && room.guestCard !== -1) {
      startTurnSystem();
      return;
    }
  }

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

async function showRoundResult(winner) {
  clearInterval(gameTimerInterval);
  const modal = $("gameResultModal");
  const iWon = (isHost && winner === "host") || (!isHost && winner === "guest");

  $("modalEmoji").innerText = iWon ? "🏆" : "😢";
  $("modalTitle").innerText = iWon ? "ПОБЕДА!" : "ПОРАЖЕНИЕ";
  $("modalDesc").innerText = iWon ? "Вы отлично угадали карту соперника!" : `Соперник ${opponentNickname} победил в этом раунде!`;

  const user = auth.currentUser;
  if (user) {
    myStats.games = (myStats.games || 0) + 1;
    if (iWon) myStats.wins = (myStats.wins || 0) + 1;

    await db.ref(`users/${user.uid}/stats`).set(myStats);
    updateMyProfileUI();
  }

  // УДАЛЯЕМ КОМНАТУ ИЗ БАЗЫ ДАННЫХ ПРИ ЗАВЕРШЕНИИ ИГРЫ
  if (currentRoomId) {
    db.ref(`rooms/${currentRoomId}`).remove();
  }

  modal.classList.add("active");
}

function returnToLobbyMenu() {
  clearInterval(gameTimerInterval);
  $("gameResultModal").classList.remove("active");
  gameStartedOnce = false;

  if (currentRoomId) {
    db.ref(`rooms/${currentRoomId}`).off();
  }

  showScreen("lobbyScreen");
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
