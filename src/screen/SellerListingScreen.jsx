import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../utils/color';
import FarmerFooter from '../components/FarmerFooter';
import axios from 'axios';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Base URL for API calls
const API_BASE_URL = 'http://192.168.29.146:5000';

const SellerListingScreen = () => {
  const [products, setProducts] = useState([]);
  const [biddingProducts, setBiddingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Retrieve the email from AsyncStorage
      const email = await AsyncStorage.getItem('userEmail');

      if (email) {
        // Fetch products for the specific email
        const response = await axios.get(`${API_BASE_URL}/products/${email}`);
        
        // Separate regular products from bidding products (for demo, just splitting the array)
        // In a real app, you'd filter based on a property like 'isBidding'
        const allProducts = response.data;
        
        // For demo purposes, let's just split the array
        // In a real app, you would filter based on some property like item.isBidding
        setProducts(allProducts);
        
        // For demonstration, let's filter every other product for bidding
        // In real app, you should filter based on actual data property
        setBiddingProducts(allProducts.filter((_, index) => index % 2 === 0));
      } else {
        console.error('No email found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch products on load
  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const navigateToProductDetails = (product) => {
    // Navigate to product details screen with product data
    navigation.navigate('ProductDetails', { product });
  };

  // Empty state component
  const EmptyListComponent = ({ message }) => (
    <View style={styles.emptyContainer}>
      <FontAwesome5 name="box-open" size={50} color={colors.secondary} />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );

  // Product card component
  const ProductCard = ({ item, isBidding = false }) => {
    // Format price with commas for thousands
    const formattedPrice = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(item.price || 0);

    return (
      <TouchableOpacity 
        style={styles.listingCard}
        onPress={() => navigateToProductDetails(item)}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: `${API_BASE_URL}/uploads/${item.images[0]}` }} 
            style={styles.productImage} 
            resizeMode="cover"
          />
          {isBidding && (
            <View style={styles.bidBadge}>
              <Text style={styles.bidText}>Bidding</Text>
            </View>
          )}
        </View>
        
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.productPrice}>{formattedPrice}</Text>
          
          {isBidding ? (
            <View style={styles.biddingDetails}>
              <View style={styles.infoRow}>
                <FontAwesome5 name="users" size={12} color={colors.secondary} />
                <Text style={styles.infoText}>5 bids</Text>
              </View>
              <View style={styles.infoRow}>
                <FontAwesome5 name="clock" size={12} color={colors.softforest} />
                <Text style={styles.timeText}>2 days left</Text>
              </View>
            </View>
          ) : (
            <View style={styles.inventoryRow}>
              <MaterialIcons name="inventory" size={12} color={colors.secondary} />
              <Text style={styles.inventoryText}>Stock: {item.quantity || 0}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" color={colors.softforest} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Products</Text>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ADDPRODUCT')}>
          <Ionicons name="add" color={colors.white} size={22} />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.softforest} />
          <Text style={styles.loadingText}>Loading your products...</Text>
        </View>
      ) : (
        <ScrollView 
          showsHorizontalScrollIndicator={false} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.softforest]} />
          }
        >
          {/* Regular Products Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Listings</Text>
              <TouchableOpacity style={styles.viewAll}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {products.length > 0 ? (
              <FlatList
                horizontal
                data={products}
                renderItem={({ item }) => <ProductCard item={item} />}
                keyExtractor={(item) => item._id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <EmptyListComponent message="No products listed yet. Add your first product!" />
            )}
          </View>

          {/* Bidding Products Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Items up for Bidding</Text>
              <TouchableOpacity style={styles.viewAll}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {biddingProducts.length > 0 ? (
              <FlatList
                horizontal
                data={biddingProducts}
                renderItem={({ item }) => <ProductCard item={item} isBidding={true} />}
                keyExtractor={(item) => `bid-${item._id}`}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <EmptyListComponent message="No items up for bidding. Start an auction!" />
            )}
          </View>

          {/* Product Analytics Summary */}
          <View style={styles.analyticsSummary}>
            <Text style={styles.analyticsTitle}>Product Performance</Text>
            
            <View style={styles.analyticsContainer}>
              <View style={styles.analyticsCard}>
                <View style={[styles.iconCircle, {backgroundColor: colors.sourapple + '40'}]}>
                  <FontAwesome5 name="eye" size={16} color={colors.softforest} />
                </View>
                <View>
                  <Text style={styles.analyticsValue}>1,287</Text>
                  <Text style={styles.analyticsLabel}>Views</Text>
                </View>
              </View>
              
              <View style={styles.analyticsCard}>
                <View style={[styles.iconCircle, {backgroundColor: colors.sunflower + '40'}]}>
                  <FontAwesome5 name="shopping-cart" size={16} color={colors.sunflower} />
                </View>
                <View>
                  <Text style={styles.analyticsValue}>36</Text>
                  <Text style={styles.analyticsLabel}>Orders</Text>
                </View>
              </View>
              
              <View style={styles.analyticsCard}>
                <View style={[styles.iconCircle, {backgroundColor: colors.jade + '40'}]}>
                  <FontAwesome5 name="rupee-sign" size={16} color={colors.softforest} />
                </View>
                <View>
                  <Text style={styles.analyticsValue}>₹8,750</Text>
                  <Text style={styles.analyticsLabel}>Revenue</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
      
      <FarmerFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.jade + '30',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.softforest,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: colors.softforest,
    fontSize: 16,
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  viewAll: {
    padding: 4,
  },
  viewAllText: {
    color: colors.softforest,
    fontWeight: '600',
    fontSize: 14,
  },
  listContainer: {
    paddingRight: 16,
    paddingBottom: 8,
  },
  listingCard: {
    width: width * 0.4,
    marginRight: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 4,
    marginTop: 4,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: width * 0.3,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  bidBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.sunflower,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  bidText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 10,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.softforest,
    marginBottom: 6,
  },
  inventoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  inventoryText: {
    marginLeft: 6,
    fontSize: 12,
    color: colors.secondary,
  },
  biddingDetails: {
    marginTop: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 6,
    fontSize: 12,
    color: colors.secondary,
  },
  timeText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: colors.softforest,
  },
  emptyContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    marginVertical: 10,
    padding: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.secondary,
    textAlign: 'center',
  },
  analyticsSummary: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
  },
  analyticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  analyticsCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  analyticsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  analyticsLabel: {
    fontSize: 12,
    color: colors.secondary,
  }
});

export default SellerListingScreen;