import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FarmerFooter from '../components/FarmerFooter';
import { colors } from '../utils/color';
import { useNavigation } from '@react-navigation/native';
import WeatherApp from '../components/Weather';
import CropRecommenderApp from '../components/Crop';

const SellerHomeScreen = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        if (email) {
          const response = await axios.get(`http://13.200.59.120:5000/api/auth/profile/${email}`);
          setProfile(response.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
    <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
    <View style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}> 
        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <Image
            style={styles.profileImage}
            source={{ uri: 'https://via.placeholder.com/150' }}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.name}>{profile.name || 'Name not available'}</Text>
            <Text style={styles.phone}>{profile.phone || 'Phone number not available'}</Text>
            <Text style={styles.location}>{profile.email || 'Email not available'}</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <StatBox value="₹8750" label="Total Revenue" />
          <StatBox value="4.8" label="Reviews" />
          <StatBox value="20" label="Total Orders" />
          <StatBox value="56" label="Customers" />
        </View>

        {/* Revenue History (placeholder) */}
        <View style={styles.revenueHistory}>
          <Text style={styles.revenueTitle}>Revenue History</Text>
          {/* Add a chart here if needed */}
          <View style={styles.chartPlaceholder}></View>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SELLERORDERS')}>
          <Text style={styles.buttonText}>Orders History</Text>
        </TouchableOpacity>
        <WeatherApp/>
        <CropRecommenderApp/>
      </ScrollView>
      <FarmerFooter />
    </View>
    </>
  );
};

const StatBox = ({ value, label }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.jade,
    marginTop:20
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileDetails: {
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  phone: {
    color: '#777',
  },
  location: {
    color: '#777',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    flexWrap: 'wrap', // Allow wrapping for smaller screens
  },
  statBox: {
    flexBasis: '45%', // Two boxes per row
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: '2.5%', // Space between boxes
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color:'#4CAF50', // Green color for values
   },
   statLabel:{
     fontSize :14 ,
     color:'#777' ,
     marginTop :5 ,
   },
   revenueHistory:{
     marginVertical :20 ,
   },
   revenueTitle:{
     fontSize :16 ,
     fontWeight :'bold' ,
     marginBottom :10 ,
   },
   chartPlaceholder:{
     height :100 ,
     backgroundColor :'#eaeaea' ,
     borderRadius :10 ,
   },
   button:{
     backgroundColor : colors.softforest ,
     padding :15 ,
     borderRadius :30,
     marginVertical :10 ,
     alignItems :'center' ,
   },
   buttonText:{
     color : colors.white ,
     fontWeight :'bold' ,
   },
});

export default SellerHomeScreen;