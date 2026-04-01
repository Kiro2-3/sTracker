<template>
  <div class="chatbot-root border border-base-200 bg-base-100 text-base-content" role="dialog" aria-label="Help assistant">
    <div class="chat-header">
      <div>
        <div>Assistant</div>
        <p class="chat-header-subtitle">Interactive help for navigation, transactions, categories, and exports</p>
      </div>
    </div>

    <div class="chat-choices">
      <button
        v-for="choice in quickChoices"
        :key="choice.key"
        class="choice border border-base-200 bg-base-200/70 text-base-content"
        @click.prevent="choose(choice.key)"
      >{{ choice.label }}</button>
    </div>

    <div class="chat-messages" ref="messagesRef">
      <div v-for="(m, i) in messages" :key="i" :class="['chat-message', m.from]">
        <div
          :class="[
            'chat-text',
            m.from === 'user'
              ? 'bg-gradient-to-r from-primary to-secondary text-primary-content'
              : 'border border-base-200 bg-base-200/70 text-base-content'
          ]"
        >
          <div v-if="m.title" class="chat-text-title">{{ m.title }}</div>
          <div>{{ m.text }}</div>

          <div v-if="m.suggestions?.length" class="chat-suggestions">
            <button
              v-for="suggestion in m.suggestions"
              :key="suggestion"
              type="button"
              class="chat-suggestion"
              @click="useSuggestion(suggestion)"
            >{{ suggestion }}</button>
          </div>

          <div v-if="messageChoiceActions(m).length" class="chat-actions">
            <button
              v-for="action in messageChoiceActions(m)"
              :key="`${action.type}-${action.label}`"
              type="button"
              class="btn btn-xs btn-ghost border border-base-300"
              @click="runAction(action)"
            >{{ action.label }}</button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="chat-message ai">
        <div class="chat-text border border-base-200 bg-base-200/70 text-base-content typing-bubble" aria-live="polite">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <form class="chat-input" @submit.prevent="send">
      <input
        v-model="input"
        class="input input-bordered input-sm w-full bg-base-100 text-base-content placeholder:text-base-content/40"
        :placeholder="loading ? 'Thinking...' : ''"
        @keydown.enter.exact.prevent="send"
        :disabled="loading"
      />
      <button type="submit" class="btn btn-sm btn-primary" :disabled="loading || !input.trim()">Send</button>
    </form>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const selectionAliases = {
  'add a bank account': { type: 'choice', key: 'add_account' },
  'bank account help': { type: 'choice', key: 'add_account' },
  'create a transaction': { type: 'choice', key: 'create_transaction' },
  'help with transactions': { type: 'choice', key: 'create_transaction' },
  'transaction help': { type: 'choice', key: 'create_transaction' },
  'manage categories': { type: 'choice', key: 'manage_categories' },
  'help with categories': { type: 'choice', key: 'manage_categories' },
  'take me to categories': { type: 'choice', key: 'manage_categories' },
  'open categories': { type: 'choice', key: 'manage_categories' },
  'open dashboard': { type: 'choice', key: 'navigation' },
  'show me dashboard tips': { type: 'choice', key: 'navigation' },
  'show me the dashboard tour': { type: 'choice', key: 'navigation' },
  'show me another tip': { type: 'choice', key: 'navigation' },
  'start tour': { type: 'choice', key: 'navigation' },
  'open tour': { type: 'choice', key: 'navigation' },
  'open profile': { type: 'choice', key: 'navigation' },
  'open recent transactions': { type: 'choice', key: 'create_transaction' },
  'show me recent transactions': { type: 'choice', key: 'create_transaction' },
  'how do i export csv': { type: 'choice', key: 'export_csv' },
}

const messages = ref([
  {
    from: 'ai',
    title: 'Hi there 👋',
    text: 'I can guide you through sTracker and also jump you straight to important pages.',
    suggestions: ['How do I add a transaction?', 'Show me the dashboard tour', 'How do I export CSV?'],
    actions: [
      { type: 'choice', key: 'navigation', label: 'Start Tour' },
    ],
  }
])

const input = ref('')
const loading = ref(false)
const messagesRef = ref(null)

const quickChoices = [
  { key: 'add_account', label: 'Add Bank Account' },
  { key: 'create_transaction', label: 'Create Transaction' },
  { key: 'manage_categories', label: 'Manage Categories' },
  { key: 'export_csv', label: 'Export CSV' },
  { key: 'navigation', label: 'App Navigation Tour' },
]

function addMessage(message) {
  messages.value.push(message)
  scrollBottom()
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function typeWrite(text, msgIndex, speed = 20) {
  if (!text || typeof text !== 'string') {
    messages.value[msgIndex].text = String(text || '')
    return
  }
  messages.value[msgIndex].text = ''
  for (let i = 0; i < text.length; i++) {
    messages.value[msgIndex].text += text[i]
    scrollBottom()
    // small pause to simulate typing
    // slight longer pause on punctuation for realism
    const ch = text[i]
    const extra = /[.,!?]/.test(ch) ? speed * 6 : 0
    await sleep(speed + extra)
  }
}

function scrollBottom() {
  nextTick(() => {
    try { messagesRef.value.scrollTop = messagesRef.value.scrollHeight } catch (e) {}
  })
}

function normalizeSelection(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[!?.,]+$/g, '')
    .replace(/\s+/g, ' ')
}

function resolveSelection(text) {
  return selectionAliases[normalizeSelection(text)] || null
}

function messageChoiceActions(message) {
  return (message.actions || []).filter((action) => action.type === 'choice')
}

function useSuggestion(text) {
  const resolved = resolveSelection(text)

  if (resolved?.type === 'choice' && resolved.key) {
    choose(resolved.key)
    return
  }

  input.value = text
  send()
}

function runAction(action) {
  if (action.type === 'choice' && action.key) {
    choose(action.key)
  }
}

function buildReply(payload) {
  return {
    from: 'ai',
    title: payload.title || '',
    text: payload.text,
    suggestions: payload.suggestions || [],
    actions: payload.actions || [],
  }
}

function createLocalResponse(text) {
  const lower = text.toLowerCase()

  if (/\b(hello|hi|hey)\b|good morning|good evening/.test(lower)) {
    return buildReply({
      title: 'Hello!',
      text: 'I can walk you through the app, explain a feature, and guide you step by step.',
      suggestions: ['How do I add a bank account?', 'Take me to categories', 'Show me dashboard tips'],
      actions: [
        { type: 'choice', key: 'navigation', label: 'Start Tour' },
        { type: 'choice', key: 'manage_categories', label: 'Category Help' },
      ],
    })
  }

  if (lower.includes('trend overview')) {
    return buildReply({
      title: 'Trend overview',
      text: 'Trend Overview compares income and expenses over time so you can quickly spot spending spikes, stronger income periods, and overall balance movement.',
      suggestions: ['Open dashboard', 'How do I reset the filters?', 'Show me recent transactions'],
      actions: [
        { type: 'choice', key: 'navigation', label: 'Dashboard Tour' },
        { type: 'choice', key: 'create_transaction', label: 'Transaction Help' },
      ],
    })
  }

  if (lower.includes('dashboard')) {
    return buildReply({
      title: 'Dashboard guide',
      text: 'Your dashboard highlights income, expenses, revenue, recent transactions, top categories, and chart trends. Use the filters at the top to narrow the data by type, category, or date range.',
      suggestions: ['What does trend overview mean?', 'How do I reset the filters?', 'Show me recent transactions'],
      actions: [
        { type: 'choice', key: 'navigation', label: 'Start Tour' },
        { type: 'choice', key: 'create_transaction', label: 'Transaction Help' },
      ],
    })
  }

  if (lower.includes('bank') || lower.includes('account')) {
    return buildReply({
      title: 'Bank accounts',
      text: 'Open Bank Accounts, add the account details, then save. You can later edit the same card or delete it if you no longer use it.',
      suggestions: ['What details do I need?', 'Can I edit an account later?', 'How do I add a transaction?'],
      actions: [
        { type: 'choice', key: 'create_transaction', label: 'Next: Add Transaction' },
      ],
    })
  }

  if (lower.includes('transaction') || lower.includes('expense') || lower.includes('income')) {
    return buildReply({
      title: 'Transactions',
      text: 'Create a transaction by choosing the bank account, category, amount, type, and date. Recent Transactions lets you filter, sort, edit, delete, and export records later.',
      suggestions: ['How do I filter transactions?', 'Show me category help', 'How do I export CSV?'],
      actions: [
        { type: 'choice', key: 'manage_categories', label: 'Category Help' },
        { type: 'choice', key: 'export_csv', label: 'Export Help' },
      ],
    })
  }

  if (lower.includes('categor')) {
    return buildReply({
      title: 'Categories',
      text: 'Categories help group your spending and improve dashboard insights. You can create, rename, and delete them from the Categories page.',
      suggestions: ['How do categories affect reports?', 'Can I rename a category?', 'How do I add a transaction?'],
      actions: [
        { type: 'choice', key: 'create_transaction', label: 'Transaction Help' },
      ],
    })
  }

  if (lower.includes('export') || lower.includes('csv') || lower.includes('download')) {
    return buildReply({
      title: 'Export CSV',
      text: 'Go to Recent Transactions, apply any filters you want, then use the Export CSV button to download only the matching records.',
      suggestions: ['Open recent transactions', 'How do I filter by date?', 'What gets exported?'],
      actions: [
        { type: 'choice', key: 'create_transaction', label: 'Transaction Help' },
      ],
    })
  }

  if (lower.includes('tour') || lower.includes('navigate') || /\bwhere\b/.test(lower)) {
    return buildReply({
      title: 'Navigation tour',
      text: 'Use the sidebar to move between Dashboard, Bank Accounts, Transactions, Categories, and Profile. The mascot gives help from anywhere, and the theme toggle is available near the top-right area.',
      suggestions: ['Open dashboard', 'Open profile', 'How do I add a bank account?'],
      actions: [
        { type: 'choice', key: 'add_account', label: 'Bank Account Help' },
        { type: 'choice', key: 'create_transaction', label: 'Transaction Help' },
      ],
    })
  }

  if (lower.includes('filter') || lower.includes('sort')) {
    return buildReply({
      title: 'Filtering tips',
      text: 'Most list screens support search, type/category filters, date ranges, and sorting. Apply the filters first, then export or review the narrowed results.',
      suggestions: ['Open recent transactions', 'Show me dashboard tour', 'How do I export CSV?'],
      actions: [
        { type: 'choice', key: 'export_csv', label: 'Export Help' },
      ],
    })
  }

  if (lower.includes('help') || lower.includes('what can you do')) {
    return buildReply({
      title: 'What I can help with',
      text: 'I can explain app features, give step-by-step instructions, suggest the next action, and open key pages for you.',
      suggestions: ['Add a bank account', 'Create a transaction', 'Manage categories'],
      actions: [
        { type: 'choice', key: 'add_account', label: 'Bank Account Help' },
        { type: 'choice', key: 'create_transaction', label: 'Transaction Help' },
      ],
    })
  }

  return null
}

async function send() {
  const text = input.value.trim()
  if (!text) return

  const resolved = resolveSelection(text)

  if (resolved?.type === 'choice' && resolved.key) {
    input.value = ''
    choose(resolved.key)
    return
  }

  addMessage({ from: 'user', text })
  input.value = ''

  const localResponse = createLocalResponse(text)
  if (localResponse) {
    addMessage(localResponse)
    return
  }

  loading.value = true
  scrollBottom()

  try {
    const tokenMeta = document.querySelector('meta[name="csrf-token"]')
    const csrf = tokenMeta ? tokenMeta.getAttribute('content') : ''

    const res = await fetch('/ai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrf,
        'Accept': 'application/json'
      },
      body: JSON.stringify({ message: text })
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(err?.message || 'Error from server')
    }

    const data = await res.json()
    const replyIndex = messages.value.length
    addMessage(buildReply({
      title: 'Here’s what I found',
      text: '',
      suggestions: ['Show me another tip', 'Open dashboard', 'How do I add a transaction?'],
      actions: [
        { type: 'choice', key: 'navigation', label: 'Open Tour' },
      ],
    }))
    await typeWrite(data.message, replyIndex)
  } catch (e) {
    addMessage(buildReply({
      title: 'Connection issue',
      text: 'Sorry, I could not fetch a response right now.',
      suggestions: ['Help with transactions', 'Help with categories', 'Open dashboard'],
      actions: [
        { type: 'choice', key: 'create_transaction', label: 'Transaction Help' },
        { type: 'choice', key: 'navigation', label: 'Dashboard Tour' },
      ],
    }))
  } finally {
    loading.value = false
    scrollBottom()
  }
}

function choose(key) {
  const choice = choices.find(c => c.key === key)
  if (!choice) return
  addMessage({ from: 'user', text: choice.label })
  addMessage(buildReply({
    title: choice.title,
    text: '',
    suggestions: choice.suggestions,
    actions: choice.actions,
  }))
  scrollBottom()
  const aiIndex = messages.value.length - 1
  typeWrite(choice.steps.join('\n'), aiIndex, 16)
}

const choices = [
  {
    key: 'add_account',
    title: 'Add a bank account',
    label: 'Add Bank Account',
    steps: [
      'Open the Bank Accounts page (sidebar → Bank Accounts).',
      'Click "Add Bank Account" (top-right or bottom on mobile).',
      'Fill in the account name and starting balance, then click Save.',
      'Use the Edit button on a card to change details or Delete to remove it.'
    ],
    suggestions: ['What details do I need?', 'Can I edit an account later?', 'How do I add a transaction?'],
    actions: [
      { type: 'choice', key: 'create_transaction', label: 'Next: Add Transaction' },
    ],
  },
  {
    key: 'create_transaction',
    title: 'Create a transaction',
    label: 'Create Transaction',
    steps: [
      'Go to Transactions → Add or click the New Transaction button.',
      'Select the bank account, choose a category, enter amount and date.',
      'Optionally add a note and save. Use the Recent Transactions page to filter and find it.'
    ],
    suggestions: ['How do I filter transactions?', 'Can I edit a transaction later?', 'How do categories work?'],
    actions: [
      { type: 'choice', key: 'manage_categories', label: 'Category Help' },
      { type: 'choice', key: 'export_csv', label: 'Export Help' },
    ],
  },
  {
    key: 'manage_categories',
    title: 'Manage categories',
    label: 'Manage Categories',
    steps: [
      'Open the Categories page from the sidebar.',
      'Click Add to create a new category; edit or delete existing categories with their buttons.',
      'Use categories when creating transactions to group expenses.'
    ],
    suggestions: ['Can I rename a category?', 'How do categories affect charts?', 'Open categories'],
    actions: [
      { type: 'choice', key: 'create_transaction', label: 'Transaction Help' },
    ],
  },
  {
    key: 'export_csv',
    title: 'Export transactions',
    label: 'Export CSV',
    steps: [
      'On Recent Transactions page, apply any filters you need (date, account, category).',
      'Click Export CSV to download the filtered transactions as a CSV file.'
    ],
    suggestions: ['What gets exported?', 'How do I filter by date?', 'Open recent transactions'],
    actions: [
      { type: 'choice', key: 'create_transaction', label: 'Transaction Help' },
    ],
  },
  {
    key: 'navigation',
    title: 'App navigation tour',
    label: 'App Navigation Tour',
    steps: [
      'The left sidebar contains: Dashboard, Bank Accounts, Transactions, Categories, and Profile.',
      'Top-right contains settings and theme toggle. Use the mascot for help anytime.'
    ],
    suggestions: ['Open dashboard', 'Open profile', 'How do I add a bank account?'],
    actions: [
      { type: 'choice', key: 'add_account', label: 'Bank Account Help' },
      { type: 'choice', key: 'create_transaction', label: 'Transaction Help' },
    ],
  }
]

scrollBottom()
</script>

<style scoped>
.chatbot-root {
  width: min(340px, 92vw);
  max-width: 420px;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(2, 6, 23, 0.14);
  backdrop-filter: blur(10px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.chat-header {
  font-weight: 700;
  padding: 0.6rem 0.9rem;
  background: linear-gradient(90deg,#7c3aed,#f59e0b);
  color: white;
  display:flex;
  align-items:center;
}
.chat-header-subtitle {
  margin-top: 0.1rem;
  font-size: 0.72rem;
  font-weight: 500;
  opacity: 0.88;
}
.chat-choices { display:flex; flex-wrap:wrap; gap:0.5rem; padding:0.6rem }
.choice { padding:0.38rem 0.6rem; border-radius:9999px; font-size:0.85rem; cursor:pointer; transition: transform 0.15s ease, filter 0.15s ease }
.choice:hover { transform: translateY(-2px); filter: brightness(0.98) }
.chat-messages { max-height: 260px; overflow:auto; padding: 0.4rem 0.6rem; flex:1 }
.chat-message { margin-bottom: 0.6rem; display:flex }
.chat-message.user { justify-content: flex-end }
.chat-message.ai { justify-content: flex-start }
.chat-text { padding: 0.5rem 0.68rem; border-radius: 10px; max-width: 80%; line-height:1.25; white-space:pre-wrap }
.chat-text-title { font-weight: 700; margin-bottom: 0.3rem }
.chat-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.55rem;
}
.chat-suggestion {
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(255, 255, 255, 0.28);
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  cursor: pointer;
}
.chat-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.6rem;
}
.chat-input { display:flex; gap:0.5rem; padding: 0.5rem; border-top: 1px solid rgba(148, 163, 184, 0.18) }
.typing-bubble {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.typing-bubble span {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 9999px;
  background: currentColor;
  opacity: 0.32;
  animation: chat-bounce 1s infinite ease-in-out;
}
.typing-bubble span:nth-child(2) { animation-delay: 0.15s }
.typing-bubble span:nth-child(3) { animation-delay: 0.3s }

@keyframes chat-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.32; }
  40% { transform: translateY(-3px); opacity: 0.9; }
}
</style>
