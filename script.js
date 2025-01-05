// Exemple de code JavaScript pour afficher plusieurs galeries avec des onglets

// Fonction principale pour charger et afficher les galeries dynamiques
async function loadGalleries(jsonURL = "images.json") {
  try {
    // Récupération dynamique de l'URL du fichier JSON
    const response = await fetch(jsonURL);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! status: ${response.status}`);
    }

    // Récupération de la liste des galeries et images
    const galleries = await response.json();

    // Sélection de l'élément HTML où afficher les galeries
    const galleryContainer = document.getElementById("gallery-container");
    const tabsContainer = document.getElementById("tabs-container");

    // Création des onglets pour chaque galerie
    Object.keys(galleries).forEach((galleryName, index) => {
      // Création de l'onglet
      const tabButton = document.createElement("button");
      tabButton.textContent = galleryName;
      tabButton.classList.add("tab-button");
      if (index === 0) tabButton.classList.add("active"); // Activer le premier onglet par défaut

      tabButton.addEventListener("click", () => {
        // Mettre à jour l'affichage des galeries
        document
          .querySelectorAll(".tab-button")
          .forEach((btn) => btn.classList.remove("active"));
        tabButton.classList.add("active");
        displayGallery(galleryName, galleries[galleryName]);
      });

      tabsContainer.appendChild(tabButton);

      // Afficher la première galerie par défaut
      if (index === 0) {
        displayGallery(galleryName, galleries[galleryName]);
      }
    });
  } catch (error) {
    console.error("Erreur lors du chargement des galeries:", error);
  }
}

// Fonction pour afficher une galerie donnée
function displayGallery(name, images) {
  const galleryContainer = document.getElementById("gallery-container");
  galleryContainer.innerHTML = ""; // Réinitialiser le conteneur

  // Ajouter un titre pour la galerie
  const title = document.createElement("h2");
  title.textContent = name;
  galleryContainer.appendChild(title);

  // Ajouter les images de la galerie
  images.forEach((image) => {
    const imgContainer = document.createElement("div");
    imgContainer.style.display = "flex";
    imgContainer.style.flexDirection = "column";
    imgContainer.style.alignItems = "center";
    imgContainer.style.margin = "10px";

    const imgElement = document.createElement("img");
    imgElement.src = `images/${name}/${image.file}`; // Le chemin doit inclure le nom du dossier
    imgElement.alt = image.caption;
    imgElement.classList.add("gallery-image"); // Ajoutez une classe pour le style si nécessaire
    imgElement.style.width = "calc(100% / 3 - 20px)";
    imgElement.style.borderRadius = "5px";
    imgElement.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    imgElement.style.objectFit = "cover";

    const caption = document.createElement("p");
    caption.textContent = image.caption;
    caption.style.textAlign = "center";
    caption.style.marginTop = "5px";
    caption.style.fontSize = "14px";
    caption.style.color = "#555";

    imgContainer.appendChild(imgElement);
    imgContainer.appendChild(caption);
    galleryContainer.appendChild(imgContainer);
  });
}

// Appel de la fonction après le chargement de la page
// L'URL JSON peut être spécifiée dynamiquement en ajoutant un attribut de données dans le script HTML
window.onload = () => {
  const scriptTag = document.currentScript;
  const jsonURL = scriptTag.getAttribute("data-json-url") || "images.json";
  loadGalleries(jsonURL);
};
