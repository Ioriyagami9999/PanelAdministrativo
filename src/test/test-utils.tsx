import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import type { RootState } from '../app/store' 
import authReducer from '../features/auth/authSlice' 
import { dummyjsonApi } from '../api/dummyjsonApi'

// 1. Simplificamos setupStore: ya no acepta preloadedState
export const setupStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer, 
      [dummyjsonApi.reducerPath]: dummyjsonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(dummyjsonApi.middleware),
  })
}

export type AppStore = ReturnType<typeof setupStore> 

// 2. Simplificamos las Opciones: quitamos preloadedState
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  store?: AppStore 
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    // 3. Simplificamos la llamada: creamos un store nuevo cada vez
    store = setupStore(),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): React.ReactElement {
    return (
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    )
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}