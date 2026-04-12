const API_URL = "http://localhost:8000/api/v1/titles/";

const modal = document.getElementById("modal-window");
const modalTitle = document.getElementById("modal-titre");
const modalImg = document.getElementById("modal-image");
const modalAnnee = document.getElementById("modal-annee");
const modalCategories = document.getElementById("modal-categories");
const modalRated = document.getElementById("modal-rated");
const modalDuree = document.getElementById("modal-duree");
const modalCountry = document.getElementById("modal-country");
const modalImdb = document.getElementById("imdb");
const modalRecettes = document.getElementById("recettes");
const modalRealisateur = document.getElementById("realisateur");
const modalSynopsis = document.getElementById("modal-synopsis");
const modalActeurs = document.getElementById("modal-acteurs");
const modalClose = document.getElementById("modal-close");


async function apiCall(url) {
    const APIReponse = await fetch(url)
    const APIDatas = await APIReponse.json()
    return APIDatas
}

async function getGenreSortedList(genre) {
    const GenreURL = API_URL + "?genre=" + genre + "&sort_by=-imdb_score&page_size=100" ;
    return GenreURL
}

async function getSortedList() {
    const URL = (API_URL + "?sort_by=-imdb_score&page_size=100");
    return URL
}

async function getFilmDetails(filmID) {
    const FilmUrl = API_URL + filmID;
    const FilmUrlResponse = await fetch(FilmUrl);
    const FilmDetails = await FilmUrlResponse.json();
    return FilmDetails;
}

async function majMeilleurFilm() {
    const SortedURL = await getSortedList();
    const APIReponse = await apiCall(SortedURL);
    const MeilleurFilm = APIReponse.results[0];

    const article = document.getElementById("meilleur-film");
    const h3 = article.querySelector("h3");
    const img = article.querySelector("img");
    const p = article.querySelector("p");
    const button = article.querySelector("button");

    h3.textContent = MeilleurFilm.title;

    const FilmDetails = await getFilmDetails(MeilleurFilm.id)

    p.textContent = FilmDetails.description
    
    img.src = MeilleurFilm.image_url;
    img.alt = "Affiche " + MeilleurFilm.title;

    img.onerror = () => {
        img.onerror = null;
        img.src = "images/error.png";
        img.alt = "Affiche non disponible";
    };
    modalButton(button, MeilleurFilm.id)
}

async function majFilmsLesMieuxNotes() {
    const SortedURL = await getSortedList();
    const APIDatas = await apiCall(SortedURL);
    const MieuxNotes = APIDatas.results;
    
    
    const section = document.getElementById("films-les-mieux-notés")
    const grille = section.querySelector(".grille");
    const article = grille.querySelectorAll("article");

    for (let i = 0; i < MieuxNotes.length; i++) {
        
        const img = article[i].querySelector("img");
        img.src = MieuxNotes[i].image_url;
        img.alt = "Affiche "  + MieuxNotes[i].titre

        img.onerror = () => {
            img.onerror = null;
            img.src = "images/error.png";
            img.alt = "Affiche non disponible";
        };

        const h3 = article[i].querySelector("h3");
        h3.textContent = MieuxNotes[i].title;

        const button = article[i].querySelector("button");
        modalButton(button, MieuxNotes[i].id)
        }
}

async function majFilmsLesMieuxNotesParGenre(genre, sectionId) {
    const APIUrl = await getGenreSortedList(genre);
    const APIDatasSorted = await apiCall(APIUrl);
    const MieuxNotes = APIDatasSorted.results;
    
    const section = document.getElementById(sectionId)
    const h2 = section.querySelector("h2")
    const grille = section.querySelector(".grille");
    const article = grille.querySelectorAll("article");

    if (sectionId !== "autres"){
        h2.textContent = genre
    }else{
        h2.textContent = "Autres: "
    };

    article.forEach(a => a.style.display = "");

    for (let i = 0; i < MieuxNotes.length; i++) {
        
        const img = article[i].querySelector("img");
        img.src = MieuxNotes[i].image_url;
        img.alt = "Affiche "  + MieuxNotes[i].titre

        img.onerror = () => {
            img.onerror = null;
            img.src = "images/error.png";
            img.alt = "Affiche non disponible";
        };

        const h3 = article[i].querySelector("h3");
        h3.textContent = MieuxNotes[i].title;

        const button = article[i].querySelector("button");
        modalButton(button, MieuxNotes[i].id)
        }
        
        if (MieuxNotes.length < 6){
            for (let i = MieuxNotes.length ; i < 6; i++){
                article[i].style.display = "none";
            }
        }
}

const voirBtn = document.querySelectorAll(".voir")
voirBtn.forEach(btn => {
    btn.addEventListener("click", function() {
        const grille = btn.parentElement.querySelector(".grille")
        grille.classList.toggle("etendue")
        btn.textContent = grille.classList.contains("etendue") ? "Voir moins" : "Voir plus"
    })
})

const menuDeroulant = document.getElementById("menu-déroulant");

async function menuDeroulantFill() {
    const URLGenres = await fetch ("http://localhost:8000/api/v1/genres/?page_size=100");
    const APIReponse = await URLGenres.json();
    const APIDatas = APIReponse.results
    const select = menuDeroulant.querySelector("select");
    select.innerHTML = "";
    
    for (let i = 0; i < APIDatas.length ; i++) {
        const option = document.createElement("option");
        option.textContent = APIDatas[i].name
        select.appendChild(option);
    }
}

menuDeroulant.addEventListener("change", async function(event) {
    const genreChoisi = event.target.value;
    majFilmsLesMieuxNotesParGenre(genreChoisi, "autres")
})

function modalButton(button, filmId){
    button.onclick = async function() {
        const response = await fetch(API_URL + filmId);
        const filmDetail = await response.json();

        modalTitle.textContent = filmDetail.title;
        modalImg.src = filmDetail.image_url;
        modalImg.alt = "Affiche " + filmDetail.title;

        modalImg.onerror = () => {
            modalImg.onerror = null;
            modalImg.src = "images/error.png";
            modalImg.alt = "Affiche non disponible";
        };
    
        modalAnnee.textContent = filmDetail.year + " - ";
        modalCategories.textContent = filmDetail.genres.join(", ");
        modalRated.textContent = (filmDetail.rated || "") + " - ";
        modalDuree.textContent = (filmDetail.duration || "") + " minutes ";
        modalCountry.textContent = "(" + (filmDetail.countries || []).join("/") + ")";
        modalImdb.textContent = "IMDB score: " + filmDetail.imdb_score + "/10";
        modalRecettes.textContent = "Recettes au box-office: " + (filmDetail.worldwide_gross_income || "N/A");

        modalRealisateur.textContent = (filmDetail.directors || []).join(", ");
        modalSynopsis.textContent = filmDetail.long_description || filmDetail.description || "";
        modalActeurs.textContent = (filmDetail.actors || []).join(", ");

        // afficher la modale
        modal.classList.add("visible");
    }
}

const mobileCloseButton = document.getElementById("mobile-modal-close");

document.addEventListener("DOMContentLoaded", () => {
    majMeilleurFilm()
    majFilmsLesMieuxNotes()
    menuDeroulantFill()
    majFilmsLesMieuxNotesParGenre("Action", "categorie-1")
    majFilmsLesMieuxNotesParGenre("Animation", "categorie-2")
    majFilmsLesMieuxNotesParGenre("Action", "autres")

    modalClose.addEventListener("click", () => {
        modal.classList.remove("visible");
    })
    mobileCloseButton.addEventListener("click", () =>{
        modal.classList.remove("visible")
    })
})