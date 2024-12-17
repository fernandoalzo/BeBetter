class PhraseManager {
  constructor(randomGenerator) {
    this.randomGenerator = randomGenerator;
    this.phrases = []; // Array para almacenar las frases con autores
  }

  async fetchPhrase() {
    const randomMessage = await this.randomGenerator.getMessage();
    return randomMessage; // Ahora retorna un objeto con `phrase` y `autor`
  }

  async loadInitialPhrases(count) {
    for (let i = 0; i < count; i++) {
      const phrase = await this.fetchPhrase();
      this.phrases.push(phrase);
    }
    return this.phrases;
  }

  async loadMorePhrases() {
    const newPhrase = await this.fetchPhrase();
    this.phrases.push(newPhrase);
    return newPhrase;
  }
}

// Clase para manejar el carrusel
class Carousel {
  constructor(phraseManager) {
    this.phraseManager = phraseManager;
    this.carousel = null;
    this.carouselInner = null;
    this.prevBtn = null;
    this.nextBtn = null;
    this.currentIndex = 0;

    // Lista de imágenes para los fondos
    this.backgroundImages = [
      'url("./img/stoicism/1.png")',
      'url("./img/stoicism/2.jpg")',
      'url("./img/stoicism/3.jpg")',
      'url("./img/stoicism/4.jpg")',
      'url("./img/stoicism/5.jpg")',
      'url("./img/stoicism/6.jpg")',
      'url("./img/stoicism/7.jpg")',
      'url("./img/stoicism/8.jpg")',
      'url("./img/stoicism/9.jpg")',
    ];
  }

  // Método para actualizar el fondo de la página
  updateBackgroundImage() {
    // Cambia el fondo según el índice actual
    document.body.style.backgroundImage =
      this.backgroundImages[this.currentIndex];
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.transition = "background-image 1s ease-in-out";
  }

  // Crear un item para el carrusel
  createCarouselItem({ phrase, autor }) {
    const item = document.createElement("div");
    item.className = "carousel-item";
    item.innerHTML = `
      <div class="carousel-phrase">"${phrase}" <br> <br> - ${autor} - </div>
    `;
    return item;
  }

  // Inicializar el carrusel
  async initCarousel() {
    this.carousel = document.querySelector(".carousel");
    this.carouselInner = document.querySelector(".carousel-inner");
    this.prevBtn = document.querySelector(".prev");
    this.nextBtn = document.querySelector(".next");

    // Limpiar contenido inicial
    this.carouselInner.innerHTML = "";

    // Crear los primeros elementos del carrusel
    const phrases = this.phraseManager.phrases;
    phrases.forEach((phrase) => {
      const carouselItem = this.createCarouselItem(phrase);
      this.carouselInner.appendChild(carouselItem);
    });

    // Actualizar el fondo inicial
    this.updateBackgroundImage();

    // Añadir event listeners
    this.prevBtn.addEventListener("click", (e) => this.prevSlide(e));
    this.nextBtn.addEventListener("click", (e) => this.nextSlide(e));
  }

  // Mover al siguiente slide
  async nextSlide(e) {
    if (e) e.preventDefault();

    // Si estamos en el último elemento, cargar uno nuevo
    if (this.currentIndex === this.phraseManager.phrases.length - 1) {
      const newPhrase = await this.phraseManager.loadMorePhrases();
      const newItem = this.createCarouselItem(newPhrase);
      this.carouselInner.appendChild(newItem);

      // Agregar una nueva imagen (puedes hacerlo dinámicamente)
      this.backgroundImages.push('url("./img/stoicism/1.png")');
    }

    // Mover al siguiente slide
    this.currentIndex++;
    this.carouselInner.style.transform = `translateX(-${
      this.currentIndex * 100
    }%)`;

    // Actualizar el fondo
    this.updateBackgroundImage();
  }

  // Mover al slide anterior
  prevSlide(e) {
    if (e) e.preventDefault();

    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.carouselInner.style.transform = `translateX(-${
        this.currentIndex * 100
      }%)`;

      // Actualizar el fondo
      this.updateBackgroundImage();
    }
  }
}

// Clase principal para orquestar las otras clases
class Index {
  constructor() {
    this.randomGenerator = new Random(); // Asegúrate de que esta clase exista y funcione
    this.phraseManager = new PhraseManager(this.randomGenerator);
    this.carousel = new Carousel(this.phraseManager);
  }

  // Método principal para inicializar
  async Main() {
    // Cargar las primeras frases
    await this.phraseManager.loadInitialPhrases(3);

    // Inicializar carrusel
    this.carousel.initCarousel();
  }
}

// Al cargar la página, inicializar el carrusel
window.onload = function () {
  const index = new Index();
  index.Main();
};
