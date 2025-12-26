// ==== Demo data ====
let currentMember = null;
let currentLeader = false;
let screenStack = [];

let members = [
  {
    id: "S001",
    name: "Alice Johnson",
    pin: "1111",
    points: 85,
    quizzes: [],
    projects: [],
    badges: ["Silver"]
  },
  {
    id: "S002",
    name: "Bob Smith",
    pin: "2222",
    points: 120,
    quizzes: [],
    projects: [],
    badges: ["Gold"]
  },
  {
    id: "S003",
    name: "Charlie Lee",
    pin: "3333",
    points: 45,
    quizzes: [],
    projects: [],
    badges: ["Bronze"]
  }
];

let leaderPin = "1234";

let quizzes = {
  Physics: [
    {
      category: "Physics",
      q: "Speed of light?",
      a: ["3x10^8 m/s", "1x10^6 m/s", "5x10^7 m/s", "1x10^8 m/s"],
      correct: 0
    }
  ],
  Chemistry: [
    {
      category: "Chemistry",
      q: "Water formula?",
      a: ["H2O", "CO2", "NaCl", "O2"],
      correct: 0
    }
  ],
  Biology: [
    {
      category: "Biology",
      q: "Basic unit of life?",
      a: ["Cell", "Atom", "Molecule", "Organ"],
      correct: 0
    }
  ]
};

let projects = [];

// ==== Screen Navigation ====
function go(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(screenId);
  if (target) target.classList.add("active");

  // Back button handling
  if (screenId === "account" || screenId === "splash") {
    document.getElementById("backIcon").style.display = "none";
  } else {
    document.getElementById("backIcon").style.display = "block";
  }

  screenStack.push(screenId);
}

// Back
function goBack() {
  if (screenStack.length > 1) {
    screenStack.pop();
    const prev = screenStack.pop();
    go(prev);
  }
}

// ==== Splash Auto ====
window.addEventListener("DOMContentLoaded", () => {
  go("splash");
  setTimeout(() => go("account"), 1500);
});

// ==== Account Buttons ====
document.getElementById("memberBtn").onclick = () => go("memberLogin");
document.getElementById("registerBtn").onclick = () => go("register");
document.getElementById("leaderBtn").onclick = () => go("leaderLogin");
document.getElementById("demoBtn").onclick = demoMode;

// ==== Member Login & Registration ====
document.getElementById("memberLoginBtn").onclick = () => {
  const num = document.getElementById("memberNumber").value;
  const pin = document.getElementById("memberPin").value;
  const m = members.find(x => x.id === num && x.pin === pin);
  if (m) {
    currentMember = m;
    go("memberDashboard");
    updateLeaderboard();
  } else {
    alert("Invalid login!");
  }
};

document.getElementById("registerMemberBtn").onclick = () => {
  const id = document.getElementById("newMemberNumber").value;
  const name = document.getElementById("newMemberName").value;
  const pin = document.getElementById("newMemberPin").value;
  if (!id || !name || !pin) {
    alert("Fill all fields!");
    return;
  }
  if (members.find(x => x.id === id)) {
    alert("Member exists!");
    return;
  }
  const newM = { id, name, pin, points: 0, quizzes: [], projects: [], badges: [] };
  members.push(newM);
  currentMember = newM;
  go("memberDashboard");
  updateLeaderboard();
};

// ==== Leader Login ====
document.getElementById("leaderLoginBtn").onclick = () => {
  const pin = document.getElementById("leaderPin").value;
  if (pin === leaderPin) {
    currentLeader = true;
    go("leaderDashboard");
    updateLeaderboard();
  } else {
    alert("Wrong PIN!");
  }
};

// ==== Demo Mode ====
function demoMode() {
  currentMember = { ...members[0], name: "Demo User", points: 75, badges: ["Bronze", "Silver"] };
  go("memberDashboard");
  updateLeaderboard();
  setTimeout(() => {
    alert("👋 Welcome to Demo Mode!\nPoints won't be saved.");
  }, 300);
}

// ==== Logout ====
document.getElementById("logoutBtn").onclick = () => {
  currentMember = null;
  currentLeader = false;
  go("account");
};
document.getElementById("logoutBtn2").onclick = () => {
  currentMember = null;
  currentLeader = false;
  go("account");
};

// ==== Dashboard buttons ====
document.getElementById("quizBtn").onclick = () => go("quizCategories");
document.getElementById("projectBtn").onclick = () => go("projectSubmit");
document.getElementById("leaderboardBtn").onclick = updateLeaderboard;
document.getElementById("leaderboardBtn2").onclick = updateLeaderboard;
document.getElementById("profileBtn").onclick = () => go("profile");

// ==== Profile ====
document.getElementById("saveProfileBtn").onclick = () => {
  if (currentMember) {
    const name = document.getElementById("profileName").value;
    if (name) currentMember.name = name;
    alert("Profile saved!");
  }
};

// ==== Leaderboard ====
function updateLeaderboard() {
  const lb = document.getElementById("leaderboardList");
  if (!lb) return;
  lb.innerHTML = "";
  const sorted = [...members].sort((a, b) => b.points - a.points);
  const maxPoints = Math.max(...members.map(x => x.points), 1);
  sorted.forEach((m, i) => {
    const div = document.createElement("div");
    div.classList.add("leaderboard-item");
    if (i === 0) div.classList.add("top1");
    if (i === 1) div.classList.add("top2");
    if (i === 2) div.classList.add("top3");
    div.innerHTML = `${i + 1}. ${m.name} - ${m.points} pts<div class="leaderboard-bar"></div>`;
    lb.appendChild(div);
    // Animate bar width
    const bar = div.querySelector(".leaderboard-bar");
    setTimeout(() => {
      bar.style.width = (m.points / maxPoints * 100) + "%";
    }, 50);
  });
}
