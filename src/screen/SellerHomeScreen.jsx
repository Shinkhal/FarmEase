import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  ActivityIndicator 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FarmerFooter from '../components/FarmerFooter';
import { colors } from '../utils/color';
import { useNavigation } from '@react-navigation/native';
import WeatherApp from '../components/Weather';
import CropRecommenderApp from '../components/Crop';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const SellerHomeScreen = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        if (email) {
          const response = await axios.get(`http://192.168.29.146:5000/api/auth/profile/${email}`);
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
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.softforest} />
        <Text style={styles.loaderText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.softforest} />
      <View style={styles.container}>
        <ScrollView 
          showsHorizontalScrollIndicator={false} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        > 
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Farmer Dashboard</Text>
          </View>
          
          {/* Profile Section */}
          <View style={styles.profileContainer}>
            <View style={styles.profileImageContainer}>
              <Image
                style={styles.profileImage}
                source={{ uri: 'https://via.placeholder.com/150' }}
              />
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.name}>{profile.name || 'Name not available'}</Text>
              <View style={styles.infoRow}>
                <MaterialIcons name="phone" size={16} color={colors.softforest} />
                <Text style={styles.infoText}>{profile.phone || 'Phone number not available'}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="email" size={16} color={colors.softforest} />
                <Text style={styles.infoText}>{profile.email || 'Email not available'}</Text>
              </View>
            </View>
          </View>

          {/* Stats Section */}
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsContainer}>
            <StatBox 
              value="₹8,750" 
              label="Total Revenue" 
              icon="rupee-sign"
              color={colors.sunflower}
            />
            <StatBox 
              value="4.8" 
              label="Rating" 
              icon="star"
              color={colors.sunflower}
            />
            <StatBox 
              value="20" 
              label="Orders" 
              icon="shopping-basket"
              color={colors.jade}
            />
            <StatBox 
              value="56" 
              label="Customers" 
              icon="users"
              color={colors.jade}
            />
          </View>

          {/* Revenue History */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Revenue History</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.chartContainer}>
              <View style={styles.chartPlaceholder}></View>
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, {backgroundColor: colors.softforest}]}></View>
                  <Text style={styles.legendText}>This Month</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, {backgroundColor: colors.jade}]}></View>
                  <Text style={styles.legendText}>Last Month</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => navigation.navigate('SELLERORDERS')}
            >
              <View style={[styles.iconBg, {backgroundColor: colors.sourapple}]}>
                <FontAwesome5 name="history" size={20} color={colors.softforest} />
              </View>
              <Text style={styles.actionText}>Orders History</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.iconBg, {backgroundColor: colors.greentea}]}>
                <FontAwesome5 name="plus" size={20} color={colors.softforest} />
              </View>
              <Text style={styles.actionText}>Add Product</Text>
            </TouchableOpacity>
          </View>

          {/* Weather and Crop Sections */}
          <View style={styles.weatherCropContainer}>
            <Text style={styles.sectionTitle}>Weather & Crop Recommendations</Text>
            <View style={styles.weatherSection}>
              <WeatherApp />
            </View>
            <View style={styles.cropSection}>
              <CropRecommenderApp />
            </View>
          </View>
        </ScrollView>
        <FarmerFooter />
      </View>
    </>
  );
};

const StatBox = ({ value, label, icon, color }) => (
  <View style={styles.statBox}>
    <View style={[styles.statIconContainer, {backgroundColor: color + '20'}]}>
      <FontAwesome5 name={icon} size={20} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  loaderText: {
    marginTop: 10,
    color: colors.softforest,
    fontSize: 16,
  },
  header: {
    marginBottom: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImageContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.jade,
  },
  profileDetails: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    marginLeft: 8,
    color: colors.secondary,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  statBox: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  statIconContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.secondary,
  },
  sectionContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: colors.softforest,
    fontSize: 14,
    fontWeight: '600',
  },
  chartContainer: {
    marginTop: 8,
  },
  chartPlaceholder: {
    height: 160,
    backgroundColor: colors.green + '30',
    borderRadius: 12,
  },
  chartLegend: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    color: colors.secondary,
    fontSize: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  iconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  weatherCropContainer: {
    marginBottom: 24,
  },
  weatherSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cropSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 54,
  }
});

export default SellerHomeScreen;