# Simple e-commerce backend

This project is a simple e-commerce backend.

## Features

- Made with NodeJs and Express framework. Used MongoDB as a database and handled communication between server, database by using native mongodb driver and hosted by AWS EC2
- Implemented session based custom authentication system for users to login and register. Encrypted password with bcrypt to ensure user security. Users can do authenticated requests by passing session header to request. 
- Handled file uploads with multer package. Images are uploaded to GCP bucket storage.             
- Send welcome emails with the nodemailer package after a new user registered.
- Send custom SMS for customer with the Twillio.
- Send notification with Firebase Notification after a new store registered.
- Implementation Iyzico when store get new membership. 
- Docker was used for mongo and node image. 

## Sending authenticated requests

Some endpoints are restricted to authenticated users only.
To send an authenticated request, add `Bearer Token` header to request headers with a valid session token.

## Auth endpoint

### Login - GET - /api/v2/[admin,store,user]/login

Example request body:

```
{
    email: 'example@example.com',
    password: 'some super secret password'
    password again: 'some super secret password'
}
```

Example request endpoint

```
https://api.example.com/api/v2/user/login
```

Returns:

```
{
    _id: '5gT7yHnc31',
    name: 'John Doe',
    email: 'example@example.com',
    tokens: {
        access_token: '964638c64d29743075d54aa21f389049d80a0a4acf49bb05a4f9'
        refresh_token: '964638c64d29743075d54aa21f389049d80a0a4acf49bb0964638c64d29743075d54aa21f389049d80a0a4acf49bb05a4f95a4f9'
    }
}
```

### Register - POST - /api/v2/user/register

Example request body:

```
{
    name: 'John Doe',
    email: 'example@example.com',
    password: 'some super secret password'
}
```

Example request endpoint

```
https://api.example.com/api/v2/user/register
```

Returns:

```
{
    _id: '5gT7yHnc31',
    name: 'John Doe',
    email: 'example@example.com',
}
```
