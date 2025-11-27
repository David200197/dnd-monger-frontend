const API_BASE = '/api';

const getHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth endpoints
  auth: {
    register: async (data) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return res.json();
    },
    login: async (data) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return res.json();
    },
    me: async (token) => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getHeaders(token)
      });
      return res.json();
    }
  },
  
  // Game endpoints
  games: {
    list: async (token) => {
      const res = await fetch(`${API_BASE}/games`, {
        headers: getHeaders(token)
      });
      return res.json();
    },
    create: async (data, token) => {
      const res = await fetch(`${API_BASE}/games`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(data)
      });
      return res.json();
    },
    get: async (gameId, token) => {
      const res = await fetch(`${API_BASE}/games/${gameId}`, {
        headers: getHeaders(token)
      });
      return res.json();
    },
    join: async (gameId, token) => {
      const res = await fetch(`${API_BASE}/games/${gameId}/join`, {
        method: 'POST',
        headers: getHeaders(token)
      });
      return res.json();
    },
    leave: async (gameId, token) => {
      const res = await fetch(`${API_BASE}/games/${gameId}/leave`, {
        method: 'POST',
        headers: getHeaders(token)
      });
      return res.json();
    },
    updateTokens: async (gameId, tokens, token) => {
      const res = await fetch(`${API_BASE}/games/${gameId}/tokens`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify({ tokens })
      });
      return res.json();
    },
    updateFog: async (gameId, fog, token) => {
      const res = await fetch(`${API_BASE}/games/${gameId}/fog`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify({ fog })
      });
      return res.json();
    },
    updateObstacles: async (gameId, obstacles, token) => {
      const res = await fetch(`${API_BASE}/games/${gameId}/obstacles`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify({ obstacles })
      });
      return res.json();
    },
    updateShareScreen: async (gameId, shareScreen, token) => {
      const res = await fetch(`${API_BASE}/games/${gameId}/share`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify({ shareScreen })
      });
      return res.json();
    },
    sync: async (gameId, token) => {
      const res = await fetch(`${API_BASE}/games/${gameId}/sync`, {
        headers: getHeaders(token)
      });
      return res.json();
    }
  },
  
  // Messages
  messages: {
    list: async (gameId, token) => {
      const res = await fetch(`${API_BASE}/games/${gameId}/messages`, {
        headers: getHeaders(token)
      });
      return res.json();
    },
    send: async (gameId, content, token) => {
      const res = await fetch(`${API_BASE}/games/${gameId}/messages`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ content })
      });
      return res.json();
    }
  },
  
  // Dice
  dice: {
    roll: async (gameId, diceType, count, modifier, token) => {
      const res = await fetch(`${API_BASE}/games/${gameId}/dice`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ diceType, count, modifier })
      });
      return res.json();
    }
  },
  
  // Actions log
  actions: {
    list: async (gameId, token) => {
      const res = await fetch(`${API_BASE}/games/${gameId}/actions`, {
        headers: getHeaders(token)
      });
      return res.json();
    },
    log: async (gameId, action, token) => {
      const res = await fetch(`${API_BASE}/games/${gameId}/actions`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(action)
      });
      return res.json();
    }
  }
};