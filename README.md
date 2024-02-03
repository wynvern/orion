This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

```bash
yarn install

npx prisma generate
```

## To-Do

-   [] redirect should be via middleware for speed purposes.
-   [] route /search should in the future be used to search for similarity and not exact match
-   [] stop passwords from FUCKING LEAKING

## .env example

```
[database]
DATABASE_URL="postgresql://postgres:password@localhost:5432/orion?schema=public"

[oauth]
NEXTAUTH_SECRET="generated-secret"

[mail]
MAIL_USERNAME=x
MAIL_PASSWORD=x
OAUTH_CLIENTID=x
OAUTH_CLIENT_SECRET=x
OAUTH_REFRESH_TOKEN=x
```
