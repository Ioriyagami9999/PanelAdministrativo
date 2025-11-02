// src/test/test-utils.tsx

import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import type { RootState } from '../app/store' 
import authReducer from '../features/auth/authSlice' 
import { dummyjsonApi } from '../api/dummyjsonApi'

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

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  store?: AppStore 
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
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