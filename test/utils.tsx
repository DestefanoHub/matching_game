import { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, type Store } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';

import { rootReducer } from '../src/store/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: Record<string, any>;
    store?: Store;
    initialRoute?: string[];
};

export function renderWithProviders(ui: ReactElement, {
        preloadedState = {},
        store = configureStore({ reducer: rootReducer, preloadedState }),
        initialRoute = ['/'],
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {
    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <Provider store={store}>
                <MemoryRouter initialEntries={initialRoute}>
                    {children}
                </MemoryRouter>
            </Provider>
        );
    }

    return {
        store,
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    };
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';