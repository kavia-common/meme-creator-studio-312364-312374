import React, { useState, useEffect } from 'react';
import { renderMeme, shareMeme } from '../services/api';
import './RightPanel.css';

// PUBLIC_INTERFACE
/**
 * Right panel component for layer controls, preview, and actions
 * @param {Object} props - Component props
 * @param {string} props.baseImage - Base image URL
 * @param {Array} props.textLayers - Array of text layer objects
 * @param {number} props.selectedLayerId - Currently selected layer ID
 * @param {Function} props.onUpdateLayer - Callback to update a layer
 * @param {Function} props.onDeleteLayer - Callback to delete a layer
 * @param {Function} props.onMoveLayerUp - Callback to move layer up in z-order
 * @param {Function} props.onMoveLayerDown - Callback to move layer down in z-order
 */
function RightPanel({
  baseImage,
  textLayers,
  selectedLayerId,
  onUpdateLayer,
  onDeleteLayer,
  onMoveLayerUp,
  onMoveLayerDown,
}) {
  const [preview, setPreview] = useState(null);
  const [rendering, setRendering] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);
  const [error, setError] = useState(null);

  const selectedLayer = textLayers.find((l) => l.id === selectedLayerId);

  useEffect(() => {
    // Auto-generate preview when state changes
    if (baseImage && textLayers.length > 0) {
      const debounce = setTimeout(() => {
        generatePreview();
      }, 1000);
      return () => clearTimeout(debounce);
    }
  }, [baseImage, textLayers]);

  const generatePreview = async () => {
    if (!baseImage) return;

    try {
      setRendering(true);
      setError(null);
      
      const blob = await renderMeme({
        baseImage,
        textLayers: textLayers.map(layer => ({
          text: layer.text,
          x: layer.x,
          y: layer.y,
          fontSize: layer.fontSize,
          fontFamily: layer.fontFamily,
          color: layer.color,
          strokeColor: layer.strokeColor,
          strokeWidth: layer.strokeWidth,
          textAlign: layer.textAlign,
          rotation: layer.rotation,
        })),
      });
      
      const url = URL.createObjectURL(blob);
      setPreview(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setRendering(false);
    }
  };

  const handleDownload = () => {
    if (!preview) return;
    
    const link = document.createElement('a');
    link.href = preview;
    link.download = `meme-${Date.now()}.png`;
    link.click();
  };

  const handleShare = async () => {
    if (!baseImage) return;

    try {
      setSharing(true);
      setError(null);
      
      const result = await shareMeme({
        baseImage,
        textLayers: textLayers.map(layer => ({
          text: layer.text,
          x: layer.x,
          y: layer.y,
          fontSize: layer.fontSize,
          fontFamily: layer.fontFamily,
          color: layer.color,
          strokeColor: layer.strokeColor,
          strokeWidth: layer.strokeWidth,
          textAlign: layer.textAlign,
          rotation: layer.rotation,
        })),
      });
      
      setShareUrl(result.shareUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setSharing(false);
    }
  };

  const copyShareUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      alert('Share URL copied to clipboard!');
    }
  };

  return (
    <div className="right-panel">
      {/* Text Layer Controls */}
      {selectedLayer && (
        <div className="panel-section">
          <h2 className="panel-title">Text Controls</h2>
          
          <div className="control-group">
            <label>Text</label>
            <input
              type="text"
              value={selectedLayer.text}
              onChange={(e) =>
                onUpdateLayer(selectedLayer.id, { text: e.target.value })
              }
              className="text-input"
            />
          </div>

          <div className="control-row">
            <div className="control-group">
              <label>Font Size</label>
              <input
                type="number"
                value={selectedLayer.fontSize}
                onChange={(e) =>
                  onUpdateLayer(selectedLayer.id, {
                    fontSize: parseInt(e.target.value),
                  })
                }
                min="12"
                max="200"
                className="number-input"
              />
            </div>

            <div className="control-group">
              <label>Rotation</label>
              <input
                type="number"
                value={selectedLayer.rotation}
                onChange={(e) =>
                  onUpdateLayer(selectedLayer.id, {
                    rotation: parseInt(e.target.value),
                  })
                }
                min="-180"
                max="180"
                className="number-input"
              />
            </div>
          </div>

          <div className="control-group">
            <label>Font Family</label>
            <select
              value={selectedLayer.fontFamily}
              onChange={(e) =>
                onUpdateLayer(selectedLayer.id, { fontFamily: e.target.value })
              }
              className="select-input"
            >
              <option value="Impact, Arial Black, sans-serif">Impact</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Times New Roman, serif">Times New Roman</option>
              <option value="Courier New, monospace">Courier New</option>
              <option value="Comic Sans MS, cursive">Comic Sans MS</option>
            </select>
          </div>

          <div className="control-row">
            <div className="control-group">
              <label>Text Color</label>
              <input
                type="color"
                value={selectedLayer.color}
                onChange={(e) =>
                  onUpdateLayer(selectedLayer.id, { color: e.target.value })
                }
                className="color-input"
              />
            </div>

            <div className="control-group">
              <label>Stroke Color</label>
              <input
                type="color"
                value={selectedLayer.strokeColor}
                onChange={(e) =>
                  onUpdateLayer(selectedLayer.id, {
                    strokeColor: e.target.value,
                  })
                }
                className="color-input"
              />
            </div>
          </div>

          <div className="control-group">
            <label>Stroke Width</label>
            <input
              type="range"
              value={selectedLayer.strokeWidth}
              onChange={(e) =>
                onUpdateLayer(selectedLayer.id, {
                  strokeWidth: parseInt(e.target.value),
                })
              }
              min="0"
              max="10"
              className="range-input"
            />
            <span className="range-value">{selectedLayer.strokeWidth}px</span>
          </div>

          <div className="control-group">
            <label>Text Align</label>
            <div className="button-group">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  className={`btn-group-item ${
                    selectedLayer.textAlign === align ? 'active' : ''
                  }`}
                  onClick={() =>
                    onUpdateLayer(selectedLayer.id, { textAlign: align })
                  }
                >
                  {align === 'left' && '⬅️'}
                  {align === 'center' && '↔️'}
                  {align === 'right' && '➡️'}
                </button>
              ))}
            </div>
          </div>

          <div className="control-actions">
            <button
              className="btn-icon"
              onClick={() => onMoveLayerUp(selectedLayer.id)}
              title="Move layer up"
            >
              ⬆️
            </button>
            <button
              className="btn-icon"
              onClick={() => onMoveLayerDown(selectedLayer.id)}
              title="Move layer down"
            >
              ⬇️
            </button>
            <button
              className="btn-icon btn-danger"
              onClick={() => onDeleteLayer(selectedLayer.id)}
              title="Delete layer"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      )}

      {/* Preview Section */}
      <div className="panel-section">
        <h2 className="panel-title">Preview</h2>
        
        <button
          className="btn-generate"
          onClick={generatePreview}
          disabled={!baseImage || rendering}
        >
          {rendering ? '⏳ Rendering...' : '🎨 Generate Preview'}
        </button>

        {preview && (
          <div className="preview-container">
            <img src={preview} alt="Meme preview" className="preview-image" />
          </div>
        )}

        {error && <div className="error-message">⚠️ {error}</div>}
      </div>

      {/* Actions Section */}
      {preview && (
        <div className="panel-section">
          <h2 className="panel-title">Actions</h2>
          
          <button className="btn-action btn-primary" onClick={handleDownload}>
            💾 Download Meme
          </button>

          <button
            className="btn-action btn-secondary"
            onClick={handleShare}
            disabled={sharing}
          >
            {sharing ? '⏳ Sharing...' : '🔗 Share Meme'}
          </button>

          {shareUrl && (
            <div className="share-url-container">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="share-url-input"
              />
              <button className="btn-copy" onClick={copyShareUrl}>
                📋 Copy
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RightPanel;
