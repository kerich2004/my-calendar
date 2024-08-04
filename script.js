const calendar = document.querySelector('.calendar')
const dayCells = document.querySelectorAll('.day-number')
const dateInput = document.querySelector('input')
const monthOut = document.querySelector('.month')
const [prevBtn, nextBtn, okBtn, hideListBtn, clearNotesBtn, addBtn, editBtn, deleteBtn, cancelBtn] = document.querySelectorAll('button')
const timeSpan = document.querySelector('span')
const ol = document.querySelector('ol')
const li = document.querySelectorAll('li')
const dialog = document.getElementById('dialog')
const form = document.querySelector('form')
const selectTypeNote = document.querySelector('#type-note')
const sortNoteSelect = document.querySelector('#sort-select')
const sortBlock = document.querySelector('.sort-notes-block')

const ls = localStorage

prevBtn.addEventListener('click', prevMonth)
nextBtn.addEventListener('click', nextMonth)
okBtn.addEventListener('click', showInputDate)
ol.addEventListener('click', showDialog)

let date = new Date()
let year = date.getFullYear()
let month = date.getMonth()
const today = date.getDate() - 1
let dateValue = dateInput.value
let currentItem = ''
let index = 0

calendar.onclick = showDialog
dialog.onsubmit = createNote
cancelBtn.onclick = hideDialog
editBtn.onclick = editNote
deleteBtn.onclick = deleteNote
hideListBtn.onclick = hideList
clearNotesBtn.onclick = clearNotes
sortNoteSelect.onchange = changeSort

let notes = JSON.parse(ls.getItem('notes')) || []

setInterval(showTime, 1000)
renderCalendar()

function renderCalendar() {
  let firstDay = new Date(year, month, 1).getDay() - 1
  let lastDate = new Date(year, month + 1, 0).getDate()

  dateInput.value = `${year}-${String(month + 1).padStart(2, '0')}-${lastDate}`

  if (firstDay < 0) firstDay = 6

  monthOut.innerText = date.toLocaleString('ru-RU', { month: 'long' }).toUpperCase() + ' ' + year

  for (let i = 1, j = firstDay; i <= lastDate; i++, j++) {
    dayCells[j].innerText = i
    dayCells[j].dataset.date = `${year}-${(month + 1).toString().padStart(2, 0)}-${i.toString().padStart(2, 0)}`
  }

  renderNotes()
  showWeekends()
  showToday(firstDay)
  showPrevMonthDays(firstDay)
  showNextMonthDays(firstDay, lastDate)
}

function showPrevMonthDays(firstDay) {
  const lastDatePrevMonth = new Date(year, month, 0)
  let lastDayPrevMonth = lastDatePrevMonth.getDate()

  if (firstDay != 0) {
    const year = lastDatePrevMonth.getFullYear()
    const month = lastDatePrevMonth.getMonth()

    for (let i = firstDay - 1; i >= 0; i--, lastDayPrevMonth--) {
      dayCells[i].innerText = lastDayPrevMonth
      dayCells[i].classList.add('another-month-day')
      dayCells[i].dataset.date = `${year}-${(month + 1).toString().padStart(2, 0)}-${lastDayPrevMonth.toString().padStart(2, 0)}`
    }
  }
}

function showNextMonthDays(firstDay, lastDate) {
  const m = (month + 1) % 12
  const y = year + (month == 0)

  for (let i = firstDay + lastDate, j = 1; i < dayCells.length; i++, j++) {
    dayCells[i].innerHTML = j
    dayCells[i].classList.add('another-month-day')
    dayCells[i].dataset.date = `${y}-${(m + 1).toString().padStart(2, 0)}-${j.toString().padStart(2, 0)}`
  }
}

function prevMonth() {
  dayCells[today].classList.remove('today')
  month--

  date = new Date(year, month)

  if (month < 0) {
    month = 11
    year--
  }

  cleanCalendar()
  renderCalendar()
}

function nextMonth() {
  month++
  date = new Date(year, month)
  year = date.getFullYear()
  month = date.getMonth()
  // if (month > 11) {
  //   month = 0
  //   year++
  // }

  cleanCalendar()
  renderCalendar()
}

function cleanCalendar() {
  for (let i = 0; i < dayCells.length; i++) {
    dayCells[i].className = 'item day-number'
  }

}

function showToday(firstDay) {
  const dateObj = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  }

  if (dateObj.year == year && dateObj.month == month) dayCells[firstDay + today].classList.add('today')

  // else dayCells[firstDay + today].classList.remove('today')
}

function showWeekends() {
  for (let i = 6; i <= dayCells.length; i += 7) {
    dayCells[i].classList.add('weekend')
    dayCells[i - 1].classList.add('weekend')
  }
}

function showInputDate() {
  dateValue = dateInput.value
  let arr = dateValue.split('-')

  year = +arr[0]
  month = +arr[1] - 1

  date = new Date(year, month)

  renderCalendar()

  // console.log(arr, year, month)
}

function showTime() {
  let minutes = new Date().getMinutes().toString().padStart(2, 0)
  let hours = new Date().getHours().toString().padStart(2, 0)
  let seconds = new Date().getSeconds().toString().padStart(2, 0)

  // if (minutes < 10) minutes = '0' + minutes
  // if (hours < 10) hours = '0' + hours
  // if (seconds < 10) seconds = '0' + seconds

  timeSpan.textContent = `${hours}:${minutes}:${seconds}`
}

function createNote(e) {
  e.preventDefault()

  let objNote = {
    date: form.date.value,
    text: form.text.value,
    type: selectTypeNote.value
  }

  notes.push(objNote)
  addToLs()
  dialog.close()
  // sortNotes()
}

function showDialog(e) {
  const cell = e.target
  form.reset()

  if (cell.tagName == 'LI') {
    currentItem = cell
    index = cell.getAttribute('index')
    currentItem.classList.add('selected-item')
    addBtn.style = 'display: none'
    editBtn.style = 'display: block'
    deleteBtn.style = 'display: block'
    form.text.value = notes[index].text
  }
  else {
    addBtn.style = 'display: block'
    editBtn.style = 'display: none'
    deleteBtn.style = 'display: none'
  }
  form.date.value = cell.dataset.date
  dialog.showModal()
}

function hideDialog(e) {
  if (e.target == dialog || e.target.type == 'button') dialog.close()
  if (currentItem.classList) currentItem.classList.remove('selected-item')
}

function sortByDate() {
  // const notes = [...ol.children]

  notes.sort((a, b) => a.date.localeCompare(b.date))

  ol.append(...notes)

  addToLs()
  renderNotes()
}

function editNote(e) {
  e.preventDefault(e)

  notes[index].text = form.text.value
  notes[index].type = selectTypeNote.value

  addToLs()
  renderNotes()
  dialog.close()
}

function deleteNote(e) {
  e.preventDefault()
  notes.splice(index, 1)

  addToLs()
  renderNotes()
  dialog.close()
}

function hideList() {
  if (ol.classList.contains('hidden-element')) {
    hideListBtn.textContent = 'Скрыть заметки'
    ol.classList.remove('hidden-element')
    ol.classList.add('animation-element')
    return
  }

  ol.classList.add('hidden-element')
  ol.classList.remove('animation-element')
  hideListBtn.textContent = 'Показать заметки'
}

function addToLs() {
  ls.setItem('notes', JSON.stringify(notes))

  renderNotes()
}


function renderNotes() {
  console.log(notes)
  let content = ''

  for (let i = 0; i < notes.length; i++) {
    content += `<li data-date="${notes[i].date}" index = ${i}> ${notes[i].text} (${notes[i].type})</li>`
  }
  ol.innerHTML = content

}

function clearNotes() {
  ls.clear()

  document.location.reload();
}

function changeSort() {
  if (sortNoteSelect.value == 'date') {
    sortByDate()
  } else if (sortNoteSelect.value = 'type') {
    sortByType()
  }
}

function sortByType() {
  notes.sort((a, b) => a.type.localeCompare(b.type))

  addToLs()
  renderNotes()
}


Object.defineProperty(
  HTMLLIElement.prototype, 
  'index', {
    get(){
      return [...this.parentElement.children].indexOf(this)
    }
  }
)