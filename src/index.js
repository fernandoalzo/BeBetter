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
  }

  createCarouselItem({ phrase, autor }) {
    const item = document.createElement("div");
    item.className = "carousel-item";
    item.innerHTML = `
      <div class="carousel-phrase">"${phrase}" <br> <br> - ${autor} - </div>
    `;
    return item;
  }

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

    // Añadir event listeners
    this.prevBtn.addEventListener("click", (e) => this.prevSlide(e));
    this.nextBtn.addEventListener("click", (e) => this.nextSlide(e));
  }

  async nextSlide(e) {
    if (e) e.preventDefault();

    // Si estamos en el último elemento, cargar uno nuevo
    if (this.currentIndex === this.phraseManager.phrases.length - 1) {
      const newPhrase = await this.phraseManager.loadMorePhrases();
      const newItem = this.createCarouselItem(newPhrase);
      this.carouselInner.appendChild(newItem);
    }

    // Mover el carrusel
    this.currentIndex++;
    this.carouselInner.style.transform = `translateX(-${
      this.currentIndex * 100
    }%)`;
  }

  prevSlide(e) {
    if (e) e.preventDefault();

    // Asegurarse de no ir más allá del primer elemento
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.carouselInner.style.transform = `translateX(-${
        this.currentIndex * 100
      }%)`;
    }
  }
}

// Clase principal para orquestar las otras clases
class Index {
  constructor() {
    this.randomGenerator = new Random();
    this.phraseManager = new PhraseManager(this.randomGenerator);
    this.carousel = new Carousel(this.phraseManager);
  }

  async Main() {
    // Cargar las primeras frases
    await this.phraseManager.loadInitialPhrases(3);

    // Inicializar carrusel
    this.carousel.initCarousel();
  }
}

window.onload = function () {
  const index = new Index();
  index.Main();
};
