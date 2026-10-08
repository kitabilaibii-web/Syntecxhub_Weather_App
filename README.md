# Smart Weather Dashboard

A weather forecasting app built with React. It shows current weather and a 5-day forecast for any city, with login authentication and protected routes.

## Features

- Login with session saved in localStorage
- Auto redirect to `/dashboard` after login
- Protected route (dashboard cannot be opened without login)
- Logout button (clears localStorage)
- City search using the OpenWeatherMap API
- Current weather: temperature, city name, condition, humidity, wind, feels-like
- 5-day forecast
- Loading state while data is being fetched
- Error handling for invalid city, invalid API key, rate limit and network errors
- Auto location (uses browser geolocation)
- Switch between °C and °F
- Recent searches list (click to search again)

## Tech Stack

- React
- Vite
- React Router
- OpenWeatherMap API
- CSS

## Getting Started

1. Clone the repository

```
   git clone https://github.com/kitabilaibii-web/Syntecxhub_Weather_App.git
   cd Syntecxhub_Weather_App
```

2. Install dependencies

```
   npm install
```

3. Create a `.env` file in the project root and add your API key

```
   VITE_WEATHER_API_KEY=your_api_key_here
```

   You can get a free key from https://openweathermap.org/api

4. Start the app

```
   npm run dev
```

## Login Credentials

- Username: student
- Password: react123

## Live Demo

YOUR_VERCEL_LINK
