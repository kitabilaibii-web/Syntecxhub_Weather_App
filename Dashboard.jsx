import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('metric'); // 'metric' for °C, 'imperial' for °F
  const [searchHistory, setSearchHistory] = useState([]);

  // Free WeatherAPI or OpenWeatherMap API details
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'YOUR_API_KEY';

  // Load search history from localStorage on initial render
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('weather_history')) || [];
    setSearchHistory(savedHistory);
  }, []);

  // Fetch Weather by City Name
  const fetchWeatherByCity = async (cityName) => {
    if (!cityName.trim()) return;
    setLoading(true);
    setError('');

    try {
      // Current Weather Fetch
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}&appid=${API_KEY}`
      );
      if (!res.ok) throw new Error('City not found or API error');
      const data = await res.json();
      setWeather(data);

      // Save to History
      saveToHistory(data.name);

      // Forecast Fetch (5-day / 3-hour)
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${unit}&appid=${API_KEY}`
      );
      if (forecastRes.ok) {
        const forecastData = await forecastRes.json();
        // Daily forecast filter (har 24 ghante par ek data point)
        const dailyData = forecastData.list.filter((_, index) => index % 8 === 0);
        setForecast(dailyData);
      }
    } catch (err) {
      setError(err.message || 'Data fetch karne mein dikkat aayi.');
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Weather by Geolocation (Auto-detect Current Location)
  const fetchWeatherByCoords = (lat, lon) => {
    setLoading(true);
    setError('');

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`)
      .then((res) => {
        if (!res.ok) throw new Error('Location data fetch nahi ho saka');
        return res.json();
      })
      .then((data) => {
        setWeather(data);
        saveToHistory(data.name);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        () => setError('Location permission deny kar di gayi.')
      );
    } else {
      setError('Aapka browser Geolocation support nahi karta.');
    }
  };

  const saveToHistory = (cityName) => {
    const updated = [cityName, ...searchHistory.filter((c) => c.toLowerCase() !== cityName.toLowerCase())].slice(0, 5);
    setSearchHistory(updated);
    localStorage.setItem('weather_history', JSON.stringify(updated));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherByCity(city);
  };

  // Re-fetch when unit (°C / °F) changes
  useEffect(() => {
    if (weather?.name) {
      fetchWeatherByCity(weather.name);
    }
  }, [unit]);

  return (
    <div className="dashboard-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🌤️ Weather Dashboard</h1>

      {/* Controls: Search, Location Button, Unit Toggle */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flexGrow: 1 }}>
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ padding: '8px', flexGrow: 1, borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Search</button>
        </form>

        <button onClick={handleCurrentLocation} style={{ padding: '8px 12px', cursor: 'pointer' }}>
          📍 Auto Location
        </button>

        <button 
          onClick={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')} 
          style={{ padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Switch to °{unit === 'metric' ? 'F' : 'C'}
        </button>
      </div>

      {/* Recent Searches */}
      {searchHistory.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <small>Recent Searches: </small>
          {searchHistory.map((item, idx) => (
            <span
              key={idx}
              onClick={() => { setCity(item); fetchWeatherByCity(item); }}
              style={{
                cursor: 'pointer',
                marginRight: '8px',
                padding: '2px 8px',
                background: '#e0e0e0',
                borderRadius: '12px',
                fontSize: '12px'
              }}
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Loading & Error States */}
      {loading && <p>Weather data load ho raha hai...</p>}
      {error && <p style={{ color: 'red' }}>⚠️ {error}</p>}

      {/* Current Weather Card */}
      {weather && !loading && (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2>{weather.name}, {weather.sys?.country}</h2>
          <h3>
            {Math.round(weather.main?.temp)}°{unit === 'metric' ? 'C' : 'F'}
          </h3>
          <p>Condition: {weather.weather?.[0]?.description}</p>
          <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
            <span>💧 Humidity: {weather.main?.humidity}%</span>
            <span>💨 Wind: {weather.wind?.speed} {unit === 'metric' ? 'm/s' : 'mph'}</span>
            <span>🌡️ Feels like: {Math.round(weather.main?.feels_like)}°</span>
          </div>
        </div>
      )}

      {/* Forecast Section */}
      {forecast.length > 0 && !loading && (
        <div>
          <h3>📅 5-Day Forecast</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
            {forecast.map((item, idx) => (
              <div key={idx} style={{ border: '1px solid #eee', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                <p><strong>{new Date(item.dt_txt).toLocaleDateString(undefined, { weekday: 'short' })}</strong></p>
                <p>{Math.round(item.main.temp)}°{unit === 'metric' ? 'C' : 'F'}</p>
                <small>{item.weather[0].main}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;