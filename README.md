# Quick Setup Locally

> Install the Dependencies

```
cd daily-code
npm install
```

> Setup DB (for Windows use git-bash to run the script)

```
cd backend/db
chmod +x ./setupDB.sh
./setupDB.sh
```

> Run locally

```
cd ..
cd frontend/ && npm run dev
cd .. && npm start
```