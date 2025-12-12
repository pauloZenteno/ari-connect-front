import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, 
  Keyboard, TouchableWithoutFeedback, Image, ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

const SYNC_URL = 'http://192.168.100.52:3000/api/biometric/sync-user';

export default function RegisterUserScreen({ route, navigation }) {
  const { targetIp, targetPass } = route.params; 

  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [photoBase64, setPhotoBase64] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert("Error", "Se requiere permiso de cámara");

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) processImage(result.assets[0].uri);
  };

  const processImage = async (uri) => {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri, [{ resize: { width: 400 } }], 
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    setPhotoUri(manipResult.uri);
    setPhotoBase64(manipResult.base64);
  };

  const handleRegister = async () => {
    if (!userId || !userName) return Alert.alert("Faltan datos", "ID y Nombre son obligatorios.");
    if (!photoBase64) return Alert.alert("Falta Foto", "La foto es obligatoria para ser visible.");

    setLoading(true);
    Keyboard.dismiss();

    try {
      const response = await fetch(SYNC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userId,
          name: userName,
          photo: photoBase64,
          deviceIp: targetIp,
          devicePass: targetPass
        }),
      });

      if (response.ok) {
        Alert.alert("¡Registro Exitoso!", `Usuario ${userName} creado en el dispositivo ${targetIp}`);
        setUserId('');
        setUserName('');
        setPhotoUri(null);
        setPhotoBase64(null);
      } else {
        Alert.alert("Error", "El biométrico rechazó la operación.");
      }
    } catch (error) {
      Alert.alert("Error de Red", "No se pudo contactar al servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="#4A5568" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Nuevo Empleado</Text>
            <View style={{width: 24}} /> 
        </View>

        <View style={styles.statusBox}>
            <View style={styles.dot} />
            <Text style={styles.statusText}>Conectado a: {targetIp}</Text>
        </View>

        <View style={styles.photoSection}>
            <TouchableOpacity onPress={takePhoto} style={styles.avatarWrapper}>
                {photoUri ? (
                    <Image source={{ uri: photoUri }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Ionicons name="camera" size={32} color="#CBD5E0" />
                        <Text style={styles.avatarText}>Tomar Foto</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>

        <View style={styles.form}>
            <Text style={styles.label}>ID de Empleado</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={userId} onChangeText={setUserId} />

            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput style={styles.input} value={userName} onChangeText={setUserName} />

            <TouchableOpacity style={styles.submitBtn} onPress={handleRegister} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitText}>REGISTRAR USUARIO</Text>}
            </TouchableOpacity>
        </View>

      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F7FAFC', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3748' },
  statusBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6FFFA', padding: 10, borderRadius: 8, marginBottom: 30, alignSelf: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#38B2AC', marginRight: 8 },
  statusText: { color: '#2C7A7B', fontWeight: '600', fontSize: 14 },
  photoSection: { alignItems: 'center', marginBottom: 30 },
  avatarWrapper: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  avatar: { width: 140, height: 140, borderRadius: 70, borderWidth: 4, borderColor: 'white' },
  avatarPlaceholder: { width: 140, height: 140, borderRadius: 70, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed' },
  avatarText: { color: '#A0AEC0', marginTop: 5, fontSize: 12 },
  form: { backgroundColor: 'white', padding: 25, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  label: { fontSize: 14, fontWeight: '600', color: '#4A5568', marginBottom: 8, marginTop: 10 },
  input: { backgroundColor: '#F7FAFC', borderRadius: 10, padding: 15, fontSize: 16, borderWidth: 1, borderColor: '#E2E8F0', color: '#2D3748' },
  submitBtn: { backgroundColor: '#3182CE', marginTop: 30, padding: 16, borderRadius: 12, alignItems: 'center', shadowColor: '#3182CE', shadowOpacity: 0.3, shadowOffset: {width: 0, height: 4}, elevation: 4 },
  submitText: { color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 },
});