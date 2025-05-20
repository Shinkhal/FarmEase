import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import FarmerFooter from '../components/FarmerFooter';
import { colors } from '../utils/color';
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FarmerListingScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [id, setId] = useState(''); // New id state
  const [email, setEmail] = useState('');
  const [images, setImages] = useState([]);

  // Request permissions to access the gallery and retrieve email from AsyncStorage
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }

      // Fetch email from AsyncStorage
      const storedEmail = await AsyncStorage.getItem('userEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        alert('Email not found. Please log in again.');
      }
    })();
  }, []);

  // Function to handle adding a new product
  const handleAddProduct = async () => {
    if (name && price && quantity && id && images.length > 0 && email) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('quantity', quantity);
      formData.append('id', id); // Append unique id
      formData.append('email', email); // Append email

      // Append each image to the form data
      images.forEach((image, index) => {
        formData.append('images', {
          uri: image,
          name: `product_image_${index}.jpg`,
          type: 'image/jpeg',
        });
      });

      try {
        // Send product data to the backend
        const response = await axios.post('http://10.35.40.26:5000/upload/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const newProduct = response.data; // Get the newly added product from the backend response

        // Update the local product state with the new product
        setProducts((prevProducts) => [...prevProducts, newProduct]);

        // Reset form fields
        setName('');
        setPrice('');
        setQuantity('');
        setId('');
        setImages([]);

        console.log('Product added successfully:', newProduct);
      } catch (error) {
        console.error('Error adding product:', error);
        alert('Error adding product: ' + (error.response?.data.message || error.message));
      }
    } else {
      alert('Please fill in all fields, add at least one image, and ensure email is present.');
    }
  };

  // Function to pick images from the gallery
  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages((prevImages) => [...prevImages, ...selectedImages]);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Function to remove an image from the selected images
  const removeImage = (uri) => {
    setImages(images.filter((image) => image !== uri));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons name={"arrow-back-outline"} color={colors.primary} size={25} />
      </TouchableOpacity>
      <Text style={styles.header}>List Your Products</Text>
  
      {/* Image Placeholder */}
      <ScrollView horizontal contentContainerStyle={styles.imagePlaceholder} showsHorizontalScrollIndicator={false}>
        {images.length > 0 ? (
          images.map((image) => (
            <View key={image} style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.productImage} />
              <TouchableOpacity onPress={() => removeImage(image)} style={styles.removeButton}>
                {/* Wrap the remove button text in <Text> */}
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noImageText}>No images selected</Text> // Wrap the placeholder text
        )}
      </ScrollView>
  
      {/* Input Fields */}
      <TextInput style={styles.input} placeholder="Product ID" value={id} onChangeText={setId} />
      <TextInput style={styles.input} placeholder="Product Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Product Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Product Quantity" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
  
      {/* Pick Images from Gallery */}
      <TouchableOpacity onPress={pickImages} style={styles.button}>
        {/* Wrap button text in <Text> */}
        <Text style={styles.buttonText}>Pick Images from Gallery</Text>
      </TouchableOpacity>
  
      {/* Add Product Button */}
      <TouchableOpacity onPress={handleAddProduct} style={styles.button}>
        {/* Wrap button text in <Text> */}
        <Text style={styles.buttonText}>Add Products</Text>
      </TouchableOpacity>
  
      {/* List of Products */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {products.map((product) => (
          <View key={product._id} style={styles.productCard}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {product.images.map((image) => (
                <Image key={image} source={{ uri: `http://10.35.40.26:5000/uploads/${image}` }} style={styles.productImage} />
              ))}
            </ScrollView>
            {/* Wrap dynamic text like product name, price, and quantity in <Text> */}
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>Price: {product.price}</Text>
            <Text style={styles.productQuantity}>Quantity: {product.quantity}</Text>
          </View>
        ))}
      </ScrollView>
  
      <FarmerFooter />
    </View>
  );
  
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.jade,
        padding: 20,
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        color: colors.primary,
        textAlign: 'center',
    },
    backButtonWrapper: {
        height: 40,
        width: 40,
        backgroundColor: colors.sunflower,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#f8f8f8',
    },
    imagePlaceholder: {
        height: 120,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
   },
   imageContainer:{
     position:'relative',
     marginRight :10 ,
   },
   productImage:{
     width :100 ,
     height :100 ,
     borderRadius :10 ,
     marginBottom :10 ,
   },
   button: {
       backgroundColor: colors.primary,
       paddingVertical: 12,
       borderRadius: 50,
       marginBottom: 15,
       width:300,
       alignSelf: "center",
   },
   buttonText:{
       color:'#fff' ,
       textAlign:'center' ,
       fontWeight:'bold' ,
   },
   noImageText:{
       color:'#666' ,
   },
   productCard:{
       width:'100%' ,
       backgroundColor:'#f8f8f8' ,
       borderRadius :10 ,
       padding :10 ,
       alignItems :'center' ,
       marginBottom :20 ,
       shadowColor :'#000' ,
       shadowOffset :{width :0 , height :2},
       shadowOpacity :0.1 ,
       shadowRadius :4 ,
       elevation :3 ,
   },
   productName:{
       fontSize :16 ,
       fontWeight :'bold' ,
       color:'#333' ,
   },
   productPrice:{
       color:'#666' ,
       marginTop :5 ,
   },
   productQuantity:{
       color:'#666' ,
       marginTop :5 ,
   },
   removeButton:{
       position:'absolute',
       top:-5,
       right:-5,
       backgroundColor:'red',
       borderRadius:5,
       paddingHorizontal:5,
   },
   removeButtonText:{
       color:'#fff',
   },
});

export default FarmerListingScreen;