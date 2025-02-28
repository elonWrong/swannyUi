import { setupUI } from './modules/ui.js';
import { initAPI, checkServerStatus, fetchModels, generateResponse } from './modules/api.js';
import { setupImageUpload, handleModelChange } from './modules/imageHandler.js';
import { setupContextManager } from './modules/contextManager.js';
import { initTheme } from './modules/theme.js';

// Global state variables
let serverOnline = false;
let selectedImage = null;
let useFullContext = false;
let selectedContextMessages = [];
let conversationHistory = [];

// Export state for other modules
export const state = {
  get serverOnline() { return serverOnline; },
  set serverOnline(value) { serverOnline = value; },
  get selectedImage() { return selectedImage; },
  set selectedImage(value) { selectedImage = value; },
  get useFullContext() { return useFullContext; },
  set useFullContext(value) { useFullContext = value; },
  get selectedContextMessages() { return selectedContextMessages; },
  set selectedContextMessages(value) { selectedContextMessages = value; },
  get conversationHistory() { return conversationHistory; },
  set conversationHistory(value) { conversationHistory = value; }
};

document.addEventListener('DOMContentLoaded', async () => {
  setupUI();
  await initAPI();
  setupImageUpload();
  setupContextManager();
  initTheme();

  checkServerStatus();
  fetchModels();
  window.generateResponse = () => {
    checkServerStatus();
    generateResponse();
  };
});