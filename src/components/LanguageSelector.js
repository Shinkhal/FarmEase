import React from 'react';
import { View, Button } from 'react-native';
import i18n from '../i18n/i18n.config';

const LanguageSelector = () => {
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
      <Button title="English" onPress={() => changeLanguage('en')} />
      <Button title="हिन्दी" onPress={() => changeLanguage('hi')} />
    </View>
  );
};

export default LanguageSelector;
