# MyMemorabilia

MyMemorabilia is a Django-based application that allows users to create digital time capsules. Users can store memories that consists of notes, multimedia files and a music track, which are then delivered to their email on a future date of their choosing. This project serves as a capstone project, demonstrating a robust backend API and a clear path toward a full-stack application.

## Core Concepts

The application is built around the idea of a "Capsule," a container for digital memories. Each capsule has a title, a body, and a "deliver on" date. Users can also attach various items to their capsules, such as images, videos, and links to music. In the future, limits would be enforced to maintain the idea of small boxes of things that you can bury to be uncovered on a future date

The project is divided into two main Django apps:

*   `capsule`: This app contains the core business logic and data models for the application.
*   `capsule_api`: This app exposes the functionality of the `capsule` app through a RESTful API, which will be used by a future frontend.

## Features

*   **User Authentication:** Users can register and log in to their accounts.
*   **Capsule Creation:** Users can create new time capsules with a title, body, and a future delivery date.
*   **Multimedia Attachments:** Users can attach files (images, videos, audio) and music links to their capsules.
*   **Capsule Listing:** Users can view a list of all the capsules they have created.
*   **API:** A RESTful API for all core functionalities.

## API Endpoints

The following API endpoints are available:

*   `POST /api/register/`: Register a new user.
*   `POST /api/login/`: Log in an existing user.
*   `POST /api/capsules/create/`: Create a new capsule.
*   `GET /api/capsules/`: List all capsules for the logged-in user.
*   `POST /api/capsules/<capsule_pk>/items/create`: Add an item to a capsule.
*   `GET /api/capsules/<capsule_pk>/items/`: List all items in a capsule.

## Database Schema

The application uses a SQLite database with the following models:

*   **CustomUser:** Extends the default Django User model to include a timezone and uses the email as the unique identifier.
*   **Capsule:** The main model for the time capsules. It includes fields for the owner, title, body, delivery date, and status.
*   **CapsuleItem:** Represents a file or a link attached to a capsule. It includes fields for the capsule it belongs to, the type of item, and the file or URL.
*   **DeliveryLog:** Logs the attempts to deliver a capsule to a user.

## Future Work

This project is under active development, and the following features are planned for the future:

### Email Delivery System

The email delivery system is a critical component of the application that is yet to be implemented. The plan is to create a custom Django management command that will be run as a cron job on the server. This command will query the database for capsules that are due for delivery, and then send them to the users' emails. The command will run every minute to ensure timely delivery.

### Frontend
A frontend will be built using Django’s templating system, HTMX, and CSS to create a fully functional website. The API remains a separate component to support future needs, such as integrating a React-based frontend or developing a mobile application later.

## Setup and Installation

To run the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the backend directory:**
    ```bash
    cd mymemorabelia2/backend
    ```
3.  **Create a virtual environment:**
    ```bash
    python3 -m venv .venv
    ```
4.  **Activate the virtual environment:**
    ```bash
    source .venv/bin/activate
    ```
5.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
6.  **Run the database migrations:**
    ```bash
    python manage.py migrate
    ```
7.  **Start the development server:**
    ```bash
    python manage.py runserver
    ```

The application will be available at `http://127.0.0.1:8000/`.
