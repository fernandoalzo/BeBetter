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

      this.messages = data.map((item) => item.phrase);
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
      return "No hay frases para mostrar.";
    }

    const randomMessage =
      this.messages[Math.floor(Math.random() * this.messages.length)];
    return randomMessage;
  }
}
