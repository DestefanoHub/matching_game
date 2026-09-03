import { renderWithProviders, screen, within } from '../../utils';

import Header from '../../../src/components/generic/Header';

describe('Login component', () => {
    test('shows the header Login button when logged out', () => {
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

        const accountText = within(header).getByText(/account:/i);
        expect(accountText).toBeVisible();
    });
});