# food-with-friends

## Setting up the backend

Create an account at https://prisma.io

Install Prisma globally if you have not already
```
npm install -g prisma
```

Navigate to your backend directory: `cd backend`.

Login with your credentials: `prisma login`.

Setup your Prisma server by typing `prisma init`. You will be asked a series of questions:
```
Prisma Server: Demo server
Choose a region with the least amount of latency
Give it a name
Stage: dev
Select the programming languate for the generated Prisma client: Don't generate
```
Create a variables.env file in the root of the backend directory. 
This should contain the following (Please not that some of your values will differ)
```
FRONTEND_URL="http://localhost:3000"
PRISMA_ENDPOINT="https://us1.prisma.sh/username/food-with-friends/dev"
PRISMA_SECRET="secret"
APP_SECRET="jwtsecret"
PORT=4444
MAIL_HOST="smtp.mailtrap.io"
MAIL_PORT=2525
MAIL_USER="abcdefghijklmn"
MAIL_PASS="opqrstuvwxyzab"
```

Deploy to Prisma
```
npm run deploy
```

Test locally
```
npm run dev
```

## Setting up the frontend
```bash
cd frontend
npm install
npm run dev
```
