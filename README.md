# karikariyaki-api

### tl;dr

```
git clone https://github.com/pepeien/karikariyaki-api.git
cd karikariyaki-api/
npm install && npm start
```

### Setting up

1. At the root of the project create a file named `.env`;

2. Still at the root of the project copy the contents of the `.env.example` file and paste it at the newly created `.env`;

3. These are the variables and their descriptions:

|                Variable                | Description                             |  Type   |                   Default                   | Required |
| :------------------------------------: | :-------------------------------------- | :-----: | :-----------------------------------------: | :------: |
|             IS_PRODUCTION              | If the environment is production        | Boolean |                                             |    ✅    |
|            ADMIN_USER_NAME             | Default admin user name                 | String  |                                             |    ✅    |
|                 SECRET                 | Salt for the `JWT` token                | String  |                                             |    ✅    |
|             SECRET_REFRESH             | Salt for the `JWT` refresh token        | String  |                                             |    ✅    |
|          SECRET_REFRESH_SIZE           | Size for the `JWT` refresh token        | Integer |                                             |    ✅    |
|              COOKIE_NAME               | Token cookie name                       | String  |                                             |    ✅    |
|     COOKIE_EXPIRATION_TIME_IN_DAYS     | Token cookie expiration in days         | Integer |                                             |    ✅    |
|          COOKIE_REFRESH_NAME           | Refresh token cookie name               | String  |                                             |    ✅    |
| COOKIE_REFRESH_EXPIRATION_TIME_IN_DAYS | Refresh token cookie expiration in days | Integer |                                             |    ✅    |
|             ORIGIN_ADDRESS             | Values for the allowed `cors` origins   | String  | http://localhost:3000 http://localhost:8080 |          |
|         ORIGIN_SHOWCASE_DOMAIN         | Value for centralized API address       | String  |                                             |          |
|           CLIENT_APP_ADDRESS           | Value for the client page address       | String  |                                             |    ✅    |
|             DATABASE_HOST              | `MongoDB` address                       | String  |                  127.0.0.1                  |          |
|             DATABASE_PORT              | `MongoDB` port                          | Integer |                    27017                    |          |
|             DATABASE_TABLE             | `MongoDB` table                         | String  |                karikariyaki                 |          |
|         DATABASE_MIN_POOL_SIZE         | `MongoDB` minimum pool size             | Integer |                      5                      |          |
|         DATABASE_MAX_POOL_SIZE         | `MongoDB` maximum pool size             | Integer |                     15                      |          |
|             DATABASE_USER              | `MongoDB` address                       | String  |                                             |          |
|           DATABASE_PASSWORD            | `MongoDB` address                       | String  |                                             |          |

4. Value(s) for the `ORIGIN_ADDRESS`:

    4.1. Example one value: `ORIGIN_ADDRESS=http://localhost:8080`

    4.2. Example multiple values: `ORIGIN_ADDRESS=http://localhost:8080 http://localhost:4200`

### Running with Docker CLI

1. Issue `docker build -t karikariyaki-api .`;
2. Issue `docker run -dp 127.0.0.1:9003 karikariyaki-api`.

##### Requirements

-   [Docker](https://docs.docker.com/engine/install) (Windows, Linux, Mac)

### Running W/O Docker

1. At the root of the project;

2. Issue `npm install` wait for the installation;

3. Issue `npm start`;

##### Requirements

-   [npm](https://nodejs.org/en/download/package-manager) (Windows, Linux, Mac)

## Documentation

You can reach to the [Developer Portal](https://api.ericodesu.com/#/service/karikariyaki) to a more hands-on driven information.
