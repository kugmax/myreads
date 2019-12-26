# myreads
Simple application to store your books.

## Project structure:

- backend: nodejs aws lambda application
- client: reactjs based application     

## Feature:
- auth0 authentication
- CRUD operation with book entity
- upload/update books cover and store it in S3 bucket
- loading list of users books using pagination
    - at backend it's implemented with dynamodb 'LastEvaluatedKey'
    - at client side it's implemented using "infinite scroll"
- rate you book

## Getting started

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```
