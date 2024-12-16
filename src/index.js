class Index {
  constructor() {
    this.randomGenerator = new Random();
  }

  async message() {
    const randomMessage = await this.randomGenerator.getMessage();
    return randomMessage;
  }
  async Main() {
    const randomMessage = await this.message();
    document.getElementById("message").innerText = randomMessage;
  }
}

window.onload = function () {
  const index = new Index();
  index.Main();
};
