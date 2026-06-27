const chat = document.getElementById('chat')
const input = document.getElementById('input')
const container = document.querySelector('.chat-container')
const inputArea = document.getElementById('inputArea')
const actionButtons = document.getElementById('actionButtons')
const saveBtn = document.getElementById('saveBtn')
const saveModal = document.getElementById('saveModal')
const closeModal = document.getElementById('closeModal')

const userId = crypto.randomUUID()

let started = false
let greetingVisible = true
let locked = false
let lastDiseaseName = null
let lastMedicineOutput = null

const greetings = [
  'Enter a disease name to begin.',
  'Search for a disease.',
  'Medical assistant ready.',
  'Type a disease name.',
  'Start your health journey.',
  'Welcome to MedAdvisor.'
]

const authenticatedGreetings = [
  '{name}, welcome back! Search for a disease.',
  'Hi {name}! Ready to find your medicine?',
  '{name}, let\'s find the right medicine for you.',
  'Welcome back, {name}! Back to better health!'
]

function scrollBottom() {
  chat.scrollTop = chat.scrollHeight
}

function createMessage(type) {
  const div = document.createElement('div')
  div.className = 'message ' + type
  chat.appendChild(div)
  scrollBottom()
  return div
}

function startThinking(element) {
  let dots = 0
  element.innerText = 'Generating'
  const interval = setInterval(() => {
    dots = (dots + 1) % 4
    element.innerText = 'Generating' + '.'.repeat(dots)
    if (!locked) clearInterval(interval)
  }, 400)
}

async function typeText(element, text) {
  element.innerText = ''
  for (let i = 0; i < text.length; i++) {
    element.innerText += text[i]
    scrollBottom()
    await new Promise(r => setTimeout(r, 4))
  }
}

function addUserMessage(text) {
  const div = createMessage('user')
  div.innerText = text
}

async function addBotMessage(text) {
  const div = createMessage('bot')
  startThinking(div)
  await new Promise(r => setTimeout(r, 600))
  await typeText(div, text)
}

function showOptions(options) {
  inputArea.classList.add('hidden')
  actionButtons.style.display = 'none'

  const wrapper = document.createElement('div')
  wrapper.className = 'options'

  options.forEach(opt => {
    const btn = document.createElement('button')
    btn.innerText = opt
    btn.onclick = () => {
      wrapper.remove()
      addUserMessage(opt)
      sendMessage(opt)
    }
    wrapper.appendChild(btn)
  })

  chat.appendChild(wrapper)
  scrollBottom()
}

async function saveMedicineResult() {
  if (!auth.isAuthenticated()) {
    notification.warning('Please login to save results.')
    window.location.href = '/login'
    return
  }

  if (!lastDiseaseName || !lastMedicineOutput) {
    notification.warning('No result to save.')
    return
  }

  try {
    const response = await fetch('/results/save', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        disease_name: lastDiseaseName,
        medicine_output: lastMedicineOutput
      })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to save result')

    saveModal.classList.remove('hidden')
    setTimeout(() => closeModal.click(), 3000)
  } catch (error) {
    notification.error('Error saving result: ' + error.message)
  }
}

closeModal.addEventListener('click', () => saveModal.classList.add('hidden'))
saveBtn.addEventListener('click', saveMedicineResult)

async function sendMessage(msg) {
  locked = true

  try {
    const res = await fetch('/chat', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, message: msg })
    })
    const data = await res.json()
    locked = false

    await addBotMessage(data.reply)

    if (data.can_save) {
      lastDiseaseName = data.disease_name
      lastMedicineOutput = data.reply
      if (auth.isAuthenticated()) {
        actionButtons.style.display = 'flex'
      }
    }

    if (data.input === 'disease') {
      inputArea.classList.remove('hidden')
      if (!data.can_save) actionButtons.style.display = 'none'
      input.placeholder = 'Enter disease name...'
      input.focus()
    }

    if (data.input === 'age') {
      inputArea.classList.remove('hidden')
      actionButtons.style.display = 'none'
      input.placeholder = 'Enter age...'
      input.focus()
    }

    if (data.input === 'gender') {
      input.placeholder = 'Select gender below'
      showOptions(data.options)
    }

  } catch (error) {
    locked = false
    await addBotMessage('Something went wrong. Please try again.')
    inputArea.classList.remove('hidden')
    actionButtons.style.display = 'none'
    input.placeholder = 'Enter disease name...'
    input.focus()
  }
}

input.addEventListener('input', () => {
  input.style.height = 'auto'
  input.style.height = input.scrollHeight + 'px'
})

input.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    if (locked) return

    const msg = input.value.trim()
    if (!msg) return

    if (!started) {
      container.classList.remove('center')
      container.classList.add('bottom')
      started = true
    }

    if (greetingVisible) {
      chat.innerHTML = ''
      greetingVisible = false
    }

    input.value = ''
    input.style.height = 'auto'

    addUserMessage(msg)
    sendMessage(msg)
  }
})

function showGreeting() {
  const div = createMessage('bot')
  if (auth.isAuthenticated()) {
    const template = authenticatedGreetings[Math.floor(Math.random() * authenticatedGreetings.length)]
    div.innerText = template.replace('{name}', auth.name || 'User')
  } else {
    div.innerText = greetings[Math.floor(Math.random() * greetings.length)]
  }
}

showGreeting()
