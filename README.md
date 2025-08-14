# veuz_ems
Employee Management System

How to Run the Project

Follow these steps to set up and run the Django project locally.

1. Create a Virtual Environment

It is recommended to use a virtual environment to manage project dependencies. Run the following command:

python3 -m venv env


This will create a virtual environment named env in your project directory.

2. Activate the Virtual Environment

On Windows:

.\env\Scripts\activate


On macOS/Linux:

source env/bin/activate


Once activated, your terminal prompt should show the environment name (env).

3. Install Dependencies

Install all the required Python packages using the requirements.txt file:

pip install -r requirements.txt

4. Run the Django Project

Start the development server using:

python3 manage.py runserver


By default, the project will run at:

http://127.0.0.1:8000/

5. Login Credentials

You can log in using the default test credentials:

Username: Admin

Password: Admin123

Alternatively, you can create a new account if needed.

6. API Documentation

Access the API documentation at:

http://127.0.0.1:8000/api/redoc/


You can view all available endpoints and their details here. A Postman collection is also provided for testing the APIs.
