import { state } from '../main.js';

export function setupContextManager() {
  const fullContextButton = document.getElementById('fullContextButton');
  fullContextButton.addEventListener('click', function () {
    state.useFullContext = !state.useFullContext;
    this.classList.toggle('active', state.useFullContext);
    if (state.useFullContext) {
      state.selectedContextMessages = [];
      document.getElementById('selectContextButton').classList.remove('active');
    }
  });

  const selectContextButton = document.getElementById('selectContextButton');
  selectContextButton.addEventListener('click', function () {
    openContextSelectionModal();
    state.useFullContext = false;
    fullContextButton.classList.remove('active');
  });

  document.getElementById('clearConversationButton').addEventListener('click', clearConversation);
}

export function openContextSelectionModal() {
  // Check if there's any conversation history
  if (conversationHistory.length === 0) {
    document.getElementById('selectContextButton').classList.remove('active');
    return;
  }

  // Toggle selection mode
  const isSelectionMode = document.querySelector('.context-checkbox') !== null;
  if (isSelectionMode) {
    // If already in selection mode, save and exit
    document.querySelectorAll('.context-checkbox').forEach(el => el.remove());
    document.querySelectorAll('.conversation-pair').forEach(el => {
      el.classList.remove('conversation-pair');
    });

    document.getElementById('selectContextButton').classList.toggle('active', state.selectedContextMessages.length > 0);
    return;
  }

  // Add deselect all button if it doesn't exist
  const controlsRow = document.querySelector('.controls-row');
  const existingDeselectButton = document.querySelector('.deselect-all-button');
  if (!existingDeselectButton) {
    const deselectButton = document.createElement('button');
    deselectButton.className = 'deselect-all-button';
    deselectButton.innerHTML = '<span class="material-icons">clear_all</span>';
    deselectButton.title = "Deselect All";
    deselectButton.onclick = function () {
      document.querySelectorAll('.context-checkbox').forEach(checkbox => {
        checkbox.checked = false;
      });
      state.selectedContextMessages = [];
    };
    controlsRow.querySelector('.context-controls').appendChild(deselectButton);
  }

  // Add checkboxes and create conversation pairs
  const messages = document.querySelectorAll('.message');
  let currentPair = null;
  let pairIndex = 0;

  messages.forEach((message, index) => {
    if (message.classList.contains('user-message')) {
      currentPair = document.createElement('div');
      currentPair.className = 'conversation-pair';
      message.parentNode.insertBefore(currentPair, message);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'context-checkbox';
      checkbox.value = pairIndex;
      checkbox.checked = state.selectedContextMessages.includes(pairIndex);

      checkbox.addEventListener('change', function () {
        const pairIndex = parseInt(this.value);
        if (this.checked) {
          if (!state.selectedContextMessages.includes(pairIndex)) {
            state.selectedContextMessages.push(pairIndex);
          }
        } else {
          state.selectedContextMessages = state.selectedContextMessages.filter(i => i !== pairIndex);
        }
      });

      currentPair.appendChild(checkbox);
      currentPair.appendChild(message);

      const nextMessage = messages[index + 1];
      if (nextMessage && nextMessage.classList.contains('ai-message')) {
        currentPair.appendChild(nextMessage);
      }

      pairIndex++;
    }
  });

  document.getElementById('selectContextButton').classList.add('active');
}

export function clearConversation() {
  if (confirm('Are you sure you want to clear the conversation?')) {
    const responseDiv = document.getElementById('response');
    responseDiv.innerHTML = '';
    state.conversationHistory = [];
    state.selectedContextMessages = [];
    state.useFullContext = false;

    // Reset context buttons
    document.getElementById('fullContextButton').classList.remove('active');
    document.getElementById('selectContextButton').classList.remove('active');
  }
}