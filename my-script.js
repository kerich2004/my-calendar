const days = document.querySelectorAll('.day')
const dateInput = document.querySelector('input')
const output = document.querySelector('.month')
const [prevBtn, nextBtn, okBtn] = document.querySelectorAll('button')

prevBtn.addEventListener('click', prevMonth)
nextBtn.addEventListener('click', nextMonth)
okBtn.addEventListener('click', test)

let date = new Date()
let year = date.getFullYear()
let month = date.getMonth()
const today = date.getDate() - 1

renderCalendar()

function renderCalendar() {
  let firstDay = new Date(year, month, 1).getDay() - 1
  let lastDay = new Date(year, month + 1, 0).getDate()

  if (firstDay < 0) firstDay = 6

  output.innerText = date.toLocaleString('ru-RU', { month: 'long' }).toUpperCase() + ' ' + year

  for (let i = 1, x = firstDay; i <= lastDay; i++, x++) {
    days[x].innerText = i
  }

  showToday()
  showWeekends()
  showPrevMonthDays(firstDay)
  showNextMonthDays(firstDay, lastDay)
}

function showPrevMonthDays(firstDay) {
  let lastDayPrevMonth = new Date(year, month, 0).getDate()

  if (firstDay != 0) {
    for (let i = firstDay - 1; i >= 0; i--, lastDayPrevMonth--) {
      days[i].innerText = lastDayPrevMonth
      days[i].classList.add('another-month-day')
    }
  }
}

function showNextMonthDays(firstDay, lastDay) {
  for (let a = lastDay + firstDay, count = 1; a < days.length; a++, count++) {
    days[a].innerHTML = count
    days[a].classList.add('another-month-day')
  }
}

function prevMonth() {
  days[today].classList.remove('today')
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

  if (month > 11) {
    month = 0
    year++
  }

  cleanCalendar()
  renderCalendar()
}

function cleanCalendar() {
  for (let i = 0; i < days.length; i++) {
    if (days[i].classList.contains('another-month-day')) days[i].classList.remove('another-month-day')

    days[i].innerText = ''
  }

}

function showToday() {
  const dateObj = {
    'month': new Date().getMonth(),
    'year': new Date().getFullYear(),
  }

  if (dateObj.year == year && dateObj.month == month) days[today].classList.add('today')

  else days[today].classList.remove('today')

}


function showWeekends() {
  for (let i = 6; i <= days.length; i += 7) {
    days[i].classList.add('weekend')
    days[i - 1].classList.add('weekend')
  }
}

function test() {
  let dateValue = dateInput.value
  let arr = dateValue.split('-')

  year = +arr[0]
  month = +arr[1]

  // date = new Date(year, month - 1)

  renderCalendar()
  // console.log(arr, year, month)
}