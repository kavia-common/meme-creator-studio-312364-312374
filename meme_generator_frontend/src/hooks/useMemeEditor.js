import { useReducer, useCallback } from 'react';

/**
 * Initial state for the meme editor
 */
const initialState = {
  baseImage: null,
  textLayers: [],
  selectedLayerId: null,
  nextLayerId: 1,
};

/**
 * Action types for the meme editor reducer
 */
const ACTION_TYPES = {
  SET_BASE_IMAGE: 'SET_BASE_IMAGE',
  ADD_TEXT_LAYER: 'ADD_TEXT_LAYER',
  UPDATE_TEXT_LAYER: 'UPDATE_TEXT_LAYER',
  DELETE_TEXT_LAYER: 'DELETE_TEXT_LAYER',
  SELECT_LAYER: 'SELECT_LAYER',
  MOVE_LAYER_UP: 'MOVE_LAYER_UP',
  MOVE_LAYER_DOWN: 'MOVE_LAYER_DOWN',
  RESET: 'RESET',
};

/**
 * Reducer function for managing meme editor state
 */
function memeEditorReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_BASE_IMAGE:
      return {
        ...state,
        baseImage: action.payload,
        textLayers: [],
        selectedLayerId: null,
      };

    case ACTION_TYPES.ADD_TEXT_LAYER:
      const newLayer = {
        id: state.nextLayerId,
        text: 'Double click to edit',
        x: 50,
        y: 50,
        fontSize: 48,
        fontFamily: 'Impact, Arial Black, sans-serif',
        color: '#FFFFFF',
        strokeColor: '#000000',
        strokeWidth: 2,
        textAlign: 'center',
        rotation: 0,
        width: 300,
        height: 60,
      };
      return {
        ...state,
        textLayers: [...state.textLayers, newLayer],
        selectedLayerId: newLayer.id,
        nextLayerId: state.nextLayerId + 1,
      };

    case ACTION_TYPES.UPDATE_TEXT_LAYER:
      return {
        ...state,
        textLayers: state.textLayers.map(layer =>
          layer.id === action.payload.id
            ? { ...layer, ...action.payload.updates }
            : layer
        ),
      };

    case ACTION_TYPES.DELETE_TEXT_LAYER:
      const remainingLayers = state.textLayers.filter(
        layer => layer.id !== action.payload
      );
      return {
        ...state,
        textLayers: remainingLayers,
        selectedLayerId:
          state.selectedLayerId === action.payload
            ? remainingLayers[0]?.id || null
            : state.selectedLayerId,
      };

    case ACTION_TYPES.SELECT_LAYER:
      return {
        ...state,
        selectedLayerId: action.payload,
      };

    case ACTION_TYPES.MOVE_LAYER_UP:
      const upIndex = state.textLayers.findIndex(l => l.id === action.payload);
      if (upIndex < state.textLayers.length - 1) {
        const newLayers = [...state.textLayers];
        [newLayers[upIndex], newLayers[upIndex + 1]] = [
          newLayers[upIndex + 1],
          newLayers[upIndex],
        ];
        return { ...state, textLayers: newLayers };
      }
      return state;

    case ACTION_TYPES.MOVE_LAYER_DOWN:
      const downIndex = state.textLayers.findIndex(l => l.id === action.payload);
      if (downIndex > 0) {
        const newLayers = [...state.textLayers];
        [newLayers[downIndex], newLayers[downIndex - 1]] = [
          newLayers[downIndex - 1],
          newLayers[downIndex],
        ];
        return { ...state, textLayers: newLayers };
      }
      return state;

    case ACTION_TYPES.RESET:
      return initialState;

    default:
      return state;
  }
}

// PUBLIC_INTERFACE
/**
 * Custom hook for managing meme editor state and actions
 * @returns {Object} Editor state and action functions
 */
export function useMemeEditor() {
  const [state, dispatch] = useReducer(memeEditorReducer, initialState);

  const setBaseImage = useCallback((imageUrl) => {
    dispatch({ type: ACTION_TYPES.SET_BASE_IMAGE, payload: imageUrl });
  }, []);

  const addTextLayer = useCallback(() => {
    dispatch({ type: ACTION_TYPES.ADD_TEXT_LAYER });
  }, []);

  const updateTextLayer = useCallback((id, updates) => {
    dispatch({
      type: ACTION_TYPES.UPDATE_TEXT_LAYER,
      payload: { id, updates },
    });
  }, []);

  const deleteTextLayer = useCallback((id) => {
    dispatch({ type: ACTION_TYPES.DELETE_TEXT_LAYER, payload: id });
  }, []);

  const selectLayer = useCallback((id) => {
    dispatch({ type: ACTION_TYPES.SELECT_LAYER, payload: id });
  }, []);

  const moveLayerUp = useCallback((id) => {
    dispatch({ type: ACTION_TYPES.MOVE_LAYER_UP, payload: id });
  }, []);

  const moveLayerDown = useCallback((id) => {
    dispatch({ type: ACTION_TYPES.MOVE_LAYER_DOWN, payload: id });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: ACTION_TYPES.RESET });
  }, []);

  return {
    baseImage: state.baseImage,
    textLayers: state.textLayers,
    selectedLayerId: state.selectedLayerId,
    setBaseImage,
    addTextLayer,
    updateTextLayer,
    deleteTextLayer,
    selectLayer,
    moveLayerUp,
    moveLayerDown,
    reset,
  };
}
