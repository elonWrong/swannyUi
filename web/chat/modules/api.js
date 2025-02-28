import { state } from '../main.js';
import { formatSize, formatDate } from './utils.js';

//API base URL gotten from /config endpoint
let API_BASE_URL = '';

export async function initAPI() {
  await fetchConfig();
}

async function fetchConfig() {
  try {
    const response = await fetch('/config');
    const config = await response.json();
    API_BASE_URL = `${config.API_BASE_URL}api`;
  } catch (error) {
    console.error('Error fetching configuration:', error);
  }
}

export async function checkServerStatus() {
  const statusIndicator = document.getElementById('serverStatus');
  const statusText = document.getElementById('serverStatusText');
  const generateButton = document.getElementById('generate');

  try {
    const response = await fetch(`${API_BASE_URL}/tags`);
    if (response.ok) {
      statusIndicator.className = 'status-indicator status-online';
      statusText.textContent = 'Server Online';
      generateButton.disabled = false;
      state.serverOnline = true;
      return true;
    }
  } catch (error) {
    console.error('Server check failed:', error);
  }

  statusIndicator.className = 'status-indicator status-offline';
  statusText.textContent = 'Server Offline';
  generateButton.disabled = true;
  state.serverOnline = false;
  return false;
}

export async function fetchModels() {
  // Implementation of model fetching
  const isOnline = await checkServerStatus();
  if (!isOnline) {
    document.getElementById('modelList').innerHTML = 
      '<option value="">Server offline</option>';
    const modelGrid = document.getElementById('modelGrid');
    if (modelGrid) {
      modelGrid.innerHTML = '<div>Server offline</div>';
    }
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/tags`);
    const data = await response.json();
    
    // Update dropdown and grid
    updateModelDropdown(data.models);
    updateModelGrid(data.models);
  } catch (error) {
    console.error('Error fetching models:', error);
    handleModelFetchError();
  }
}

function updateModelDropdown(models) {
  const modelSelect = document.getElementById('modelList');
  modelSelect.innerHTML = '';
  
  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.name;
    option.textContent = model.name;
    modelSelect.appendChild(option);
  });

  modelSelect.addEventListener('change', () => {
    import('./imageHandler.js').then(module => module.handleModelChange());
  });
  
  // Initial check for current model
  import('./imageHandler.js').then(module => module.handleModelChange());
}

function updateModelGrid(models) {
  const modelGrid = document.getElementById('modelGrid');
  if (modelGrid) {
    modelGrid.innerHTML = '';
    models.forEach(model => {
      const card = document.createElement('div');
      card.className = 'model-card';
      card.innerHTML = `
        <h3>${model.name}</h3>
        <div class="model-meta">
          <span class="tag">Size: ${formatSize(model.size)}</span>
          <span class="tag">Modified: ${formatDate(model.modified_at)}</span>
        </div>
        <div class="model-actions">
          <button class="btn btn-danger" onclick="deleteModel('${model.name}')">
            <span class="material-icons">delete</span>
            Delete
          </button>
        </div>
      `;
      modelGrid.appendChild(card);
    });
  }
}

function handleModelFetchError() {
  document.getElementById('modelList').innerHTML = 
    '<option value="">Error loading models</option>';
  const modelGrid = document.getElementById('modelGrid');
  if (modelGrid) {
    modelGrid.innerHTML = '<div>Error loading models</div>';
  }
}

export async function generateResponse() {
    if (!state.serverOnline) {
      alert('Server is offline. Please check your Ollama server.');
      return;
    }

    const promptInput = document.getElementById('prompt');
    const prompt = promptInput.value;
    const model = document.getElementById('modelList').value;
    const temperature = parseFloat(document.getElementById('temperature').value);
    const contextLength = parseInt(document.getElementById('contextLength').value);
    const button = document.getElementById('generate');
    const responseDiv = document.getElementById('response');

    if (!prompt) {
        alert('Please enter a prompt');
        return;
    }

    // Create contextPrompt before adding the latest user message
    let contextMessages = [];

    if (state.useFullContext) {
        contextMessages = [...state.conversationHistory];
    } else if (state.selectedContextMessages.length > 0) {
        state.selectedContextMessages.forEach(index => {
            const userMsg = state.conversationHistory[index * 2];
            const assistantMsg = state.conversationHistory[index * 2 + 1];
            if (userMsg && assistantMsg) {
                contextMessages.push(userMsg);
                contextMessages.push(assistantMsg);
            }
        });
    }

    let contextPrompt = contextMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');

    // Then, construct the full prompt
    const fullPrompt = (contextPrompt ? contextPrompt + '\n' : '') + 'user: ' + prompt + '\nassistant:';

    // Store the user message
    state.conversationHistory.push({ role: 'user', content: prompt });

    // Add user's prompt to the response area
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.textContent = prompt;
    responseDiv.appendChild(userMessage);

    // Add system message
    const systemMessage = document.createElement('div');
    systemMessage.className = 'message system-message';
    systemMessage.textContent = 'Generating response...';
    responseDiv.appendChild(systemMessage);

    // Create a new div for the AI response
    const aiResponse = document.createElement('div');
    aiResponse.className = 'message ai-message';
    responseDiv.appendChild(aiResponse);

    // Clear input field and reset height
    promptInput.value = '';
    promptInput.style.height = 'auto';

    button.disabled = true;
    
    let fullResponse = '';

    try {
        const options = {
            temperature: temperature,
            num_ctx: contextLength
        }
        const requestBody = {
            model: model,
            prompt: fullPrompt,
            options: options
        };

        // Add image data if present
        if (state.selectedImage) {
            requestBody.images = [state.selectedImage];
        }

        const response = await fetch(`${API_BASE_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        fullResponse = '';

        while (true) {
            const {value, done} = await reader.read();
            if (done) break;
            
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.trim()) {
                    try {
                        const jsonResponse = JSON.parse(line);
                        if (jsonResponse.response) {
                            fullResponse += jsonResponse.response;
                            aiResponse.innerHTML = marked.parse(fullResponse);
                        }
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                    }
                }
            }
        }

        // After generation is complete
        systemMessage.textContent = 'Generation complete!';
        setTimeout(() => systemMessage.remove(), 1000);
    } catch (error) {
        console.error('Error:', error);
        systemMessage.textContent = 'Error generating response: ' + error.message;
    } finally {
        button.disabled = false;
        state.selectedImage = null;
        document.getElementById('imagePreview').innerHTML = '';
    }

    // After getting the AI response, store it
    state.conversationHistory.push({ role: 'assistant', content: fullResponse });
}

export async function deleteModel(modelName) {
    if (!confirm(`Are you sure you want to delete ${modelName}?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: modelName })
        });

        if (response.ok) {
            fetchModels();
        } else {
            throw new Error('Failed to delete model');
        }
    } catch (error) {
        console.error('Error deleting model:', error);
        alert('Error deleting model: ' + error.message);
    }
}