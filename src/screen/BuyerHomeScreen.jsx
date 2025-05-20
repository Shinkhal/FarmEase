import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Location from 'expo-location';
import { colors } from '../utils/color';

const { width } = Dimensions.get('window'); // Get device width for responsive styles

const BuyerHomeScreen = () => {
  const navigation = useNavigation();
  
  // State to hold the user's name and location
  const [userName, setUserName] = useState('User');
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState('Your City');
  
  // State for API data
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // For scrolling animation
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        setUserName(name || 'Guest'); // Fallback to 'Guest' if name is not available
      } catch (error) {
        console.log('Failed to fetch user name from AsyncStorage', error);
      }
    };

    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);

      const reverseGeocode = async (latitude, longitude) => {
        try {
          let result = await Location.reverseGeocodeAsync({ latitude, longitude });
          if (result.length > 0) {
            setCity(result[0]?.city || 'Your City');
          }
        } catch (error) {
          console.error('Failed to get city name', error);
        }
      };

      reverseGeocode(coords.latitude, coords.longitude);
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://192.168.29.146:5000/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products', error);
        setLoading(false);
      }
    };

    fetchUserName();
    fetchLocation();
    fetchProducts();
  }, []);

  // Infinite horizontal scroll animation for banner text
  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.timing(scrollX, {
          toValue: 1,
          duration: 5000, // Increased speed by reducing duration (was 8000)
          useNativeDriver: true,
        })
      ).start();
    };
    startAnimation();
  }, [scrollX]);

  const translateX = scrollX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width], // Moves the text off the screen and back
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        showsHorizontalScrollIndicator={false} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* App Header */}
        <View style={styles.appHeader}>
          <Text style={styles.appName}>FARMEASE</Text>
          <Ionicons name="search-outline" size={24} color="#333" />
        </View>

        {/* User Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Hello, {userName}!</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color={colors.primary} />
            <Text style={styles.locationText}>{city}</Text>
          </View>
        </View>

        {/* Banner Container */}
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: 'https://image-placeholder.com/images/actual-size/180x240.png' }} // Replace with your banner image URL
            style={styles.bannerImage}
          />
        </View>

        {/* Scrolling Banner Text */}
        <View>
          <Animated.View style={[styles.bannerTextContainer, { transform: [{ translateX }] }]} >
            <Text style={styles.bannerText}>
              Latest Offers! Up to 50% off on selected items! Latest Offers! Up to 50% off on selected items!
            </Text>
          </Animated.View>
        </View>

        {/* Recommended Products */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended Products</Text>
        </View>
        <FlatList
          horizontal
          data={products}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listingCard}
              onPress={() => navigation.navigate('ProductDetails', { product: item })}
              activeOpacity={0.8}
            >
              <Image source={{ uri: `http://10.35.138.29:5000/uploads/${item.images[0]}` }} style={styles.productImage} />
              <Text style={styles.productName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id.toString()}
          showsHorizontalScrollIndicator={false}
        />
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available for Bidding</Text>
        </View>
        <FlatList
          horizontal
          data={products}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[ styles.accessoryCard]}
              onPress={() => navigation.navigate('ProductDetails', { product: item })}
              activeOpacity={0.8}
            >
              <Image source={{ uri: `http://10.35.138.29:5000/uploads/${item.images[0]}` }} style={styles.biddingImage} />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={[styles.productStatus, item.isAvailable ? styles.available : styles.unavailable]}>
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
      <View style={styles.footer}>
        <Footer />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greentea,
    padding:15
  },
  scrollViewContent: {
    paddingBottom: 60, 
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign:'center'
  },
  greetingSection: {
    marginBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerContainer: {
    width: '100%',
    height: width * 0.4, // Responsive height based on width
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 5, // Android shadow effect
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerTextContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-end', // Align text to start
    overflow: 'hidden',
    width: '200%',
    marginBottom: 20
  },
  bannerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'left', // Align text left for continuity
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  
  listingCard: {
    alignItems: 'center',
      margin: 10,
      backgroundColor: colors.jade,
      borderRadius: 10,
      overflow: 'hidden',
      elevation: 4, // Android shadow
      padding: 10,
      width: width * 0.5,
      height:200

  },
  productImage: {
    width: '100%',
    height: '80%',
    borderRadius: 10,
    marginBottom: 5,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  accessoryCard: {
    borderWidth: 1,
    borderColor: colors.primary,
    height:250,
    alignItems: 'center',
    margin: 10,
    backgroundColor: colors.jade,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 4, // Android shadow
    padding: 10,
    width: width * 0.5,

  },
  biddingImage: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
    marginBottom: 5,
  },
  productStatus: {
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    color: '#fff',
  },
  available: {
    backgroundColor: 'green',
  },
  unavailable: {
    backgroundColor: 'red',
  },
});

export default BuyerHomeScreen;
