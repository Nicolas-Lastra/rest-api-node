const express = require('express') // require -> commonJS
const crypto = require('node:crypto') // Para la creación de ID
const movies = require('./movies.json') // Más adelante obtener de base de datos
const cors = require('cors')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const app = express()
app.use(express.json()) // Middleware

// Midlleware de cors, instalar previamente (pnpm install cors -E)
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234',
      'http://movies.com',
      'http://nico.dev'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))

app.disable('x-powered-by')

// Raíz
app.get('/', (req, res) => {
  res.json({ message: 'hola mundo' })
})

// Endpoints

// Dominios aceptados
// Especificar si no se está utilizando dependencia cors
// const ACCEPTED_ORIGINS = [
//   'http://localhost:8080',
//   'http://localhost:1234',
//   'http://movies.com',
//   'http://nico.dev'
// ]

// Todos los recursos que sean MOVIES se identifica con /movies
app.get('/movies', (req, res) => {
  // res.header('Access-Control-Allow-Origin', '*') // Permite todos los orignes (CORS)

  // Dominios y origenes específicos
  // Especificar si no se está utilizando dependencia cors
  // const origin = req.header('origin')
  // // Tener en cuenta que el navegador no envía la cabecera origin cuando es el mismo origen
  // if (ACCEPTED_ORIGINS.includes(origin || !origin)) {
  //   res.header('Access-Control-Allow-Origin', origin)
  // }

  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLocaleLowerCase()))
    return res.json(filteredMovies)
  }

  res.json(movies)
})

// :id es dinámico y es un parámetro de la url
app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).json({ message: 'Movie not found' })
})

// Crear recursos
app.post('/movies', (req, res) => {
  const result = validateMovie(req.body) // Validación según schema

  // También se puede utilizar if (!result.success)
  if (result.error) {
    // 422 Unprocessable Entity
    return res.status(422).json({ error: JSON.parse(result.error.message) })
  }

  // Debe cambiarse más adelante por una base de datos
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  // Esto no sería REST ya que estamos guardando el estado de la aplicación en memoria
  movies.push(newMovie)

  res.status(201).json(newMovie)
})

// Actualizar parcialmente
app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)
  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex < 0) return res.status(404).json({ message: 'Movie not found' })

  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updatedMovie

  return res.json(updatedMovie)
})

// Borrar un recurso
app.delete('/movies/:id', (req, res) => {
  // Especificar si no se está utilizando dependencia cors
  // const origin = req.header('origin')
  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', origin)
  // }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)
  return res.json({ message: 'Movie deleted' })
})

// Options, operaciones permitidas CORS
// Utilizar esto si no se está usando dependencia cors
// app.options('/movies/:id', (req, res) => {
//   const origin = req.header('origin')

//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE') // Métodos permitidos
//   }
//   res.send(200)
// })

// Importante dejar process.env.PORT ya que el servicio de hosting
// suele proporcionar un puerto por variable de entorno
const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
