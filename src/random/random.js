class Random {
  constructor() {
    this.jsonFilePath = "./../frases.json";
    this.messages = [];
  }

  async loadMessages() {
    try {
      const response = await fetch(this.jsonFilePath);
      if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${response.status}`);
      }
      const data = await response.json();

      // Guardamos los objetos completos en lugar de solo las frases
      this.messages = data.map((item) => ({
        phrase: item.phrase,
        autor: item.autor,
      }));
    } catch (error) {
      console.error("Hubo un problema al cargar los mensajes:", error);
    }
  }

  async getMessage() {
    await this.loadMessages();
    if (this.messages.length === 0) {
      console.warn(
        "La lista de mensajes está vacía. Asegúrate de llamar a loadMessages() primero."
      );
      return { phrase: "No hay frases para mostrar.", autor: null };
    }

    const randomMessage =
      this.messages[Math.floor(Math.random() * this.messages.length)];
    return randomMessage; // Retornamos un objeto con 'phrase' y 'autor'
  }
}
