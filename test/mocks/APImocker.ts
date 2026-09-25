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
    LoginResponseBody
];

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

            if(body.username === 'tester0' && body.password === 'Password1234!' && body.confirmPassword === 'Password1234!'){
                return HttpResponse.json([
                    errorCodes,
                    {
                        ID: '1234abcd',
                        username: 'tester0',
                        JWT: 'avalidjwt'
                    }], 
                    {status: 201}
                );
            }

            // return new HttpResponse(null, {status: 400});
        }

        return new HttpResponse(null, {status: 500});
    }),
];