I will make a proper readme... I promise 🙏

for now, to replicate on your local, your `.env` file should look like this

```
DATABASE_URL=<I use postgres>
PORT=8080
GOOGLE_OAUTH20_CLIENT_ID=<create on GCP>
GOOGLE_OAUTH20_CLIENT_SECRET=<create on GCP>
SESSION_SECRET=<for express-session | passport js>
```

After connecting your choice DB, run prisma migrations
```
npx prisma migrate dev
```
Then start the server
```
npm run devStart
```
