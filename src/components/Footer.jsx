import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/color';

const Footer = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerIcon} onPress={() => navigation.navigate('BUYER')}>
        <Ionicons name="home-outline" size={24} color={colors.white} />
        <Text style={styles.footerText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerIcon} onPress={() => navigation.navigate('Cart')}>
        <Ionicons name="cart-outline" size={24} color={colors.white} />
        <Text style={styles.footerText}>Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerIcon} onPress={() => navigation.navigate('Orders')}>
        <Ionicons name="notifications-outline" size={24} color={colors.white} />
        <Text style={styles.footerText}>Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerIcon} onPress={() => navigation.navigate('BUYERPROFILE')}>
        <Ionicons name="person-outline" size={24} color={colors.white} />
        <Text style={styles.footerText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 30,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  footerIcon: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: colors.white,
  },
});

export default Footer;
