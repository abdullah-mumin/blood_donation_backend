# Instruction on how to run project locally

# Pre-reqs

To build and run this app locally you will need a few things:

- Install [Node.js](https://nodejs.org/en/)
- Install [VS Code](https://code.visualstudio.com/)

## Getting started:

- Clone the repository

```
git clone https://github.com/abdullah-mumin/blood_donation_backend.git
```

- Install dependencies

```
cd blood_donation_backend
npm install
```

```
# Signin with your account and go to Database Access section, and copy your database url. Also remember your user-name and password.
# Create a .env file and do the following

NODE_ENV=development
PORT=5000
DATABASE_URL="youe database url"
BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET=47c37ca21f4bab4f9f8c60f374a65e3c138cbfdfeb0781006f98c4bcb74c1707
JWT_REFRESH_SECRET=5dfdf3ef6e50a3ab23c067abad626c1ddc6f7aab86680fb3547f67d88604408b39df21ae82f64572f524c1ec4a295104e99c788cf5e9bc4387aa6f7742f42e24
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=365d

# create account in supabase and create a project and copy the url and past it in the database_url

#replece <username> and <password> with your username and password.

```

- Build and run the project

```
npm run build
npm run dev
```

### Live server link & Video Link

- [Front-end Live Server](https://blood-donation-frontend-sigma.vercel.app/)
- [Back-end Live Server](https://blooddonationbackendserver-root-dev.vercel.app/)
- [Explanation Video](https://youtu.be/ITqXN4yUpII)
