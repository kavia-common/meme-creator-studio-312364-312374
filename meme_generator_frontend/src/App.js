import React from 'react';
import { useMemeEditor } from './hooks/useMemeEditor';
import TopNav from './components/TopNav';
import LeftPanel from './components/LeftPanel';
import CanvasEditor from './components/CanvasEditor';
import RightPanel from './components/RightPanel';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Main application component for the meme generator
 * Orchestrates all sub-components and manages meme editor state
 */
function App() {
  const {
    baseImage,
    textLayers,
    selectedLayerId,
    setBaseImage,
    addTextLayer,
    updateTextLayer,
    deleteTextLayer,
    selectLayer,
    moveLayerUp,
    moveLayerDown,
    reset,
  } = useMemeEditor();

  return (
    <div className="App">
      <TopNav onReset={reset} />
      <div className="app-content">
        <LeftPanel onSelectImage={setBaseImage} />
        <CanvasEditor
          baseImage={baseImage}
          textLayers={textLayers}
          selectedLayerId={selectedLayerId}
          onUpdateLayer={updateTextLayer}
          onSelectLayer={selectLayer}
          onAddLayer={addTextLayer}
        />
        <RightPanel
          baseImage={baseImage}
          textLayers={textLayers}
          selectedLayerId={selectedLayerId}
          onUpdateLayer={updateTextLayer}
          onDeleteLayer={deleteTextLayer}
          onMoveLayerUp={moveLayerUp}
          onMoveLayerDown={moveLayerDown}
        />
      </div>
    </div>
  );
}

export default App;
