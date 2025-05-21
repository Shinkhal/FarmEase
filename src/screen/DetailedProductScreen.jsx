import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Dimensions,
  ToastAndroid,
  TextInput,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Footer from '../components/Footer';
import { colors } from '../utils/color';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = 350;

const ProductDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params;
  const scrollViewRef = useRef(null);
  const flatListRef = useRef(null);
  
  // State management
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [pincode, setPincode] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmittingCart, setIsSubmittingCart] = useState(false);
  const [isSubmittingPincode, setIsSubmittingPincode] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  // Memoized values
  const productImages = useMemo(() => {
    return product.images ? 
      product.images.map(image => `http://172.21.2.95:5000/uploads/${image}`) : 
      [];
  }, [product.images]);
  
  // Handle image change
  const handleImageChange = useCallback((event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentImageIndex(currentIndex);
  }, [SCREEN_WIDTH]);
  
  // Add to Cart Function
  const addToCart = useCallback(async (id, isBuyNow = false) => {
    setIsSubmittingCart(true);
    try {
      let itemArray = await AsyncStorage.getItem('cartItems');
      itemArray = JSON.parse(itemArray) || [];
      
      // Add multiple items based on quantity
      for (let i = 0; i < quantity; i++) {
        itemArray.push(id);
      }
      
      await AsyncStorage.setItem('cartItems', JSON.stringify(itemArray));
      ToastAndroid.show(
        isBuyNow ? 'Proceeding to checkout...' : 'Added to cart successfully!', 
        ToastAndroid.SHORT
      );
      
      if (isBuyNow) {
        navigation.navigate('Cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart. Please try again.');
    } finally {
      setIsSubmittingCart(false);
    }
  }, [quantity, navigation]);
  
  // Message Seller Function
  const handleMessageSeller = useCallback(() => {
    navigation.navigate('Messages', { sellerId: product.sellerId, productId: product.id });
  }, [navigation, product.id, product.sellerId]);
  
  // Share Product Function
  const handleShareProduct = useCallback(async () => {
    try {
      const imageUrl = productImages[0];
      const fileName = imageUrl.split('/').pop();
      const fileUri = FileSystem.documentDirectory + fileName;
      
      // Show share loading indicator
      ToastAndroid.show('Preparing to share...', ToastAndroid.SHORT);
      
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
      const message = `Check out this product: ${product.name}\n\nPrice: ₹${product.price}\nDescription: ${product.description}`;
      
      await Sharing.shareAsync(uri, {
        dialogTitle: `Check out this product: ${product.name}`,
        UTI: 'public.image',
        mimeType: 'image/jpeg',
        message,
      });
    } catch (error) {
      console.error("Error sharing product:", error);
      Alert.alert('Share Failed', 'Could not share this product. Please try again later.');
    }
  }, [productImages, product]);
  
  // Handle pincode submission
  const handlePincodeSubmit = useCallback(() => {
    if (!pincode || pincode.length !== 6) {
      Alert.alert('Invalid Pincode', 'Please enter a valid 6-digit pincode');
      return;
    }
    
    setIsSubmittingPincode(true);
    
    // Simulate API call to check delivery availability
    setTimeout(() => {
      setIsSubmittingPincode(false);
      Alert.alert(
        'Delivery Available', 
        `Delivery to pincode ${pincode} will take approximately 3-5 business days.`
      );
    }, 1000);
  }, [pincode]);
  
  // Handle review submission
  const handleReviewSubmit = useCallback(() => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating');
      return;
    }
    
    if (!review.trim()) {
      Alert.alert('Review Required', 'Please write your review');
      return;
    }
    
    setIsSubmittingReview(true);
    
    // Simulate API call to submit review
    setTimeout(() => {
      setIsSubmittingReview(false);
      Alert.alert('Thank You!', 'Your review has been submitted successfully.');
      setReview('');
      setRating(0);
    }, 1000);
  }, [rating, review]);
  
  // Quantity adjustment handlers
  const decrementQuantity = useCallback(() => {
    setQuantity(prev => Math.max(1, prev - 1));
  }, []);
  
  const incrementQuantity = useCallback(() => {
    setQuantity(prev => Math.min(10, prev + 1));
  }, []);
  
  // Smooth scroll to sections
  const scrollToSection = useCallback((yOffset) => {
    scrollViewRef.current?.scrollTo({ y: yOffset, animated: true });
  }, []);

  // Rendering helpers
  const renderImageItem = useCallback(({ item }) => (
    <View style={styles.imageWrapper}>
      <Image source={{ uri: item }} style={styles.productImage} />
    </View>
  ), []);

  const renderDotIndicator = useCallback(() => (
    <View style={styles.dotContainer}>
      {productImages.map((_, index) => (
        <View 
          key={index} 
          style={[
            styles.dot, 
            { backgroundColor: index === currentImageIndex ? colors.primary : colors.gray }
          ]} 
        />
      ))}
    </View>
  ), [productImages, currentImageIndex]);
  
  // Render section titles with jump links
  const renderSectionTitle = useCallback((title, onPress) => (
    <View style={styles.sectionTitleContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onPress && (
        <TouchableOpacity onPress={onPress}>
          <Ionicons name="chevron-down" size={20} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.jade} barStyle="light-content" />
      
      {/* Header with Back and Share Buttons */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Product Details</Text>
        
        <TouchableOpacity style={styles.headerButton} onPress={handleShareProduct}>
          <Ionicons name="share-social" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Product Images Gallery */}
        <View style={styles.imageContainer}>
          <FlatList
            ref={flatListRef}
            data={productImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={renderImageItem}
            onScroll={handleImageChange}
            keyExtractor={(_, index) => `image-${index}`}
            snapToInterval={SCREEN_WIDTH}
            decelerationRate="fast"
          />
          {renderDotIndicator()}
        </View>
        
        {/* Product Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>₹{product.price}</Text>
          
          {/* Product Rating Summary (Placeholder) */}
          <View style={styles.ratingRow}>
            <View style={styles.ratingStars}>
              {[...Array(5)].map((_, i) => (
                <Ionicons 
                  key={i}
                  name={i < Math.floor(4.5) ? "star" : i + 0.5 <= 4.5 ? "star-half" : "star-outline"}
                  size={16}
                  color="#FFD700"
                />
              ))}
            </View>
            <Text style={styles.ratingText}>4.5 (120 reviews)</Text>
          </View>
          
          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantitySelectorContainer}>
              <TouchableOpacity
                style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                onPress={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Ionicons name="remove" size={20} color={quantity <= 1 ? colors.secondary : colors.primary} />
              </TouchableOpacity>
              
              <View style={styles.quantityValueContainer}>
                <Text style={styles.quantityValue}>{quantity}</Text>
              </View>
              
              <TouchableOpacity
                style={[styles.quantityButton, quantity >= 10 && styles.quantityButtonDisabled]}
                onPress={incrementQuantity}
                disabled={quantity >= 10}
              >
                <Ionicons name="add" size={20} color={quantity >= 10 ? colors.secondary : colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Description Section */}
        <View style={styles.sectionCard}>
          {renderSectionTitle('Description')}
          <Text style={styles.descriptionText}>{product.description || 'No description available for this product.'}</Text>
        </View>
        
        {/* Delivery Section */}
        <View style={styles.sectionCard}>
          {renderSectionTitle('Check Delivery Availability')}
          <View style={styles.pincodeContainer}>
            <View style={styles.pincodeInputWrapper}>
              <Ionicons name="location-outline" size={20} color={colors.primary} />
              <TextInput
                style={styles.pincodeInput}
                placeholder="Enter 6-digit pincode"
                value={pincode}
                onChangeText={setPincode}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.pincodeButton} 
              onPress={handlePincodeSubmit}
              disabled={isSubmittingPincode}
            >
              {isSubmittingPincode ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Check</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Seller Section */}
        <View style={styles.sectionCard}>
          {renderSectionTitle('Seller Information')}
          <View style={styles.sellerContainer}>
            <View style={styles.sellerInfo}>
              <View style={styles.sellerAvatarContainer}>
                <Text style={styles.sellerAvatarText}>
                  {(product.sellerName || 'Seller').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.sellerName}>{product.sellerName || 'Eco-friendly Store'}</Text>
                <Text style={styles.sellerRating}>
                  <Ionicons name="star" size={14} color="#FFD700" /> 4.8 • Seller since 2023
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.messageSellerButton} 
              onPress={handleMessageSeller}
            >
              <Ionicons name="chatbubble-outline" size={18} color={colors.white} />
              <Text style={styles.messageSellerText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Review Section */}
        <View style={styles.sectionCard}>
          {renderSectionTitle('Write a Review')}
          
          {/* Star Rating */}
          <View style={styles.reviewRatingContainer}>
            {[...Array(5)].map((_, i) => (
              <TouchableOpacity 
                key={i} 
                onPress={() => setRating(i + 1)}
              >
                <Ionicons 
                  name={i < rating ? "star" : "star-outline"} 
                  size={32} 
                  color={i < rating ? "#FFD700" : colors.secondary} 
                />
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Review Input */}
          <TextInput
            style={styles.reviewInput}
            placeholder="Share your experience with this product..."
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={4}
          />
          
          {/* Submit Review Button */}
          <TouchableOpacity 
            style={styles.submitReviewButton} 
            onPress={handleReviewSubmit}
            disabled={isSubmittingReview}
          >
            {isSubmittingReview ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Submit Review</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Bottom Action Buttons */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity 
          style={[styles.cartButton, isSubmittingCart && styles.disabledButton]} 
          onPress={() => addToCart(product.id)}
          disabled={isSubmittingCart}
        >
          {isSubmittingCart ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Ionicons name="cart-outline" size={22} color={colors.white} />
              <Text style={styles.buttonText}>Add to Cart</Text>
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.buyButton, isSubmittingCart && styles.disabledButton]} 
          onPress={() => addToCart(product.id, true)}
          disabled={isSubmittingCart}
        >
          {isSubmittingCart ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Buy Now</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Footer */}
      <View style={styles.footerContainer}>
        <Footer />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.jade,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 10,
    paddingHorizontal: 15,
    elevation: 3,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    backgroundColor: colors.white,
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  productImage: {
    width: SCREEN_WIDTH * 0.9,
    height: IMAGE_HEIGHT * 0.9,
    resizeMode: 'contain',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 16,
    margin: 12,
    marginTop: -25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.sunflower,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    color: colors.primary,
    fontSize: 14,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quantityLabel: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  quantitySelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.greentea,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityValueContainer: {
    minWidth: 40,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 16,
    margin: 12,
    marginTop: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.primary,
  },
  pincodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  pincodeInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
  },
  pincodeInput: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 15,
    color: colors.primary,
  },
  pincodeButton: {
    backgroundColor: colors.softforest,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sellerAvatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.jade,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sellerAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  sellerRating: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 2,
  },
  messageSellerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.softforest,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  messageSellerText: {
    color: colors.white,
    fontWeight: '500',
    marginLeft: 6,
  },
  reviewRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    marginTop: 8,
  },
  submitReviewButton: {
    backgroundColor: colors.softforest,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 16,
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 50, // Adjust based on your Footer height
    left: 0,
    right: 0,
  },
  cartButton: {
    flex: 1,
    backgroundColor: colors.jade,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 8,
  },
  buyButton: {
    flex: 1,
    backgroundColor: colors.softforest,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 25,
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
  },
});

export default ProductDetailsScreen;