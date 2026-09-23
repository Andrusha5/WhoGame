const firebaseConfig = {
  apiKey: "AIzaSyDE6GU2eTql3LTBzJjmCCap6FQ56-STEr4",
  authDomain: "whogame-9d9ad.firebaseapp.com",
  projectId: "whogame-9d9ad",
  storageBucket: "whogame-9d9ad.firebasestorage.app",
  messagingSenderId: "406180903972",
  appId: "1:406180903972:web:5be3c921dbf7f0e78eacb1",
  measurementId: "G-GQRX2DTNQG"
};

// Инициализация
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
} else {
  alert("Ошибка загрузки сети! Проверьте интернет или VPN.");
}

const auth = firebase.auth();
const db = firebase.database();

let myNickname = "";
let currentRoomId = null;
let isHost = false;
let currentAuthMode = "login";

const $ = (id) => document.getElementById(id);

// НАДЕЖНОЕ ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ
function showScreen(screenId) {
  const screens = ["authScreen", "lobbyScreen", "roomScreen", "gameScreen"];
  screens.forEach(id => {
    const el = $(id);
    if (el) {
      if (id === screenId) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    }
  });
}

// Авто-проверка авторизации при старте
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
    msgEl.innerText = "Заполните ник и пароль (мин. 6 символов)!";
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

async function createNewRoom() {
  isHost = true;
  currentRoomId = Math.floor(1000 + Math.random() * 9000).toString();
  
  await db.ref(`rooms/${currentRoomId}`).set({
    roomId: currentRoomId,
    host: myNickname,
    guest: "",
    pack: "cars",
    state: "waiting"
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
  currentRoomId = code;

  const snapshot = await db.ref(`rooms/${currentRoomId}`).once('value');
  if (!snapshot.exists()) {
    $("lobbyMessage").innerText = "Комната не найдена!";
    return;
  }

  await db.ref(`rooms/${currentRoomId}`).update({ guest: myNickname });
  $("roomCodeDisplay").innerText = currentRoomId;
  $("packSelector").disabled = true;
  $("playerStatusBadge").innerText = "⏳ Ожидаем старт...";
  $("startMatchBtn").disabled = true;

  showScreen("roomScreen");
  listenRoom();
}

function listenRoom() {
  db.ref(`rooms/${currentRoomId}`).on('value', (snapshot) => {
    const room = snapshot.val();
    if (!room) return;

    if (room.guest) {
      if (isHost) {
        $("playerStatusBadge").innerText = `✅ Соперник ${room.guest} вошел!`;
        $("startMatchBtn").disabled = false;
      } else {
        $("playerStatusBadge").innerText = `✅ Подключено к ${room.host}`;
      }
    }

    if (room.state === "playing") {
      showScreen("gameScreen");
    }
  });
}

function onPackSelectionChanged() {
  if (isHost) db.ref(`rooms/${currentRoomId}`).update({ pack: $("packSelector").value });
}

function startMatch() {
  if (isHost) db.ref(`rooms/${currentRoomId}`).update({ state: "playing" });
}