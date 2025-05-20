import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../utils/color";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { useTranslation } from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const LoginScreen = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [secureEntery, setSecureEntery] = useState(true);
  const [loading, setLoading] = useState(false);

  // Load fonts
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  // Show loading screen until fonts are loaded
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const { t } = useTranslation(); // Use translation hook

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSignup = () => {
    navigation.navigate("SIGNUP");
  };

  

const handleLogin = async () => {
  const loginData = {
    phone: phone,
    password: password,
  };

  try {
    const response = await fetch("http://13.200.59.120:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
      credentials: "include", // Use this if you're working with cookies or sessions
    });

    const data = await response.json();
    console.log(data); // Log the entire response

    if (response.ok) {
      console.log("Login success");
      console.log("Role:", data.role); // Check if role is available
      
      // Store user's email
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
      console.log("Login failed:", data.message);
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
};

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
      )}
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons name={"arrow-back-outline"} color={colors.primary} size={25} />
      </TouchableOpacity>
      <Image source={require("../assets/logo-new.png")} style={styles.logo} />
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>{t('greetinglogin')}</Text>
      </View>
      {/* form  */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <SimpleLineIcons name={"screen-smartphone"} size={30} color={colors.secondary} />
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
          <SimpleLineIcons name={"lock"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder={t("passwordPlaceholder")}
            placeholderTextColor={colors.secondary}
            secureTextEntry={secureEntery}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => {
              setSecureEntery((prev) => !prev);
            }}
          >
            <SimpleLineIcons name={"eye"} size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>{t("forgotPassword")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginButtonWrapper}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginText}>{t("login")}</Text>
        </TouchableOpacity>
        <Text style={styles.continueText}>{t("continue")}</Text>
        <TouchableOpacity style={styles.googleButtonContainer}>
          <Image source={require("../assets/google.png")} style={styles.googleImage} />
          <Text style={styles.googleText}>{t("google")}</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>don't have an account !</Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupText}>{t("signup")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.yellow,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  loading: {
    position: "absolute",
    zIndex: 10,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  logo: {
    height: 44,
    width: 180,
    marginVertical: 40,
    marginBottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.sunflower,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginVertical: 20,
  },
  headingText: {
    fontSize: 32,
    color: colors.primary,
    fontFamily: "Poppins_700Bold", // Apply Poppins Bold
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: "Poppins_400Regular", // Apply Poppins Regular
  },
  forgotPasswordText: {
    textAlign: "right",
    color: colors.primary,
    marginVertical: 10,
    fontFamily: "Poppins_400Regular", // Apply Poppins Regular
  },
  loginButtonWrapper: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginTop: 20,
  },
  loginText: {
    color: colors.white,
    fontSize: 20,
    textAlign: "center",
    padding: 10,
    fontFamily: "Poppins_700Bold", // Apply Poppins Bold
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    color: colors.primary,
    fontFamily: "Poppins_400Regular", // Apply Poppins Regular
  },
  googleButtonContainer: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  googleImage: {
    height: 20,
    width: 20,
  },
  googleText: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold", // Apply Poppins Bold
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: colors.primary,
    fontFamily: "Poppins_400Regular", // Apply Poppins Regular
  },
  signupText: {
    color: colors.primary,
    fontFamily: "Poppins_700Bold", // Apply Poppins Bold
  },
});
