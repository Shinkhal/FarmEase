import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import FarmerFooter from '../components/FarmerFooter';
import { colors } from '../utils/color';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MyOrders = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const orderSummary = {
    pending: 34,
    shipped: 20,
    returned: 0,
    canceled: 2,
  };

  const orders = [
    { id: '1', status: 'Pending', title: ' Basmati Rice ' ,price: '₹140' },
    { id: '2', status: 'Shipped', title: ' Basmati Rice ' ,price: '₹140' },
    { id: '3', status: 'Returned', title:' Basmati Rice ' , price: '₹140' },
    { id: '4', status: 'Canceled', title:' Basmati Rice ' , price: '₹140' },
  ];

  const filteredOrders = orders.filter(order => selectedFilter === 'All' || order.status === selectedFilter);

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderTitle}>{item.title}</Text>
      <Text style={styles.orderPrice}>{item.price}</Text>
      <Text style={styles[item.status.toLowerCase()]}>{item.status}</Text>
    </View>
  );

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
                <Ionicons name={"arrow-back-outline"} color={colors.primary} size={25} />
      </TouchableOpacity>
      {/* Order Summary */}
      <View style={styles.summary}>
        <Text>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text>Pending: {orderSummary.pending}</Text>
          <Text>Shipped: {orderSummary.shipped}</Text>
          <Text>Returned: {orderSummary.returned}</Text>
          <Text>Canceled: {orderSummary.canceled}</Text>
        </View>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        {['All', 'Pending', 'Shipped', 'Returned', 'Canceled'].map(filter => (
          <TouchableOpacity key={filter} onPress={() => setSelectedFilter(filter)} style={styles.filterButton}>
            <Text>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Order List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={item => item.id}
        renderItem={renderOrder}
      />
    <FarmerFooter/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.jade,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.sunflower,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom:10
  },
  summary: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#e0f7fa', // Light cyan background for summary
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 10, // Added padding for better touch area
    shadowColor: '#000',
    backgroundColor: colors.sourapple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 15, // Teal color for buttons
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#ffffff', // White text for contrast
    fontWeight: 'bold',
  },
  orderCard: {
    paddingVertical: 15, // Adjusted vertical padding for better spacing
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderRadius:20
  },
  orderTitle: {
    fontSize: 16, // Slightly larger font size for titles
    fontWeight: 'bold',
  },
  orderPrice: {
    fontSize: 14, // Font size for price
    marginVertical: 5, // Space between price and status
  },

// Status colors
pending: { color: '#ffa726' }, // Orange for pending
shipped: { color: '#42a5f5' }, // Blue for shipped
returned: { color: '#ef5350' }, // Red for returned
canceled: { color: '#bdbdbd' }, // Gray for canceled
});

export default MyOrders;