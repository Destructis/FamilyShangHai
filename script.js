// Exemple de code JavaScript pour afficher plusieurs galeries avec des onglets

// Fonction principale pour charger et afficher les galeries dynamiques
async function loadGalleries(jsonURL = "./images.json") {
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

    // Style réactif pour ajuster le nombre d'images par ligne
    imgElement.style.width = "100%";
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

  // Appliquer des classes pour le responsive
  galleryContainer.classList.add("gallery-grid");
  applyResponsiveStyles();
}

// Fonction pour appliquer les styles réactifs dynamiquement
function applyResponsiveStyles() {
  const styleTag =
    document.getElementById("responsive-styles") ||
    document.createElement("style");
  styleTag.id = "responsive-styles";
  document.head.appendChild(styleTag);

  styleTag.textContent = `
      .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
      }
  `;
}

// Appel de la fonction après le chargement de la page
// L'URL JSON peut être spécifiée dynamiquement en ajoutant un attribut de données dans le script HTML
window.onload = () => {
  const scriptTag = document.querySelector('script[src="script.js"]');
  const jsonURL = scriptTag?.getAttribute("data-json-url") || "images.json";
  loadGalleries(jsonURL);
};

// Fichier: script.js

const galleryContainer = document.getElementById("gallery");

// Fonction pour créer des éléments de la galerie
function createGalleryItem(image, caption) {
  const item = document.createElement("div");
  item.className = "gallery-item";

  const img = document.createElement("img");
  img.dataset.src = `images/${image}`;
  img.alt = caption;
  img.className = "lazy-image";

  const captionElem = document.createElement("div");
  captionElem.className = "caption";
  captionElem.textContent = caption;

  item.appendChild(img);
  item.appendChild(captionElem);

  return item;
}

// Fonction pour charger les images visibles
function lazyLoadImages(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // Charger l'image
      img.onload = () => img.classList.add("loaded"); // Transition visible après le chargement
      observer.unobserve(img); // Arrêter d'observer une fois chargé
    }
  });
}

// Charger le JSON contenant les données des images
fetch("images.json")
  .then((response) => response.json())
  .then((data) => {
    // Parcourir chaque dossier
    Object.keys(data).forEach((folder) => {
      if (data[folder].files) {
        data[folder].files.forEach((file) => {
          const galleryItem = createGalleryItem(file.file, file.caption);
          galleryContainer.appendChild(galleryItem);
        });
      }
    });

    // Configurer IntersectionObserver
    const observer = new IntersectionObserver(lazyLoadImages, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    });

    // Observer chaque image
    const images = document.querySelectorAll(".lazy-image");
    images.forEach((image) => observer.observe(image));
  })
  .catch((error) =>
    console.error("Erreur lors du chargement des images JSON:", error)
  );
