import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView
} from "react-native";
import React, { useState } from "react";
import { colors } from "../utils/color";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation } from "@react-navigation/native";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { useTranslation } from "react-i18next"; 

const SignupScreen = () => {
  const navigation = useNavigation();
  const [secureEntery, setSecureEntery] = useState(true);
  const [role, setRole] = useState('');  
  const [fullName, setFullName] = useState('');  
  const [email, setEmail] = useState('');  
  const [phone, setPhone] = useState('');  // Added state for phone number
  const [password, setPassword] = useState('');
  const { t } = useTranslation();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {
    navigation.navigate("LOGIN");
  };

  const handleSignup = async () => {
    // Simple form validation
    if (!fullName || !email || !phone || !password || !role) {
      alert('Please fill in all fields.');
      return;
    }
  
    try {
      const response = await fetch('http://13.200.59.120:5000/api/auth/register', { // Ensure the endpoint matches your backend route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Fullname: fullName,
          email,
          password,
          phone,  // Using phone as username
          role,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Signup successful:', data);
        navigation.navigate('LOGIN');
      } else {
        console.error('Error:', data.message);
        alert('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons name={"arrow-back-outline"} color={colors.primary} size={25} />
      </TouchableOpacity>
      <Image source={require("../assets/logo-new.png")} style={styles.logo}/>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>{t('greeting')}</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name={"person-outline"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder={t('NamePlaceholder')}
            placeholderTextColor={colors.secondary}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name={"mail-outline"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder={t('emailPlaceholder')}
            placeholderTextColor={colors.secondary}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <SimpleLineIcons name={"lock"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder={t('passwordPlaceholder')}
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

        {/* Phone Number Input */}
        <View style={styles.inputContainer}>
          <SimpleLineIcons
            name={"screen-smartphone"}
            size={30}
            color={colors.secondary}
          />
          <TextInput
            style={styles.textInput}
            placeholder={t('phonePlaceholder')}
            placeholderTextColor={colors.secondary}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>
        <View style={styles.roleContainer}>
          <Text style={styles.roleText}>{t('roles')}</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[styles.roleButton, role === 'farmer' && styles.selectedRoleButton]}
              onPress={() => setRole('farmer')}
            >
              <Text style={styles.roleButtonText}>{t('farmer')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, role === 'consumer' && styles.selectedRoleButton]}
              onPress={() => setRole('consumer')}
            >
              <Text style={styles.roleButtonText}>{t('consumer')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.loginButtonWrapper} onPress={handleSignup}>
          <Text style={styles.loginText}>{t('signup')}</Text>
        </TouchableOpacity>
         <Text style={styles.continueText}>{t('continue')}</Text>
        <TouchableOpacity style={styles.googleButtonContainer}>
          <Image
            source={require("../assets/google.png")}
            style={styles.googleImage}
          />
          <Text style={styles.googleText}>{t('google')}</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>{t('already Have An Account')}</Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.signupText}>{t('login')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.gray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 44,
    width: 180,
    marginVertical: 40,
    marginBottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    marginVertical: 20,
  },
  headingText: {
    fontSize: 32,
    color: colors.primary,
    fontFamily: "Poppins_700Bold", 
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
    fontFamily: "Poppins_400Regular", 
  },
  roleContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  roleText: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: colors.primary,
    marginBottom: 10,
  },
  roleButtons: {
    flexDirection: "row",
    gap: 10,
  },
  roleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  selectedRoleButton: {
    backgroundColor: colors.primary,
  },
  roleButtonText: {
    fontFamily: "Poppins_400Regular",
    color: colors.secondary,
  },
  loginButtonWrapper: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginTop: 20,
  },
  loginText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: "Poppins_700Bold", 
    textAlign: "center",
    padding: 10,
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    fontFamily: "Poppins_400Regular", 
    color: colors.primary,
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
    fontFamily: "Poppins_700Bold", 
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
    fontFamily: "Poppins_400Regular", 
  },
  signupText: {
    color: colors.primary,
    fontFamily: "Poppins_700Bold", 
  },
});
