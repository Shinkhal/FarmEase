import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/color";
import { useTranslation } from "react-i18next";

const OtpVerificationScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      // Simulate OTP verification process
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
      // After successful OTP verification, navigate to the login screen
      navigation.navigate("LOGIN");
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>{t('enterOtp')}</Text>
      <TextInput
        style={styles.otpInput}
        placeholder={t('otpPlaceholder')}
        keyboardType="numeric"
        maxLength={6} // Assuming OTP is 6 digits
        value={otp}
        onChangeText={setOtp}
      />
      <TouchableOpacity
        style={styles.verifyButton}
        onPress={handleVerifyOtp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <Text style={styles.verifyButtonText}>{t('verify')}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default OtpVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
    justifyContent: "center",
  },
  headingText: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 10,
    padding: 15,
    fontFamily: "Poppins_400Regular",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  verifyButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  verifyButtonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
  },
});
