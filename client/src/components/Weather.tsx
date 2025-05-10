import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind } from "lucide-react";
import { formatDate } from "@/lib/utils/date";

// Use environment variable or the API proxy endpoint
const WEATHER_API_BASE = "/api/weather";

interface WeatherData {
  location: string;
  date: string;
  temperature: number;
  conditions: string;
  icon: string;
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Get user's location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Call our backend weather API proxy
          const weatherResponse = await fetch(
            `${WEATHER_API_BASE}?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          );
          
          if (!weatherResponse.ok) {
            throw new Error("Failed to fetch weather data");
          }
          
          const weatherData = await weatherResponse.json();
          
          setWeather({
            location: weatherData.location,
            date: weatherData.date,
            temperature: weatherData.temperature,
            conditions: weatherData.conditions,
            icon: weatherData.icon,
          });
          
          setLoading(false);
        } catch (error) {
          console.error("Weather fetch error:", error);
          
          // Fallback data if the API is unavailable
          setWeather({
            location: "Your Location",
            date: formatDate(new Date(), 'EEE, d MMM'),
            temperature: 25,
            conditions: "Weather data unavailable",
            icon: "1",
          });
          
          setLoading(false);
          
          toast({
            title: "Weather data unavailable",
            description: "Could not access weather information",
            variant: "destructive",
          });
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        
        // Fallback for when location is denied
        setWeather({
          location: "Location Unknown",
          date: formatDate(new Date(), 'EEE, d MMM'),
          temperature: 25,
          conditions: "Enable location access",
          icon: "1",
        });
        
        setLoading(false);
        
        toast({
          title: "Location access denied",
          description: "Please enable location access for weather updates",
          variant: "destructive",
        });
      }
    );
  }, [toast]);
  
  // Weather icon based on conditions
  const getWeatherIcon = (iconCode: string) => {
    const code = parseInt(iconCode);
    
    // Sunny
    if ([1, 2, 3, 4, 5].includes(code)) {
      return <Sun className="text-amber-400 text-lg" />;
    }
    // Cloudy
    else if ([6, 7, 8, 9, 10, 11].includes(code)) {
      return <Cloud className="text-gray-400 text-lg" />;
    }
    // Rainy
    else if ([12, 13, 14, 15, 16, 17, 18].includes(code)) {
      return <CloudRain className="text-blue-400 text-lg" />;
    }
    // Snowy
    else if ([19, 20, 21, 22, 23, 24, 25, 26, 29].includes(code)) {
      return <CloudSnow className="text-blue-200 text-lg" />;
    }
    // Stormy
    else if ([15, 16, 17, 41, 42].includes(code)) {
      return <CloudLightning className="text-amber-400 text-lg" />;
    }
    // Windy
    else if ([32, 33, 34, 35].includes(code)) {
      return <Wind className="text-gray-400 text-lg" />;
    }
    // Default
    else {
      return <Sun className="text-amber-400 text-lg" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-neutral-100 p-3 rounded-lg animate-pulse">
        <div className="h-5 bg-neutral-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 p-3 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{weather?.location}</p>
          <p className="text-xs text-neutral-500">{weather?.date}</p>
        </div>
        <div className="flex items-center">
          {weather && getWeatherIcon(weather.icon)}
          <span className="text-lg font-medium ml-1">{weather?.temperature}°C</span>
        </div>
      </div>
    </div>
  );
}
