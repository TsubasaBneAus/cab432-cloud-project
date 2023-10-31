# Image Converter

## Architecture Diagram

![Cloud Project updated diagram](https://github.com/TsubasaBneAus/cab432-cloud-project/assets/103486301/4d802b7c-5cad-4a3b-b80b-d25d48a18b47)

## How to set up this Web Application

## 1. Create and Place .env file in the "cab432-cloud-project" directory

### Please fill out certain strings inside the curly braces as shown below

### After filling out the strings, please remove those braces

```bash
# Development environment
# DATABASE_URL="mysql://{User Name}:{Password}@{Database Endpoint}:3306/image-converter"
# NEXTAUTH_SECRET="{Encryption Key}"
# NEXTAUTH_URL="http://localhost:3000"
# GOOGLE_CLIENT_ID="{Google Client ID}"
# GOOGLE_CLIENT_SECRET="{Google Client Secret}"

# Production Environment
DATABASE_URL="mysql://{User Name}:{Password}@{Database Endpoint}:3306/image-converter"
NEXTAUTH_SECRET="{Encryption Key}"
NEXTAUTH_URL="http://{DNS for the Load Balancer of the EC2 instances}"
GOOGLE_CLIENT_ID="{Google Client ID}"
GOOGLE_CLIENT_SECRET="{Google Client Secret}"
```

## 2. Build docker images and Run their containers

### For the development environment

```bash
docker compose -f docker-compose.dev.yml up --build --force-recreate -d
```

### For the production environment

```bash
docker compose -f docker-compose.prod.yml up --build --force-recreate -d
```

## 3. Setup the database

### * If you create the RDS instance for the first time, execute the following steps to implement database migration, otherwise skip these steps

## 3.1 Enter the Next.js container

### For the development environment

```bash
docker exec -it cab432-cloud-project-nextjs-dev bash
```

### For the production environment

```bash
docker exec -it cab432-cloud-project-nextjs-prod sh
```

## 3.2 Implement database migration using Prisma (ORM)

```bash
npx prisma migrate dev
```

## 3.3 Exit from the Next.js container

```bash
exit
```

## 4.1 Set up the configuration of pm2 (Only Production Environment)

```bash
npm install -g pm2
pm2 start startup.sh --name image-converter
pm2 startup
```

## 4.2 Copy and Paste the output after the codes above were executed in the terminal (Only Production Environment)

```bash
npm save
```
