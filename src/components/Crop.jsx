// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, StyleSheet, Alert } from 'react-native';
// import * as Location from 'expo-location';

// const CropRecommenderApp = () => {
//   // State to store the prediction result
//   const [prediction, setPrediction] = useState('');

//   // State to store weather and soil data
//   const [weatherAndSoilData, setWeatherAndSoilData] = useState({
//     N: 0,
//     P: 0,
//     K: 0,
//     temperature: 0,
//     humidity: 0,
//     ph: 0,
//     rainfall: 0
//   });

//   useEffect(() => {
//     // Fetch weather and soil data on mount
//     const fetchWeatherAndSoilData = async () => {
//       try {
//         // Get user's location
//         let { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== 'granted') {
//           Alert.alert('Permission required', 'Location permission is required to fetch weather and soil data.');
//           return;
//         }

//         let location = await Location.getCurrentPositionAsync({});
//         const { latitude, longitude } = location.coords;

//         // Fetch weather data
//         const API_KEY = '0685965d6a0e515a84392f7cf47266ed'; 
//         const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
//         const weatherData = await weatherResponse.json();
//         const temperatureAvg = weatherData.main.temp;
//         const humidityAvg = weatherData.main.humidity;

//         // Fetch soil data from Tomorrow.io
//         const soilResponse = await fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${latitude},${longitude}&apikey=zyJd8JsQ5RpSKqepzPh1qJ3qJwBkqsbs`);
//         const soilData = await soilResponse.json();
//         const rainfall = soilData.timelines.daily[0].values.precipitationSum;

//         // Fetch soil properties
//         const soilPropertiesResponse = await fetch(`https://rest.isric.org/soilgrids/v2.0/properties/query?lat=${latitude}&lon=${longitude}`);
//         const soilPropertiesData = await soilPropertiesResponse.json();
//         const pH_value = soilPropertiesData.properties.layers[7].depths[0].values.mean;
//         const Nitrogen_content = soilPropertiesData.properties.layers[4].depths[0].values.mean;
//         const Phosphorus_content = soilPropertiesData.properties.layers[5].depths[0].values.mean;  // Example data
//         const Potassium_content = soilPropertiesData.properties.layers[6].depths[0].values.mean;  // Example data

//         // Update state with fetched data
//         setWeatherAndSoilData({
//           N: Nitrogen_content,
//           P: Phosphorus_content,
//           K: Potassium_content,
//           temperature: temperatureAvg,
//           humidity: humidityAvg,
//           ph: pH_value,
//           rainfall: rainfall
//         });
//       } catch (error) {
//         console.error(error);
//         Alert.alert('Error', 'Failed to fetch weather and soil data.');
//       }
//     };

//     fetchWeatherAndSoilData();
//   }, []);

//   // Function to handle crop recommendation
//   const handleRecommendCrop = async () => {
//     try {
//       // Combine fetched data into payload
//       const payload = {
//         N: weatherAndSoilData.N,
//         P: weatherAndSoilData.P,
//         K: weatherAndSoilData.K,
//         temperature: weatherAndSoilData.temperature,
//         humidity: weatherAndSoilData.humidity,
//         ph: weatherAndSoilData.ph,
//         rainfall: weatherAndSoilData.rainfall
//       };

//       const response = await fetch('https://crop-recommender-ml.onrender.com/predict', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       const json = await response.json();
//       setPrediction(json.prediction);  // Update the state with the prediction result
//     } catch (error) {
//       Alert.alert('Error', 'Failed to fetch the prediction.');
//       console.error(error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Button title="Get Crop Recommendation" onPress={handleRecommendCrop} />
//       {prediction ? <Text style={styles.result}>Recommended Crop: {prediction}</Text> : null}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     justifyContent: 'center',
//   },
//   result: {
//     marginTop: 20,
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default CropRecommenderApp;

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const CropRecommenderApp = () => {
  // State to hold the prediction result
  const [cropRecommendation, setCropRecommendation] = useState(null);

  // Function to hit the API with default payload
  const getCropRecommendation = async () => {
    try {
      // Default payload
      const payload = {
        N: 50,
        P: 30,
        K: 40,
        temperature: 25.0,
        humidity: 60.0,
        ph: 6.5,
        rainfall: 100.0
      };

      // Making POST request to the API
      const response = await fetch('https://crop-recommender-ml.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(payload).toString()
      });

      // Parsing the response JSON
      const text = await response.text();
      const regex = /Recommended Crop: (\w+)/;
      const match = text.match(regex);

      // Setting the crop recommendation if found
      if (match && match[1]) {
        setCropRecommendation(match[1]);
      } else {
        Alert.alert("Error", "Failed to fetch the crop recommendation.");
      }

    } catch (error) {
      Alert.alert("Error", "Something went wrong while fetching the data.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crop Recommender</Text>
      <Button
        title="Get Crop Recommendation"
        onPress={getCropRecommendation}
      />
      {cropRecommendation && (
        <Text style={styles.result}>Recommended Crop: {cropRecommendation}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
});

export default CropRecommenderApp;