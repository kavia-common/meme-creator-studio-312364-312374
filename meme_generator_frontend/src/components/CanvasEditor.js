import React, { useRef, useEffect, useState } from 'react';
import './CanvasEditor.css';

// PUBLIC_INTERFACE
/**
 * Canvas editor component for editing meme with text layers
 * @param {Object} props - Component props
 * @param {string} props.baseImage - Base image URL
 * @param {Array} props.textLayers - Array of text layer objects
 * @param {number} props.selectedLayerId - Currently selected layer ID
 * @param {Function} props.onUpdateLayer - Callback to update a layer
 * @param {Function} props.onSelectLayer - Callback to select a layer
 * @param {Function} props.onAddLayer - Callback to add a new layer
 */
function CanvasEditor({
  baseImage,
  textLayers,
  selectedLayerId,
  onUpdateLayer,
  onSelectLayer,
  onAddLayer,
}) {
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [resizing, setResizing] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [editingLayer, setEditingLayer] = useState(null);

  useEffect(() => {
    renderCanvas();
  }, [baseImage, textLayers]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw base image
    if (baseImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        canvas.width = Math.min(img.width, 800);
        canvas.height = (img.height * canvas.width) / img.width;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Draw text layers
        textLayers.forEach((layer) => {
          drawTextLayer(ctx, layer);
        });
      };
      img.src = baseImage;
    }
  };

  const drawTextLayer = (ctx, layer) => {
    ctx.save();
    
    // Apply transformations
    const centerX = layer.x + layer.width / 2;
    const centerY = layer.y + layer.height / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate((layer.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Set text styles
    ctx.font = `${layer.fontSize}px ${layer.fontFamily}`;
    ctx.fillStyle = layer.color;
    ctx.strokeStyle = layer.strokeColor;
    ctx.lineWidth = layer.strokeWidth;
    ctx.textAlign = layer.textAlign;
    ctx.textBaseline = 'middle';

    const textX = layer.x + layer.width / 2;
    const textY = layer.y + layer.height / 2;

    // Draw text with stroke
    if (layer.strokeWidth > 0) {
      ctx.strokeText(layer.text, textX, textY);
    }
    ctx.fillText(layer.text, textX, textY);

    // Draw selection border
    if (layer.id === selectedLayerId) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(layer.x, layer.y, layer.width, layer.height);
      ctx.setLineDash([]);
    }

    ctx.restore();
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a layer
    for (let i = textLayers.length - 1; i >= 0; i--) {
      const layer = textLayers[i];
      if (
        x >= layer.x &&
        x <= layer.x + layer.width &&
        y >= layer.y &&
        y <= layer.y + layer.height
      ) {
        onSelectLayer(layer.id);
        setDragging(layer.id);
        setDragStart({ x: x - layer.x, y: y - layer.y });
        break;
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    onUpdateLayer(dragging, {
      x: Math.max(0, x - dragStart.x),
      y: Math.max(0, y - dragStart.y),
    });
  };

  const handleMouseUp = () => {
    setDragging(null);
    setResizing(null);
  };

  const handleDoubleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = textLayers.length - 1; i >= 0; i--) {
      const layer = textLayers[i];
      if (
        x >= layer.x &&
        x <= layer.x + layer.width &&
        y >= layer.y &&
        y <= layer.y + layer.height
      ) {
        setEditingLayer(layer.id);
        break;
      }
    }
  };

  const handleTextEdit = (layerId, newText) => {
    onUpdateLayer(layerId, { text: newText });
    setEditingLayer(null);
  };

  return (
    <div className="canvas-editor">
      {!baseImage ? (
        <div className="canvas-placeholder">
          <div className="placeholder-content">
            <span className="placeholder-icon">🖼️</span>
            <h3>Select a template or upload an image to start</h3>
            <p>Choose from the template gallery or upload your own image</p>
          </div>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            className="meme-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={handleDoubleClick}
          />
          <button className="add-text-btn" onClick={onAddLayer}>
            ➕ Add Text Layer
          </button>
        </>
      )}

      {editingLayer && (
        <div className="text-edit-modal">
          <div className="modal-content">
            <h3>Edit Text</h3>
            <input
              type="text"
              defaultValue={
                textLayers.find((l) => l.id === editingLayer)?.text || ''
              }
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleTextEdit(editingLayer, e.target.value);
                }
              }}
              autoFocus
            />
            <div className="modal-actions">
              <button
                onClick={(e) => {
                  const input = e.target.parentElement.previousSibling;
                  handleTextEdit(editingLayer, input.value);
                }}
                className="btn-primary"
              >
                Save
              </button>
              <button
                onClick={() => setEditingLayer(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CanvasEditor;
