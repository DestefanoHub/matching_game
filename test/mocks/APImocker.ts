import { http, HttpResponse } from 'msw';

const baseURL = 'http://localhost:3100/';

export const handlers = [
    http.post(`${baseURL}player/login`, async ({request}) => {
        const body = await request.json();
        
        if(typeof body === 'object' && body !== null){
            if((Object.hasOwn(body, 'username') && body.username === 'tester1') && (Object.hasOwn(body, 'password') && body.password === 'Password1234!')){
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
];