import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { colors } from "../utils/color";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { useTranslation } from "react-i18next";
import LanguageSelector from '../components/LanguageSelector'; // Adjust the path as necessary
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  const { t } = useTranslation();

  // Request location access
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied.");
        Alert.alert(
          "Location Access Required",
          "We need location access to show relevant information.",
          [{ text: "OK" }]
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const handleLogin = () => {
    navigation.navigate("LOGIN");
  };

  const handleSignup = () => {
    navigation.navigate("SIGNUP");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require("../assets/logo-new.png")} style={styles.logo} />
      <Image
        source={require("../assets/banner-removebg.png")}
        style={styles.banner}
      />
      <Text style={styles.title}>{t('welcome')}</Text>
      <Text style={styles.subtitle}>{t('subtitle')}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.loginButtonWrapper,
            { backgroundColor: colors.primary },
          ]}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>{t('login')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.loginButtonWrapper]}
          onPress={handleSignup}
        >
          <Text style={styles.signupButtonText}>{t('signup')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.languageSelectorContainer}>
        <LanguageSelector />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.yellow,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.yellow,
  },
  logo: {
    height: width * 0.1, // Responsive height
    width: width * 0.5, // Responsive width
    marginVertical: width * 0.1, // Responsive margin
  },
  banner: {
    height: width * 0.6, // Responsive height
    width: width * 0.9, // Responsive width
    marginVertical: width * 0.05, // Responsive margin
  },
  title: {
    fontSize: width * 0.1, // Responsive font size
    color: colors.primary,
    paddingHorizontal: width * 0.05,
    textAlign: "center",
    marginVertical: width * 0.05,
    fontFamily: "Poppins_700Bold",
  },
  subtitle: {
    fontSize: width * 0.05, // Responsive font size
    paddingHorizontal: width * 0.05,
    textAlign: "center",
    color: colors.secondary,
    marginVertical: width * 0.05,
    fontFamily: "Poppins_400Regular",
  },
  buttonContainer: {
    marginTop: width * 0.05,
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.primary,
    width: "70%",
    height: width * 0.15, // Responsive height
    borderRadius: width * 0.1, // Responsive radius
  },
  loginButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    borderRadius: width * 0.1, // Responsive radius
  },
  loginButtonText: {
    color: colors.white,
    fontSize: width * 0.045, // Responsive font size
    fontFamily: "Poppins_700Bold",
  },
  signupButtonText: {
    fontSize: width * 0.045, // Responsive font size
    fontFamily: "Poppins_700Bold",
  },
  languageSelectorContainer: {
    marginVertical: width * 0.05,
    justifyContent: "space-between",
  },
});

export default HomeScreen;
