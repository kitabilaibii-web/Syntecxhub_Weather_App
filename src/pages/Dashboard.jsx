import React, { useState, useEffect } from 'react';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const Dashboard = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('metric'); // 'metric' = °C, 'imperial' = °F
  const [searchHistory, setSearchHistory] = useState([]);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // 1) On first load: restore history and fetch weather for the last searched city (or a default)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('weather_history')) || [];
    setSearchHistory(saved);
    const startCity = saved[0] || 'Lahore';
    setCity(startCity);
    loadWeather({ q: startCity });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Re-fetch when unit changes (°C <-> °F)
  useEffect(() => {
    if (weather?.name) {
      loadWeather({ q: weather.name }, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  // Builds a query string from either { q: 'City' } or { lat, lon }
  const buildQuery = (params) => {
    const query = new URLSearchParams({ ...params, units: unit, appid: API_KEY });
    return query.toString();
  };

  // Turns an HTTP status into a clear message
  const getErrorMessage = (status) => {
    if (status === 404) return 'City not found. Check the spelling and try again.';
    if (status === 401) return 'Invalid API key. Check VITE_WEATHER_API_KEY.';
    if (status === 429) return 'Too many requests. Please wait a moment and try again.';
    return `Something went wrong (error ${status}).`;
  };

  // Fetches current weather + forecast together
  const loadWeather = async (params, addToHistory = true) => {
    if (params.q && !params.q.trim()) return;
    if (!API_KEY) {
      setError('API key is missing. Add VITE_WEATHER_API_KEY to your environment.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const query = buildQuery(params);

      const [currentRes, forecastRes] = await Promise.all([
        fetch(`${BASE_URL}/weather?${query}`),
        fetch(`${BASE_URL}/forecast?${query}`),
      ]);

      if (!currentRes.ok) throw new Error(getErrorMessage(currentRes.status));

      const currentData = await currentRes.json();
      setWeather(currentData);
      if (addToHistory) saveToHistory(currentData.name);

      if (forecastRes.ok) {
        const forecastData = await forecastRes.json();
        // One data point per day (every 8th item of the 3-hour list)
        setForecast(forecastData.list.filter((_, i) => i % 8 === 0));
      } else {
        setForecast([]);
      }
    } catch (err) {
      // fetch() itself throws TypeError on network failure
      if (err instanceof TypeError) {
        setError('Network error. Check your internet connection.');
      } else {
        setError(err.message);
      }
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Your browser does not support geolocation.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => loadWeather({ lat: coords.latitude, lon: coords.longitude }),
      () => setError('Location permission was denied.')
    );
  };

  const saveToHistory = (cityName) => {
    setSearchHistory((prev) => {
      const updated = [
        cityName,
        ...prev.filter((c) => c.toLowerCase() !== cityName.toLowerCase()),
      ].slice(0, 5);
      localStorage.setItem('weather_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadWeather({ q: city });
  };

  const unitSymbol = unit === 'metric' ? 'C' : 'F';

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
          {searchHistory.map((item) => (
            <span
              key={item}
              onClick={() => { setCity(item); loadWeather({ q: item }); }}
              style={{
                cursor: 'pointer',
                marginRight: '8px',
                padding: '2px 8px',
                background: '#e0e0e0',
                borderRadius: '12px',
                fontSize: '12px',
              }}
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Loading & Error States */}
      {loading && <p>Loading weather data...</p>}
      {error && <p style={{ color: 'red' }}>⚠️ {error}</p>}

      {/* Current Weather Card */}
      {weather && !loading && (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2>{weather.name}, {weather.sys?.country}</h2>
          <h3>{Math.round(weather.main?.temp)}°{unitSymbol}</h3>
          <p>Condition: {weather.weather?.[0]?.description}</p>
          <div style={{ display: 'flex', gap: '15px', marginTop: '10px', flexWrap: 'wrap' }}>
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
            {forecast.map((item) => (
              <div key={item.dt} style={{ border: '1px solid #eee', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                <p><strong>{new Date(item.dt_txt).toLocaleDateString(undefined, { weekday: 'short' })}</strong></p>
                <p>{Math.round(item.main.temp)}°{unitSymbol}</p>
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
