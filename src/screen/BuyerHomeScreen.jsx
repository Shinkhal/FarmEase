import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  StatusBar,
  RefreshControl,
  ImageBackground,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Carousel from 'react-native-snap-carousel';

import Footer from '../components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { fetchProducts } from '../services/api';

const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.7;
const ITEM_HEIGHT = ITEM_WIDTH * 1.2;
const SPACING = 10;

const colors = {
  primary: '#27AE60',
  secondary: '#2ECC71',
  accent: '#F1C40F',
  dark: '#2C3E50',
  light: '#ECF0F1',
  white: '#FFFFFF',
  error: '#E53935',
};

const BuyerHomeScreen = () => {
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const carouselRef = useRef(null);
  const bannerAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // States
  const [userName, setUserName] = useState('Guest');
  const [city, setCity] = useState('Your City');
  const [products, setProducts] = useState([]);
  const [biddingProducts, setBiddingProducts] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Fruits', icon: 'fruit-apple' },
    { id: 2, name: 'Vegetables', icon: 'food-apple' },
    { id: 3, name: 'Grains', icon: 'grain' },
    { id: 4, name: 'Dairy', icon: 'cup' },
    { id: 5, name: 'Others', icon: 'dots-horizontal' },
  ]);
  const [banners, setBanners] = useState([
    { id: 1, image: 'https://image-placeholder.com/images/actual-size/180x240.png', title: 'Seasonal Sale' },
    { id: 2, image: 'https://image-placeholder.com/images/actual-size/180x240.png', title: 'Fresh Picks' },
  ]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState({ temp: '22°C', condition: 'Sunny' });

  useEffect(() => {
    // Initialize data
    initializeData();
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(bannerAnimation, {
            toValue: 1,
            duration: 20000,
            useNativeDriver: true,
          }),
          Animated.timing(bannerAnimation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getUserName();
      StatusBar.setBackgroundColor(colors.primary);
      StatusBar.setBarStyle('light-content');
      return () => {};
    }, [])
  );

  // Initialize all data
  const initializeData = async () => {
    try {
      await Promise.all([
        getUserName(),
        getUserLocation(),
        getProducts(),
      ]);
    } catch (error) {
      console.error('Error initializing data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get user name from storage
  const getUserName = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      if (name) setUserName(name);
    } catch (error) {
      console.log('Failed to fetch user name', error);
    }
  };

  // Get user location and city
  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const { coords } = await Location.getCurrentPositionAsync({});
      if (coords) {
        const result = await Location.reverseGeocodeAsync({
          latitude: coords.latitude,
          longitude: coords.longitude
        });
        
        if (result.length > 0) {
          setCity(result[0]?.city || 'Your City');
        }
      }
    } catch (error) {
      console.error('Failed to get location', error);
    }
  };

  // Fetch products from API
  const getProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data.slice(0, 6)); // First 6 products
      setBiddingProducts(data.slice(0, 4).map(p => ({
        ...p,
        currentBid: Math.floor(Math.random() * 100) + 50,
        timeLeft: Math.floor(Math.random() * 24) + 1 + ' hours',
        bidCount: Math.floor(Math.random() * 10) + 1,
      })));
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await initializeData();
    setRefreshing(false);
  };

  // Animation values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [height * 0.2, height * 0.1],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const translateX = bannerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [width, -width * 2],
  });

  // Product item renderer
  const renderProductItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.productGradient}
        />
        
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.productPrice}>₹{Math.floor(Math.random() * 100) + 50}/kg</Text>
        </View>
        
        <TouchableOpacity style={styles.addToCartButton}>
          <Ionicons name="add" size={18} color={colors.white} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderBiddingItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.biddingCard}
        onPress={() => navigation.navigate('BiddingDetails', { product: item })}
        activeOpacity={0.9}
      >
        <ImageBackground
          source={{ uri: `http://10.35.138.29:5000/uploads/${item.images[0]}` }}
          style={styles.biddingImage}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.biddingGradient}
          />
          
          <BlurView intensity={80} style={styles.bidInfo}>
            <View style={styles.bidDetails}>
              <Text style={styles.bidLabel}>Current Bid</Text>
              <Text style={styles.bidValue}>₹{item.currentBid}</Text>
            </View>
            
            <View style={styles.bidTimeContainer}>
              <Ionicons name="time-outline" size={16} color={colors.white} />
              <Text style={styles.bidTimeText}>{item.timeLeft} left</Text>
            </View>
          </BlurView>
        </ImageBackground>
        
        <View style={styles.biddingContent}>
          <Text style={styles.biddingTitle} numberOfLines={1}>{item.name}</Text>
          <TouchableOpacity style={styles.placeBidButton}>
            <Text style={styles.placeBidText}>Bid Now</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderBanner = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.bannerItemContainer}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Promotions', { banner: item })}
      >
        <Image source={{ uri: item.image }} style={styles.bannerImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.bannerGradient}
        >
          <Text style={styles.bannerTitle}>{item.title}</Text>
          <TouchableOpacity style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>View Offers</Text>
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderCategory = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => navigation.navigate('CategoryProducts', { category: item })}
      >
        <View style={styles.categoryIconContainer}>
          <MaterialCommunityIcons name={item.icon} size={24} color={colors.primary} />
        </View>
        <Text style={styles.categoryName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading FarmEase</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            height: headerHeight,
            opacity: headerOpacity,
          }
        ]}
      >
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTopRow}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.openDrawer()}
              >
                <Ionicons name="menu" size={24} color={colors.white} />
              </TouchableOpacity>
              
              <Text style={styles.appName}>FARMEASE</Text>
              
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  style={styles.headerActionButton}
                  onPress={() => navigation.navigate('Cart')}
                >
                  <Ionicons name="cart-outline" size={22} color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.searchBar}
              onPress={() => navigation.navigate('Search')}
            >
              <Ionicons name="search" size={16} color={colors.dark} />
              <Text style={styles.searchPlaceholder}>Search for fresh produce...</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        {/* User Greeting Section */}
        <Animated.View 
          style={[
            styles.greetingSection,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.greetingContent}>
            <View>
              <Text style={styles.greeting}>Hello, {userName}</Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color={colors.primary} />
                <Text style={styles.locationText}>{city}</Text>
              </View>
            </View>
            
            <View style={styles.weatherWidget}>
              <Ionicons name="sunny-outline" size={24} color={colors.accent} />
              <Text style={styles.weatherTemp}>{weatherInfo.temp}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            horizontal
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Banner Carousel */}
        <View style={styles.carouselSection}>
          <Carousel
            ref={carouselRef}
            data={banners}
            renderItem={renderBanner}
            sliderWidth={width - 30}
            itemWidth={width - 60}
            loop={true}
            autoplay={true}
            autoplayInterval={5000}
          />
        </View>

        {/* Scrolling Banner Text */}
        <View style={styles.scrollingBannerContainer}>
          <View style={styles.announcementIcon}>
            <FontAwesome name="bullhorn" size={16} color={colors.white} />
          </View>
          
          <View style={styles.scrollingTextWrapper}>
            <Animated.Text 
              style={[
                styles.bannerText,
                { transform: [{ translateX }] },
              ]}
            >
              🌱 Fresh harvest festival this weekend! 🌽 Up to 50% off on organic products!
            </Animated.Text>
          </View>
        </View>

        {/* Recommended Products */}
        <View style={styles.productsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended For You</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllProducts')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            horizontal
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </View>

        {/* Available for Bidding */}
        <View style={styles.biddingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Auctions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllBiddings')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            horizontal
            data={biddingProducts}
            renderItem={renderBiddingItem}
            keyExtractor={(item) => item._id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.biddingList}
          />
        </View>
      </ScrollView>
    
        <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  header: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100,
  },
  headerGradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
    paddingHorizontal: 15,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
    padding: 5,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionButton: {
    padding: 5,
    marginLeft: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
  },
  searchPlaceholder: {
    color: '#A0A0A0',
    marginLeft: 10,
    fontSize: 14,
  },
  scrollViewContent: {
    paddingTop: height * 0.22,
    paddingBottom: 90,
  },
  greetingSection: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  greetingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 4,
    color: colors.primary,
    fontSize: 12,
  },
  weatherWidget: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
  },
  weatherTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: 5,
  },
  categoriesSection: {
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
  },
  categoriesList: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: 80,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.dark,
    textAlign: 'center',
  },
  carouselSection: {
    marginBottom: 20,
  },
  bannerItemContainer: {
    height: width * 0.45,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  bannerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    justifyContent: 'flex-end',
    padding: 15,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 10,
  },
  bannerButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.dark,
  },
  scrollingBannerContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 30,
    marginHorizontal: 15,
    marginBottom: 20,
    height: 40,
    alignItems: 'center',
    overflow: 'hidden',
  },
  announcementIcon: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollingTextWrapper: {
    flex: 1,
    overflow: 'hidden',
    height: 40,
    justifyContent: 'center',
  },
  bannerText: {
    fontSize: 14,
    color: colors.dark,
    paddingHorizontal: 10,
    width: width * 3,
  },
  productsSection: {
    marginBottom: 20,
  },
  productsList: {
    paddingLeft: 10,
    paddingRight: 5,
  },
  productCard: {
    width: width * 0.42,
    margin: 5,
    backgroundColor: colors.white,
    borderRadius: 15,
    overflow: 'hidden',
    height: 200,
  },
  productImage: {
    width: '100%',
    height: '65%',
  },
  productGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '65%',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  biddingSection: {
    marginBottom: 20,
  },
  biddingList: {
    paddingLeft: 15,
    paddingRight: 10,
  },
  biddingCard: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    marginRight: SPACING,
    backgroundColor: colors.white,
    borderRadius: 15,
    overflow: 'hidden',
  },
  biddingImage: {
    height: '70%',
    width: '100%',
    justifyContent: 'flex-end',
  },
  biddingGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  bidInfo: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bidDetails: {},
  bidLabel: {
    fontSize: 10,
    color: colors.white,
    opacity: 0.8,
  },
  bidValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  bidTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231, 76, 60, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bidTimeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.white,
    marginLeft: 4,
  },
  biddingContent: {
    padding: 15,
    height: '30%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  biddingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    flex: 1,
  },
  placeBidButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  placeBidText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
  },
  
});

export default BuyerHomeScreen;