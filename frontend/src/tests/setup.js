// Configuração global dos testes
// Simula APIs do browser que o jsdom não implementa nativamente
import { vi } from 'vitest'

// Mock do ResizeObserver — usado pelo Vuetify internamente
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock do matchMedia — usado pelo Vuetify para temas responsivos
global.matchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))
