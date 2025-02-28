import { state } from '../main.js';

export function setupImageUpload() {
  const imageUploadBtn = document.getElementById('imageUpload');
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  // Set initial visibility to none
  imageUploadBtn.style.display = 'none';

  imageUploadBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', handleImageUpload);
}

export function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      state.selectedImage = e.target.result;
      displayImagePreview(state.selectedImage);
    };
    reader.readAsDataURL(file);
  }
}

export function displayImagePreview(imageData) {
  const previewArea = document.getElementById('imagePreview');
  previewArea.innerHTML = '';

  const previewContainer = document.createElement('div');
  previewContainer.className = 'preview-container';

  const img = document.createElement('img');
  img.src = imageData;
  img.className = 'preview-image';

  const removeButton = document.createElement('button');
  removeButton.className = 'remove-image';
  removeButton.innerHTML = '<span class="material-icons">close</span>';
  removeButton.onclick = () => {
    state.selectedImage = null;
    previewArea.innerHTML = '';
  };

  previewContainer.appendChild(img);
  previewContainer.appendChild(removeButton);
  previewArea.appendChild(previewContainer);
}

export function handleModelChange() {
  const modelSelect = document.getElementById('modelList');
  const imageUploadBtn = document.getElementById('imageUpload');
  
  // Show image upload button only for llama3.2-vision model
  if (modelSelect.value === 'llama3.2-vision:latest') {
    imageUploadBtn.style.display = 'block';
  } else {
    // Hide button and clear any selected image for other models
    imageUploadBtn.style.display = 'none';
    state.selectedImage = null;
    document.getElementById('imagePreview').innerHTML = '';
  }
}