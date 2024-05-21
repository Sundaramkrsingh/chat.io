# Quick Setup Locally

> Clone repo

```
git clone https://github.com/Sundaramkrsingh/latracal-assignment.git
```

> Install the Dependencies

```
cd latracal-assignment
npm install
```

> Setup DB (for Windows use git-bash to run the script and ignore chmod cmd)
> Ensure Docker daemon is in running state

```
cd backend/
chmod +x ./setupDB.sh  
./setupDB.sh
```

> Run locally

```
cd ../frontend
npm run dev
cd ../backend
npm start
```

# Demo Credentials 

> (login with two or more users from different browsers to test real-time functionality)

    - user-1
        - username: sundaram
        - password: Sundaram@123

    - user-2
        - username: yuvraj69
        - password: Yuvraj@123
    
    - user-3
        - username: anonybro@123
        - password: Anonybro@123


## Stacks used
- ```Express``` for backend routes
- ```ws``` library for websocket logic
- ```React``` for client side
- ```Recoil``` state management
- ```Prisma ORM``` as orm and ```PostgreSQL``` as db on docker


> Project Structure

```
latracal-assignment/
├── backend/
│   ├── prisma
│   ├── src 
│   ├── .env
│   ├── docker-compose.yml
│   ├── package.json
│   ├── setupDB.sh
│   ├── tsconfig.json
├── frontend/
│   ├── src
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
└── README.md
```


> Database Schema (prisma)

```
model User {
  id          Int       @id @default(autoincrement())
  email       String    @unique
  username    String    @unique
  password    String 
  messages    Message[]
}

model Message {
  id          Int       @id @default(autoincrement())
  username    String       
  text        String
  timeStamp   String
  user        User      @relation(fields: [username], references: [username])
}
```


# API Endpoints

- api/v1/user/signup   - for user signup
- api/v1/user/signin   - for user signin
- api/v1/user/signout  - for user signout

- api/v1/chat/         - for websocket server
- api/v1/chat/messages - for fetching all messages of room
- api/v1/session       - for session authentication
