const form = document.querySelector('.form')
const btnAdd = document.querySelector('.btn-add')
const btnView = document.querySelector('.btn-view')
const btnClose = document.querySelector('.close')
const btnEdit = document.querySelector('.edit')
const btnDel = document.querySelector('.btn-delete')
const btnDone = document.querySelector('.btn-done')
const btnGenerateText = document.querySelector('.btn-generate')
const inputTitle = document.getElementById('noteTitle')
const inputText = document.getElementById('noteText')
const main = document.querySelector('.main')
const popupEl = document.querySelector('.popup')
const overlayEl = document.querySelector('.overlay')
let titlePopup = document.getElementById('popupTitle')
let textPopup = document.getElementById('popupText')
const btnPopup = document.querySelector('.buttons-popup')

class Note {
  #note = {}
  #id = 0
  constructor() {
    this._getLocalStorage()

    form.addEventListener('submit', this._createNote.bind(this))
    btnGenerateText.addEventListener('click', this._generateText.bind(this))
    main.addEventListener('click', this._showPopup.bind(this))
    overlayEl.addEventListener('click', this._closePopup.bind(this))
    popupEl.addEventListener('click', this._closePopup.bind(this))
    btnEdit.addEventListener('click', this._editNote.bind(this))
    btnDone.addEventListener('click', this._changeDataNote.bind(this))
    btnDel.addEventListener('click', this._delNotes.bind(this))
  }

  _createNote(e) {
    e.preventDefault()

    const title = inputTitle.value
    const text = inputText.value

    if (!title || !text) return

    inputTitle.value = inputText.value = ''

    this.#note[this.#id] = { id: this.#id, title: title, text: text }
    this._render(this.#note[this.#id])
    this.#id += 1

    this._setLocalStorage()
  }
  _render(data) {
    let html = `
    <div class="page" data-id="${data.id}">
        <p class="title">${data.title}</p>
        <p class="text">
          ${
            data.text.length < 150 ? data.text : data.text.slice(0, 150) + '...'
          }
        </p>
        <div class="btn btn-view">View</div>
      </div>
    `
    main.insertAdjacentHTML('afterbegin', html)
  }

  _showPopup(e) {
    e.preventDefault()
    const open = e.target.closest('.btn-view')
    if (!open) return
    const id = e.target.closest('.page').dataset['id']

    ;[overlayEl, popupEl].forEach((el) => {
      el.classList.remove('hidden')
    })
    this._renderPopup(this.#note[id])
    this.#note['editedId'] = id
  }
  _closePopup(e) {
    const overlay = e.target.closest('.overlay')
    const close = e.target.closest('.close')
    if (overlay || close) {
      ;[overlayEl, popupEl].forEach((el) => {
        el.classList.add('hidden')
      })
      this._closeEdit()
      btnEdit.classList.remove('open')
    }
  }
  _editNote(e) {
    const id = this.#note['editedId']

    if (!e.target.closest('.open')) {
      titlePopup.disabled = false
      textPopup.disabled = false
      btnDone.classList.remove('hidden')
      btnEdit.classList.add('open')
    } else {
      btnEdit.classList.remove('open')
      this._closeEdit()
      titlePopup.value = this.#note[id].title
      textPopup.value = this.#note[id].text
    }
  }
  _closeEdit() {
    titlePopup.disabled = true
    textPopup.disabled = true
    btnDone.classList.add('hidden')
  }

  _changeDataNote(e) {
    e.preventDefault()

    const id = this.#note['editedId']
    delete this.#note[id]
    this.#note[id] = {
      id: +id,
      title: titlePopup.value,
      text: textPopup.value,
    }

    titlePopup.disabled = true
    textPopup.disabled = true
    btnDone.classList.add('hidden')
    btnEdit.classList.remove('open')
    for (const page of Object.values(main.children)) {
      if (page.dataset['id'] === id) page.remove()
    }

    this._render(this.#note[id])
    delete this.#note['editedId']
    this._setLocalStorage()
  }

  _renderPopup(data) {
    titlePopup.value = data.title
    textPopup.value = data.text
  }

  _delNotes() {
    main.innerHTML = ''
    localStorage.clear()
  }

  _setLocalStorage() {
    localStorage.setItem('note', JSON.stringify(this.#note))
  }

  _getLocalStorage() {
    this.#note = JSON.parse(localStorage.getItem('note'))
    if (!this.#note || Object.keys(this.#note).length === 0) {
      return (this.#note = {})
    }

    this.#id = +Object.keys(this.#note).at(-1) + 1

    for (const [key, el] of Object.entries(this.#note)) {
      if (key === 'editedId') return
      this._render(el)
    }
  }

  _generateText() {
    let text = ''
    const words = Math.floor(Math.random() * 50) + 150
    for (let i = 0; i < words; i++) {
      text += ` ${this._makeWork(Math.floor(Math.random() * 7))}`
    }
    inputText.value = text
  }

  _makeWork(letters) {
    let result = ''
    const characters = 'abcdefghijklmnopqrstuvwxyz'
    const charactersLength = characters.length
    for (let i = 0; i < letters; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }
}

const note = new Note()
