import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Image 
} from 'react-native';
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
      const response = await fetch(`http://192.168.29.146:5000/api/auth/profile/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }); 

      const data = await response.json();
      
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

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    // navigation.navigate('EditProfile', { profileData });
    Alert.alert("Edit Profile", "Edit profile functionality coming soon!");
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color={colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            getEmailAndFetchProfile();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>{profileData.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.profileName}>{profileData.name}</Text>
          <Text style={styles.sellerTag}>Verified Seller</Text>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{profileData.email}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="call-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{profileData.phone}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('SellerProducts')}>
            <Ionicons name="leaf-outline" size={22} color={colors.primary} />
            <Text style={styles.actionText}>My Products</Text>
            <Ionicons name="chevron-forward" size={22} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('SellerOrders')}>
            <Ionicons name="cart-outline" size={22} color={colors.primary} />
            <Text style={styles.actionText}>My Orders</Text>
            <Ionicons name="chevron-forward" size={22} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={22} color={colors.primary} />
            <Text style={styles.actionText}>Settings</Text>
            <Ionicons name="chevron-forward" size={22} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Help')}>
            <Ionicons name="help-circle-outline" size={22} color={colors.primary} />
            <Text style={styles.actionText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={colors.white} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      
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
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 15,
    elevation: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  editButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  profileImageContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.white,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  sellerTag: {
    backgroundColor: colors.jade,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    color: colors.white,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lighterGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  actionsSection: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  actionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: colors.error,
    marginHorizontal: 15,
    marginVertical: 20,
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    marginBottom: 80,
  },
  logoutButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: 15,
    color: colors.text,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 20,
  },
  errorText: {
    marginTop: 15,
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default SellerProfileScreen;