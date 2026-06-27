# 🩺 MedAdvisor — Smart HealthCare

A conversational medicine recommendation web app built for the Indian healthcare context. Users enter a disease name, age, and gender, and MedAdvisor returns age-appropriate medicine suggestions with dosages, costs, and precautions — all sourced from a curated Indian pharma dataset.

---

## ✨ Features

- **Conversational chat interface** — step-by-step disease → age → gender flow
- **Fuzzy disease search** — handles typos and partial names using RapidFuzz
- **Age & gender-aware recommendations** — medicines filtered by patient profile, with female-specific precautions
- **33 diseases covered** — from common cold to tuberculosis, diabetes, depression, and more
- **Save results** — logged-in users can save and revisit medicine recommendations
- **User authentication** — secure email + password signup and login with bcrypt hashing
- **Dashboard** — view and delete saved results
- **Indian pharma pricing** — all costs in ₹ with real brand names

---

## 🦠 Diseases Covered

Common Cold, Fever, Diarrhoea, Headache, Typhoid, Malaria, Dengue, Diabetes, Hypertension, Asthma, Stomach Ache, Skin Allergy, Cough, Pneumonia, Bronchitis, Tuberculosis, Acidity / GERD, Constipation, Jaundice, IBS, UTI, Chickenpox, COVID-19, Fungal Infection, Thyroid Disorder, Arthritis, Anaemia, Anxiety, Depression, Insomnia, Conjunctivitis, Ear Infection, Sinusitis

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, Flask |
| Database | Supabase (PostgreSQL + JSONB) |
| Auth | bcrypt password hashing, Flask sessions |
| Fuzzy Matching | RapidFuzz |
| Frontend | Vanilla HTML, CSS, JavaScript |
| Server | Gunicorn |

---

## 📁 Project Structure

```
MedAdvisor/
├── app.py               # Flask backend — routes, auth, chat logic
├── supabase_client.py   # Supabase connection
├── requirements.txt     # Python dependencies
├── templates/
│   ├── index.html       # Main chat page
│   ├── login.html       # Login / Sign up page
│   └── dashboard.html   # Saved results dashboard
└── static/
    ├── style.css        # All styles
    ├── script.js        # Chat interface logic
    ├── auth.js          # Auth state management
    ├── login.js         # Login / signup form logic
    ├── dashboard.js     # Dashboard logic
    └── notification.js  # Toast notification system
```

---

## 🗄 Database Schema

Three tables in Supabase:

**`users`** — registered accounts
```sql
id, email, name, password_hash, created_at
```

**`saved_results`** — medicine results saved by users
```sql
id, user_id (email), disease_name, medicine_output, created_at
```

**`diseases`** — disease + medicines data (JSONB)
```sql
id, name, medicines (JSONB array), created_at
```

Each medicine entry in the JSONB array contains:
```json
{
  "name": "Medicine name",
  "dosage": "Dose instructions",
  "description": "Detailed info",
  "cost": "₹XX–₹XX",
  "min_age": 0,
  "max_age": 120,
  "female_precautions": "Precaution text or null"
}
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mbkvkrishna/MedAdvisor.git
cd MedAdvisor
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Set up Supabase

- Create a project at [supabase.com](https://supabase.com)
- Run `dataset.sql` in the Supabase SQL Editor to create tables and seed disease data
- Run the migration to add the password column:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
```

### 4. Configure environment variables

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_or_service_key
SECRET_KEY=your_flask_secret_key
```

### 5. Run locally

```bash
python app.py
```

App runs at `http://localhost:5000`

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Home / chat page |
| GET | `/login` | Login & signup page |
| GET | `/dashboard` | Saved results dashboard |
| POST | `/auth/signup` | Create a new account |
| POST | `/auth/login` | Login with email + password |
| POST | `/auth/logout` | Logout and clear session |
| POST | `/auth/delete-account` | Delete account and all saved results |
| POST | `/chat` | Send a chat message |
| POST | `/results/save` | Save a medicine result |
| GET | `/results/get` | Get all saved results |
| DELETE | `/results/delete/<id>` | Delete a saved result |

---

## ⚙️ Deploying

### Render / Railway / Fly.io

1. Set the environment variables (`SUPABASE_URL`, `SUPABASE_KEY`, `SECRET_KEY`)
2. Set the start command to:

```bash
gunicorn app:app
```

3. Run the SQL migration in Supabase before first launch

---

## ⚠️ Disclaimer

MedAdvisor is an informational tool only and is **not a substitute for professional medical advice**. Always consult a qualified doctor before taking any medication. Medicine recommendations are based on general Indian pharma guidelines and may not apply to every individual's situation.

---

## 📄 License

MIT License — free to use, modify, and distribute.
