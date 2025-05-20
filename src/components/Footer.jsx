import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../utils/color';

const Footer = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState('BUYER');
  
  // Animation for button press
  const [pressedButton, setPressedButton] = useState(null);
  const animatedValues = {
    home: new Animated.Value(1),
    cart: new Animated.Value(1),
    orders: new Animated.Value(1),
    profile: new Animated.Value(1),
  };

  useEffect(() => {
    // Determine active tab based on current route
    const routeName = route.name;
    if (routeName === 'BUYER') setActiveTab('home');
    else if (routeName === 'Cart') setActiveTab('cart');
    else if (routeName === 'Orders') setActiveTab('orders');
    else if (routeName === 'BUYERPROFILE') setActiveTab('profile');
  }, [route]);

  const animateButton = (button) => {
    setPressedButton(button);
    Animated.sequence([
      Animated.timing(animatedValues[button], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues[button], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => setPressedButton(null));
  };

  const handleNavigate = (screen, button) => {
    animateButton(button);
    navigation.navigate(screen);
  };

  const renderTabButton = (name, iconName, screenName, buttonKey) => {
    const isActive = activeTab === buttonKey;
    const animatedStyle = {
      transform: [{ scale: animatedValues[buttonKey] }],
    };

    return (
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          style={[styles.footerIcon, isActive && styles.footerIconActive]}
          onPress={() => handleNavigate(screenName, buttonKey)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
            <Ionicons
              name={isActive ? iconName : `${iconName}-outline`}
              size={22}
              color={isActive ? colors.softforest : colors.secondary}
            />
          </View>
          <Text
            style={[
              styles.footerText,
              isActive && styles.footerTextActive,
            ]}
          >
            {name}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.footerContainer}>
      <View style={styles.footer}>
        {renderTabButton('Home', 'home', 'BUYER', 'home')}
        {renderTabButton('Cart', 'cart', 'Cart', 'cart')}
        {renderTabButton('Orders', 'receipt', 'Orders', 'orders')}
        {renderTabButton('Profile', 'person', 'BUYERPROFILE', 'profile')}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  footerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  footerIconActive: {
    transform: [{ translateY: -2 }],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  iconContainerActive: {
    backgroundColor: colors.jade + '30',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.secondary,
    marginTop: 2,
  },
  footerTextActive: {
    color: colors.softforest,
    fontWeight: '600',
  },
});

export default Footer;