
import '@testing-library/jest-dom';

import { setupServer } from 'msw/node'
import { handlers } from '../mocks/handlers' // Ajusta la ruta si es necesario

const server = setupServer(...handlers)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

