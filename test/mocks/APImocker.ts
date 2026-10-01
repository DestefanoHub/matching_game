import { http, HttpResponse } from 'msw';

const baseURL = 'http://localhost:3100/';

type LoginRequestBody = {
    username: string,
    password: string
};

type LoginResponseBody = null | {
    ID: string,
    username: string,
    JWT: string
};

type CreateUserRequestBody = {
    username: string,
    password: string,
    confirmPassword: string
};

type CreateUserResponseBody = null | [
    number[],
    null | LoginResponseBody
];

type EditUserRequestBody = {
    password: string,
    confirmPassword: string
};

type EditUserResponseBody = null | number[];

export const handlers = [
    http.post<never, LoginRequestBody, LoginResponseBody>(`${baseURL}player/login`, async ({request}) => {
        const body = await request.json();
        
        if(typeof body === 'object' && body !== null){
            if(body.username === 'tester1' && body.password === 'Password1234!'){
                return HttpResponse.json({
                    ID: '1234abcd',
                    username: 'tester1',
                    JWT: 'avalidjwt'
                }, {
                    status: 201
                });
            }

            return new HttpResponse(null, {status: 401});
        }

        return new HttpResponse(null, {status: 500});
    }),
    http.post<never, CreateUserRequestBody, CreateUserResponseBody>(`${baseURL}player/createAccount`, async ({request}) => {
        const body = await request.json();

        if(typeof body === 'object' && body !== null){
            const errorCodes: number[] = [];
            let status = 201;
            let playerCreds: LoginResponseBody = null;

            //Success
            if(body.username === 'tester0' && body.password === 'Password1234!' && body.confirmPassword === 'Password1234!'){
                playerCreds = {
                    ID: '1234abcd',
                    username: 'tester0',
                    JWT: 'avalidjwt'
                };
            }

            //Duplicate
            if(body.username === 'testerDup'){
                errorCodes.push(2);
            }

            if(typeof body.username === 'undefined' || (body.username.length < 5 || body.username.length > 30)) {
                errorCodes.push(1);
            }

            if(typeof body.password === 'undefined' || (body.password.length < 12 || body.password.length > 30)) {
                errorCodes.push(3);
            }
            
            if(typeof body.confirmPassword === 'undefined' || body.confirmPassword !== body.password) {
                errorCodes.push(4);
            }

            if(errorCodes.length){
                status = 400;
            }else{

            }

            return HttpResponse.json([
                    errorCodes,
                    playerCreds
                ],
                {status}
            );
        }

        return new HttpResponse(null, {status: 500});
    }),
    http.patch<never, EditUserRequestBody, EditUserResponseBody>(`${baseURL}player/changePassword`, async ({request}) => {
        const body = await request.json();

        if(typeof body === 'object' && body !== null){
            const errorCodes: number[] = [];
            let status = 200;

            if(body.password === 'Password1234!'){
                errorCodes.push(2);
            }

            if(typeof body.password === 'undefined' || (body.password.length < 12 || body.password.length > 30)) {
                errorCodes.push(1);
            }

            if(typeof body.confirmPassword === 'undefined' || body.confirmPassword !== body.password) {
                errorCodes.push(3);
            }

            if(errorCodes.length){
                status = 400;
            }

            return HttpResponse.json(errorCodes, {status})
        }

        return new HttpResponse(null, {status: 500});
    })    
];