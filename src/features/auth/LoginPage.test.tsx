
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { renderWithProviders } from '../../test/test-utils'
import LoginPage from './LoginPage'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const mockLoginResponse = {
  id: 1,
  username: 'kminchelle',
  email: 'kminchelle@example.com',
  firstName: 'Test',
  lastName: 'User',
  token: 'fake-jwt-token-123',
  image: '',
  gender: 'male',
}

export const handlers = [
  http.post('https://dummyjson.com/auth/login', () => {
    return HttpResponse.json(mockLoginResponse)
  })
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


describe('Prueba de LoginPage', () => {

  it('debería iniciar sesión y mostrar un toast de éxito', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(<LoginPage />)

    const usernameInput = screen.getByPlaceholderText('Nombre de usuario')
    const passwordInput = screen.getByPlaceholderText('Tu contraseña')
    const submitButton = screen.getByRole('button', { name: /Ingresar/i })

    await user.clear(usernameInput)
    await user.clear(passwordInput)

    await user.type(usernameInput, 'kminchelle')
    await user.type(passwordInput, '0lelplR')
    
    await user.click(submitButton)

    const successMessage = await screen.findByText('Inicio exitoso')
    const welcomeMessage = await screen.findByText('Bienvenido, kminchelle!')

    expect(successMessage).toBeInTheDocument()
    expect(welcomeMessage).toBeInTheDocument()
  })
  
})