import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/color';
import FarmerFooter from '../components/FarmerFooter';
import axios from 'axios';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SellerListingScreen = () => {
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();

  // Fetch products from API using email stored in AsyncStorage
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Retrieve the email from AsyncStorage
        const email = await AsyncStorage.getItem('userEmail');

        if (email) {
          // Fetch products for the specific email
          const response = await axios.get(`http://10.35.138.29:5000/products/${email}`); // Replace with your API URL
          setProducts(response.data); // Set fetched products to state
        } else {
          console.error('No email found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    fetchProducts();
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons name={"arrow-back-outline"} color={colors.primary} size={25} />
      </TouchableOpacity>
      <ScrollView showsHorizontalScrollIndicator={false} 
                  showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionTitle}>My Listings</Text>
        <FlatList
        horizontal
        data={products}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listingCard}>
            <Image source={{ uri: `http://10.35.138.29:5000/uploads/${item.images[0]}` }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id} // Use MongoDB ID as key
        showsHorizontalScrollIndicator={false}
      />

        <Text style={styles.sectionTitle}>My Items up for Bidding</Text>
        <FlatList
        horizontal
        data={products}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listingCard}>
            <Image source={{ uri: `http://10.35.138.29:5000/uploads/${item.images[0]}` }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id} // Use MongoDB ID as key
        showsHorizontalScrollIndicator={false}
      />
        
      </ScrollView>
      <FarmerFooter />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.jade,
    paddingHorizontal: width * 0.04, // Responsive padding
    paddingVertical: width * 0.02,
    padding:20 // Responsive padding
  },
  sectionTitle: {
    fontSize: width * 0.05, // Responsive font size
    fontWeight: 'bold',
    marginTop: width * 0.05, // Responsive margin
    color: colors.primary,
  },
  productImage: {
    width: width * 0.25, // Responsive image size
    height: width * 0.25, // Responsive image size
    borderRadius: width * 0.02, // Responsive radius
  },
  productName: {
    fontSize: width * 0.04, // Responsive font size
    fontWeight: 'bold',
    marginTop: width * 0.02, // Responsive margin
    color: colors.text,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.sunflower,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  listingCard: {
    width: width * 0.35, // Responsive width
    marginRight: width * 0.03, // Responsive margin
    backgroundColor: colors.white,
    borderRadius: width * 0.02, // Responsive radius
    paddingVertical: width * 0.03, // Responsive padding
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop:10
   },
   
   biddingInfo:{
     color :colors.secondary ,
     marginTop :width*0.01 , 
   }
});

export default SellerListingScreen;