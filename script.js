const API_KEY = "AIzaSyBRWvI5Sx4URj7oC5qdy2C-L7snYCd5zQ0";
const RANGE = "data!A1:Z9999";
const SPREADSHEET_ID = "1p2jQxopbxImai3jTx96olNqHfOy5OmCkv0pINGxQcws";
const URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

const form = document.getElementById("form");

let responses = [];


function filtreElements(tableau, responses) {
  // Filtrer les éléments en fonction des réponses de l'utilisateur
  let randomArray = [];
  const response = responses[0];
  const elementsFiltres = tableau.filter(element => {
    if(parseInt(element.age) <= response.age && parseInt(element.budget) <= response.budget) {
      return true 
    } else {
      return false
    }
  });
  // Renvoyer les 3 premiers éléments filtrés
  if (elementsFiltres.length === 0) {
    console.log("Il n'y a pas de valeur correspondante");
  } else {
    for (let i = 0; i <= elementsFiltres.length && i < 3; i++) {
      // Générer un index aléatoire entre 0 et la longueur du tableau
      const indexAleatoire = Math.floor(Math.random() * elementsFiltres.length);
  
      // Ajouter l'élément correspondant à l'index aléatoire dans le tableau d'éléments aléatoires
      randomArray.push(elementsFiltres[indexAleatoire]);
  
      // Retirer l'élément sélectionné pour éviter les doublons
      elementsFiltres.splice(indexAleatoire, 1);
    }
  }
  return randomArray;
}
//Permet de récupérer le données du google sheet et de creer les items
const letsgo = () => {
  fetch(URL)
    .then(response => response.json())
    .then(data => {
      const values = data.values;
      const headers = values[0];
      const rows = values.slice(1);
              
      const results = rows.map(row => {
        return headers.reduce((obj, header, index) => {
          obj[header] = row[index];
          return obj;
        }, {});
      });
      console.log(results)
      const presentsDiv = document.getElementById("presents");
      console.log(presentsDiv)
      const elemfiltered = filtreElements(results, responses)
      console.log(elemfiltered)
      elemfiltered.forEach(el => {
        console.log(el)
        const elementHtml = `
          <a href="${el.lien}" target="_blank">
            <img src="${el.image}">
            <p>${el.name}</p>
          </a>
        `;
        presentsDiv.innerHTML += elementHtml;
      });


    })
    .catch(error => console.error(error));
}


// Ecouteur d'événement pour le formulaire
form.addEventListener("submit", async function(event) {
  event.preventDefault();
  const budget = parseInt(document.getElementById("budget").value);
  const age = parseInt(document.getElementById("age").value);
  
  // Récupération des valeurs des champs du formulaire
  // const gender = document.querySelector("#gender").value;
  // const interests = document.getElementById("interests").value;
  // const hobbies = document.getElementById("hobbies").value;
  
  // Stockage des réponses dans le tableau
  responses.push({
    budget,
    age,
    // gender,
    // interests,
    // hobbies
  });

  console.log(responses)

  const filteredResult = await letsgo();
  console.log(filteredResult);

  // Réinitialisation des champs du formulaire
  form.reset();
});


