/**
 * API service module for communicating with the meme generator backend.
 * Handles all HTTP requests with proper error handling and response parsing.
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

/**
 * Handle API errors consistently
 * @param {Response} response - Fetch API response object
 */
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// PUBLIC_INTERFACE
/**
 * Fetch all available meme templates
 * @returns {Promise<Array>} Array of template objects
 */
export async function getTemplates() {
  const response = await fetch(`${API_BASE_URL}/api/templates`);
  return handleResponse(response);
}

// PUBLIC_INTERFACE
/**
 * Upload a custom image file
 * @param {File} file - Image file to upload
 * @returns {Promise<Object>} Upload result with image URL
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse(response);
}

// PUBLIC_INTERFACE
/**
 * Render a meme with text layers
 * @param {Object} memeData - Meme configuration with baseImage and textLayers
 * @returns {Promise<Blob>} Rendered image as blob
 */
export async function renderMeme(memeData) {
  const response = await fetch(`${API_BASE_URL}/api/render`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(memeData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Render failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.blob();
}

// PUBLIC_INTERFACE
/**
 * Create a share link for a rendered meme
 * @param {Object} memeData - Meme configuration with baseImage and textLayers
 * @returns {Promise<Object>} Share result with token and URL
 */
export async function shareMeme(memeData) {
  const response = await fetch(`${API_BASE_URL}/api/share`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(memeData),
  });
  return handleResponse(response);
}

// PUBLIC_INTERFACE
/**
 * Get a shared meme by token
 * @param {string} token - Share token
 * @returns {Promise<Blob>} Meme image as blob
 */
export async function getSharedMeme(token) {
  const response = await fetch(`${API_BASE_URL}/api/share/${token}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch shared meme: ${response.status}`);
  }
  
  return response.blob();
}
