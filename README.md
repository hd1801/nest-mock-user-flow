# Steps to Run the Application

1. **Install Node Modules**: Run `npm install` or `yarn install` to install the required Node.js modules.
2. **Run Docker Compose**: Execute `docker-compose up -d` to start the Docker containers in detached mode.
3. **Create Proper `.env` File**: Create a `.env` file in the root of your project directory and add the following environment variables:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=userflow
REDIS_PORT=6379
REDIS_HOST=localhost
```

4. **Start the Application**: Run `npm run start` to start the application.
