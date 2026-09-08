import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, beforeAll } from 'vitest';

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
});

beforeEach(() => {
    sessionStorage.clear();
});

afterEach(() => {
    cleanup();
});