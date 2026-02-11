# MyMemorabilia

MyMemorabilia is a digital time capsule service designed to capture and rediscover memories. It allows users to create capsules containing notes, photos, videos, and music, which are then automatically delivered to their email on a specified future date. This project is live and deployed at **mymemorabelia.com**. It is built with a robust Django backend, containerized with Docker, and designed for scalable deployment.

## Features

- **User Authentication:** Secure user registration and login system using tokens.
- **Digital Time Capsules:** Create capsules with a title and a future delivery date.
- **Multimedia Content:** Add multiple items to each capsule, including text notes, images, videos, audio clips, and links to music tracks.
- **Automated Email Delivery:** A background worker (Celery) ensures capsules are delivered reliably on the scheduled date.
- **RESTful API:** A well-documented API for all functionalities, allowing for integration with any frontend application.
- **Cloud Storage:** Seamlessly uses AWS S3 for file storage in production for scalability and performance.

## Core Concepts

The application is built around the idea of a **Capsule**, a container for digital memories. Each capsule has a title, a body, and a `deliver_on` date. Users can attach various items to their capsules, such as images, videos, and links to music.

The project is divided into two main Django apps:
* `capsule`: Contains the core business logic and data models.
* `capsule_api`: Exposes the `capsule` app's functionality through a RESTful API.

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

## Database Schema
The application uses a database with the following models:
* **CustomUser:** Extends the default Django User model, using email as the unique identifier and adding a `timezone` field.
* **Capsule:** The main model for time capsules, containing fields for the owner, title, body, delivery date, and status.
* **CapsuleItem:** Represents a file or a link attached to a capsule.
* **DeliveryLog:** Logs the attempts to deliver a capsule to a user.

It uses Postgresql for production and the default sqlite for local development.

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
}' https://mymemorabelia.com/api/register/
```

**2. Log in:**

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "email": "test@example.com",
  "password": "strongpassword123"
}' https://mymemorabelia.com/api/login/
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
}' https://mymemorabelia.com/api/capsules/create/
```

**4. Add a file to a capsule:**

```bash
curl -X POST -H "Authorization: Token YOUR_AUTH_TOKEN" -F "kind=image" -F "file=@/path/to/your/image.jpg" https://mymemorabelia.com/api/capsules/1/items/create/
```

## Deployment

The application is live at **mymemorabelia.com**, deployed on an AWS EC2 instance using a fully containerized setup.

### Deployment Architecture & Process

The deployment was provisioned using the following architecture and steps:

- **Infrastructure**: An **AWS EC2 instance** was set up to host the application.
- **Containerization**: **Docker** and **Docker Compose** are at the core of the deployment. The `docker-compose.yml` file defines all the necessary services (`web`, `db`, `redis`, `celery_worker`, `celery_beat`, and `nginx`) and their configurations, ensuring a reproducible and isolated environment.
- **Reverse Proxy**: **Nginx** is used as a reverse proxy. It listens on port 80, handles incoming HTTP requests, and forwards them to the Django `web` container. It is also configured to serve static and media files directly for better performance.
- **Database**: A **PostgreSQL** database runs in a dedicated Docker container, with its data persisted in a Docker volume to prevent data loss across container restarts.
- **File Storage**: For production, the application was configured to use **AWS S3**. All user-uploaded media files and static assets are stored in an S3 bucket, which is more scalable and decoupled from the application server.
- **Configuration**:
    1.  The repository was cloned onto the EC2 instance.
    2.  A `.env` file was created in the `backend/` directory to hold all production secrets and configuration variables, such as database credentials, AWS keys, and the Django secret key.
    3.  The `ENV` variable was set to `prod` to activate all production settings (e.g., PostgreSQL, S3 storage, and stricter security).
- **Execution**:
    The application was launched by running `docker-compose up --build -d`. This command built the images, started all services, and the `entrypoint.sh` script in the `web` container ran the database migrations automatically.

**Note on Email:** The email functionality is implemented using Celery for asynchronous delivery. However, the system is currently awaiting final approval from AWS Simple Email Service (SES). Once approved, the production environment variables for email will be fully configured to enable delivery.

## Local Development Setup

To run the project on your local machine, follow these steps.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/mymemorabelia.git
    cd mymemorabelia
    ```

2.  **Configure Environment Variables (.env)**
    - Create a file named `.env` in the `backend/` directory.
    - For local development, you only need to define the following variables. The `ENV=dev` setting ensures the app runs with `DEBUG` on, uses SQLite, and stores files locally.

    ```env
    # .env for local development
    ENV="dev"
    DJANGO_SECRET_KEY='your-super-secret-key-goes-here-change-me'
    DATABASE_URL=sqlite:///db.sqlite3
    ```
    *Note: You can generate a new `DJANGO_SECRET_KEY` using an online generator or a simple Python script.*

3.  **Set up the Python Virtual Environment:**
    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    ```

4.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Run Database Migrations:**
    ```bash
    python manage.py migrate
    ```

6.  **Start the Development Server:**
    ```bash
    python manage.py runserver
    ```
    The API will now be available at `http://127.0.0.1:8000/`.

7.  **Run the Celery Worker (in a separate terminal):**
    - Make sure your virtual environment is activated.
    ```bash
    celery -A mymemorabelia worker --loglevel=info
    ```
    
8.  **Run the Celery Beat Scheduler (in a separate terminal):**
    - Make sure your virtual environment is activated.
    ```bash
    celery -A mymemorabelia beat --loglevel=info
    ```

## Future Work

- **Frontend Interface:** Develop a full-featured frontend using a modern JavaScript framework like React or Vue.js.
- **Complete Email Integration:** Fully activate the email delivery system once AWS SES approval is granted.
- **Enhanced Features:** Add features like social login, capsule sharing, and more customization options.
