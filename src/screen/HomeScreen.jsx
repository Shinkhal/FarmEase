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
  SafeAreaView,
  StatusBar,
} from "react-native";
import * as Location from "expo-location";
import { colors } from "../utils/color";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { useTranslation } from "react-i18next";
import LanguageSelector from '../components/LanguageSelector';
import { Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.greentea} />
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Image source={require("../assets/logo-new.png")} style={styles.logo} resizeMode="contain" />
        </View>
        
        <View style={styles.bannerContainer}>
          <Image
            source={require("../assets/banner-removebg.png")}
            style={styles.banner}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{t('welcome')}</Text>
          <Text style={styles.subtitle}>{t('subtitle')}</Text>
          
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleLogin}
            >
              <LinearGradient
                colors={[colors.softforest, colors.jade]}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryButtonText}>{t('login')}</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSignup}
            >
              <Text style={styles.secondaryButtonText}>{t('signup')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.languageSelectorContainer}>
          <LanguageSelector />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.greentea,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.greentea,
  },
  headerContainer: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logo: {
    height: 40,
    width: width * 0.5,
  },
  bannerContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 24,
  },
  banner: {
    height: width * 0.5,
    width: width * 0.85,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "Poppins_700Bold",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: colors.secondary,
    marginBottom: 36,
    fontFamily: "Poppins_400Regular",
    lineHeight: 24,
  },
  actionContainer: {
    width: '100%',
    marginTop: 8,
    gap: 16,
  },
  primaryButton: {
    height: 54,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.softforest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  secondaryButton: {
    height: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.softforest,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  secondaryButtonText: {
    color: colors.softforest,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  languageSelectorContainer: {
    marginTop: 40,
    width: '100%',
    paddingHorizontal: 24,
  },
});

export default HomeScreen;