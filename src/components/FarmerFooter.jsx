import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../utils/color';

const FarmerFooter = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState('SELLER');
  
  // Animation for button press
  const [pressedButton, setPressedButton] = useState(null);
  const animatedValues = {
    home: new Animated.Value(1),
    listings: new Animated.Value(1),
    create: new Animated.Value(1),
    orders: new Animated.Value(1),
    profile: new Animated.Value(1),
  };

  useEffect(() => {
    // Determine active tab based on current route
    const routeName = route.name;
    if (routeName === 'SELLER') setActiveTab('home');
    else if (routeName === 'SellerListingScreen') setActiveTab('listings');
    else if (routeName === 'ADDPRODUCT') setActiveTab('create');
    else if (routeName === 'SELLERORDERS') setActiveTab('orders');
    else if (routeName === 'SELLERPROFILE') setActiveTab('profile');
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

    // Special styling for Create button
    const isCreate = buttonKey === 'create';
    
    return (
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          style={[
            styles.footerIcon, 
            isActive && styles.footerIconActive,
            isCreate && styles.createButton
          ]}
          onPress={() => handleNavigate(screenName, buttonKey)}
          activeOpacity={0.7}
        >
          {isCreate ? (
            <View style={styles.createIconWrapper}>
              <Ionicons name={iconName} size={24} color={colors.white} />
            </View>
          ) : (
            <View style={[
              styles.iconContainer, 
              isActive && styles.iconContainerActive
            ]}>
              <Ionicons
                name={isActive ? iconName : `${iconName}-outline`}
                size={isCreate ? 28 : 22}
                color={isActive ? colors.softforest : colors.secondary}
              />
            </View>
          )}
          <Text
            style={[
              styles.footerText,
              isActive && styles.footerTextActive,
              isCreate && styles.createText
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
        {renderTabButton('Home', 'home', 'SELLER', 'home')}
        {renderTabButton('Listings', 'list', 'SellerListingScreen', 'listings')}
        {renderTabButton('Add', 'add-circle', 'ADDPRODUCT', 'create')}
        {renderTabButton('Orders', 'receipt', 'SELLERORDERS', 'orders')}
        {renderTabButton('Profile', 'person', 'SELLERPROFILE', 'profile')}
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
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 10,
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
    paddingHorizontal: 12,
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
  // Special styling for create button
  createButton: {
    marginTop: -20, // Lift the create button up
  },
  createIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.softforest,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 2,
  },
  createText: {
    color: colors.softforest,
    fontWeight: '600',
  }
});

export default FarmerFooter;