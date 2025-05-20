import React, { useState, useEffect } from 'react';
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
  Animated,
  ToastAndroid,
  TextInput,
  Platform,
  StatusBar
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker'; // Ensure this is the correct import for your Picker
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Footer from '../components/Footer';
import { colors } from '../utils/color';

const ProductDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params;

  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [pincode, setPincode] = useState('');
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  
  const width = Dimensions.get('window').width;
  const scrollX = new Animated.Value(0);
  
  let position = Animated.divide(scrollX, width);

  // Add to Cart Function
  const addToCart = async id => {
    let itemArray = await AsyncStorage.getItem('cartItems');
    itemArray = JSON.parse(itemArray) || [];
    itemArray.push(id);
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(itemArray));
      ToastAndroid.show('Item Added Successfully to cart', ToastAndroid.SHORT);
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
    }
  };

  // Message Seller Function
  const handleMessageSeller = () => {
    console.log(`Messaging seller of ${product.name}`);
  };

  // Share Product Function
  const handleShareProduct = async () => {
    try {
      const imageUrl = `http://172.21.2.95:5000/uploads/${product.images[0]}`; // Consider making this dynamic
      const fileUri = FileSystem.documentDirectory + product.images[0];
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
      ToastAndroid.show("Failed to share product", ToastAndroid.SHORT);
    }
  };

  // Handle Image Press
  const handleImagePress = () => {
    setIsImageViewerVisible(true);
  };

  // Cleanup effect for unmounting
  useEffect(() => {
    return () => {
      // Cleanup code if needed (e.g., removing listeners)
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Share Product Button */}
      <TouchableOpacity style={styles.shareButton} onPress={handleShareProduct}>
        <Ionicons name="share-social-outline" size={30} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" color="#000" size={25} />
      </TouchableOpacity>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Images Container */}
        <View style={styles.imageContainer}>
          <FlatList
            data={product.images ? product.images.map(image => ({ uri: image })) : []}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity onPress={handleImagePress} style={styles.imageWrapper}>
                <Image source={{ uri: `http://172.21.2.95:5000/uploads/${item.uri}` }} style={styles.productImage} />
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={width}
            bounces={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
          />
        </View>

        <View style={styles.dotContainer}>
          {product.images ? product.images.map((_, index) => {
            let opacity = position.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0.2, 1, 0.2],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View key={index} style={[styles.dot, { opacity }]} />
            );
          }) : null}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>Price: ₹{product.price}</Text>
          
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <Picker
              selectedValue={quantity}
              style={styles.quantityPicker}
              onValueChange={(itemValue) => setQuantity(itemValue)}
            >
              {[...Array(10).keys()].map(i => (
                <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
              ))}
            </Picker>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button]} onPress={() => addToCart(product.id)}>
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button]} onPress={() => addToCart(product.id)}>
              <Text style={styles.buttonText}>Buy Now</Text>
            </TouchableOpacity>
          </View>

          {/* Message Seller Button */}
          <TouchableOpacity style={[styles.button, styles.messageSellerButton]} onPress={handleMessageSeller}>
            <Text style={[styles.buttonText]}>Message Seller</Text>
          </TouchableOpacity>

          {/* Pincode/Address Input */}
          <View style={styles.pincodeContainer}>
            <Text style={styles.pincodeLabel}>Enter Pincode:</Text>
            <View style={styles.pincodeInputContainer}>
              <Ionicons name="location-outline" size={24} color="#1E90FF" style={styles.locationIcon} />
              <TextInput
                placeholder="Enter your pincode"
                value={pincode}
                onChangeText={(text) => setPincode(text)}
                style={styles.pincodeInput}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={() => console.log("Pincode submitted:", pincode)}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>

          {/* Reviews Section */}
          <View style={styles.reviewContainer}>
            <Text style={styles.reviewTitle}>Write a Review</Text>
            <View style={styles.ratingContainer}>
              {[...Array(5).keys()].map(i => (
                <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
                  <Ionicons name="star" size={30} color={rating > i ? '#FFD700' : '#ccc'} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Review Text Input */}
            <TextInput
              placeholder="Write your review here..."
              value={review}
              onChangeText={(text) => setReview(text)}
              style={styles.reviewInput}
              multiline
              numberOfLines={4}
            />

            {/* Submit Review Button */}
            <TouchableOpacity
              style={[styles.button]}
              onPress={() => console.log("Review submitted:", review)}
            >
              <Text style={styles.buttonText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Footer />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10
  },
  scrollViewContent: {
    paddingBottom: 60, // Adjust this value to match the height of your footer
  },
  backButtonWrapper: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    left: 15,
    zIndex: 1000,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:colors.sunflower,
    borderRadius:50
  },
  shareButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    right: 15,
    zIndex: 1000,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 300,
  },
  imageWrapper: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
    margin: 3,
  },
  detailsContainer: {
    padding: 15,
  },
  productName: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 18,
    color: colors.sunflower,
    fontWeight : 'bold',
    marginVertical: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityLabel: {
    fontSize: 16,
  },
  quantityPicker: {
    height: 50,
    width: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  button: {
    flex: 1,
    backgroundColor: colors.softforest,
    padding: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
  },
  messageSellerButton: {
    marginVertical: 10,
    backgroundColor: '#4CAF50',
  },
  pincodeContainer: {
    marginVertical: 20,
    padding:5
  },
  pincodeLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  pincodeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius:30,
    borderWidth:1,
    margin:5
  
  },
  locationIcon: {
    marginRight: 10,
  },
  pincodeInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 16,
    paddingVertical: 5,
  },
  reviewContainer: {
    marginVertical: 20,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
});

export default ProductDetailsScreen;
