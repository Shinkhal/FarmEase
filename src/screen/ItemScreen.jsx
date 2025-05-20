import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const ProductScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.headerButton}>{"<"}</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Image and Details */}
      <Image 
        style={styles.productImage} 
        source={{uri: 'https://example.com/your-product-image.jpg'}} 
      />
      <Text style={styles.price}>₹14,000</Text>
      <Text style={styles.productTitle}>Single seater comfort chair</Text>
      <Text style={styles.productSubTitle}>by thriftstore</Text>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        <Text style={styles.tag}>Furniture</Text>
        <Text style={styles.tag}>Home</Text>
        <Text style={styles.todayTag}>TODAY</Text>
      </View>

      {/* Product Description */}
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa, velit urna, scelerisque elementum cum proin justo.
      </Text>

      {/* Orders Received */}
      <Text style={styles.sectionTitle}>Orders received</Text>
      <View style={styles.orderItem}>
        <Image style={styles.orderImage} source={{uri: 'https://example.com/user1-image.jpg'}} />
        <View>
          <Text style={styles.orderUser}>Moksh Pratap, Delhi</Text>
          <Text style={styles.orderDate}>16th Sep, 2022</Text>
        </View>
        <View style={styles.orderStatusNew}>
          <Text style={styles.orderStatusText}>NEW</Text>
        </View>
      </View>
      <View style={styles.orderItem}>
        <Image style={styles.orderImage} source={{uri: 'https://example.com/user2-image.jpg'}} />
        <View>
          <Text style={styles.orderUser}>Kritika Sinha</Text>
          <Text style={styles.orderDate}>11th Sep, 2022</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerButton: {
    fontSize: 18,
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButtonText: {
    color: '#007BFF',
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productSubTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#E0E0E0',
    padding: 6,
    borderRadius: 20,
    marginRight: 8,
    fontSize: 12,
  },
  todayTag: {
    backgroundColor: '#FF9800',
    padding: 6,
    borderRadius: 20,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  orderUser: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
  },
  orderStatusNew: {
    backgroundColor: '#00C853',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  orderStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ProductScreen;