const z = require('zod') // Para validaciones

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required'
  }),
  year: z.number().int().positive().min(1900).max(2026),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5),
  poster: z.string().url({ message: 'Poster must be a valid URL' }),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
    {
      required_error: 'Movie genre is required.',
      invalid_type_error: 'Movie genre must be an array of enum Genre'
    }
  )
})
// La ID no se valida en este schema, por lo tanto cuando se quiera modificar
// a través de este, no lo hará

function validateMovie (input) {
  return movieSchema.safeParse(input)
}

function validatePartialMovie (input) {
  return movieSchema.partial().safeParse(input)
  // Partial convierte todas las propiedades del schema en opcionales
  // Si la propiedad está y se quiere modificar, valida solo eso
}

module.exports = {
  validateMovie,
  validatePartialMovie
}
