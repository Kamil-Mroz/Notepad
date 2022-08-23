const form = document.querySelector(".form");
const btnAdd = document.querySelector(".btn-add");
const btnView = document.querySelector(".btn-view");
const btnGenerateText = document.querySelector(".btn-generate");
const inputTitle = document.getElementById("noteTitle");
const inputText = document.getElementById("noteText");
const main = document.querySelector(".main");
let titlePopup = document.getElementById("popupTitle");
let textPopup = document.getElementById("popupText");

class Note {
  #note = {};
  #id = 0;
  constructor() {
    this._getLocalStorage();

    form.addEventListener("submit", this._createNote.bind(this));
    btnGenerateText.addEventListener("click", this._generateText.bind(this));
  }

  _createNote(e) {
    e.preventDefault();

    const title = inputTitle.value;
    const text = inputText.value;

    if (!title || !text) return;

    inputTitle.value = inputText.value = "";

    this.#note[this.#id] = { id: this.#id, title: title, text: text };
    this._render(this.#note[this.#id]);
    this.#id += 1;

    this._setLocalStorage();
  }
  _render(data) {
    let html = `
    <div class="page" data-id="${data.id}">
        <p class="title">${data.title}</p>
        <p class="text">
          ${
            data.text.length < 150
              ? data.text
              : data.text.slice(0, 250) + " ..."
          }
        </p>
        <div class="btn btn-view">View</div>
      </div>
    `;
    main.insertAdjacentHTML("beforeend", html);
  }

  _setLocalStorage() {
    localStorage.setItem("note", JSON.stringify(this.#note));
  }

  _getLocalStorage() {
    this.#note = JSON.parse(localStorage.getItem("note"));
    if (!this.#note || Object.keys(this.#note).length === 0)
      return (this.#note = {});

    this.#id = +Object.keys(this.#note).at(-1) + 1;

    for (const el of Object.values(this.#note)) {
      this._render(el);
    }
  }

  _generateText() {
    let text = "";
    const words = Math.floor(Math.random() * 50) + 150;
    for (let i = 0; i < words; i++) {
      text += ` ${this._makeWork(Math.floor(Math.random() * 7))}`;
    }
    inputText.value = text;
  }

  _makeWork(letters) {
    let result = "";
    const characters = "abcdefghijklmnopqrstuvwxyz";
    const charactersLength = characters.length;
    for (let i = 0; i < letters; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}

const note = new Note();
