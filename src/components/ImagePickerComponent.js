import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../api/api';

const ImagePickerComponent = () => {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleUpload = async () => {
    if (image) {
      try {
        const formData = new FormData();
        formData.append('photo', {
          uri: image,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });
        await uploadImage(formData);
        Alert.alert('Image uploaded successfully!');
      } catch (error) {
        console.error(error);
        Alert.alert('Image upload failed.');
      }
    } else {
      Alert.alert('No image selected.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        <Button title="Take a photo" onPress={takePhoto} />
      </View>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Upload Image" onPress={handleUpload} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});

export default ImagePickerComponent;
