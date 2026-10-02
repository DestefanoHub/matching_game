import { fireEvent, renderWithProviders, screen, userEvent, within } from './utils';

import Header from '../src/components/generic/Header';
import { AccountMessages } from '../src/utils/types';

describe('Header component', () => {
    describe('Tests when the user is logged out', () => {
        test('Header displays \'create account\' and \'login\' buttons successfully', () => {
            renderWithProviders(<Header />);
            const header = screen.getByRole('banner');

            expect(within(header).getByRole('button', {
                name: /login/i
            })).toBeVisible();

            expect(within(header).getByRole('button', {
                name: /create account/i
            })).toBeVisible();
        });

        describe('Testing the Login Modal', () => {        
            test('Clicking the Login button opens the Login modal successfully', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /login/i
                }));
                const loginModal = await screen.findByRole('dialog', {name: /login/i});
                expect(loginModal).toBeVisible();
            });

            test('Logging in successfully', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /login/i
                }));
                const loginModal = await screen.findByRole('dialog', {name: /login/i});

                await user.type(within(loginModal).getByLabelText(/^username/i), 'tester1');
                await user.type(within(loginModal).getByLabelText(/^password/i), 'Password1234!');
                await user.click(within(loginModal).getByRole('button', {
                    name: /login/i
                }));
                
                const logoutButton = await within(header).findByRole('button', {
                    name: /logout/i
                });
                expect(logoutButton).toBeVisible();
            });

            test('Login form submission failed: all fields empty', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /login/i
                }));
                const loginModal = await screen.findByRole('dialog', {name: /login/i});
                const loginButton = within(loginModal).getByRole('button', {
                    name: /login/i
                });
                
                expect(loginButton).toBeDisabled();
            });

            test('Login form submission failed: username empty', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /login/i
                }));
                const loginModal = await screen.findByRole('dialog', {name: /login/i});
                const loginButton = within(loginModal).getByRole('button', {
                    name: /login/i
                });

                await user.type(within(loginModal).getByLabelText(/^password/i), 'Password1234!');
                
                expect(loginButton).toBeDisabled();
            });

            test('Login form submission failed: username too short', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /login/i
                }));
                const loginModal = await screen.findByRole('dialog', {name: /login/i});
                const loginButton = within(loginModal).getByRole('button', {
                    name: /login/i
                });

                await user.type(within(loginModal).getByLabelText(/^username/i), 'test');
                await user.type(within(loginModal).getByLabelText(/^password/i), 'Password1234!');
                
                expect(loginButton).toBeDisabled();
            });

            test('Login form submission failed: username too long', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /login/i
                }));
                const loginModal = await screen.findByRole('dialog', {name: /login/i});
                const loginButton = within(loginModal).getByRole('button', {
                    name: /login/i
                });

                //Using user.type won't allow the field to go past maxlength.
                fireEvent.change(within(loginModal).getByLabelText(/^username/i), {target: {value: 'testertestertestertestertestertester'}});
                await user.type(within(loginModal).getByLabelText(/^password/i), 'Password1234!');
                
                expect(loginButton).toBeDisabled();
            });

            test('Login form submission failed: password empty', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /login/i
                }));
                const loginModal = await screen.findByRole('dialog', {name: /login/i});
                const loginButton = within(loginModal).getByRole('button', {
                    name: /login/i
                });

                await user.type(within(loginModal).getByLabelText(/^username/i), 'tester1');
                
                expect(loginButton).toBeDisabled();
            });

            test('Login form submission failed: password too short', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /login/i
                }));
                const loginModal = await screen.findByRole('dialog', {name: /login/i});
                const loginButton = within(loginModal).getByRole('button', {
                    name: /login/i
                });

                await user.type(within(loginModal).getByLabelText(/^username/i), 'tester1');
                await user.type(within(loginModal).getByLabelText(/^password/i), 'Password');
                
                expect(loginButton).toBeDisabled();
            });

            test('Login form submission failed: password too long', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /login/i
                }));
                const loginModal = await screen.findByRole('dialog', {name: /login/i});
                const loginButton = within(loginModal).getByRole('button', {
                    name: /login/i
                });

                await user.type(within(loginModal).getByLabelText(/^username/i), 'tester1');
                //Using user.type won't allow the field to go past maxlength.
                fireEvent.change(within(loginModal).getByLabelText(/^password/i), {target: {value: 'PasswordPasswordPasswordPassword'}});
                
                expect(loginButton).toBeDisabled();
            });

            test('Login form submission failed: incorrect credentials', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /login/i
                }));
                const loginModal = await screen.findByRole('dialog', {name: /login/i});
                const loginButton = within(loginModal).getByRole('button', {
                    name: /login/i
                });

                await user.type(within(loginModal).getByLabelText(/^username/i), 'tester');
                await user.type(within(loginModal).getByLabelText(/^password/i), 'Password1234');
                await user.click(loginButton);
                const errorMsg = within(loginModal).getByText(AccountMessages.INVALID);
                
                expect(loginButton).toBeDisabled();
                expect(errorMsg).toBeVisible();
            });
        });

        describe('Testing the Create Account Modal', () => {
            test('Clicking the Create Account button opens the Create Account modal successfully', async () => {
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

            test('Created account successfully', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /create account/i
                }));
                const createModal = await screen.findByRole('dialog', {name: /create account/i});

                await user.type(within(createModal).getByLabelText(/^username/i), 'tester0');
                await user.type(within(createModal).getByLabelText(/^password/i), 'Password1234!');
                await user.type(within(createModal).getByLabelText(/^confirm password/i), 'Password1234!');
                await user.click(within(createModal).getByRole('button', {
                    name: /create/i
                }));
                
                const logoutButton = await within(header).findByRole('button', {
                    name: /logout/i
                });
                expect(logoutButton).toBeVisible();

                const editAccountButton = await within(header).findByRole('button', {
                    name: 'tester0'
                });
                expect(editAccountButton).toBeVisible();
            });

            test('Create account submission failed: all fields empty', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /create account/i
                }));
                const createModal = await screen.findByRole('dialog', {name: /create account/i});
                const createButton = within(createModal).getByRole('button', {
                    name: /create/i
                });
                
                expect(createButton).toBeDisabled();
            });

            test('Create account submission failed: username empty', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /create account/i
                }));
                const createModal = await screen.findByRole('dialog', {name: /create account/i});
                const createButton = within(createModal).getByRole('button', {
                    name: /create/i
                });
                
                await user.type(within(createModal).getByLabelText(/^password/i), 'Password1234!');
                await user.type(within(createModal).getByLabelText(/^confirm password/i), 'Password1234!');
                
                expect(createButton).toBeDisabled();
            });

            test('Create account submission failed: username too short', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /create account/i
                }));
                const createModal = await screen.findByRole('dialog', {name: /create account/i});
                const createButton = within(createModal).getByRole('button', {
                    name: /create/i
                });
                
                await user.type(within(createModal).getByLabelText(/^username/i), 'test');
                await user.type(within(createModal).getByLabelText(/^password/i), 'Password1234!');
                await user.type(within(createModal).getByLabelText(/^confirm password/i), 'Password1234!');
                const uNameErrorMsg = within(createModal).getByText(AccountMessages.UNAMELENGTH);
                
                expect(createButton).toBeDisabled();
                expect(uNameErrorMsg).toBeVisible();
            });

            test('Create account submission failed: username too long', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /create account/i
                }));
                const createModal = await screen.findByRole('dialog', {name: /create account/i});
                const createButton = within(createModal).getByRole('button', {
                    name: /create/i
                });
                
                //Using user.type won't allow the field to go past maxlength.
                fireEvent.change(within(createModal).getByLabelText(/^username/i), {target: {value: 'TesterTesterTesterTesterTesterTester'}});
                await user.type(within(createModal).getByLabelText(/^password/i), 'Password1234!');
                await user.type(within(createModal).getByLabelText(/^confirm password/i), 'Password1234!');
                const uNameErrorMsg = within(createModal).getByText(AccountMessages.UNAMELENGTH);
                
                expect(createButton).toBeDisabled();
                expect(uNameErrorMsg).toBeVisible();
            });

            test('Create account submission failed: username taken', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /create account/i
                }));
                const createModal = await screen.findByRole('dialog', {name: /create account/i});
                const createButton = within(createModal).getByRole('button', {
                    name: /create/i
                });

                await user.type(within(createModal).getByLabelText(/^username/i), 'testerDup');
                await user.type(within(createModal).getByLabelText(/^password/i), 'Password1234!');
                await user.type(within(createModal).getByLabelText(/^confirm password/i), 'Password1234!');
                await user.click(createButton);
                const uNameErrorMsg = within(createModal).getByText(AccountMessages.UNAMETAKEN);

                expect(uNameErrorMsg).toBeVisible();
                expect(createButton).toBeDisabled();
            });

            test('Create account submission failed: password empty', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /create account/i
                }));
                const createModal = await screen.findByRole('dialog', {name: /create account/i});
                const createButton = within(createModal).getByRole('button', {
                    name: /create/i
                });
                
                await user.type(within(createModal).getByLabelText(/^username/i), 'tester0');
                await user.type(within(createModal).getByLabelText(/^confirm password/i), 'Password1234!');
                
                expect(createButton).toBeDisabled();
            });

            test('Create account submission failed: password too short', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /create account/i
                }));
                const createModal = await screen.findByRole('dialog', {name: /create account/i});
                const createButton = within(createModal).getByRole('button', {
                    name: /create/i
                });
                
                await user.type(within(createModal).getByLabelText(/^username/i), 'tester0');
                await user.type(within(createModal).getByLabelText(/^password/i), 'Pass');
                await user.type(within(createModal).getByLabelText(/^confirm password/i), 'Pass');
                const pWordErrorMsg = within(createModal).getByText(AccountMessages.PWORDLENGTH);
                
                expect(createButton).toBeDisabled();
                expect(pWordErrorMsg).toBeVisible();
            });

            test('Create account submission failed: password too long', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /create account/i
                }));
                const createModal = await screen.findByRole('dialog', {name: /create account/i});
                const createButton = within(createModal).getByRole('button', {
                    name: /create/i
                });
                
                await user.type(within(createModal).getByLabelText(/^username/i), 'tester0');
                //Using user.type won't allow the field to go past maxlength.
                fireEvent.change(within(createModal).getByLabelText(/^password/i), {target: {value: 'PasswordPasswordPasswordPassword'}});
                fireEvent.change(within(createModal).getByLabelText(/^confirm password/i), {target: {value: 'PasswordPasswordPasswordPassword'}});
                const pWordErrorMsg = within(createModal).getByText(AccountMessages.PWORDLENGTH);
                
                expect(createButton).toBeDisabled();
                expect(pWordErrorMsg).toBeVisible();
            });

            test('Create account submission failed: confirm password empty', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /create account/i
                }));
                const createModal = await screen.findByRole('dialog', {name: /create account/i});
                const createButton = within(createModal).getByRole('button', {
                    name: /create/i
                });
                
                await user.type(within(createModal).getByLabelText(/^username/i), 'tester0');
                await user.type(within(createModal).getByLabelText(/^password/i), 'Password1234!');
                
                expect(createButton).toBeDisabled();
            });

            test('Create account submission failed: password and confirm password do not match', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /create account/i
                }));
                const createModal = await screen.findByRole('dialog', {name: /create account/i});
                const createButton = within(createModal).getByRole('button', {
                    name: /create/i
                });
                
                await user.type(within(createModal).getByLabelText(/^username/i), 'tester0');
                await user.type(within(createModal).getByLabelText(/^password/i), 'Password1234!');
                await user.type(within(createModal).getByLabelText(/^confirm password/i), '!4321dorwssaP');
                const pWordErrorMsg = within(createModal).getByText(AccountMessages.PWORDNOMATCH);
                
                expect(createButton).toBeDisabled();
                expect(pWordErrorMsg).toBeVisible();
            });

            test('Create account submission failed: username too short, password too short, password and confirm password do not match all at once', async () => {
                const user = userEvent.setup();
                renderWithProviders(<Header/>);
                const header = screen.getByRole('banner');

                await user.click(within(header).getByRole('button', {
                    name: /create account/i
                }));
                const createModal = await screen.findByRole('dialog', {name: /create account/i});
                const createButton = within(createModal).getByRole('button', {
                    name: /create/i
                });
                
                await user.type(within(createModal).getByLabelText(/^username/i), 'test');
                await user.type(within(createModal).getByLabelText(/^password/i), 'Pass');
                await user.type(within(createModal).getByLabelText(/^confirm password/i), '!4321dorwssaP');
                const uNameLenErrorMsg = within(createModal).getByText(AccountMessages.UNAMELENGTH);
                const pWordLenErrorMsg = within(createModal).getByText(AccountMessages.PWORDLENGTH);
                const pWordMatchErrorMsg = within(createModal).getByText(AccountMessages.PWORDNOMATCH);
                
                expect(createButton).toBeDisabled();
                expect(uNameLenErrorMsg).toBeVisible();
                expect(pWordLenErrorMsg).toBeVisible();
                expect(pWordMatchErrorMsg).toBeVisible();
            });
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

        test('Clicking the \'Logout\' button logs the user out', async () => {
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

            const logoutButton = within(header).getByRole('button', {
                name: /logout/i
            });
            await user.click(logoutButton);

            const loginButton = within(header).getByRole('button', {
                name: /login/i
            });
            expect(loginButton).toBeVisible();

            const createAccountButton = within(header).getByRole('button', {
                name: /create account/i
            });
            expect(createAccountButton).toBeVisible();
        });

        describe('Testing the Edit Account modal', () => {
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

            test('Edited account successfully', async () => {
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

                await user.click(within(header).getByRole('button', {
                    name: sessionState.username
                }));
                const editModal = await screen.findByRole('dialog', {name: /edit account/i});

                await user.type(within(editModal).getByLabelText(/^new password/i), 'MyNewPassword');
                await user.type(within(editModal).getByLabelText(/^confirm new password/i), 'MyNewPassword');
                await user.click(within(editModal).getByRole('button', {
                    name: /update/i
                }));
                const editedAccountMsg = within(editModal).getByText(AccountMessages.PWORDCHANGED);
                
                expect(editedAccountMsg).toBeVisible();
            });

            test('Edit account submission failed: all fields empty', async () => {
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

                await user.click(within(header).getByRole('button', {
                    name: sessionState.username
                }));

                const editModal = await screen.findByRole('dialog', {name: /edit account/i});
                const editButton = within(editModal).getByRole('button', {
                    name: /update/i
                });
                
                expect(editButton).toBeDisabled();
            });

            test('Edit account submission failed: password empty', async () => {
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

                await user.click(within(header).getByRole('button', {
                    name: sessionState.username
                }));
                const editModal = await screen.findByRole('dialog', {name: /edit account/i});
                const editButton = within(editModal).getByRole('button', {
                    name: /update/i
                });

                await user.type(within(editModal).getByLabelText(/^confirm new password/i), 'MyNewPassword');
                
                expect(editButton).toBeDisabled();
            });

            test('Edit account submission failed: password too short', async () => {
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

                await user.click(within(header).getByRole('button', {
                    name: sessionState.username
                }));
                const editModal = await screen.findByRole('dialog', {name: /edit account/i});
                const editButton = within(editModal).getByRole('button', {
                    name: /update/i
                });

                await user.type(within(editModal).getByLabelText(/^new password/i), 'MyNew');
                await user.type(within(editModal).getByLabelText(/^confirm new password/i), 'MyNew');
                const pWordErrorMsg = within(editModal).getByText(AccountMessages.PWORDLENGTH);
                
                expect(editButton).toBeDisabled();
                expect(pWordErrorMsg).toBeVisible();
            });

            test('Edit account submission failed: password too long', async () => {
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

                await user.click(within(header).getByRole('button', {
                    name: sessionState.username
                }));
                const editModal = await screen.findByRole('dialog', {name: /edit account/i});
                const editButton = within(editModal).getByRole('button', {
                    name: /update/i
                });

                //Using user.type won't allow the field to go past maxlength.
                fireEvent.change(within(editModal).getByLabelText(/^new password/i), {target: {value: 'PasswordPasswordPasswordPassword'}});
                fireEvent.change(within(editModal).getByLabelText(/^confirm new password/i), {target: {value: 'PasswordPasswordPasswordPassword'}});
                const pWordErrorMsg = within(editModal).getByText(AccountMessages.PWORDLENGTH);
                
                expect(editButton).toBeDisabled();
                expect(pWordErrorMsg).toBeVisible();
            });
            
            test('Edit account submission failed: password is old password', async () => {
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

                await user.click(within(header).getByRole('button', {
                    name: sessionState.username
                }));
                const editModal = await screen.findByRole('dialog', {name: /edit account/i});
                const editButton = within(editModal).getByRole('button', {
                    name: /update/i
                });

                await user.type(within(editModal).getByLabelText(/^new password/i), 'Password1234!');
                await user.type(within(editModal).getByLabelText(/^confirm new password/i), 'Password1234!');
                await user.click(editButton);
                const pWordErrorMsg = within(editModal).getByText(AccountMessages.PWORDOLD);
                
                expect(pWordErrorMsg).toBeVisible();
                expect(editButton).toBeDisabled();
            });

            test('Edit account submission failed: confirm password empty', async () => {
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

                await user.click(within(header).getByRole('button', {
                    name: sessionState.username
                }));
                const editModal = await screen.findByRole('dialog', {name: /edit account/i});
                const editButton = within(editModal).getByRole('button', {
                    name: /update/i
                });

                await user.type(within(editModal).getByLabelText(/^new password/i), 'MyNewPassword');
                
                expect(editButton).toBeDisabled();
            });

            test('Edit account submission failed: password and confirm password do not match', async () => {
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

                await user.click(within(header).getByRole('button', {
                    name: sessionState.username
                }));
                const editModal = await screen.findByRole('dialog', {name: /edit account/i});
                const editButton = within(editModal).getByRole('button', {
                    name: /update/i
                });

                await user.type(within(editModal).getByLabelText(/^new password/i), 'MyNewPassword');
                await user.type(within(editModal).getByLabelText(/^confirm new password/i), 'drowssaPweNyM');
                const pWordErrorMsg = within(editModal).getByText(AccountMessages.PWORDNOMATCH);
                
                expect(editButton).toBeDisabled();
                expect(pWordErrorMsg).toBeVisible();
            });

            test('Edit account submission failed: password too short and confirm password do not match all at once', async () => {
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

                await user.click(within(header).getByRole('button', {
                    name: sessionState.username
                }));
                const editModal = await screen.findByRole('dialog', {name: /edit account/i});
                const editButton = within(editModal).getByRole('button', {
                    name: /update/i
                });

                await user.type(within(editModal).getByLabelText(/^new password/i), 'MyNew');
                await user.type(within(editModal).getByLabelText(/^confirm new password/i), 'drowssaPweNyM');
                const pWordMatchErrorMsg = within(editModal).getByText(AccountMessages.PWORDNOMATCH);
                const pWordLengthErrorMsg = within(editModal).getByText(AccountMessages.PWORDLENGTH);
                
                expect(editButton).toBeDisabled();
                expect(pWordMatchErrorMsg).toBeVisible();
                expect(pWordLengthErrorMsg).toBeVisible();
            });
        });

        describe('Testing the Delete Account modal', () => {

        });
    });

    describe('Tests that are session agnostic', () => {
        test('Header modals are hidden by default', () => {        
            renderWithProviders(<Header/>);

            const createModal = screen.queryByRole('dialog', {name: /create account/i});
            expect(createModal).not.toBeInTheDocument();

            const editModal = screen.queryByRole('dialog', {name: /edit account/i});
            expect(editModal).not.toBeInTheDocument();

            const loginModal = screen.queryByRole('dialog', {name: /login/i});
            expect(loginModal).not.toBeInTheDocument();
        });

        test('Nav buttons receive \'active\' class when on the respective page', async () => {
            const user = userEvent.setup();
            renderWithProviders(<Header/>);
            const navigation = screen.getByRole('navigation');
            const navButtons = within(navigation).getAllByRole('link');

            //Home should be active be default.
            let activeButtons = navButtons.filter(btn => btn.classList.contains('active'));
            expect(activeButtons).toHaveLength(1);
            expect(activeButtons[0]).toHaveTextContent(/home/i);
            activeButtons = [];

            const playButton = within(navigation).getByRole('link', {
                name: /play/i
            });
            await user.click(playButton);
            activeButtons = navButtons.filter(btn => btn.classList.contains('active'));
            expect(activeButtons).toHaveLength(1);
            expect(activeButtons[0]).toHaveTextContent(/play/i);
            activeButtons = [];

            const historyButton = within(navigation).getByRole('link', {
                name: /history/i
            });
            await user.click(historyButton);
            activeButtons = navButtons.filter(btn => btn.classList.contains('active'));
            expect(activeButtons).toHaveLength(1);
            expect(activeButtons[0]).toHaveTextContent(/history/i);
            activeButtons = [];

            const homeButton = within(navigation).getByRole('link', {
                name: /home/i
            });
            await user.click(homeButton);
            activeButtons = navButtons.filter(btn => btn.classList.contains('active'));
            expect(activeButtons).toHaveLength(1);
            expect(activeButtons[0]).toHaveTextContent(/home/i);
            activeButtons = [];
        });
    });
});