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
  "Micronesia",
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
const playButton = document.getElementById("playButton");
const statusMessage = document.getElementById("statusMessage");
const playerCountryEl = document.getElementById("playerCountry");
const opponentCountryEl = document.getElementById("opponentCountry");
const playerScoreEl = document.getElementById("playerScore");
const opponentScoreEl = document.getElementById("opponentScore");
const matchSummaryEl = document.getElementById("matchSummary");

function populateCountries() {
  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    select.appendChild(option);
  });
  select.value = "Brazil";
}

function getCountryStrength(countryName) {
  const index = countries.indexOf(countryName);
  const base = index >= 0 ? index % 12 : 5;
  return 4 + base;
}

function playMatch() {
  const chosenCountry = select.value;
  const chosenIndex = countries.indexOf(chosenCountry);
  let opponentIndex = Math.floor(Math.random() * countries.length);

  while (opponentIndex === chosenIndex) {
    opponentIndex = Math.floor(Math.random() * countries.length);
  }

  const opponentCountry = countries[opponentIndex];
  const playerStrength = getCountryStrength(chosenCountry);
  const opponentStrength = getCountryStrength(opponentCountry);

  const playerGoals = Math.min(5, Math.max(0, Math.round(playerStrength / 2 + Math.random() * 1.2)));
  const opponentGoals = Math.min(5, Math.max(0, Math.round(opponentStrength / 2 + Math.random() * 1.2)));

  playerCountryEl.textContent = chosenCountry;
  opponentCountryEl.textContent = opponentCountry;
  playerScoreEl.textContent = playerGoals;
  opponentScoreEl.textContent = opponentGoals;

  if (playerGoals > opponentGoals) {
    matchSummaryEl.textContent = `${chosenCountry} beats ${opponentCountry} ${playerGoals}-${opponentGoals}.`;
    statusMessage.textContent = "Victory! A strong finish in the final minutes.";
  } else if (playerGoals < opponentGoals) {
    matchSummaryEl.textContent = `${opponentCountry} wins ${opponentGoals}-${playerGoals} over ${chosenCountry}.`;
    statusMessage.textContent = "The match slipped away. Try another country.";
  } else {
    matchSummaryEl.textContent = `${chosenCountry} and ${opponentCountry} draw ${playerGoals}-${opponentGoals}.`;
    statusMessage.textContent = "A hard-fought draw. Take another shot.";
  }
}

populateCountries();
playButton.addEventListener("click", playMatch);
