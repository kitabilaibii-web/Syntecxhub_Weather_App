# 🌤️ Smart Weather Dashboard

React JS project — Login + Protected Route + Weather API + LocalStorage.

## 📂 Project Structure
```
smart-weather-dashboard/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── components/
    │   └── ProtectedRoute.jsx
    └── pages/
        ├── Login.jsx
        └── Dashboard.jsx
```

## 🚀 Setup Karne Ke Steps (Roman Urdu)

### 1. Node modules install karein
Terminal mein project folder ke andar jaa kar:
```
npm install
```

### 2. Free Weather API Key lein
1. Jayein: https://openweathermap.org/api
2. Free account banayein (sign up)
3. "API keys" tab mein apni default key copy karein
4. Note: Key generate hone ke baad activate hone mein **10-15 minutes** lag sakte hain — sabar rakhein!

### 3. API Key ko project mein daalein
File open karein: `src/pages/Dashboard.jsx`
Top par ye line milegi:
```js
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
```
Yahan apni asli key paste kar dein, jaise:
```js
const API_KEY = "abcd1234yourrealkeyhere";
```

### 4. App run karein
```
npm run dev
```
Browser mein khud khulega, ya manually jayein: **http://localhost:3000**

## 🔑 Login Credentials (Testing ke liye)
- **Username:** student
- **Password:** react123

## ✅ Features Checklist
- [x] Login page with validation
- [x] localStorage session save
- [x] Auto redirect to /dashboard after login
- [x] Protected Route (Dashboard bina login access nahi hoga)
- [x] Logout button (clears localStorage)
- [x] City search + Weather API integration
- [x] Loading state jab tak data aaye
- [x] Temperature, city name, aur condition display
- [x] BONUS: Recent Searches list (click karke dobara search bhi ho jata hai)

## 🎥 Screen Recording Banane Ke Liye Tips
1. App start karein (`npm run dev`)
2. Pehle `/dashboard` URL directly try karein bina login kiye → dikhayein ke redirect ho raha hai
3. Phir galat password se login try karein → error dikhayein
4. Sahi credentials se login karein → dashboard par pohanch jayein
5. Kisi city ka naam likh kar search karein → loading + result dikhayein
6. Recent searches list par click kar ke dikhayein
7. Logout button dabayein → wapis login page par redirect ho jayein

Good luck! 🎓
