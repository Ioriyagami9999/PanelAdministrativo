// Importamos 'describe', 'it', 'expect' de vitest (ya es global si lo configuraste)
import { describe, it, expect } from 'vitest'

// Importamos el reducer Y las acciones que queremos probar
import authReducer, { 
  setCredentials, 
  logout, 
  initialState // Importamos el estado inicial para comparar
} from './authSlice'

// Asumimos un tipo 'User' para el mock
import { User } from '../../utils/types'

describe('Pruebas del authSlice (Reducer)', () => {

  it('debería manejar el estado inicial', () => {
    // Si le damos un estado 'undefined' y una acción desconocida...
    expect(authReducer(undefined, { type: 'unknown' }))
      // ...debería devolver el estado inicial.
      .toEqual(initialState)
  })

  it('debería manejar setCredentials correctamente', () => {
    const mockUser: User = { 
      id: 1, 
      username: 'testuser', 
      email: 'test@test.com', 
      firstName: 'Test', 
      lastName: 'User', 
      image: '', 
      gender: '' 
    }
    
    const credentials = { user: mockUser, token: 'fake-token-123' }
    
    // 1. Arrange: Empezamos con el estado inicial
    const state = initialState
    
    // 2. Act: Despachamos la acción 'setCredentials'
    const newState = authReducer(state, setCredentials(credentials))
    
    // 3. Assert: Comprobamos que el estado se actualizó
    expect(newState.user).toEqual(mockUser)
    expect(newState.token).toBe('fake-token-123')
  })

  it('debería manejar logout correctamente', () => {
    // 1. Arrange: Creamos un estado "logueado"
    const loggedInState = {
      user: { id: 1, username: 'testuser' } as User,
      token: 'fake-token-123'
    }
    
    // 2. Act: Despachamos la acción 'logout'
    const newState = authReducer(loggedInState, logout())
    
    // 3. Assert: Comprobamos que el estado volvió al inicial
    expect(newState.user).toBeNull()
    expect(newState.token).toBeNull()
    expect(newState).toEqual(initialState)
  })
})