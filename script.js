const API_KEY = "AIzaSyBRWvI5Sx4URj7oC5qdy2C-L7snYCd5zQ0";
const RANGE = "data!A1:Z9999";
const SPREADSHEET_ID = "1p2jQxopbxImai3jTx96olNqHfOy5OmCkv0pINGxQcws";
const URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

const form = document.getElementById("form");
const presentsDiv = document.getElementById("presents");
const showMoreBtn = document.getElementById("show-more");
let elements = [];

// Récupère les données du Google Sheet
async function fetchData() {
  const response = await fetch(URL);
  const data = await response.json();
  const values = data.values;
  const headers = values[0];
  const rows = values.slice(1);
  
  elements = rows.map(row => {
    return headers.reduce((obj, header, index) => {
      obj[header] = row[index];
      return obj;
    }, {});
  });
}



// Filtrage des éléments en fonction des réponses du formulaire
function filterElements(responses) {
  const filteredElements = elements.filter(element => {
    const age = parseInt(responses.age);
    const budget = parseInt(responses.budget);
    return parseInt(element.age) <= age && parseInt(element.budget) <= budget;
  });
  showMoreBtn.addEventListener("click", () => {
    displayElements(filteredElements);
  });
  return filteredElements;
}

// Sélection de 3 éléments aléatoires parmi les éléments filtrés
function selectRandomElements(filteredElements) {
  if (filteredElements.length === 0) {
    console.log("Pas de cadeau pour toi, nique ta race héhé");
    return [];
  }
  const randomElements = [];
  while (randomElements.length < 3 && filteredElements.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredElements.length);
    randomElements.push(filteredElements[randomIndex]);
    filteredElements.splice(randomIndex, 1);
  }
  return randomElements;
}

// Affichage des éléments sur la page
const displayElements = (randomElements) => {
  randomElements.forEach(element => {
    const link = document.createElement("a");
    link.href = element.lien;
    link.target = "_blank";
    
    const image = document.createElement("img");
    image.src = element.image;
    link.appendChild(image);
    
    const name = document.createElement("p");
    name.textContent = element.name;
    link.appendChild(name);
    
    presentsDiv.appendChild(link);
  });
}

// Réinitialisation des champs du formulaire
function resetForm() {
  form.reset();
}

// Ecouteur d'événement pour le formulaire
form.addEventListener("submit", async function(event) {
  event.preventDefault();
  
  // Récupération des valeurs des champs du formulaire
  const responses = {
    age: document.getElementById("age").value,
    budget: document.getElementById("budget").value
  };
  
  // Récupération des données du Google Sheet si ce n'est pas déjà fait
  if (elements.length === 0) {
    await fetchData();
  }
  
  const filteredElements = filterElements(responses);
  const randomElements = selectRandomElements(filteredElements);
  displayElements(randomElements);
  resetForm();
});



