# MyMemorabilia

MyMemorabilia is a digital time capsule service designed to capture and rediscover memories. It allows users to create capsules containing notes, photos, videos, and music, which are then automatically delivered to their email on a specified future date. This project is built with a robust Django backend, containerized with Docker, and designed for scalable deployment.

## Features

- **User Authentication:** Secure user registration and login system using tokens.
- **Digital Time Capsules:** Create capsules with a title and a future delivery date.
- **Multimedia Content:** Add multiple items to each capsule, including text notes, images, videos, audio clips, and links to music tracks.
- **Automated Email Delivery:** A background worker (Celery) ensures capsules are delivered reliably on the scheduled date.
- **RESTful API:** A well-documented API for all functionalities, allowing for integration with any frontend application.
- **Cloud Storage:** Seamlessly uses AWS S3 for file storage in production for scalability and performance.

## Architecture & Tech Stack

MyMemorabilia is built on a modern, scalable architecture:

- **Backend:** **Django** and **Django REST Framework (DRF)** provide a powerful and secure foundation for the API.
- **Database:** **PostgreSQL** is used in production for its robustness and reliability, with **SQLite** for easy local development.
- **Asynchronous Tasks:** **Celery** with a **Redis** broker handles background tasks, primarily for sending email notifications without blocking the main application.
- **Containerization:** **Docker** and **Docker Compose** are used to containerize the application and its services, ensuring consistency across development and production environments.
- **Web Server & Reverse Proxy:** **Nginx** serves as the reverse proxy, managing incoming traffic and serving static files efficiently.
- **File Storage:** The application uses the local filesystem for development and **AWS S3** for production to handle large volumes of user-uploaded files.
- **API Documentation:** API endpoints are automatically documented using **drf-spectacular**, providing interactive Swagger and ReDoc interfaces.
- **Frontend:** A simple HTML/CSS frontend styled with **TailwindCSS**.

## API Documentation

The API is self-documented using OpenAPI. Once the application is running, you can access the interactive API documentation at:

- **Swagger UI:** `/api/schema/swagger-ui/`
- **ReDoc:** `/api/schema/redoc/`

### API Endpoints

Here are the primary endpoints:

| Method | Endpoint                                 | Description                              |
|--------|------------------------------------------|------------------------------------------|
| `POST` | `/api/register/`                         | Register a new user.                     |
| `POST` | `/api/login/`                            | Log in to get an authentication token.   |
| `POST` | `/api/capsules/create/`                  | Create a new time capsule.               |
| `GET`  | `/api/capsules/`                         | List all capsules for the logged-in user.|
| `POST` | `/api/capsules/<id>/items/create/`       | Add an item to a specific capsule.       |
| `GET`  | `/api/capsules/<id>/items/`              | List all items in a specific capsule.    |

### API Usage Examples

**1. Register a new user:**

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "username": "testuser",
  "email": "test@example.com",
  "password": "strongpassword123",
  "timezone": "UTC"
}' http://localhost:8000/api/register/
```

**2. Log in:**

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "email": "test@example.com",
  "password": "strongpassword123"
}' http://localhost:8000/api/login/
```
**Response:**
```json
{
    "token": "YOUR_AUTH_TOKEN",
    ...
}
```

**3. Create a new capsule:**

```bash
curl -X POST -H "Authorization: Token YOUR_AUTH_TOKEN" -H "Content-Type: application/json" -d '{
  "title": "My First Capsule",
  "deliver_on": "2028-02-10T10:00:00Z"
}' http://localhost:8000/api/capsules/create/
```

**4. Add a file to a capsule:**

```bash
curl -X POST -H "Authorization: Token YOUR_AUTH_TOKEN" -F "kind=image" -F "file=@/path/to/your/image.jpg" http://localhost:8000/api/capsules/1/items/create/
```

## Deployment

The application is designed to be deployed on a cloud provider like AWS using Docker.

### Deployment Architecture

- An **AWS EC2 instance** hosts the application.
- **Docker Compose** orchestrates the services defined in `docker-compose.yml`: `web` (Django), `db` (Postgres), `redis`, `celery_worker`, `celery_beat`, and `nginx`.
- **Nginx** acts as a reverse proxy, routing external traffic to the Django application and serving static/media files directly.
- **PostgreSQL** runs in a separate container for the database.
- **AWS S3** is used for storing user-uploaded media files and static assets.
- **AWS SES (Simple Email Service)** is intended for sending emails, though it is pending approval.

### Deployment Steps

1.  **Clone the repository on your EC2 instance:**
    ```bash
    git clone https://github.com/your-username/mymemorabelia.git
    cd mymemorabelia
    ```

2.  **Create and configure the environment file:**
    - In the `backend/` directory, create a `.env` file.
    - This file should contain production-level secrets and configurations. See `backend/mymemorabelia/settings.py` for all possible variables.

    **Example `backend/.env` for production:**
    ```env
    ENV=prod
    DJANGO_SECRET_KEY='your-production-secret-key'
    DJANGO_ALLOWED_HOSTS='yourdomain.com,www.yourdomain.com'

    # Postgres Settings
    POSTGRES_DB=mydb
    POSTGRES_USER=myuser
    POSTGRES_PASSWORD=mypassword
    DATABASE_URL=postgres://myuser:mypassword@db:5432/mydb

    # AWS Settings
    AWS_ACCESS_KEY_ID='your-aws-access-key'
    AWS_SECRET_ACCESS_KEY='your-aws-secret-key'
    AWS_STORAGE_BUCKET_NAME='your-s3-bucket-name'
    AWS_S3_REGION_NAME='your-s3-region'
    AWS_S3_CUSTOM_DOMAIN='your-s3-custom-domain' # e.g., d123.cloudfront.net

    # Email Settings (Pending AWS Approval)
    # EMAIL_HOST='email-smtp.your-region.amazonaws.com'
    # EMAIL_HOST_USER='your-smtp-username'
    # EMAIL_HOST_PASSWORD='your-smtp-password'
    # DEFAULT_FROM_EMAIL='noreply@yourdomain.com'
    ```
    **Note on Email:** The email functionality is implemented, but email delivery is paused pending AWS SES approval. For now, emails will be printed to the console in development mode.

3.  **Build and run the containers:**
    ```bash
    docker-compose up --build -d
    ```
    This command will build the Docker images, start all services in detached mode, and apply database migrations as specified in `entrypoint.sh`.

## Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/mymemorabelia.git
    cd mymemorabelia
    ```

2.  **Set up environment variables for local development:**
    - Create a `.env` file in the `backend/` directory.
    ```env
    # .env for local development
    ENV=dev
    DJANGO_SECRET_KEY='a-good-local-secret-key'
    DATABASE_URL=sqlite:///db.sqlite3
    ```

3.  **Set up the Python virtual environment:**
    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

4.  **Run database migrations:**
    ```bash
    python manage.py migrate
    ```

5.  **Start the development server:**
    ```bash
    python manage.py runserver
    ```
    The API will be available at `http://127.0.0.1:8000/`.

6.  **Run Celery Worker (in a separate terminal):**
    ```bash
    celery -A mymemorabelia worker --loglevel=info
    ```

## Future Work

- **Frontend Interface:** Develop a full-featured frontend using a modern JavaScript framework like React or Vue.js.
- **Complete Email Integration:** Fully activate the email delivery system once AWS SES approval is granted.
- **Enhanced Features:** Add features like social login, capsule sharing, and more customization options.
