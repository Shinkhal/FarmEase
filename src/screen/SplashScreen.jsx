import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const userRole = await AsyncStorage.getItem('userRole'); // Retrieve user role from AsyncStorage

        if (userToken && userRole) {
          if (userRole === 'farmer') {
            navigation.navigate('SELLER'); // Navigate to seller screen for farmers
          } else if (userRole === 'consumer') {
            navigation.navigate('BUYER'); // Navigate to buyer screen for consumers
          }
        } else {
          navigation.navigate('HOME'); // Not logged in, go to login
        }
      } catch (e) {
        console.log('Error checking login status or user role:', e);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, [navigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
};

export default SplashScreen;
