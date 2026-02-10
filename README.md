# 🧪 Chemical Equipment Visualizer

Hybrid Web + Desktop Data Visualization System

A full-stack application that allows users to upload CSV datasets of chemical equipment metrics and visualize them through both a web dashboard and a desktop application.

Built as a screening task using a fixed tech stack:

* React + Chart.js (Web Frontend)
* PyQt5 + Matplotlib (Desktop Frontend)
* Django + DRF + Pandas + SQLite (Backend)

---

# 📌 Features

## 🌐 Web Application

* User login using Django Token Authentication
* Upload CSV datasets
* Dashboard with:

  * Summary cards
  * Equipment type distribution chart
  * Data table
* Upload history (last 5 datasets)
* Load dataset from history
* Generate PDF report

## 🖥 Desktop Application (PyQt5)

* Login using same backend API
* Upload CSV files
* Load dataset from history
* Dashboard with:

  * Summary metrics
  * Matplotlib chart
  * Dynamic data table
* Generate PDF report
* Logout support

## ⚙ Backend (Django + DRF)

* Token authentication
* CSV upload & storage
* Pandas-based analytics:

  * Total equipment
  * Average flowrate
  * Average pressure
  * Average temperature
  * Equipment type distribution
* Stores last 5 uploads
* REST API shared by web & desktop apps

---

# 🏗 Tech Stack

### Frontend (Web)

* React
* Chart.js
* React Router
* Axios / Fetch API

### Frontend (Desktop)

* PyQt5
* Matplotlib
* Requests

### Backend

* Django
* Django REST Framework
* Pandas
* SQLite

---

# 📂 Project Structure

```
chemical-equipment-visualizer/
│
├── backend/
│   ├── config/
│   ├── datasets/
│   ├── db.sqlite3
│   └── manage.py
│
├── web-frontend/
│   ├── src/
│   └── package.json
│
├── desktop-frontend/
│   ├── main.py
│   ├── services/
│   ├── ui/
│   └── utils/
│
├── sample-data/
│   └── sample_equipment_data.csv
│
└── README.md
```

---

# 🚀 Setup Instructions

## 1️⃣ Backend Setup (Django)

```bash
cd backend
python -m venv venv
venv\Scripts\activate

pip install django djangorestframework pandas django-cors-headers

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Server runs at:

```
http://127.0.0.1:8000
```

---

## 2️⃣ Web Frontend Setup (React)

```bash
cd web-frontend
npm install
npm start
```

App runs at:

```
http://localhost:3000
```

---

## 3️⃣ Desktop Frontend Setup (PyQt5)

```bash
cd desktop-frontend
python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
python main.py
```

---

# 🔐 Authentication

Login is handled via Django Token Authentication.

API endpoint:

```
POST /api/auth/token/
```

Example request:

```json
{
  "username": "admin",
  "password": "password"
}
```

Response:

```json
{
  "token": "abc123..."
}
```

Token is stored:

* Web → localStorage
* Desktop → local file (`~/.chemical_visualizer/auth.json`)

---

# 📡 API Endpoints

### Auth

```
POST /api/auth/token/
```

### Upload CSV

```
POST /api/upload/
```

### Get History (last 5 uploads)

```
GET /api/history/
```

### Load dataset by name

```
GET /api/datasets/by-name/?name=filename.csv
```

---

# 📊 Supported CSV Format (Recommended)

Example:

```
Equipment Name,Type,Flowrate,Pressure,Temperature
Pump-1,Pump,10,5,100
Valve-1,Valve,8,6,90
Reactor-1,Reactor,12,7,120
```

The backend also supports alternate column names like:

* Flow_Rate
* Temp
* equipment_type

---

# 📄 PDF Reports

Both web and desktop apps can generate PDF reports containing:

* Dataset metadata
* Summary metrics
* Equipment type chart
* Sample data table

---

# 🌍 Deployment (Optional)

Web app can be deployed using:

* Render
* Railway
* Heroku

