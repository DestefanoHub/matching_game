import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, afterAll, beforeEach, beforeAll } from 'vitest';

import { server } from './mocks/node';

beforeAll(() => {
    if (!HTMLDialogElement.prototype.showModal) {
        HTMLDialogElement.prototype.showModal = function () {
            this.setAttribute('open', 'open');
            this.setAttribute('aria-hidden', 'false');
        };
    }

    if (!HTMLDialogElement.prototype.close) {
        HTMLDialogElement.prototype.close = function () {
            this.removeAttribute('open');
            this.setAttribute('aria-hidden', 'true');
        };
    }

    server.listen();
});

afterAll(() => {
    server.close();
});

beforeEach(() => {
    sessionStorage.clear();
});

afterEach(() => {
    cleanup();
    server.resetHandlers();
});