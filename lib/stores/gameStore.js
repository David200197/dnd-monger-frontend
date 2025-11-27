import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  currentGame: null,
  tokens: [],
  obstacles: [],
  fog: [],
  messages: [],
  actions: [],
  diceHistory: [],
  shareScreen: null,
  connectedPlayers: [],
  lastSync: null,
  
  setCurrentGame: (game) => set({ currentGame: game }),
  
  setTokens: (tokens) => set({ tokens }),
  addToken: (token) => set((state) => ({ 
    tokens: [...state.tokens, token] 
  })),
  updateToken: (tokenId, updates) => set((state) => ({
    tokens: state.tokens.map(t => 
      t.id === tokenId ? { ...t, ...updates } : t
    )
  })),
  removeToken: (tokenId) => set((state) => ({
    tokens: state.tokens.filter(t => t.id !== tokenId)
  })),
  
  setObstacles: (obstacles) => set({ obstacles }),
  addObstacle: (obstacle) => set((state) => ({ 
    obstacles: [...state.obstacles, obstacle] 
  })),
  removeObstacle: (obstacleId) => set((state) => ({
    obstacles: state.obstacles.filter(o => o.id !== obstacleId)
  })),
  
  setFog: (fog) => set({ fog }),
  toggleFogCell: (x, y) => set((state) => {
    const key = `${x},${y}`;
    const newFog = state.fog.includes(key)
      ? state.fog.filter(f => f !== key)
      : [...state.fog, key];
    return { fog: newFog };
  }),
  revealAllFog: () => set({ fog: [] }),
  hideAllFog: (gridSize) => {
    const allCells = [];
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        allCells.push(`${x},${y}`);
      }
    }
    set({ fog: allCells });
  },
  
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  
  setActions: (actions) => set({ actions }),
  addAction: (action) => set((state) => ({ 
    actions: [action, ...state.actions].slice(0, 100) 
  })),
  
  addDiceRoll: (roll) => set((state) => ({ 
    diceHistory: [roll, ...state.diceHistory].slice(0, 50) 
  })),
  clearDiceHistory: () => set({ diceHistory: [] }),
  
  setShareScreen: (shareScreen) => set({ shareScreen }),
  
  setConnectedPlayers: (players) => set({ connectedPlayers: players }),
  
  setLastSync: (time) => set({ lastSync: time }),
  
  resetGame: () => set({
    currentGame: null,
    tokens: [],
    obstacles: [],
    fog: [],
    messages: [],
    actions: [],
    shareScreen: null,
    connectedPlayers: []
  })
}));