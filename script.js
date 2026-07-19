const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Republic of the Congo)",
  "Congo (Democratic Republic of the Congo)",
  "Costa Rica",
  "Côte d'Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];

const select = document.getElementById("countrySelect");
const countrySearch = document.getElementById("countrySearch");
const playButton = document.getElementById("playButton");
const passButton = document.getElementById("passButton");
const dribbleButton = document.getElementById("dribbleButton");
const twoPlayerModeToggle = document.getElementById("twoPlayerModeToggle");
const statusMessage = document.getElementById("statusMessage");
const playerCountryEl = document.getElementById("playerCountry");
const opponentCountryEl = document.getElementById("opponentCountry");
const playerScoreEl = document.getElementById("playerScore");
const opponentScoreEl = document.getElementById("opponentScore");
const matchSummaryEl = document.getElementById("matchSummary");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const matchScreen = document.getElementById("matchScreen");
const matchScreenText = document.getElementById("matchScreenText");
const startMatchButton = document.getElementById("startMatchButton");

const fieldWidth = canvas.width;
const fieldHeight = canvas.height;
const keys = { w: false, a: false, s: false, d: false, e: false, Space: false, Enter: false, ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
let animationFrameId = null;
let spaceJustPressed = false;
let enterJustPressed = false;
let passJustPressed = false;
let dribbleCooldown = 0;
// runtime match state
let dribbleHold = 0;

const gameState = {
  playerName: "",
  opponentName: "",
  playerGoals: 0,
  opponentGoals: 0,
  running: false,
  userTeam: [
    { id: "user", x: 140, y: fieldHeight / 2, radius: 20, speed: 320, color: "#f8fafc" },
    { id: "user-support", x: 240, y: fieldHeight / 2 - 60, radius: 18, speed: 280, color: "#e2e8f0" },
    { id: "user-wing", x: 250, y: fieldHeight / 2 + 70, radius: 18, speed: 280, color: "#f8fafc" }
  ],
  aiTeam: [
    { id: "ai", x: fieldWidth - 140, y: fieldHeight / 2, radius: 20, speed: 250, color: "#fbbf24" },
    { id: "ai-support", x: fieldWidth - 240, y: fieldHeight / 2 - 60, radius: 18, speed: 240, color: "#fde68a" },
    { id: "ai-wing", x: fieldWidth - 250, y: fieldHeight / 2 + 70, radius: 18, speed: 240, color: "#fbbf24" }
  ],
  user: null,
  ai: null,
  ball: { x: fieldWidth / 2, y: fieldHeight / 2, radius: 10, vx: 0, vy: 0, owner: null },
  aiShotCooldown: 0,
  aimTarget: { x: fieldWidth / 2, y: fieldHeight / 2 }
};
gameState.user = gameState.userTeam[0];
gameState.ai = gameState.aiTeam[0];

function populateCountries() {
  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    select.appendChild(option);
  });
  select.value = "Brazil";
  countrySearch.value = "";
  filterCountries();
}

function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
}

function filterCountries() {
  const query = countrySearch.value.trim().toLowerCase();
  const options = Array.from(select.options);
  let hasVisibleSelection = false;

  options.forEach((option) => {
    const matches = !query || option.textContent.toLowerCase().includes(query);
    option.hidden = !matches;
    if (!hasVisibleSelection && matches) {
      hasVisibleSelection = true;
    }
  });

  const selectedStillVisible = options.some((option) => option.value === select.value && !option.hidden);
  if (!selectedStillVisible) {
    const firstVisible = options.find((option) => !option.hidden);
    if (firstVisible) {
      select.value = firstVisible.value;
    }
  }
}

function getCountryStrength(countryName) {
  const index = countries.indexOf(countryName);
  const base = index >= 0 ? index % 12 : 5;
  return 4 + base;
}

function clampPlayer(player) {
  player.x = Math.max(30, Math.min(fieldWidth - 30, player.x));
  player.y = Math.max(30, Math.min(fieldHeight - 30, player.y));
}

function resolvePlayerCollisions() {
  const players = [...gameState.userTeam, ...gameState.aiTeam];

  for (let i = 0; i < players.length; i += 1) {
    for (let j = i + 1; j < players.length; j += 1) {
      const a = players[i];
      const b = players[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const minDistance = a.radius + b.radius + 4;
      const distance = Math.hypot(dx, dy) || 1;

      if (distance < minDistance) {
        const overlap = minDistance - distance;
        const pushX = (dx / distance) * (overlap / 2);
        const pushY = (dy / distance) * (overlap / 2);
        a.x -= pushX;
        a.y -= pushY;
        b.x += pushX;
        b.y += pushY;
        clampPlayer(a);
        clampPlayer(b);
      }
    }
  }
}

function movePlayerToward(player, targetX, targetY, delta, speedMultiplier = 1) {
  const dx = targetX - player.x;
  const dy = targetY - player.y;
  const magnitude = Math.hypot(dx, dy) || 1;
  player.x += (dx / magnitude) * player.speed * speedMultiplier * delta;
  player.y += (dy / magnitude) * player.speed * speedMultiplier * delta;
  clampPlayer(player);
}

function updateTeamShape(team, isUserTeam, delta) {
  const captain = team[0];
  const support = team[1];
  const wing = team[2];
  const ball = gameState.ball;
  const attackGoalX = isUserTeam ? fieldWidth - 80 : 80;
  const defendGoalX = isUserTeam ? 80 : fieldWidth - 80;

  if (isUserTeam) {
    if (ball.owner === "user") {
      movePlayerToward(support, Math.min(captain.x + 90, fieldWidth * 0.65), Math.max(70, Math.min(fieldHeight - 70, captain.y - 45)), delta, 0.95);
      movePlayerToward(wing, Math.min(captain.x + 110, fieldWidth * 0.78), Math.max(70, Math.min(fieldHeight - 70, captain.y + 55)), delta, 0.95);
    } else if (ball.owner === "ai") {
      movePlayerToward(support, Math.max(80, Math.min(defendGoalX + 60, ball.x - 70)), Math.max(70, Math.min(fieldHeight - 70, ball.y - 25)), delta, 0.9);
      movePlayerToward(wing, Math.max(80, Math.min(defendGoalX + 60, ball.x - 50)), Math.max(70, Math.min(fieldHeight - 70, ball.y + 25)), delta, 0.9);
    } else {
      movePlayerToward(support, Math.max(80, Math.min(attackGoalX - 90, ball.x - 50)), Math.max(70, Math.min(fieldHeight - 70, ball.y - 30)), delta, 0.9);
      movePlayerToward(wing, Math.max(80, Math.min(attackGoalX - 90, ball.x - 35)), Math.max(70, Math.min(fieldHeight - 70, ball.y + 30)), delta, 0.9);
    }
    return;
  }

  if (ball.owner === "ai") {
    movePlayerToward(support, Math.max(80, Math.min(attackGoalX + 90, ball.x + 50)), Math.max(70, Math.min(fieldHeight - 70, ball.y - 25)), delta, 0.95);
    movePlayerToward(wing, Math.max(80, Math.min(attackGoalX + 90, ball.x + 35)), Math.max(70, Math.min(fieldHeight - 70, ball.y + 25)), delta, 0.95);
  } else if (ball.owner === "user") {
    movePlayerToward(support, Math.max(80, Math.min(defendGoalX - 60, ball.x + 70)), Math.max(70, Math.min(fieldHeight - 70, ball.y - 25)), delta, 0.9);
    movePlayerToward(wing, Math.max(80, Math.min(defendGoalX - 60, ball.x + 50)), Math.max(70, Math.min(fieldHeight - 70, ball.y + 25)), delta, 0.9);
  } else {
    movePlayerToward(support, Math.max(80, Math.min(attackGoalX + 90, ball.x + 50)), Math.max(70, Math.min(fieldHeight - 70, ball.y - 30)), delta, 0.9);
    movePlayerToward(wing, Math.max(80, Math.min(attackGoalX + 90, ball.x + 35)), Math.max(70, Math.min(fieldHeight - 70, ball.y + 30)), delta, 0.9);
  }
}

function tryClaimBall(teamName) {
  const team = teamName === "user" ? gameState.userTeam : gameState.aiTeam;
  const ball = gameState.ball;

  for (const player of team) {
    const distance = Math.hypot(ball.x - player.x, ball.y - player.y);
    if (distance < player.radius + ball.radius + 4) {
      ball.x = player.x;
      ball.y = player.y;
      ball.vx = 0;
      ball.vy = 0;
      ball.owner = teamName;
      return;
    }
  }
}

function passToTeammate() {
  if (gameState.ball.owner !== "user") {
    return;
  }

  const captain = gameState.user;
  let bestTarget = null;
  let bestDistance = Infinity;

  gameState.userTeam.forEach((player) => {
    if (player === captain) {
      return;
    }

    const distance = Math.hypot(gameState.ball.x - player.x, gameState.ball.y - player.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestTarget = player;
    }
  });

  if (!bestTarget || bestDistance > 240) {
    statusMessage.textContent = "No open teammate nearby. Shot instead.";
    const aimX = gameState.aimTarget.x - captain.x;
    const aimY = gameState.aimTarget.y - captain.y;
    gameState.ball.x = captain.x;
    gameState.ball.y = captain.y;
    shootBall(captain, aimX, aimY);
    return;
  }

  const passX = bestTarget.x - captain.x;
  const passY = bestTarget.y - captain.y;
  gameState.ball.x = captain.x;
  gameState.ball.y = captain.y;
  shootBall(captain, passX, passY, 0.72);
  statusMessage.textContent = "Pass!";
}

function dribble() {
  if (!gameState.running) {
    statusMessage.textContent = "Start a match before dribbling.";
    return;
  }

  if (dribbleCooldown > 0) {
    statusMessage.textContent = "Dribble is cooling down.";
    return;
  }

  const captain = gameState.user;
  const dist = Math.hypot(gameState.ball.x - captain.x, gameState.ball.y - captain.y);
  if (dist > captain.radius + gameState.ball.radius + 60 && gameState.ball.owner !== "user") {
    statusMessage.textContent = "You need the ball to dribble.";
    return;
  }

  // Claim the ball and hold it at the player's feet for a short window.
  gameState.ball.owner = "user";
  gameState.ball.x = captain.x;
  gameState.ball.y = captain.y;
  gameState.ball.vx = 0;
  gameState.ball.vy = 0;
  dribbleHold = 10.0; // seconds to keep the ball glued to the player
  dribbleCooldown = 2.0; // overall cooldown before next dribble
  statusMessage.textContent = "Dribbling — ball glued to your feet.";
}

function resetBall() {
  gameState.ball.x = fieldWidth / 2;
  gameState.ball.y = fieldHeight / 2;
  gameState.ball.vx = 0;
  gameState.ball.vy = 0;
  gameState.ball.owner = null;
  gameState.userTeam[0].x = 140;
  gameState.userTeam[0].y = fieldHeight / 2;
  gameState.userTeam[1].x = 240;
  gameState.userTeam[1].y = fieldHeight / 2 - 60;
  gameState.userTeam[2].x = 250;
  gameState.userTeam[2].y = fieldHeight / 2 + 70;
  gameState.aiTeam[0].x = fieldWidth - 140;
  gameState.aiTeam[0].y = fieldHeight / 2;
  gameState.aiTeam[1].x = fieldWidth - 240;
  gameState.aiTeam[1].y = fieldHeight / 2 - 60;
  gameState.aiTeam[2].x = fieldWidth - 250;
  gameState.aiTeam[2].y = fieldHeight / 2 + 70;
  gameState.aiShotCooldown = 0;
}

function updateScoreboard() {
  playerCountryEl.textContent = gameState.playerName;
  opponentCountryEl.textContent = gameState.opponentName;
  playerScoreEl.textContent = gameState.playerGoals;
  opponentScoreEl.textContent = gameState.opponentGoals;
  matchSummaryEl.textContent = `${gameState.playerName} ${gameState.playerGoals}-${gameState.opponentGoals} ${gameState.opponentName}`;
  const modeText = twoPlayerModeToggle.checked
    ? "2 Player Mode: WASD + Space for you, Arrow Keys + Enter for the other player."
    : "Move with WASD, aim with the mouse, and press space to shoot.";
  statusMessage.textContent = modeText;
}

function showMatchScreen(message) {
  matchScreenText.textContent = message;
  matchScreen.style.display = "flex";
}

function hideMatchScreen() {
  matchScreen.style.display = "none";
}

function startMatch() {
  const chosenCountry = select.value;
  const chosenIndex = countries.indexOf(chosenCountry);
  let opponentIndex = Math.floor(Math.random() * countries.length);

  while (opponentIndex === chosenIndex) {
    opponentIndex = Math.floor(Math.random() * countries.length);
  }

  gameState.playerName = chosenCountry;
  gameState.opponentName = countries[opponentIndex];
  gameState.playerGoals = 0;
  gameState.opponentGoals = 0;
  resetBall();
  // initialize halves and timer
  gameState.matchHalf = 1;
  gameState.timeLeft = HALF_DURATION;
  gameState.inBreak = false;
  gameState.breakTimeLeft = 0;
  updateScoreboard();
  hideMatchScreen();
  gameState.running = true;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  animationFrameId = requestAnimationFrame(loop);
}

function loop(time) {
  if (!gameState.running) {
    return;
  }

  const delta = Math.min(0.032, (time - (loop.lastTime || time)) / 1000);
  loop.lastTime = time;

  updateGame(delta);
  drawField();
  animationFrameId = requestAnimationFrame(loop);
}

function performTackle() {
  const distanceToBall = Math.hypot(gameState.ball.x - gameState.user.x, gameState.ball.y - gameState.user.y);
  if (distanceToBall < 120) {
    gameState.ball.vx = -260;
    gameState.ball.vy = (Math.random() - 0.5) * 180;
    statusMessage.textContent = "Tackle! The ball was won back.";
  } else {
    statusMessage.textContent = "Tackle missed. Get closer to the ball.";
  }
}

function shootBall(shooter, aimX = 0, aimY = 0, powerMultiplier = 1) {
  const aimMagnitude = Math.hypot(aimX, aimY) || 1;
  const normalizedAimX = aimMagnitude > 0 ? aimX / aimMagnitude : 0;
  const normalizedAimY = aimMagnitude > 0 ? aimY / aimMagnitude : 0;

  const fallbackX = gameState.ball.x - shooter.x;
  const fallbackY = gameState.ball.y - shooter.y;
  const fallbackMagnitude = Math.hypot(fallbackX, fallbackY) || 1;
  const shotX = aimMagnitude > 0 ? normalizedAimX : fallbackX / fallbackMagnitude;
  const shotY = aimMagnitude > 0 ? normalizedAimY : fallbackY / fallbackMagnitude;

  gameState.ball.vx = shotX * 780 * powerMultiplier;
  gameState.ball.vy = shotY * 320 * powerMultiplier;
  gameState.ball.owner = null;
}

function updateGame(delta) {
  // Handle half / break timers at the top of the update loop
  if (gameState.running) {
    if (gameState.inBreak) {
      // decrement break timer and update overlay
      gameState.breakTimeLeft = Math.max(0, gameState.breakTimeLeft - delta);
      showMatchScreen(`Half Time — resumes in ${Math.ceil(gameState.breakTimeLeft)}s`);
      if (gameState.breakTimeLeft <= 0) {
        // end break, start second half (or resume)
        hideMatchScreen();
        gameState.inBreak = false;
        gameState.matchHalf = Math.min(2, (gameState.matchHalf || 1) + 1);
        gameState.timeLeft = HALF_DURATION;
        updateScoreboard();
      }
      // while in break, skip the rest of the update (freeze players/ball)
      return;
    }

    // decrement active half time
    if (typeof gameState.timeLeft === "number") {
      gameState.timeLeft = Math.max(0, gameState.timeLeft - delta);
      // if time ran out for the half
      if (gameState.timeLeft <= 0) {
        if ((gameState.matchHalf || 1) === 1) {
          // start break
          gameState.inBreak = true;
          gameState.breakTimeLeft = BREAK_DURATION;
          // freeze ball
          gameState.ball.vx = 0;
          gameState.ball.vy = 0;
          showMatchScreen(`Half Time — resumes in ${Math.ceil(gameState.breakTimeLeft)}s`);
          updateScoreboard();
          return;
        } else {
          // full time — end match
          gameState.running = false;
          showMatchScreen(`Full Time — ${gameState.playerName} ${gameState.playerGoals}-${gameState.opponentGoals} ${gameState.opponentName}`);
          updateScoreboard();
          return;
        }
      }
    }
    updateScoreboard();
  }

  const inputX = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
  const inputY = (keys.s ? 1 : 0) - (keys.w ? 1 : 0);

  if (inputX !== 0 || inputY !== 0) {
    const magnitude = Math.hypot(inputX, inputY) || 1;
    gameState.user.x += (inputX / magnitude) * gameState.user.speed * delta;
    gameState.user.y += (inputY / magnitude) * gameState.user.speed * delta;
  }

  gameState.user.x = Math.max(30, Math.min(fieldWidth - 30, gameState.user.x));
  gameState.user.y = Math.max(30, Math.min(fieldHeight - 30, gameState.user.y));

  if (twoPlayerModeToggle.checked) {
    const aiInputX = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
    const aiInputY = (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0);

    if (aiInputX !== 0 || aiInputY !== 0) {
      const magnitude = Math.hypot(aiInputX, aiInputY) || 1;
      gameState.ai.x += (aiInputX / magnitude) * gameState.ai.speed * delta;
      gameState.ai.y += (aiInputY / magnitude) * gameState.ai.speed * delta;
    }

    gameState.ai.x = Math.max(30, Math.min(fieldWidth - 30, gameState.ai.x));
    gameState.ai.y = Math.max(30, Math.min(fieldHeight - 30, gameState.ai.y));
  } else {
    const aiDistanceToBall = Math.hypot(gameState.ball.x - gameState.ai.x, gameState.ball.y - gameState.ai.y);
    const aiDefensiveLineX = fieldWidth * 0.58;
    const aiDefensiveLineY = fieldHeight / 2;
    let aiTargetX = aiDefensiveLineX;
    let aiTargetY = aiDefensiveLineY + (gameState.ball.y - aiDefensiveLineY) * 0.22;

    if (gameState.ball.owner === "ai") {
      const directGoalX = fieldWidth - 90;
      const directGoalY = Math.max(70, Math.min(fieldHeight - 70, gameState.ball.y + (gameState.user.y - gameState.ball.y) * 0.18));
      const laneTargetX = Math.max(140, Math.min(fieldWidth - 120, gameState.ball.x + 70));
      const laneTargetY = Math.max(70, Math.min(fieldHeight - 70, gameState.ball.y + (gameState.user.y > fieldHeight / 2 ? -28 : 28)));

      if (gameState.ai.x > fieldWidth * 0.55 || gameState.ball.x > fieldWidth * 0.6) {
        aiTargetX = directGoalX;
        aiTargetY = directGoalY;
      } else {
        aiTargetX = laneTargetX;
        aiTargetY = laneTargetY;
      }
    } else if (gameState.ball.x > fieldWidth * 0.42) {
      aiTargetX = Math.max(fieldWidth * 0.45, Math.min(fieldWidth - 70, gameState.ball.x - 20));
      aiTargetY = gameState.ball.y + (gameState.ball.y > fieldHeight / 2 ? 18 : -18);
    } else if (aiDistanceToBall < 140) {
      aiTargetX = gameState.ball.x - 20;
      aiTargetY = gameState.ball.y;
    } else {
      aiTargetX = fieldWidth * 0.64;
      aiTargetY = gameState.ball.y;
    }

    if (gameState.ball.owner !== "ai") {
      aiTargetX = Math.min(fieldWidth - 80, aiTargetX + 35);
      aiTargetY = aiTargetY + (gameState.ball.y > fieldHeight / 2 ? 24 : -24);
    }

    const playerToGoalX = fieldWidth - 80 - gameState.user.x;
    const playerToGoalY = fieldHeight / 2 - gameState.user.y;
    const playerToGoalMagnitude = Math.hypot(playerToGoalX, playerToGoalY) || 1;
    const dribbleLaneX = gameState.user.x + (playerToGoalX / playerToGoalMagnitude) * 70;
    const dribbleLaneY = gameState.user.y + (playerToGoalY / playerToGoalMagnitude) * 60;

    if (gameState.ball.owner === "ai" && gameState.ball.x > fieldWidth * 0.4) {
      aiTargetX = gameState.ai.x > fieldWidth * 0.55 ? fieldWidth - 90 : dribbleLaneX;
      aiTargetY = gameState.ai.x > fieldWidth * 0.55 ? Math.max(70, Math.min(fieldHeight - 70, gameState.ball.y + (gameState.user.y - gameState.ball.y) * 0.2)) : dribbleLaneY;
    }

    const aiDx = aiTargetX - gameState.ai.x;
    const aiDy = aiTargetY - gameState.ai.y;
    const aiMagnitude = Math.hypot(aiDx, aiDy) || 1;
    gameState.ai.x += (aiDx / aiMagnitude) * gameState.ai.speed * delta;
    gameState.ai.y += (aiDy / aiMagnitude) * gameState.ai.speed * delta;
    gameState.ai.x = Math.max(30, Math.min(fieldWidth - 30, gameState.ai.x));
    gameState.ai.y = Math.max(30, Math.min(fieldHeight - 30, gameState.ai.y));
  }

  if (spaceJustPressed) {
    const distToBall = Math.hypot(gameState.ball.x - gameState.user.x, gameState.ball.y - gameState.user.y);
    const canShoot = gameState.ball.owner === "user" || distToBall < gameState.user.radius + gameState.ball.radius + 24;

    if (canShoot) {
      const aimX = gameState.aimTarget.x - gameState.user.x;
      const aimY = gameState.aimTarget.y - gameState.user.y;
      gameState.ball.x = gameState.user.x;
      gameState.ball.y = gameState.user.y;
      shootBall(gameState.user, aimX, aimY);
      statusMessage.textContent = "Shot!";
    }
    spaceJustPressed = false;
  }

  if (enterJustPressed) {
    const distToBall = Math.hypot(gameState.ball.x - gameState.ai.x, gameState.ball.y - gameState.ai.y);
    const canShoot = gameState.ball.owner === "ai" || distToBall < gameState.ai.radius + gameState.ball.radius + 24;

    if (canShoot) {
      const aimX = gameState.aimTarget.x - gameState.ai.x;
      const aimY = gameState.aimTarget.y - gameState.ai.y;
      gameState.ball.x = gameState.ai.x;
      gameState.ball.y = gameState.ai.y;
      shootBall(gameState.ai, aimX, aimY);
      statusMessage.textContent = "Second player shot!";
    }
    enterJustPressed = false;
  }

  // Countdown dribble cooldown and hold timer
  dribbleCooldown = Math.max(0, dribbleCooldown - delta);
  dribbleHold = Math.max(0, dribbleHold - delta);

  // While dribbleHold is active, keep the ball locked to the user's feet.
  if (dribbleHold > 0 && gameState.ball.owner === "user") {
    gameState.ball.x = gameState.user.x;
    gameState.ball.y = gameState.user.y;
    gameState.ball.vx = 0;
    gameState.ball.vy = 0;
  }

  resolvePlayerCollisions();

  gameState.aiShotCooldown = Math.max(0, gameState.aiShotCooldown - delta);
  const aiDistToBall = Math.hypot(gameState.ball.x - gameState.ai.x, gameState.ball.y - gameState.ai.y);
  if (!twoPlayerModeToggle.checked && gameState.ball.owner === "ai" && aiDistToBall < gameState.ai.radius + gameState.ball.radius + 16 && gameState.aiShotCooldown <= 0) {
    const aiAimX = fieldWidth - 60 - gameState.ai.x;
    const aiAimY = fieldHeight / 2 - gameState.ai.y;
    shootBall(gameState.ai, aiAimX, aiAimY);
    gameState.aiShotCooldown = 0.7;
  } else if (
    !twoPlayerModeToggle.checked &&
    gameState.ball.owner !== "ai" &&
    aiDistToBall < gameState.ai.radius + gameState.ball.radius + 16 &&
    gameState.ball.x > fieldWidth * 0.4 &&
    gameState.aiShotCooldown <= 0
  ) {
    const aiAimX = gameState.ball.x - gameState.ai.x;
    const aiAimY = gameState.ball.y - gameState.ai.y;
    shootBall(gameState.ai, aiAimX, aiAimY);
    gameState.aiShotCooldown = 0.8;
  }

  gameState.ball.x += gameState.ball.vx * delta;
  gameState.ball.y += gameState.ball.vy * delta;
  gameState.ball.vx *= 0.95;
  gameState.ball.vy *= 0.95;

  if (gameState.ball.vx !== 0 || gameState.ball.vy !== 0) {
    gameState.ball.vx += (Math.random() - 0.5) * 14;
    gameState.ball.vy += (Math.random() - 0.5) * 12;
  }

  if (Math.abs(gameState.ball.vx) < 10) {
    gameState.ball.vx = 0;
  }
  if (Math.abs(gameState.ball.vy) < 10) {
    gameState.ball.vy = 0;
  }

  const userDist = Math.hypot(gameState.ball.x - gameState.user.x, gameState.ball.y - gameState.user.y);
  if (gameState.ball.owner !== "user" && userDist < gameState.user.radius + gameState.ball.radius + 4 && Math.abs(gameState.ball.vx) + Math.abs(gameState.ball.vy) < 220) {
    gameState.ball.x = gameState.user.x;
    gameState.ball.y = gameState.user.y;
    gameState.ball.vx = 0;
    gameState.ball.vy = 0;
    gameState.ball.owner = "user";
  }

  const aiDist = Math.hypot(gameState.ball.x - gameState.ai.x, gameState.ball.y - gameState.ai.y);
  if (gameState.ball.owner !== "ai" && aiDist < gameState.ai.radius + gameState.ball.radius + 4 && Math.abs(gameState.ball.vx) + Math.abs(gameState.ball.vy) < 220) {
    gameState.ball.x = gameState.ai.x;
    gameState.ball.y = gameState.ai.y;
    gameState.ball.vx = 0;
    gameState.ball.vy = 0;
    gameState.ball.owner = "ai";
  }

  if (gameState.ball.y - gameState.ball.radius < 0 || gameState.ball.y + gameState.ball.radius > fieldHeight) {
    gameState.ball.vy *= -1;
    gameState.ball.y = Math.max(gameState.ball.radius, Math.min(fieldHeight - gameState.ball.radius, gameState.ball.y));
  }

  if (gameState.ball.x + gameState.ball.radius < 0) {
    gameState.opponentGoals += 1;
    updateScoreboard();
    resetBall();
    return;
  }

  if (gameState.ball.x - gameState.ball.radius > fieldWidth) {
    gameState.playerGoals += 1;
    updateScoreboard();
    resetBall();
    return;
  }
}

function drawField() {
  ctx.clearRect(0, 0, fieldWidth, fieldHeight);
  ctx.fillStyle = "#1f9d4a";
  ctx.fillRect(0, 0, fieldWidth, fieldHeight);
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, fieldWidth - 40, fieldHeight - 40);
  ctx.beginPath();
  ctx.moveTo(fieldWidth / 2, 20);
  ctx.lineTo(fieldWidth / 2, fieldHeight - 20);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(fieldWidth / 2, fieldHeight / 2, 70, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(20, fieldHeight / 2 - 50, 40, 100);
  ctx.fillRect(fieldWidth - 60, fieldHeight / 2 - 50, 40, 100);

  gameState.userTeam.forEach(drawPlayer);
  gameState.aiTeam.forEach(drawPlayer);

  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(gameState.user.x, gameState.user.y);
  ctx.lineTo(gameState.aimTarget.x, gameState.aimTarget.y);
  ctx.stroke();
  ctx.restore();

  drawBall(gameState.ball);
}

function drawPlayer(player) {
  ctx.save();
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(15, 23, 42, 0.35)";
  ctx.stroke();
  ctx.restore();
}

function drawBall(ball) {
  if (Math.abs(ball.vx) + Math.abs(ball.vy) > 20) {
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(ball.x - ball.vx * 0.025, ball.y - ball.vy * 0.025, ball.radius + 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.translate(ball.x, ball.y);
  ctx.scale(1.08, 1.08);
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, ball.radius - 2, 0, Math.PI * 1.8);
  ctx.stroke();

  ctx.strokeStyle = "#dc2626";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, ball.radius - 4, Math.PI * 0.25, Math.PI * 1.3);
  ctx.stroke();
  ctx.restore();
}

function normalizeKey(event) {
  if (event.code === "KeyW") return "w";
  if (event.code === "KeyA") return "a";
  if (event.code === "KeyS") return "s";
  if (event.code === "KeyD") return "d";
  if (event.code === "KeyF") return "f";
  if (event.code === "Space") return "Space";
  if (event.code === "Enter") return "Enter";
  if (event.code === "KeyL") return "l";
  if (event.code === "ArrowUp") return "ArrowUp";
  if (event.code === "ArrowDown") return "ArrowDown";
  if (event.code === "ArrowLeft") return "ArrowLeft";
  if (event.code === "ArrowRight") return "ArrowRight";
  return event.key.toLowerCase();
}

function handleKeyDown(event) {
  // If an input or textarea is focused (e.g. countrySearch), don't treat
  // key events as gameplay input — allow typing normally.
  const active = document.activeElement;
  if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)) {
    return;
  }

  const normalizedKey = normalizeKey(event);

  if (["w", "a", "s", "d", "e", "f", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "Enter"].includes(normalizedKey)) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (normalizedKey === "Space") {
    keys.Space = true;
    spaceJustPressed = true;
    return;
  }

  if (normalizedKey === "Enter") {
    keys.Enter = true;
    enterJustPressed = true;
    return;
  }

  if (normalizedKey === "e") {
    keys.e = true;
    passJustPressed = true;
    return;
  }

  if (normalizedKey === "l") {
    dribble();
    return;
  }

  if (normalizedKey === "f") {
    performTackle();
    return;
  }

  if (normalizedKey in keys) {
    keys[normalizedKey] = true;
  }
}

function handleKeyUp(event) {
  // Ignore keyup if typing in an input/textarea
  const active = document.activeElement;
  if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)) {
    return;
  }

  const normalizedKey = normalizeKey(event);

  if (normalizedKey === "Space") {
    keys.Space = false;
    return;
  }

  if (normalizedKey === "Enter") {
    keys.Enter = false;
    return;
  }

  if (normalizedKey === "e") {
    keys.e = false;
    return;
  }

  if (normalizedKey in keys) {
    keys[normalizedKey] = false;
  }
}

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  gameState.aimTarget.x = Math.max(20, Math.min(fieldWidth - 20, (event.clientX - rect.left) * scaleX));
  gameState.aimTarget.y = Math.max(20, Math.min(fieldHeight - 20, (event.clientY - rect.top) * scaleY));
});

passButton.addEventListener("click", () => {
  if (!gameState.running) {
    statusMessage.textContent = "Start a match before passing.";
    return;
  }
  passToTeammate();
});

dribbleButton.addEventListener("click", () => {
  dribble();
});

countrySearch.addEventListener("input", filterCountries);
select.addEventListener("change", () => {
  filterCountries();
});

twoPlayerModeToggle.addEventListener("change", () => {
  updateScoreboard();
});

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
populateCountries();
showMatchScreen("Choose your country and start the match.");
playButton.addEventListener("click", startMatch);
startMatchButton.addEventListener("click", startMatch);
