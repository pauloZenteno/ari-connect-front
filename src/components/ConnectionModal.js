import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import LottieView from 'lottie-react-native';

// Importamos las animaciones desde la nueva ruta en src
const animations = {
  loading: require('../assets/animations/loading.json'),
  success: require('../assets/animations/success.json'),
  error: require('../assets/animations/error.json'),
};

export default function ConnectionModal({ visible, status }) {
  const animationRef = useRef(null);

  useEffect(() => {
    if (visible && animationRef.current) {
      animationRef.current.play();
    }
  }, [visible, status]);

  const getAnimationSource = () => {
    switch (status) {
      case 'connecting': return animations.loading;
      case 'success': return animations.success;
      case 'error': return animations.error;
      default: return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connecting': return "Estableciendo conexión segura...";
      case 'success': return "¡Conexión Exitosa!";
      case 'error': return "Conexión Denegada";
      default: return "";
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <LottieView
            ref={animationRef}
            source={getAnimationSource()}
            autoPlay
            loop={status === 'connecting'}
            style={styles.lottie}
            resizeMode="contain"
          />
          <Text style={[
            styles.modalText, 
            status === 'error' && styles.errorText,
            status === 'success' && styles.successText
          ]}>
            {getStatusText()}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 25,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  lottie: {
    width: 180,
    height: 180,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 10
  },
  successText: { color: '#059669' },
  errorText: { color: '#DC2626' },
});