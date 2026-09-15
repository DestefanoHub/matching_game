import { setupServer } from 'msw/node';

import { handlers } from './APImocker';

export const server = setupServer(...handlers);