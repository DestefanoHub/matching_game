import { renderWithProviders, screen, userEvent, within } from './utils';

import Header from '../src/components/generic/Header';

describe('Header component', () => {
    describe('Tests when the user is logged out', () => {
        test('Header displays \'create account\' and \'login\' buttons', () => {
            renderWithProviders(<Header />);
            const header = screen.getByRole('banner');

            const loginButton = within(header).getByRole('button', {
                name: /login/i
            });
            expect(loginButton).toBeVisible();

            const createAccountButton = within(header).getByRole('button', {
                name: /create account/i
            });
            expect(createAccountButton).toBeVisible();
        });

        test('Header modals are hidden by default', () => {        
            renderWithProviders(<Header/>);

            const createModal = screen.queryByRole('dialog', {name: /create account/i});
            expect(createModal).not.toBeInTheDocument();

            const editModal = screen.queryByRole('dialog', {name: /edit account/i});
            expect(editModal).not.toBeInTheDocument();

            const loginModal = screen.queryByRole('dialog', {name: /login/i});
            expect(loginModal).not.toBeInTheDocument();
        });

        test('Clicking the Login button opens the Login modal', async () => {
            const user = userEvent.setup();
            renderWithProviders(<Header/>);
            const header = screen.getByRole('banner');

            const loginButton = within(header).getByRole('button', {
                name: /login/i
            });
            await user.click(loginButton);
            const loginModal = await screen.findByRole('dialog', {name: /login/i});
            expect(loginModal).toBeVisible();
        });

        test('Clicking the Create Account button opens the Create Account modal', async () => {
            const user = userEvent.setup();
            renderWithProviders(<Header/>);
            const header = screen.getByRole('banner');

            const createAccountButton = within(header).getByRole('button', {
                name: /create account/i
            });
            await user.click(createAccountButton);
            const createModal = await screen.findByRole('dialog', {name: /create account/i});
            expect(createModal).toBeVisible();
        });
    });

    describe('Tests when the user is logged in', () => {
        test('Header displays \'edit account\' and \'logout\' buttons', () => {
            const sessionState = {
                ID: 'abcd1234',
                username: 'Tester1',
                JWT: 'qwertyuiop[]'
            };
            
            renderWithProviders(<Header />, {preloadedState: {
                session: sessionState
            }});
            const header = screen.getByRole('banner');

            const logoutButton = within(header).getByRole('button', {
                name: /logout/i
            });
            expect(logoutButton).toBeVisible();

            const usernameRegex = new RegExp(`${sessionState.username}`, 'i');
            const editAccountButton = within(header).getByRole('button', {
                name: usernameRegex
            });
            expect(editAccountButton).toBeVisible();
        });

        test('Header modals are hidden by default', () => {
            const sessionState = {
                ID: 'abcd1234',
                username: 'Tester1',
                JWT: 'qwertyuiop[]'
            };
            
            renderWithProviders(<Header/>, {preloadedState: {
                session: sessionState
            }});

            const createModal = screen.queryByRole('dialog', {name: /create account/i});
            expect(createModal).not.toBeInTheDocument();

            const editModal = screen.queryByRole('dialog', {name: /edit account/i});
            expect(editModal).not.toBeInTheDocument();

            const loginModal = screen.queryByRole('dialog', {name: /login/i});
            expect(loginModal).not.toBeInTheDocument();
        });

        test('Clicking the Edit Account button opens the Edit Account modal', async () => {
            const sessionState = {
                ID: 'abcd1234',
                username: 'Tester1',
                JWT: 'qwertyuiop[]'
            };
            
            const user = userEvent.setup();
            renderWithProviders(<Header/>, {preloadedState: {
                session: sessionState
            }});
            const header = screen.getByRole('banner');

            const usernameRegex = new RegExp(`${sessionState.username}`, 'i');
            const editAccountButton = within(header).getByRole('button', {
                name: usernameRegex
            });

            await user.click(editAccountButton);
            const editModal = await screen.findByRole('dialog', {name: /edit account/i});
            expect(editModal).toBeVisible();
        });
    });
});