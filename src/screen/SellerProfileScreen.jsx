import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from '../utils/color';
import FarmerFooter from '../components/FarmerFooter';

const SellerProfileScreen = () => {
  const navigation = useNavigation();
  
  // State to hold fetched data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  // State to handle loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const handleGoBack = () => {
    navigation.goBack();
  };

  // Function to fetch profile data from API
  const fetchProfileData = async (email) => {
    try {
      // Replace with your actual API URL and pass email in the query params or request body
      const response = await fetch(`http://13.200.59.120:5000/api/auth/profile/${email}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
    }); 

      const data = await response.json();
      
      // Assuming the API response is structured like { name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
      setProfileData({
        name: data.name,
        email: data.email,
        phone: data.phone,
      });
      setLoading(false);

    } catch (err) {
      setError('Failed to fetch profile data');
      setLoading(false);
    }
  };

  // Fetch the email from AsyncStorage and use it to fetch profile data
  useEffect(() => {
    const getEmailAndFetchProfile = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        if (email) {
          // Call the fetchProfileData function with the stored email
          fetchProfileData(email);
        } else {
          setError('No email found');
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to retrieve email');
        setLoading(false);
      }
    };
    
    getEmailAndFetchProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              // Clear user data
              await AsyncStorage.multiRemove(['userToken', 'userEmail', 'userRole']);
              
              // Navigate to the LOGIN screen only after data is removed
              navigation.reset({
                index: 0,
                routes: [{ name: 'HOME' }],
              });
            } catch (error) {
              console.log("Error logging out: ", error);
            }
          },
        },
      ]
    );
  };
  

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <>
    <View style={styles.container}>
        <ScrollView style={styles.content}>
            <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
                <Ionicons name={"arrow-back-outline"} color={colors.primary} size={25} />
            </TouchableOpacity>
            <Text style={styles.header}>Seller Profile</Text>
            <View style={styles.profileBox}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{profileData.name}</Text>

                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{profileData.email}</Text>

                <Text style={styles.label}>Phone Number:</Text>
                <Text style={styles.value}>{profileData.phone}</Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
        <FarmerFooter />
    </View>
    </>
);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.jade,
        padding: 20,
        marginTop: 20
    },
    content: {
        padding: 20,
        backgroundColor: colors.gray,
        borderRadius: 10,
        shadowColor: colors.jade,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: colors.primary
    },
    profileBox: {
        backgroundColor: colors.white, // Background color for the box
        borderRadius: 10, // Rounded corners
        padding: 15, // Padding inside the box
        marginBottom: 20, // Space below the box
        shadowColor: '#000', // Shadow color
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3, // Shadow opacity
        shadowRadius: 4, // Shadow blur radius
        elevation: 5, // For Android shadow effect
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.softforest
    },
    value: {
        fontSize: 16,
        marginBottom: 10,
        color: colors.text
    },
    backButtonWrapper: {
        height: 40,
        width: 40,
        backgroundColor: colors.sunflower,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10
    },
    logoutButton: {
        backgroundColor: colors.softforest,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
  
    logoutText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SellerProfileScreen;