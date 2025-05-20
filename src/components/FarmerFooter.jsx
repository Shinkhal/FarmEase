import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/color'; // Make sure to define your color palette in this file

const FarmerFooter = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerIcon} onPress={() => navigation.navigate('SELLER')}>
        <Ionicons name="home-outline" size={24} color={colors.white} />
        <Text style={styles.footerText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerIcon} onPress={() => navigation.navigate('SellerListingScreen')}>
        <Ionicons name="list-outline" size={24} color={colors.white} />
        <Text style={styles.footerText}>Listings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerIcon} onPress={() => navigation.navigate('ADDPRODUCT')}>
        <Ionicons name="add-circle-outline" size={24} color={colors.white} />
        <Text style={styles.footerText}>Create</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerIcon} onPress={() => navigation.navigate('SELLERORDERS')}>
        <Ionicons name="notifications-outline" size={24} color={colors.white} />
        <Text style={styles.footerText}>Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerIcon} onPress={() => navigation.navigate('SELLERPROFILE')}>
        <Ionicons name="person-outline" size={24} color={colors.white} />
        <Text style={styles.footerText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 30,
  },
  footerIcon: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.white,
  },
});

export default FarmerFooter;