import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

const WeatherApp = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const requestPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      fetchWeatherData(loc.coords.latitude, loc.coords.longitude);
    };

    requestPermissions();
  }, []);

  const fetchWeatherData = async (latitude, longitude) => {
    const API_KEY = '0685965d6a0e515a84392f7cf47266ed'; // Replace with your OpenWeatherMap API key
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
      const json = await response.json();
      setWeatherData(json);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      {weatherData && (
        <Text style={styles.weatherInfo}>
          Temperature: {weatherData.main.temp}°C
          {'\n'}Weather: {weatherData.weather[0].description}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
  weatherInfo: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default WeatherApp;