
import { describe, it, expect } from 'vitest'

import authReducer, { 
  setCredentials, 
  logout, 
  initialState 
} from './authSlice'


import { User } from '../../utils/types'

describe('Pruebas del authSlice (Reducer)', () => {

  it('debería manejar el estado inicial', () => {
    expect(authReducer(undefined, { type: 'unknown' }))
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
    
    const state = initialState
    
    const newState = authReducer(state, setCredentials(credentials))
    
    expect(newState.user).toEqual(mockUser)
    expect(newState.token).toBe('fake-token-123')
  })

  it('debería manejar logout correctamente', () => {
    const loggedInState = {
      user: { id: 1, username: 'testuser' } as User,
      token: 'fake-token-123'
    }
    
    const newState = authReducer(loggedInState, logout())
    
    expect(newState.user).toBeNull()
    expect(newState.token).toBeNull()
    expect(newState).toEqual(initialState)
  })
})