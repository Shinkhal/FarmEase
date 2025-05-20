import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../utils/color";
import { useTranslation } from "react-i18next";

const MainScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);

  // Fetch listings from a hypothetical API or database
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      // Simulate data fetching
      const data = [
        { id: "1", title: "Farm Fresh Apples", price: "$5/kg",   },
        { id: "2", title: "Organic Carrots", price: "$3/kg",   },
        { id: "3", title: "Free-Range Eggs", price: "$4/dozen",  },
        // Add more items here
      ];
      setTimeout(() => {
        setListings(data);
        setLoading(false);
      }, 2000); // Simulated delay
    } catch (error) {
      console.error("Error fetching listings:", error);
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement filtering logic if needed
  };

  const renderListingItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.cardContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('marketplace')}</Text>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={30} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Loading Indicator or Listings */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={listings}
          renderItem={renderListingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate("Explore")}>
          <Ionicons name="search" size={24} color={colors.primary} />
          <Text style={styles.footerText}>{t('explore')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate("Orders")}>
          <Ionicons name="cart-outline" size={24} color={colors.primary} />
          <Text style={styles.footerText}>{t('orders')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate("Account")}>
          <Ionicons name="person-outline" size={24} color={colors.primary} />
          <Text style={styles.footerText}>{t('account')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
    paddingBottom: 80, // Added padding to prevent footer overlap
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    color: colors.primary,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightGray,
    borderRadius: 50,
    padding: 10,
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontFamily: "Poppins_400Regular",
    color: colors.secondary,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: colors.primary,
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: colors.secondary,
    marginTop: 5,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: colors.lightGray,
  },
  footerButton: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: colors.primary,
    marginTop: 5,
  },
});
