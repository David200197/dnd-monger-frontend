import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'mapmaster-secret-key-change-in-production'

// MongoDB connection
let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

// Verify JWT token
function verifyToken(request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (error) {
    return null
  }
}

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    // ============= ROOT =============
    if ((route === '/' || route === '/root') && method === 'GET') {
      return handleCORS(NextResponse.json({ message: "MapMaster API v1.0" }))
    }

    // ============= AUTH ROUTES =============
    
    // Register - POST /api/auth/register
    if (route === '/auth/register' && method === 'POST') {
      const body = await request.json()
      const { username, password, email, avatar, role } = body
      
      if (!username || !password) {
        return handleCORS(NextResponse.json(
          { error: "Username and password are required" },
          { status: 400 }
        ))
      }
      
      // Check if user exists
      const existingUser = await db.collection('users').findOne({ username })
      if (existingUser) {
        return handleCORS(NextResponse.json(
          { error: "Username already exists" },
          { status: 400 }
        ))
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)
      
      const user = {
        id: uuidv4(),
        username,
        password: hashedPassword,
        email: email || '',
        avatar: avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`,
        role: role || null, // No default role - user must select
        createdAt: new Date()
      }
      
      await db.collection('users').insertOne(user)
      
      const token = generateToken(user)
      const { password: _, ...userWithoutPassword } = user
      
      return handleCORS(NextResponse.json({
        user: userWithoutPassword,
        token
      }))
    }
    
    // Login - POST /api/auth/login
    if (route === '/auth/login' && method === 'POST') {
      const body = await request.json()
      const { username, password } = body
      
      if (!username || !password) {
        return handleCORS(NextResponse.json(
          { error: "Username and password are required" },
          { status: 400 }
        ))
      }
      
      const user = await db.collection('users').findOne({ username })
      if (!user) {
        return handleCORS(NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        ))
      }
      
      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) {
        return handleCORS(NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        ))
      }
      
      const token = generateToken(user)
      const { password: _, ...userWithoutPassword } = user
      
      return handleCORS(NextResponse.json({
        user: userWithoutPassword,
        token
      }))
    }
    
    // Get current user - GET /api/auth/me
    if (route === '/auth/me' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      const user = await db.collection('users').findOne({ id: decoded.id })
      if (!user) {
        return handleCORS(NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        ))
      }
      
      const { password: _, ...userWithoutPassword } = user
      return handleCORS(NextResponse.json({ user: userWithoutPassword }))
    }
    
    // Update role - PUT /api/auth/role
    if (route === '/auth/role' && method === 'PUT') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      const body = await request.json()
      const { role } = body
      
      if (!['dm', 'player'].includes(role)) {
        return handleCORS(NextResponse.json(
          { error: "Invalid role" },
          { status: 400 }
        ))
      }
      
      await db.collection('users').updateOne(
        { id: decoded.id },
        { $set: { role } }
      )
      
      const user = await db.collection('users').findOne({ id: decoded.id })
      const { password: _, ...userWithoutPassword } = user
      const newToken = generateToken(user)
      
      return handleCORS(NextResponse.json({
        user: userWithoutPassword,
        token: newToken
      }))
    }

    // ============= GAME ROUTES =============
    
    // List games - GET /api/games
    if (route === '/games' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      const games = await db.collection('games')
        .find({ status: { $ne: 'deleted' } })
        .sort({ createdAt: -1 })
        .toArray()
      
      const cleanedGames = games.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json({ games: cleanedGames }))
    }
    
    // Create game - POST /api/games
    if (route === '/games' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      const body = await request.json()
      const { name, description, maxPlayers, gridSize } = body
      
      if (!name) {
        return handleCORS(NextResponse.json(
          { error: "Game name is required" },
          { status: 400 }
        ))
      }
      
      const game = {
        id: uuidv4(),
        name,
        description: description || '',
        maxPlayers: maxPlayers || 6,
        gridSize: gridSize || 20,
        dmId: decoded.id,
        dmUsername: decoded.username,
        players: [{ id: decoded.id, username: decoded.username, role: 'dm' }],
        tokens: [],
        obstacles: [],
        fog: [],
        shareScreen: null,
        status: 'waiting',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await db.collection('games').insertOne(game)
      
      const { _id, ...gameWithoutMongo } = game
      return handleCORS(NextResponse.json({ game: gameWithoutMongo }))
    }
    
    // Get single game - GET /api/games/:id
    const getGameMatch = route.match(/^\/games\/([^/]+)$/)
    if (getGameMatch && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      const gameId = getGameMatch[1]
      const game = await db.collection('games').findOne({ id: gameId })
      
      if (!game) {
        return handleCORS(NextResponse.json(
          { error: "Game not found" },
          { status: 404 }
        ))
      }
      
      const { _id, ...gameWithoutMongo } = game
      return handleCORS(NextResponse.json({ game: gameWithoutMongo }))
    }
    
    // Join game - POST /api/games/:id/join
    const joinGameMatch = route.match(/^\/games\/([^/]+)\/join$/)
    if (joinGameMatch && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      const gameId = joinGameMatch[1]
      const game = await db.collection('games').findOne({ id: gameId })
      
      if (!game) {
        return handleCORS(NextResponse.json(
          { error: "Game not found" },
          { status: 404 }
        ))
      }
      
      // Check if already in game
      if (game.players.some(p => p.id === decoded.id)) {
        const { _id, ...gameWithoutMongo } = game
        return handleCORS(NextResponse.json({ game: gameWithoutMongo }))
      }
      
      // Check max players
      if (game.players.length >= game.maxPlayers) {
        return handleCORS(NextResponse.json(
          { error: "Game is full" },
          { status: 400 }
        ))
      }
      
      const newPlayer = { 
        id: decoded.id, 
        username: decoded.username, 
        role: 'player' 
      }
      
      await db.collection('games').updateOne(
        { id: gameId },
        { 
          $push: { players: newPlayer },
          $set: { updatedAt: new Date() }
        }
      )
      
      // Log action
      await db.collection('actions').insertOne({
        id: uuidv4(),
        gameId,
        userId: decoded.id,
        username: decoded.username,
        type: 'gameJoined',
        data: {},
        createdAt: new Date()
      })
      
      const updatedGame = await db.collection('games').findOne({ id: gameId })
      const { _id, ...gameWithoutMongo } = updatedGame
      return handleCORS(NextResponse.json({ game: gameWithoutMongo }))
    }
    
    // Leave game - POST /api/games/:id/leave
    const leaveGameMatch = route.match(/^\/games\/([^/]+)\/leave$/)
    if (leaveGameMatch && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      const gameId = leaveGameMatch[1]
      
      await db.collection('games').updateOne(
        { id: gameId },
        { 
          $pull: { players: { id: decoded.id } },
          $set: { updatedAt: new Date() }
        }
      )
      
      // Log action
      await db.collection('actions').insertOne({
        id: uuidv4(),
        gameId,
        userId: decoded.id,
        username: decoded.username,
        type: 'gameLeft',
        data: {},
        createdAt: new Date()
      })
      
      return handleCORS(NextResponse.json({ success: true }))
    }
    
    // Update tokens - PUT /api/games/:id/tokens
    const updateTokensMatch = route.match(/^\/games\/([^/]+)\/tokens$/)
    if (updateTokensMatch && method === 'PUT') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      const gameId = updateTokensMatch[1]
      const body = await request.json()
      const { tokens } = body
      
      await db.collection('games').updateOne(
        { id: gameId },
        { $set: { tokens, updatedAt: new Date() } }
      )
      
      return handleCORS(NextResponse.json({ success: true }))
    }
    
    // Update fog - PUT /api/games/:id/fog
    const updateFogMatch = route.match(/^\/games\/([^/]+)\/fog$/)
    if (updateFogMatch && method === 'PUT') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      const gameId = updateFogMatch[1]
      const body = await request.json()
      const { fog } = body
      
      await db.collection('games').updateOne(
        { id: gameId },
        { $set: { fog, updatedAt: new Date() } }
      )
      
      return handleCORS(NextResponse.json({ success: true }))
    }
    
    // Update obstacles - PUT /api/games/:id/obstacles
    const updateObstaclesMatch = route.match(/^\/games\/([^/]+)\/obstacles$/)
    if (updateObstaclesMatch && method === 'PUT') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      const gameId = updateObstaclesMatch[1]
      const body = await request.json()
      const { obstacles } = body
      
      await db.collection('games').updateOne(
        { id: gameId },
        { $set: { obstacles, updatedAt: new Date() } }
      )
      
      return handleCORS(NextResponse.json({ success: true }))
    }
    
    // Update share screen - PUT /api/games/:id/share
    const updateShareMatch = route.match(/^\/games\/([^/]+)\/share$/)
    if (updateShareMatch && method === 'PUT') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      const gameId = updateShareMatch[1]
      const body = await request.json()
      const { shareScreen } = body
      
      await db.collection('games').updateOne(
        { id: gameId },
        { $set: { shareScreen, updatedAt: new Date() } }
      )
      
      return handleCORS(NextResponse.json({ success: true }))
    }
    
    // Sync game state - GET /api/games/:id/sync
    const syncGameMatch = route.match(/^\/games\/([^/]+)\/sync$/)
    if (syncGameMatch && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      const gameId = syncGameMatch[1]
      const game = await db.collection('games').findOne({ id: gameId })
      
      if (!game) {
        return handleCORS(NextResponse.json(
          { error: "Game not found" },
          { status: 404 }
        ))
      }
      
      // Get recent messages
      const messages = await db.collection('messages')
        .find({ gameId })
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray()
      
      // Get recent actions
      const actions = await db.collection('actions')
        .find({ gameId })
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray()
      
      const { _id, ...gameWithoutMongo } = game
      const cleanMessages = messages.map(({ _id, ...rest }) => rest).reverse()
      const cleanActions = actions.map(({ _id, ...rest }) => rest)
      
      return handleCORS(NextResponse.json({
        game: gameWithoutMongo,
        messages: cleanMessages,
        actions: cleanActions,
        timestamp: new Date()
      }))
    }

    // ============= MESSAGE ROUTES =============
    
    // Get messages - GET /api/games/:id/messages
    const getMessagesMatch = route.match(/^\/games\/([^/]+)\/messages$/)
    if (getMessagesMatch && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      const gameId = getMessagesMatch[1]
      const messages = await db.collection('messages')
        .find({ gameId })
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray()
      
      const cleanedMessages = messages.map(({ _id, ...rest }) => rest).reverse()
      return handleCORS(NextResponse.json({ messages: cleanedMessages }))
    }
    
    // Send message - POST /api/games/:id/messages
    const sendMessageMatch = route.match(/^\/games\/([^/]+)\/messages$/)
    if (sendMessageMatch && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      const gameId = sendMessageMatch[1]
      const body = await request.json()
      const { content } = body
      
      if (!content) {
        return handleCORS(NextResponse.json(
          { error: "Message content is required" },
          { status: 400 }
        ))
      }
      
      const user = await db.collection('users').findOne({ id: decoded.id })
      
      const message = {
        id: uuidv4(),
        gameId,
        userId: decoded.id,
        username: decoded.username,
        avatar: user?.avatar || '',
        content,
        createdAt: new Date()
      }
      
      await db.collection('messages').insertOne(message)
      
      const { _id, ...messageWithoutMongo } = message
      return handleCORS(NextResponse.json({ message: messageWithoutMongo }))
    }

    // ============= DICE ROUTES =============
    
    // Roll dice - POST /api/games/:id/dice
    const rollDiceMatch = route.match(/^\/games\/([^/]+)\/dice$/)
    if (rollDiceMatch && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      const gameId = rollDiceMatch[1]
      const body = await request.json()
      const { diceType, count, modifier } = body
      
      const sides = parseInt(diceType.replace('d', ''))
      const diceCount = count || 1
      const mod = modifier || 0
      
      const rolls = []
      for (let i = 0; i < diceCount; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1)
      }
      
      const total = rolls.reduce((a, b) => a + b, 0) + mod
      
      const diceRoll = {
        id: uuidv4(),
        gameId,
        userId: decoded.id,
        username: decoded.username,
        diceType,
        count: diceCount,
        modifier: mod,
        rolls,
        total,
        createdAt: new Date()
      }
      
      // Log as action
      await db.collection('actions').insertOne({
        id: uuidv4(),
        gameId,
        userId: decoded.id,
        username: decoded.username,
        type: 'diceRolled',
        data: { diceType, count: diceCount, modifier: mod, rolls, total },
        createdAt: new Date()
      })
      
      return handleCORS(NextResponse.json({ roll: diceRoll }))
    }

    // ============= ACTION LOG ROUTES =============
    
    // Get actions - GET /api/games/:id/actions
    const getActionsMatch = route.match(/^\/games\/([^/]+)\/actions$/)
    if (getActionsMatch && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      const gameId = getActionsMatch[1]
      const actions = await db.collection('actions')
        .find({ gameId })
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray()
      
      const cleanedActions = actions.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json({ actions: cleanedActions }))
    }
    
    // Log action - POST /api/games/:id/actions
    const logActionMatch = route.match(/^\/games\/([^/]+)\/actions$/)
    if (logActionMatch && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      const gameId = logActionMatch[1]
      const body = await request.json()
      const { type, data } = body
      
      const action = {
        id: uuidv4(),
        gameId,
        userId: decoded.id,
        username: decoded.username,
        type,
        data: data || {},
        createdAt: new Date()
      }
      
      await db.collection('actions').insertOne(action)
      
      const { _id, ...actionWithoutMongo } = action
      return handleCORS(NextResponse.json({ action: actionWithoutMongo }))
    }

    // Route not found
    return handleCORS(NextResponse.json(
      { error: `Route ${route} not found` },
      { status: 404 }
    ))

  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    ))
  }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute