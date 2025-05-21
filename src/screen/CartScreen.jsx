import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
  TextInput
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const colors = {
  primary: '#27AE60',
  secondary: '#2ECC71',
  dark: '#2C3E50',
  light: '#ECF0F1',
  white: '#FFFFFF',
  error: '#E53935',
  success: '#43A047',
};

const CartScreen = () => {
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  
  // States
  const [cartItems, setCartItems] = useState([
    {
      _id: '1',
      name: 'Fresh Tomatoes',
      price: 40,
      quantity: 2,
      image: 'tomato.jpg',
      seller: 'Green Farm',
      unit: 'kg'
    },
    {
      _id: '2',
      name: 'Organic Carrots',
      price: 35,
      quantity: 1,
      image: 'carrot.jpg',
      seller: 'Hill Top Farms',
      unit: 'kg'
    },
    {
      _id: '3',
      name: 'Green Spinach Bundle',
      price: 25,
      quantity: 3,
      image: 'spinach.jpg',
      seller: 'Nature Harvest',
      unit: 'bundle'
    },
    {
      _id: '4',
      name: 'Brown Rice',
      price: 60,
      quantity: 2,
      image: 'rice.jpg',
      seller: 'Organic Valley',
      unit: 'kg'
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [promocode, setPromocode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(buttonAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Load cart items from storage
    loadCartItems();
  }, []);

  // Load saved cart items
  const loadCartItems = async () => {
    try {
      const savedItems = await AsyncStorage.getItem('cartItems');
      if (savedItems) {
        // If you have actual saved items, use this:
        // setCartItems(JSON.parse(savedItems));
      }
    } catch (error) {
      console.log('Error loading cart items:', error);
    }
  };

  // Save cart items to storage
  const saveCartItems = async (items) => {
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(items));
    } catch (error) {
      console.log('Error saving cart items:', error);
    }
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee = 40;
    const tax = subtotal * 0.05;
    return (subtotal + deliveryFee + tax) - discount;
  };

  // Update item quantity
  const updateQuantity = (id, action) => {
    const updatedItems = cartItems.map(item => {
      if (item._id === id) {
        if (action === 'increase') {
          return { ...item, quantity: item.quantity + 1 };
        } else if (action === 'decrease' && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
      }
      return item;
    });
    
    setCartItems(updatedItems);
    saveCartItems(updatedItems);
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    const updatedItems = cartItems.filter(item => item._id !== id);
    setCartItems(updatedItems);
    saveCartItems(updatedItems);
  };

  // Apply promo code
  const applyPromoCode = () => {
    if (promocode.toLowerCase() === 'farmfresh') {
      setDiscount(50);
      setPromoApplied(true);
      Alert.alert('Success', 'Promo code applied successfully! ₹50 discount added.');
    } else {
      Alert.alert('Invalid Code', 'Please enter a valid promo code');
      setPromoApplied(false);
      setDiscount(0);
    }
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Add items before checkout.');
      return;
    }
    
    setLoading(true);
    
    // Simulate checkout process
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Checkout', {
        items: cartItems,
        subtotal: calculateSubtotal(),
        discount: discount,
        total: calculateTotal(),
      });
    }, 1500);
  };

  // Header animation values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 70],
    extrapolate: 'clamp',
  });

  const checkoutButtonScale = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  // Empty cart view
  const renderEmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <Text style={styles.emptyCartTitle}>Your Cart is Empty</Text>
      <Text style={styles.emptyCartText}>
        Looks like you haven't added any products to your cart yet.
      </Text>
      <TouchableOpacity
        style={styles.startShoppingButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.startShoppingText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  // Render cart item
  const renderCartItem = (item) => (
    <View key={item._id} style={styles.cartItemContainer}>
      <View style={styles.cartItemCard}>
        <Image 
          source={{ uri: `http://192.168.29.146:5000/uploads/${item.image}` }} 
          style={styles.itemImage}
        />
        
        <View style={styles.itemDetails}>
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemSeller}>{item.seller}</Text>
          </View>
          
          <View style={styles.itemPriceRow}>
            <Text style={styles.itemPrice}>₹{item.price}/{item.unit}</Text>
            
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={[styles.quantityButton, item.quantity === 1 && styles.disabledButton]}
                onPress={() => updateQuantity(item._id, 'decrease')}
                disabled={item.quantity === 1}
              >
                <Ionicons 
                  name="remove" 
                  size={18} 
                  color={item.quantity === 1 ? '#B0BEC5' : colors.dark} 
                />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{item.quantity}</Text>
              
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item._id, 'increase')}
              >
                <Ionicons name="add" size={18} color={colors.dark} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.itemTotalRow}>
            <Text style={styles.itemTotalLabel}>Total:</Text>
            <Text style={styles.itemTotal}>₹{item.price * item.quantity}</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromCart(item._id)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render summary section
  const renderSummarySection = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>Order Summary</Text>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>₹{calculateSubtotal()}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Delivery Fee</Text>
        <Text style={styles.summaryValue}>₹40</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tax (5%)</Text>
        <Text style={styles.summaryValue}>₹{(calculateSubtotal() * 0.05).toFixed(2)}</Text>
      </View>
      
      {promoApplied && (
        <View style={styles.summaryRow}>
          <Text style={styles.discountLabel}>Discount</Text>
          <Text style={styles.discountValue}>-₹{discount}</Text>
        </View>
      )}
      
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>₹{calculateTotal().toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.header,
          { height: headerHeight }
        ]}
      >
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Your Cart</Text>
            
            <View style={styles.headerRight}>
              <Text style={styles.itemCount}>{cartItems.length} items</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Cart Items */}
          <Animated.View
            style={[
              styles.cartItemsContainer,
              { opacity: fadeAnim }
            ]}
          >
            {cartItems.map(renderCartItem)}
          </Animated.View>
          
          {/* Promo Code Section */}
          <View style={styles.promoContainer}>
            <Text style={styles.promoTitle}>Promo Code</Text>
            
            <View style={styles.promoInputContainer}>
              <TextInput
                style={styles.promoInput}
                placeholder="Enter promo code"
                value={promocode}
                onChangeText={setPromocode}
                editable={!promoApplied}
              />
              
              <TouchableOpacity
                style={[
                  styles.promoButton,
                  promoApplied && styles.promoAppliedButton,
                ]}
                onPress={applyPromoCode}
                disabled={promoApplied}
              >
                <Text style={styles.promoButtonText}>
                  {promoApplied ? 'Applied' : 'Apply'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {promoApplied && (
              <View style={styles.promoAppliedContainer}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.promoAppliedText}>Promo code applied successfully!</Text>
              </View>
            )}
          </View>
          
          {/* Order Summary */}
          {renderSummarySection()}
          
          {/* Extra Space for Bottom Buttons */}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
      
      {cartItems.length > 0 && (
        <Animated.View
          style={[
            styles.checkoutContainer,
            {
              transform: [{ scale: checkoutButtonScale }],
            },
          ]}
        >
          <View style={styles.checkoutContent}>
            <View>
              <Text style={styles.checkoutTotalLabel}>Total Amount</Text>
              <Text style={styles.checkoutTotal}>₹{calculateTotal().toFixed(2)}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={proceedToCheckout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <>
                  <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                  <Ionicons name="arrow-forward" size={18} color={colors.white} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
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
    justifyContent: 'flex-end',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerRight: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  itemCount: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollViewContent: {
    paddingTop: 130,
    paddingBottom: 20,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 150,
  },
  emptyCartTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: 20,
    marginBottom: 10,
  },
  emptyCartText: {
    fontSize: 14,
    color: colors.dark,
    opacity: 0.7,
    textAlign: 'center',
    maxWidth: '80%',
    marginBottom: 30,
  },
  startShoppingButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startShoppingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  cartItemsContainer: {
    paddingHorizontal: 15,
  },
  cartItemContainer: {
    marginBottom: 15,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 12,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 2,
  },
  itemSeller: {
    fontSize: 12,
    color: colors.dark,
    opacity: 0.6,
  },
  itemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 5,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    width: 28,
    textAlign: 'center',
  },
  itemTotalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 5,
  },
  itemTotalLabel: {
    fontSize: 12,
    color: colors.dark,
    opacity: 0.7,
    marginRight: 5,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  removeButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  promoContainer: {
    backgroundColor: colors.white,
    borderRadius: 15,
    marginHorizontal: 15,
    marginTop: 15,
    padding: 15,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 10,
  },
  promoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.dark,
  },
  promoButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 10,
  },
  promoAppliedButton: {
    backgroundColor: colors.success,
  },
  promoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  promoAppliedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  promoAppliedText: {
    fontSize: 12,
    color: colors.success,
    marginLeft: 5,
  },
  summaryContainer: {
    backgroundColor: colors.white,
    borderRadius: 15,
    marginHorizontal: 15,
    marginTop: 15,
    padding: 15,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.dark,
    opacity: 0.7,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
  },
  discountLabel: {
    fontSize: 14,
    color: colors.success,
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.success,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    padding: 15,
  },
  checkoutContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutTotalLabel: {
    fontSize: 12,
    color: colors.dark,
    opacity: 0.7,
  },
  checkoutTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginRight: 5,
  }
});

export default CartScreen;