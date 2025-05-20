import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../utils/color";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { useTranslation } from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

// Use your development machine's IP address instead of localhost
const API_BASE_URL = "http://192.168.29.146:5000"; // Replace with your actual IP address

const LoginScreen = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  // Load fonts
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Show loading screen until fonts are loaded
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.softforest} />
      </View>
    );
  }

  const { t } = useTranslation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSignup = () => {
    navigation.navigate("SIGNUP");
  };

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Input Required", "Please enter both phone number and password");
      return;
    }
    
    setLoading(true);
    
    const loginData = {
      phone: phone,
      password: password,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: "include",
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store user data
        await AsyncStorage.setItem('userEmail', data.email);
        await AsyncStorage.setItem('userRole', data.role);
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userPhone', data.phone);
        await AsyncStorage.setItem('userName', data.Fullname);

        if (data.role === "farmer") {
          navigation.navigate("SELLER");
        } else if (data.role === "consumer") {
          navigation.navigate("BUYER");
        }
      } else {
        Alert.alert("Login Failed", data.message || "Please check your credentials");
      }
    } catch (error) {
      Alert.alert("Connection Error", "Unable to connect to the server. Please check that the server is running and that you're connected to the same network.");
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.greentea} />
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.softforest} />
        </View>
      )}
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <Ionicons name="arrow-back-outline" color={colors.softforest} size={22} />
              </TouchableOpacity>
              <Image source={require("../assets/logo-new.png")} style={styles.logo} resizeMode="contain" />
            </View>
            
            <View style={styles.headingContainer}>
              <Text style={styles.headingText}>{t('greetinglogin')}</Text>
              <Text style={styles.subheadingText}>{t('loginSubhead') || "Sign in to access your account"}</Text>
            </View>
            
            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                  <SimpleLineIcons name="screen-smartphone" size={22} color={colors.secondary} />
                  <TextInput
                    style={styles.textInput}
                    placeholder={t("phonePlaceholder")}
                    placeholderTextColor={colors.secondary}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <SimpleLineIcons name="lock" size={22} color={colors.secondary} />
                  <TextInput
                    style={styles.textInput}
                    placeholder={t("passwordPlaceholder")}
                    placeholderTextColor={colors.secondary}
                    secureTextEntry={secureEntry}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setSecureEntry((prev) => !prev)}
                    style={styles.eyeIcon}
                  >
                    {/* Fixed: Replaced "eye-blocked" with "eye-close" which is available in SimpleLineIcons */}
                    <SimpleLineIcons 
                      name={secureEntry ? "eye" : "eye-close"} 
                      size={18} 
                      color={colors.secondary} 
                    />
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity style={styles.forgotPasswordContainer}>
                  <Text style={styles.forgotPasswordText}>{t("forgotPassword")}</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
              >
                <LinearGradient
                  colors={[colors.softforest, colors.jade]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.loginText}>{t("login")}</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>{t("continue")}</Text>
                <View style={styles.divider} />
              </View>
              
              <TouchableOpacity style={styles.googleButton}>
                <Image source={require("../assets/google.png")} style={styles.googleImage} />
                <Text style={styles.googleText}>{t("google")}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.footerContainer}>
              <Text style={styles.accountText}>{t("noAccount") || "Don't have an account?"}</Text>
              <TouchableOpacity onPress={handleSignup}>
                <Text style={styles.signupText}>{t("signup")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.greentea,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.greentea,
  },
  loadingOverlay: {
    position: "absolute",
    zIndex: 10,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(254, 246, 235, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  backButton: {
    height: 42,
    width: 42,
    backgroundColor: colors.green,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  logo: {
    height: 36,
    width: width * 0.4,
  },
  headingContainer: {
    marginBottom: 32,
  },
  headingText: {
    fontSize: 28,
    color: colors.primary,
    fontFamily: "Poppins_700Bold",
    marginBottom: 8,
  },
  subheadingText: {
    fontSize: 16,
    color: colors.secondary,
    fontFamily: "Poppins_400Regular",
  },
  formContainer: {
    width: "100%",
  },
  inputWrapper: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontFamily: "Poppins_400Regular",
    fontSize: 15,
    color: colors.primary,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    color: colors.softforest,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },
  loginButton: {
    height: 54,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: colors.softforest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 16,
  },
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 28,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray,
  },
  dividerText: {
    paddingHorizontal: 16,
    color: colors.secondary,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
  },
  googleButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  googleImage: {
    height: 20,
    width: 20,
    marginRight: 12,
  },
  googleText: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: "Poppins_600SemiBold",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    paddingBottom: 16,
  },
  accountText: {
    color: colors.secondary,
    fontFamily: "Poppins_400Regular",
    marginRight: 4,
  },
  signupText: {
    color: colors.softforest,
    fontFamily: "Poppins_600SemiBold",
  },
});

export default LoginScreen;