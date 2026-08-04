import { render, screen } from '@testing-library/react';

import Header from '../../../src/components/generic/Header';

describe('Login component', () => {
    test('Modal closes upon successful login.', () => {
        render(<Header/>);
        screen.debug();
    });
});