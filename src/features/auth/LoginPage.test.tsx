import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '../../test/test-utils'
import LoginPage from './LoginPage'

describe('Prueba de LoginPage', () => {

  it('debería iniciar sesión y mostrar un toast de éxito', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(<LoginPage />)

    // --- ✅ AQUÍ ESTÁ EL CAMBIO ---
    // 4. Act: El usuario escribe en los campos
    const usernameInput = screen.getByPlaceholderText('Nombre de usuario')
    const passwordInput = screen.getByPlaceholderText('Tu contraseña')
    const submitButton = screen.getByRole('button', { name: /Ingresar/i })

    // Limpiamos los valores por defecto primero (buena práctica)
    await user.clear(usernameInput)
    await user.clear(passwordInput)

    // Escribimos las credenciales correctas
    await user.type(usernameInput, 'kminchelle')
    await user.type(passwordInput, '0lelplR')
    
    await user.click(submitButton)
    // ----------------------------

    // 5. Assert: Verificamos el resultado
    const successMessage = await screen.findByText('Inicio exitoso')
    const welcomeMessage = await screen.findByText('Bienvenido, kminchelle!')

    expect(successMessage).toBeInTheDocument()
    expect(welcomeMessage).toBeInTheDocument()
  })
  
  // ... (el otro test)
})