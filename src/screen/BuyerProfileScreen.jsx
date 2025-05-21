import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Image,
  StatusBar 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from '../utils/color';
import Footer from '../components/Footer';

const BuyerProfileScreen = () => {
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
              
              // Navigate to the HOME screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'HOME' }],
              });
            } catch (error) {
              console.log("Error logging out: ", error);
              Alert.alert("Error", "Could not log out. Please try again.");
            }
          },
        },
      ]
    );
  };
  
  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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
        <Ionicons name="alert-circle-outline" size={50} color={colors.primary} />
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
      <StatusBar backgroundColor={colors.jade} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" color={colors.white} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={styles.placeholderView} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials(profileData.name)}</Text>
          </View>
          <Text style={styles.profileName}>{profileData.name}</Text>
        </View>

        {/* Profile Details */}
        <View style={styles.profileDetailsContainer}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="person-outline" size={22} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{profileData.name}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={22} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{profileData.email}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={22} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{profileData.phone}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('EditProfile', { profileData })}>
            <Ionicons name="create-outline" size={22} color={colors.primary} />
            <Text style={styles.actionButtonText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={22} color={colors.gray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('OrderHistory')}>
            <Ionicons name="list-outline" size={22} color={colors.primary} />
            <Text style={styles.actionButtonText}>Order History</Text>
            <Ionicons name="chevron-forward" size={22} color={colors.gray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Favorites')}>
            <Ionicons name="heart-outline" size={22} color={colors.primary} />
            <Text style={styles.actionButtonText}>Saved Items</Text>
            <Ionicons name="chevron-forward" size={22} color={colors.gray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={colors.white} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

        <Footer />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greentea,
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.jade,
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 16,
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
  placeholderView: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: colors.jade,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  profileDetailsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 4,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: 8,
  },
});

export default BuyerProfileScreen;