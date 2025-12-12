import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, 
  StatusBar, Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const BACKEND_URL = 'http://192.168.100.52:3000/api/biometric/test';

const DEVICES = [
  { id: '1', brand: 'Dahua', model: '3CODE', serial: 'wja6234400022' }
];

export default function HomeScreen({ navigation }) {
  const [expandedId, setExpandedId] = useState('1'); 
  const [deviceIp, setDeviceIp] = useState('');
  const [devicePass, setDevicePass] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberIp, setRememberIp] = useState(false);
  const [searchText, setSearchText] = useState('');

  // --- ESTADOS PARA ANIMACIÓN ---
  const [modalVisible, setModalVisible] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('idle'); // 'idle' | 'connecting' | 'success' | 'error'
  
  // Referencia para controlar el Lottie
  const animationRef = useRef(null);

  // Efecto para manejar los cambios de animación
  useEffect(() => {
    if (modalVisible && animationRef.current) {
        animationRef.current.play();
    }
  }, [modalVisible, connectionStatus]);

  // --- LÓGICA DE CONEXIÓN CON ANIMACIONES ---
  const handleConnect = async () => {
    if (!deviceIp || !devicePass) {
      // Usamos alert normal solo para validación local rápida
      alert("Campos Requeridos: Ingresa IP y Contraseña.");
      return;
    }

    // 1. Mostrar Modal y Animación de "Probando..."
    setConnectionStatus('connecting');
    setModalVisible(true);

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            deviceIp: deviceIp,
            devicePass: devicePass
        })
      });

      if (response.ok) {
        // 2. Éxito: Cambiar animación a "Aprobada"
        setConnectionStatus('success');
        
        // Esperar 2 segundos para que el usuario disfrute la animación de éxito antes de cambiar de pantalla
        setTimeout(() => {
            setModalVisible(false);
            navigation.navigate('RegisterUser', { 
                targetIp: deviceIp,
                targetPass: devicePass
            });
        }, 2500); 

      } else {
        // 3. Error del Biométrico: Cambiar animación a "Denegada"
        handleError();
      }
    } catch (error) {
      // 4. Error de Red: Cambiar animación a "Denegada"
      handleError();
    }
  };

  const handleError = () => {
    setConnectionStatus('error');
    // Esperar 2.5 segundos viendo el error y luego cerrar
    setTimeout(() => {
        setModalVisible(false);
    }, 2500);
  };

  // Función auxiliar para elegir el archivo JSON correcto
  const getAnimationSource = () => {
    switch (connectionStatus) {
        case 'connecting': return require('../../assets/animations/loading.json'); // Tu archivo "Probando"
        case 'success':    return require('../../assets/animations/success.json'); // Tu archivo "Aprobada"
        case 'error':      return require('../../assets/animations/error.json');   // Tu archivo "Denegada"
        default:           return null;
    }
  };

  // Texto auxiliar debajo de la animación
  const getStatusText = () => {
      switch (connectionStatus) {
          case 'connecting': return "Estableciendo conexión segura...";
          case 'success':    return "¡Conexión Exitosa!";
          case 'error':      return "Conexión Denegada";
          default: return "";
      }
  };

  const renderItem = ({ item }) => {
    const isExpanded = item.id === expandedId;

    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity 
          activeOpacity={0.8} 
          style={[styles.card, isExpanded && styles.cardExpanded]} 
          onPress={() => setExpandedId(isExpanded ? null : item.id)}
        >
          <View style={styles.cardHeader}>
            <View style={styles.infoContainer}>
                <View style={styles.titleRow}>
                    <Text style={styles.brandText}>{item.brand}</Text>
                    <Text style={styles.modelText}>{item.model}</Text>
                </View>
                <Text style={styles.serialText}>{item.serial}</Text>
            </View>
            <Ionicons name="create-outline" size={20} color="#60A5FA" />
          </View>

          {isExpanded && (
            <View style={styles.expandedContent}>
              <View style={styles.divider} />
              
              <View style={styles.inputWrapper}>
                <TextInput 
                  style={styles.textInput}
                  placeholder="IP: 10.10.100.220"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={deviceIp}
                  onChangeText={setDeviceIp}
                />
              </View>

              <View style={[styles.inputWrapper, styles.passwordWrapper, { marginTop: 10 }]}>
                <TextInput 
                  style={[styles.textInput, { flex: 1 }]}
                  placeholder="Contraseña"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!isPasswordVisible} 
                  value={devicePass}
                  onChangeText={setDevicePass}
                />
                <TouchableOpacity 
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={{ padding: 10 }}
                >
                    <Ionicons 
                        name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                        size={22} 
                        color="#9CA3AF" 
                    />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.checkboxRow} 
                onPress={() => setRememberIp(!rememberIp)}
              >
                <Ionicons 
                    name={rememberIp ? "checkbox" : "square-outline"} 
                    size={22} 
                    color={rememberIp ? "#34D399" : "#9CA3AF"} 
                />
                <Text style={styles.checkboxLabel}>Recordar IP</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.connectButton}
                onPress={handleConnect}
              >
                  <Text style={styles.connectButtonText}>Conectar</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* --- MODAL DE ANIMACIONES --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {}} // Evita cierre accidental en Android
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <LottieView
                    ref={animationRef}
                    source={getAnimationSource()}
                    autoPlay
                    loop={connectionStatus === 'connecting'} // Solo loopear si está cargando
                    style={styles.lottie}
                    resizeMode="contain"
                />
                <Text style={[
                    styles.modalText, 
                    connectionStatus === 'error' && styles.errorText,
                    connectionStatus === 'success' && styles.successText
                ]}>
                    {getStatusText()}
                </Text>
            </View>
        </View>
      </Modal>

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Dispositivos biométricos</Text>

        <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#9CA3AF" style={{marginRight: 10}} />
            <TextInput 
                style={styles.searchInput}
                placeholder="Buscar"
                placeholderTextColor="#9CA3AF"
                value={searchText}
                onChangeText={setSearchText}
            />
            <Ionicons name="mic-outline" size={20} color="#9CA3AF" />
        </View>

        <FlatList
            data={DEVICES}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  
  // Estilos del Modal Lottie
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)', // Fondo semitransparente oscuro
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
  successText: { color: '#059669' }, // Verde bonito
  errorText: { color: '#DC2626' },   // Rojo alerta

  // Estilos Generales
  body: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginTop: 20, marginBottom: 15, textAlign: 'center' },
  
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2
  },
  searchInput: { flex: 1, fontSize: 16, color: '#374151' },
  listContent: { paddingBottom: 30 },
  cardContainer: { marginBottom: 15 },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3,
    borderWidth: 1, borderColor: 'transparent'
  },
  cardExpanded: { borderColor: '#E5E7EB' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  infoContainer: { flexDirection: 'column', flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  brandText: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginRight: 8 },
  modelText: { fontSize: 14, fontWeight: '400', color: '#4B5563' },
  serialText: { fontSize: 12, color: '#9CA3AF' },
  expandedContent: { marginTop: 15 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginBottom: 15 },
  inputWrapper: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 5,
  },
  textInput: {
    padding: 12,
    fontSize: 16,
    color: '#374151',
    width: '100%',
  },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 5 },
  checkboxLabel: { color: '#6B7280', marginLeft: 8, fontSize: 14 },
  connectButton: {
    backgroundColor: '#D1FAE5', 
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  connectButtonText: {
    color: '#065F46', 
    fontWeight: '600',
    fontSize: 16
  }
});