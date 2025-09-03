# MyMemorabilia 

MyMemorabilia is a Django-based application that allows users to create digital time capsules. Users can store memories consisting of notes, multimedia files, and a music track, which are then delivered to their email on a future date of their choosing. This project serves as a capstone, demonstrating a robust, backend-complete API ready for a frontend interface.

## Core Concepts

The application is built around the idea of a **Capsule**, a container for digital memories. Each capsule has a title, a body, and a `deliver_on` date. Users can attach various items to their capsules, such as images, videos, and links to music. Future versions will enforce limits to maintain the feeling of a small, personal time capsule.

The project is divided into two main Django apps:
* `capsule`: Contains the core business logic and data models.
* `capsule_api`: Exposes the `capsule` app's functionality through a RESTful API.

---

## Features

* **User Authentication:** Users can register and log in to their accounts.
* **Capsule Creation:** Users can create new time capsules with a title, body, and a future delivery date.
* **Multimedia Attachments:** Users can attach files (images, videos, audio) and music links to their capsules.
* **Capsule Listing:** Users can view a list of all the capsules they have created.
* **RESTful API:** A well-defined API for all core functionalities.

---

## API Endpoints

The API is available locally or on the deployed server.

**Base URL (Production):** `https://mymemorabelia.com/api`
**Base URL (Local):** `http://127.0.0.1:8000/api`

* `POST /register/`: Register a new user.
* `POST /login/`: Log in and receive an auth token.
* `POST /capsules/create/`: Create a new capsule.
* `GET /capsules/`: List all capsules for the logged-in user.
* `POST /capsules/<capsule_pk>/items/create/`: Add an item to a specific capsule.
* `GET /capsules/<capsule_pk>/items/`: List all items in a specific capsule.

---

## Storage
## Storage System
The application employs a flexible storage backend that adapts based on the environment (`dev` vs. `prod`). This is controlled by the `ENV` environment variable.

### Development (`ENV=dev`)
In the local development environment, the application uses Django's default **filesystem storage**.
* **Media Files:** User-uploaded content (like images and videos for capsules) is stored in the `/files/` directory at the project root, as defined by `MEDIA_ROOT`.
* **Static Files:** Static assets like CSS and JavaScript are managed by Django's `StaticFilesStorage` and served from the `/static/` directory.


### Production (`ENV=prod`)
For production, the application switches to a more robust and scalable solution using **Amazon S3 (Simple Storage Service)** via the `django-storages` package.
* **Cloud Storage:** All user-uploaded media and static assets are stored in a designated AWS S3 bucket. This offloads file storage from the application server, which is better for performance, security, and scalability.
* **Serving Files:** Files are served directly from S3 for faster delivery to users. The `AWS_S3_CUSTOM_DOMAIN` setting allows files to be served from a custom URL.
* **Configuration:** This is enabled by setting `ENV=prod` and providing the necessary AWS credentials (e.g., `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_STORAGE_BUCKET_NAME`) in the environment variables
This dual approach ensures that the application is both easy to run locally and ready for a scalable, production-grade deployment.

## Database Schema
The application uses a database with the following models:
* **CustomUser:** Extends the default Django User model, using email as the unique identifier and adding a `timezone` field.
* **Capsule:** The main model for time capsules, containing fields for the owner, title, body, delivery date, and status.
* **CapsuleItem:** Represents a file or a link attached to a capsule.
* **DeliveryLog:** Logs the attempts to deliver a capsule to a user.

It uses Postgresql for production and the default sqlite for local development.

## Local Development Setup

To run the project on your local machine, follow these steps.

### 1. Environment Variables (.env)
The project reads settings from environment variables in settings.py. Set ENV correctly:

ENV=dev → local development

DEBUG on, SQLite, local files.

ALLOWED_HOSTS auto: 127.0.0.1, localhost.

ENV=prod → production
DEBUG off, Postgres, S3 storage, strict security.
DJANGO_ALLOWED_HOSTS must include your domain(s), comma-separated.


Create a file named `.env` in the `backend` directory (`mymemorabelia2/backend/.env`).

For **local development**, you only need to define the following variables. Copy the content below into your `.env` file:

# .env for local development
```
ENV="dev"
DJANGO_SECRET_KEY='your-super-secret-key-goes-here-change-me'
```
Note: You can generate a new DJANGO_SECRET_KEY using an online generator or a simple Python script.

2. Installation Steps
Clone the repository:
`git clone <repository-url>`

Navigate to the backend directory:
`cd mymemorabelia2/backend`

Create and activate a virtual environment:
```
python3 -m venv .venv
source .venv/bin/activate
Install the dependencies:
```
`pip install -r requirements.txt`

Run migrate
`python manage.py migrate`

Start the development server:
`python manage.py runserver`

The API will now be available at http://127.0.0.1:8000/.

## Future Work:
This project is under active development. Planned features include:

### Email Delivery System
A custom Django management command will be created to handle email delivery. This command will be scheduled as a cron job to run every minute, querying for due capsules and sending them to users.

### Frontend
A dynamic frontend will be built using Django's templating system, HTMX, and CSS. The API will remain a separate component to allow for future integration with other technologies like React or mobile applications.
