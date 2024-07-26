const calendar = document.querySelector('.calendar')
const dayCells = document.querySelectorAll('.day-number')
const dateInput = document.querySelector('input')
const monthOut = document.querySelector('.month')
const [prevBtn, nextBtn, okBtn] = document.querySelectorAll('button')
const timeSpan = document.querySelector('span')
const ol = document.querySelector('ol')
const dialog = document.getElementById('dialog')
const form = document.querySelector('form')

prevBtn.addEventListener('click', prevMonth)
nextBtn.addEventListener('click', nextMonth)
okBtn.addEventListener('click', showInputDate)

let date = new Date()
let year = date.getFullYear()
let month = date.getMonth()
const today = date.getDate() - 1
let dateValue = dateInput.value

calendar.onclick = showDialog
dialog.onsubmit = createNote
dialog.onclick = hideDialog

setInterval(showTime, 1000)
renderCalendar()

function renderCalendar() {
  let firstDay = new Date(year, month, 1).getDay() - 1
  let lastDate = new Date(year, month + 1, 0).getDate()

  dateInput.value = `${year}-${String(month + 1).padStart(2, '0')}-${today + 1}`

  if (firstDay < 0) firstDay = 6

  monthOut.innerText = date.toLocaleString('ru-RU', { month: 'long' }).toUpperCase() + ' ' + year

  for (let i = 1, j = firstDay; i <= lastDate; i++, j++) {
    dayCells[j].innerText = i
    dayCells[j].dataset.date = `${year}-${(month + 1).toString().padStart(2, 0)}-${i.toString().padStart(2, 0)}`
  }

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

  const note = document.createElement('li')

  note.dataset.date = form.date.value
  note.innerText = form.text.value.trim()

  ol.append(note)
  dialog.close()
  sortNotes()
}

function showDialog(e) {
  const cell = e.target

  dialog.showModal()
  form.reset()
  form.date.value = cell.dataset.date
}

function hideDialog(e) {
  if (e.target == dialog || e.target.type == 'button') dialog.close()
}

function sortNotes() {
  const notes = [...ol.children]

  notes.sort((a, b) => a.dataset.date.localeCompare(b.dataset.date))
  
  ol.append(...notes)
}