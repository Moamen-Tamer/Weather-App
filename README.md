# 🌤️ Weather App - Asynchronous JavaScript Learning Project

A comprehensive weather application built to demonstrate advanced JavaScript concepts including asynchronous programming, error handling, caching mechanisms, and class-based architecture.

## 🚀 Features

### Core Functionality
- **Single City Weather**: Get detailed weather information for any supported city
- **Multi-City Batch Processing**: Fetch weather data for multiple cities simultaneously using `Promise.all`
- **Weather Comparison**: Compare weather conditions between two cities
- **Intelligent Caching**: 5-minute cache system to optimize API calls and improve performance
- **Comprehensive Error Handling**: Robust error management with detailed feedback

### Technical Highlights
- **Asynchronous Programming**: Extensive use of Promises and async/await
- **Mock API Simulation**: Realistic network delays and response patterns
- **Class-based Architecture**: Clean, maintainable object-oriented design
- **Memory Management**: Smart cache expiry and cleanup mechanisms
- **Detailed Logging**: Console logging for development and debugging

## 🌍 Supported Cities

The app includes weather data for 7 major cities:
- London, UK 🌦️
- New York, USA ☀️
- Tokyo, Japan ⛅
- Paris, France ☁️
- Sydney, Australia 🌞
- Moscow, Russia ❄️
- Dubai, UAE 🔥

## 🛠️ Installation & Usage

### Prerequisites
- Basic understanding of JavaScript and asynchronous programming

## 📖 API Reference

### WeatherApp Class Methods

#### `getWeather(city)`
Fetches weather data for a single city with caching support.

**Parameters:**
- `city` (string): Name of the city

**Returns:** Promise resolving to weather data object

**Example:**
```javascript
const weather = await app.getWeather("London");
console.log(weather.data.temperature); // 15
```

#### `getMultipleCitiesWeather(cities)`
Fetches weather data for multiple cities in parallel.

**Parameters:**
- `cities` (array): Array of city names

**Returns:** Promise resolving to batch results with summary

**Example:**
```javascript
const results = await app.getMultipleCitiesWeather(["London", "Paris", "Tokyo"]);
console.log(`${results.summary.successful}/${results.summary.total} successful`);
```

#### `compareWeather(city1, city2)`
Compares weather conditions between two cities.

**Parameters:**
- `city1` (string): First city name
- `city2` (string): Second city name

**Returns:** Promise resolving to comparison object

#### Cache Management
- `getCacheStatus()`: View current cache status
- `clearCache()`: Clear all cached data
- `clearExpiredCache()`: Remove only expired entries

## 🎯 Learning Objectives

This project demonstrates:

### 1. **Asynchronous Programming**
- Promise creation and handling
- async/await syntax and best practices
- Error handling with try/catch blocks
- Parallel execution with Promise.all

### 2. **Software Architecture**
- Class-based design patterns
- Method composition and reusability
- Separation of concerns
- Clean code principles

### 3. **Performance Optimization**
- Intelligent caching strategies
- Memory management
- Batch processing techniques
- Network request optimization

### 4. **Error Handling**
- Comprehensive error catching
- User-friendly error messages
- Graceful degradation
- Input validation

## 🧪 Testing

The application includes a comprehensive test suite:

```javascript
async function testWeatherApp() {
    const app = new WeatherApp();
    
    // Test single city
    const londonWeather = await app.getWeather("London");
    
    // Test error handling
    const invalidWeather = await app.getWeather("Atlantis");
    
    // Test batch processing
    const multipleResults = await app.getMultipleCitiesWeather(["New York", "Tokyo"]);
    
    // Test comparison
    const comparison = await app.compareWeather("London", "Dubai");
}
```

## 🔧 Configuration

### Cache Settings
```javascript
this.cacheExpiryTime = 5 * 60 * 1000; // 5 minutes
```

### Network Simulation
```javascript
const networkDelay = (Math.random() * 1500) + 500; // 500-2000ms delay
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📬 Contact

- **GitHub**: [Mo'men Tamer](https://github.com/Moamen-Tamer)
- **LinkedIn**: [Mo'men Tamer](https://www.linkedin.com/in/mo-men-tamer-86a57b336/)

