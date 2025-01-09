// Fichier: script.js

const galleryContainer = document.getElementById("gallery");

/**
 * Crée un élément de la galerie pour une image donnée
 * @param {string} image - Nom de l'image
 * @param {string} caption - Légende de l'image
 * @returns {HTMLElement}
 */
function createGalleryItem(image, caption) {
  const item = document.createElement("div");
  item.className = "gallery-item";

  const img = document.createElement("img");
  img.dataset.src = `images/${image}`; // Chargement différé via data-src
  img.alt = caption;
  img.className = "lazy-image";

  const captionElem = document.createElement("div");
  captionElem.className = "caption";
  captionElem.textContent = caption;

  item.appendChild(img);
  item.appendChild(captionElem);

  return item;
}

/**
 * Fonction pour charger les images visibles
 * @param {IntersectionObserverEntry[]} entries - Entrées d'observation
 * @param {IntersectionObserver} observer - L'observateur
 */
function lazyLoadImages(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // Charger l'image
      img.onload = () => img.classList.add("loaded"); // Ajoute une classe après chargement
      observer.unobserve(img); // Arrêter d'observer l'image une fois chargée
    }
  });
}

/**
 * Charge et affiche les images depuis le fichier JSON
 */
function loadGallery() {
  fetch("images.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Parcourir chaque dossier et ajouter les images à la galerie
      Object.keys(data).forEach((folder) => {
        if (data[folder].files) {
          data[folder].files.forEach((file) => {
            const galleryItem = createGalleryItem(file.file, file.caption);
            galleryContainer.appendChild(galleryItem);
          });
        }
      });

      // Configurer l'observateur pour lazy loading
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
}

// Charger la galerie au chargement de la page
loadGallery();
