import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// Import Screens
import HomeScreen from './src/screen/HomeScreen';
import LoginScreen from './src/screen/LoginScreen';
import SignupScreen from './src/screen/SignupScreen';
import SplashScreen from './src/screen/SplashScreen'; // Include SplashScreen for role-based navigation
import BuyerHomeScreen from './src/screen/BuyerHomeScreen';
import SellerHomeScreen from './src/screen/SellerHomeScreen';
import SellerListingScreen from './src/screen/SellerListingScreen';
import ProductScreen from './src/screen/ItemScreen';
import SellerOrdersScreen from './src/screen/SellerOrdersScreen';
import BuyerProfileScreen from './src/screen/BuyerProfileScreen';
import SellerProfileScreen from './src/screen/SellerProfileScreen';
import FarmerListingScreen from './src/screen/AddProductScreen';
import ProductDetailsScreen from './src/screen/DetailedProductScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* SplashScreen as the entry point for role-based navigation */}
        <Stack.Screen name="SplashScreen" component={SplashScreen} />

        {/* Auth Screens */}
        <Stack.Screen name="HOME" component={HomeScreen} />
        <Stack.Screen name="LOGIN" component={LoginScreen} />
        <Stack.Screen name="SIGNUP" component={SignupScreen} />

        {/* Role-based Screens */}
        
        <Stack.Screen name="BUYER" component={BuyerHomeScreen} />
        <Stack.Screen name="SELLER" component={SellerHomeScreen} />


        <Stack.Screen name="SellerListingScreen" component={SellerListingScreen} /> 
        <Stack.Screen name="ADDPRODUCT" component={FarmerListingScreen} />
        <Stack.Screen name="SELLERORDERS" component={SellerOrdersScreen} />
        <Stack.Screen name='ProductDetails' component={ProductDetailsScreen}/>
        
        {/* Buyer Screens */}
        {/* <Stack.Screen name="ProductScreen" component={ProductScreen} /> */}
        <Stack.Screen name="BUYERPROFILE" component={BuyerProfileScreen} />
        <Stack.Screen name='SELLERPROFILE' component={SellerProfileScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
