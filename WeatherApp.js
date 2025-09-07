/*
 * Complete Weather App - Asynchronous JavaScript Learning Project
 * 
 * This app demonstrates:
 * - Promises and async/await
 * - Error handling with try/catch
 * - Class-based architecture
 * - Caching mechanism
 * - Mock API simulation
 * - Multiple request handling
 */

class WeatherApp {
    constructor () {
        this.apiURL = "https://api.openweathermap.org/data/2.5/weather";
        this.apiKey = "your-api-key-here";  // In real app, get from OpenWeather
        this.cache = {};  // Cache to store recent weather data (avoid repeated API calls)
        this.cacheExpiryTime = 5 * 60 * 1000;  // Cache expiration time (5 minutes)
        console.log("🌤️  Weather App initialized");
    }

    async fetchWeatherMock(city) {
        console.log(`📡 Fetching weather for ${city}...`);

        return new Promise ((resolve, reject) => {
            const networkDelay = (Math.random() * 1500) + 500;
            
            setTimeout(() => {
                const weatherDatabase = {
                    "london": {
                        temperature: 15,
                        description: "Cloudy with light rain",
                        humidity: 78,
                        windSpeed: 12,
                        pressure: 1013,
                        visibility: 8,
                        icon: "🌦️",
                        feels_like: 13
                    },
                    "new york": {
                        temperature: 22,
                        description: "Sunny and clear",
                        humidity: 45,
                        windSpeed: 8,
                        pressure: 1020,
                        visibility: 15,
                        icon: "☀️",
                        feels_like: 24
                    },
                    "tokyo": {
                        temperature: 18,
                        description: "Partly cloudy",
                        humidity: 62,
                        windSpeed: 6,
                        pressure: 1018,
                        visibility: 12,
                        icon: "⛅",
                        feels_like: 19
                    },
                    "paris": {
                        temperature: 12,
                        description: "Overcast",
                        humidity: 71,
                        windSpeed: 14,
                        pressure: 1008,
                        visibility: 10,
                        icon: "☁️",
                        feels_like: 10
                    },
                    "sydney": {
                        temperature: 25,
                        description: "Warm and sunny",
                        humidity: 38,
                        windSpeed: 10,
                        pressure: 1025,
                        visibility: 20,
                        icon: "🌞",
                        feels_like: 27
                    },
                    "moscow": {
                        temperature: -5,
                        description: "Snow and cold",
                        humidity: 85,
                        windSpeed: 18,
                        pressure: 1000,
                        visibility: 5,
                        icon: "❄️",
                        feels_like: -10
                    },
                    "dubai": {
                        temperature: 35,
                        description: "Hot and sunny",
                        humidity: 25,
                        windSpeed: 5,
                        pressure: 1015,
                        visibility: 18,
                        icon: "🔥",
                        feels_like: 40
                    }
                };

                const cityKey = city.toLowerCase().trim();

                if(weatherDatabase[cityKey]) {  // SUCCESS CASE - Return weather data
                    const weatherData = {
                        city: cityKey,
                        country: this.getCountryForCity(cityKey),
                        ...weatherDatabase[cityKey],
                        timestamp: Date.now(),
                        source: "mock-api"
                    };

                    console.log(`✅ Weather data found for ${city}`);
                    resolve(weatherData);
                } else {  // ERROR CASE - City not found
                    const availableCities = Object.keys(weatherDatabase).map(city => city.charAt(0).toUpperCase() + city.slice(1)).join(", ");

                    reject(new Error(`Weather data not available for "${city}". Available cities: ${availableCities}`));
                }
            }, networkDelay);
        })
    }

    getCountryForCity (city) {  //Helper function to get country for city (for more realistic data)
        const cityCountryMap = {
            "london": "United Kingdom",
            "new york": "United States",
            "tokyo": "Japan",
            "paris": "France",
            "sydney": "Australia",
            "moscow": "Russia",
            "dubai": "UAE"
        };

        return cityCountryMap[city] || "unknown";
    }

    async getWeather (city) {
        try {
            if (!city || typeof city !== 'string' || city.trim() === "") {
                throw new Error("City name is required and must be a valid string");
            } 
            
            const cleanCity = city.toLowerCase().trim();
            console.log(`🔍 Getting weather for: ${cleanCity}`);
            
            const cachedResult = this.getCachedWeather(cleanCity);

            if (cachedResult) {
                console.log(`📋 Using cached data for ${cleanCity}`);
                return this.formatSuccessResponse(cachedResult.data, true);
            }

            console.log(`🔄 Fetching fresh weather data for ${cleanCity}...`);
            const weatherData = await this.fetchWeatherMock(cleanCity);

            this.cacheWeatherData(cleanCity, weatherData);

            return this.formatSuccessResponse(weatherData, false);

        } catch (error) {
            console.error(`❌ Weather fetch failed for ${city}:`, error.message);
            return this.formatErrorResponse(error, city);
        }
    }

    getCachedWeather (city) {
        const cached = this.cache[city];

        if (!cached) {
            return null;  // no data cached yet
        }

        const age = Date.now() - cached.timestamp;
        if (age > this.cacheExpiryTime) {  // cache expired
            delete this.cache[city];
            console.log(`🗑️  Expired cache removed for ${city}`);
            return null
        }

        return cached; // available cached data for usage
    }

    cacheWeatherData (city, weatherData) {
        this.cache[city] = {
            data: weatherData,
            timestamp: Date.now()
        };

        console.log(`💾 Cached weather data for ${city}`);
    }

    formatSuccessResponse(weatherData, fromCache) {
        const cacheText = fromCache ? " (from cache)" : "";

        return {
            success: true,
            message: `${weatherData.city}: ${weatherData.temperature}°C, ${weatherData.description}${cacheText}`,
            data: {
                city: weatherData.city,
                country: weatherData.country,
                temperature: weatherData.temperature,
                description: weatherData.description,
                humidity: weatherData.humidity,
                windSpeed: weatherData.windSpeed,
                pressure: weatherData.pressure,
                visibility: weatherData.visibility,
                feelsLike: weatherData.feels_like,
                icon: weatherData.icon,
                timestamp: weatherData.timestamp,
                fromCache: fromCache
            },
            displayText: this.createDisplayText(weatherData)
        };
    }

    formatErrorResponse(error, city) {
        return {
            success: false,
            message: `Unable to get weather for ${city}: ${error.message}`,
            data: null,
            displayText: `❌ Error: ${error.message}`,
            error: {
                type: error.name || "WeatherError",
                message: error.message,
                timestamp: new Date().toISOString()
            }
        };
    }

    createDisplayText(weatherData) {
        return `${weatherData.icon} Weather in ${weatherData.city}, ${weatherData.country}
        🌡️ Temperature: ${weatherData.temperature}°C (feels like ${weatherData.feels_like}°C)
        📝 Description: ${weatherData.description}
        💧 Humidity: ${weatherData.humidity}%
        💨 Wind Speed: ${weatherData.windSpeed} km/h
        📊 Pressure: ${weatherData.pressure} hPa
        👁️ Visibility: ${weatherData.visibility} km
        ⏰ Updated: ${weatherData.timestamp}`.trim();
    }

    async getMultipleCitiesWeather (cities) {
        if (!Array.isArray(cities) || cities.length === 0) {
            throw new Error("Cities must be a non-empty array");
        }

        console.log(`🌍 Fetching weather for ${cities.length} cities in parallel...`);
        const startTime = Date.now();

        try {
            const weatherPromises = cities.map(city => this.getWeather(city));

            const result = await Promise.all(weatherPromises);

            const successful = result.filter(result => result.success);
            const failed = result.filter(result => !result.success);
            const duration = Date.now() - startTime;

            console.log(`📊 Batch complete in ${duration}ms: ${successful.length} successful, ${failed.length} failed`);

            return {
                success: true,
                results: result,
                summary: {
                    total: cities.length,
                    successful: successful.length,
                    failed: failed.length,
                    duration: duration,
                    averageTime: (duration / cities.length)
                }
            };

        } catch (error) {
            console.error("❌ Batch weather fetch failed:", error.message);

            return {
                success: false,
                results: [],
                error: error.message,
                summary: {
                    total: cities.length,
                    successful: 0,
                    failed: cities.length,
                    duration: Date.now() - startTime
                },
            };
        }
    }

    async compareWeather (city1, city2) {
        console.log(`⚖️  Comparing weather between ${city1} and ${city2}...`);

        try {
            const [weather1, weather2] = await Promise.all([
                this.getWeather(city1),
                this.getWeather(city2)
            ]);

            if (!weather1.success) {
                throw new Error(`Failed to get weather for ${city1}: ${weather1.message}`);
            }

            if (!weather2.success) {
                throw new Error(`Failed to get weather for ${city2}: ${weather2.message}`);
            }

            const comparison = this.createWeatherComparison(weather1.data, weather2.data);

            return {
                success: true,
                city1: weather1.data,
                city2: weather2.data,
                comparison: comparison,
                summary: this.createComparisonSummary(weather1.data, weather2.data)
            };

        } catch (error) {
            console.error("❌ Weather comparison failed:", error.message);

            return {
                success: false,
                error: error.message
            };
        }
    }

    createWeatherComparison (weather1, weather2) {
        const tempDiff = weather1.temperature - weather2.temperature;
        const humidityDiff = weather1.humidity - weather2.humidity;

        return {
            temperature: {
                difference: tempDiff,
                warmer: tempDiff > 0 ? weather1 : weather2,
                description: Math.abs(tempDiff) < 1 ? "Similar temperatures" : `${Math.abs(tempDiff)}°C ${tempDiff > 0 ? 'warmer' : 'cooler'} in ${tempDiff > 0 ? weather1.city : weather2.city}`
            },
            humidity: {
                difference: humidityDiff,
                moreHumid: humidityDiff > 0 ? weather1 : weather2,
                description: Math.abs(humidityDiff) < 1 ? "Similar humidity" : `${Math.abs(humidityDiff)}% ${humidityDiff > 0 ? 'more humid' : 'less humid'} in ${humidityDiff > 0 ? weather1.city : weather2.city}`
            }
        };
    }

    createComparisonSummary (weather1, weather2) {
        return `
        🏙️ ${weather1.city}: ${weather1.temperature}°C, ${weather1.description}
        🏙️ ${weather2.city}: ${weather2.temperature}°C, ${weather2.description}`.trim();
    }

    getCacheStatus() {
        const cacheKeys = Object.keys(this.cache);
        const now = Date.now();

        const cacheStatus = cacheKeys.map(key => {
            const cached = this.cache[key];
            const age = now - cached.timestamp;
            const expired = age > this.cacheExpiryTime; 
            
            return {
                city: key,
                age: Math.round(age / 1000),
                expired: expired,
                data: cached.data
            };
        })

        return {
            totalEntries: cacheKeys.length,
            validEntries: cacheStatus.filter(item => !item.expired).length,
            expiredEntries: cacheStatus.filter(item => item.expired).length,
            details: cacheStatus
        };
    }

    clearCache() {
        this.cache = {};
        console.log("🗑️ Cache entries cleared");
    }

    clearExpiredCache() {
        const now = Date.now();
        let clearedCount = 0;

        Object.keys(this.cache).forEach(key => {
            const age = now - this.cache[key].timestamp;
            if (age > this.cacheExpiryTime) {
                delete this.cache[key];
                clearedCount += 1;
            }
        })

        console.log(`🗑️ Cleared ${clearedCount} expired cache entries`);
        return clearedCount;
    }
}

////////////////////////// END OF CLASS ///////////////////////////

//////////////////////////  -  TEST  -  ///////////////////////////

async function testWeatherApp() {
    const app = new WeatherApp();
    
    console.log("\n--- Testing Functionality ---");
    
    // Test single city
    const londonWeather = await app.getWeather("London");
    console.log(londonWeather.displayText);
    
    // Test error case
    const invalidWeather = await app.getWeather("Atlantis");
    console.log(invalidWeather.message);
    
    // Test multiple cities
    const cities = ["New York", "Tokyo", "Paris"];
    const multipleResults = await app.getMultipleCitiesWeather(cities);
    console.log(`\nMultiple cities result: ${multipleResults.summary.successful}/${multipleResults.summary.total} successful`);
    
    // Test comparison
    const comparison = await app.compareWeather("London", "Dubai");
    if (comparison.success) {
        console.log("\nComparison:", comparison.comparison.temperature.description);
    }
    
    // Test cache status
    const cacheStatus = app.getCacheStatus();
    console.log(`\nCache status: ${cacheStatus.totalEntries} entries, ${cacheStatus.validEntries} valid`);
}

testWeatherApp();
