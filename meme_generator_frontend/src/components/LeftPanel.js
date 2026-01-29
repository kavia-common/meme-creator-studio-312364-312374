import React, { useState, useEffect } from 'react';
import { getTemplates, uploadImage } from '../services/api';
import './LeftPanel.css';

// PUBLIC_INTERFACE
/**
 * Left panel component for template gallery and image upload
 * @param {Object} props - Component props
 * @param {Function} props.onSelectImage - Callback when an image is selected
 */
function LeftPanel({ onSelectImage }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      const result = await uploadImage(file);
      onSelectImage(result.imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="left-panel">
      <div className="panel-section">
        <h2 className="panel-title">Upload Image</h2>
        <label className="upload-btn">
          {uploading ? '⏳ Uploading...' : '📤 Upload Your Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <div className="panel-section">
        <h2 className="panel-title">Meme Templates</h2>
        
        {loading && <div className="loading">Loading templates...</div>}
        
        {error && (
          <div className="error-message">
            ⚠️ {error}
            <button className="retry-btn" onClick={loadTemplates}>
              Retry
            </button>
          </div>
        )}

        <div className="template-grid">
          {templates.map((template) => (
            <div
              key={template.id}
              className="template-card"
              onClick={() => onSelectImage(template.url)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter') onSelectImage(template.url);
              }}
            >
              <img
                src={template.url}
                alt={template.name}
                className="template-image"
              />
              <div className="template-name">{template.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LeftPanel;
