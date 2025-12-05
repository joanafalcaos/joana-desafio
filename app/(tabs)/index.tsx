import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { userService, User } from '../../services/user';
import { mediaService, MediaItem } from '../../services/media';

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storagePercentage, setStoragePercentage] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Animar barra de progresso quando os dados de armazenamento mudarem
    progress.value = withTiming(storagePercentage / 100, { duration: 1000 });
  }, [storagePercentage]);

  const fetchData = async () => {
    try {
      // Buscar dados do usuário e mídia em paralelo
      const [userData, mediaData] = await Promise.all([
        userService.getMe(),
        mediaService.getMedia(),
      ]);

      setUser(userData);
      setMediaItems(mediaData);

      // Calcular armazenamento usado
      const totalSize = mediaService.calculateTotalSize(mediaData);
      setStorageUsed(totalSize);

      // Calcular porcentagem de uso (5GB = 5 * 1024 * 1024 * 1024 bytes)
      const percentage = mediaService.calculateStoragePercentage(totalSize);
      setStoragePercentage(percentage);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setLoading(false);
    }
  };

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E87722" />
      </View>
    );
  }

  // Extrair primeiro nome do usuário
  const firstName = user?.name?.split(' ')[0] || 'Usuário';

  // Formatar tamanho do armazenamento
  const formattedStorage = mediaService.formatBytes(storageUsed);
  const storageDisplay = `${formattedStorage} DE 5 GB`;

  return (
    <View style={styles.container}>
      {/* Mensagem de Boas-Vindas */}
      <Animated.View
        entering={FadeInDown.duration(600).delay(200)}
        style={styles.welcomeContainer}
      >
        <Text style={styles.welcomeText}>Bem-vindo,</Text>
        <Text style={styles.userName}>{firstName}.</Text>
      </Animated.View>

      {/* Seção de Acesso Rápido */}
      <Animated.View
        entering={FadeInUp.duration(600).delay(400)}
        style={styles.quickAccessContainer}
      >
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>

        {/* Card de Armazenamento */}
        <Animated.View
          entering={SlideInRight.duration(600).delay(600)}
          style={styles.storageCard}
        >
          <View style={styles.storageHeader}>
            <View style={styles.storageIconContainer}>
              <MaterialCommunityIcons
                name="folder"
                size={24}
                color="#E87722"
              />
            </View>
            <View style={styles.storageInfo}>
              <Text style={styles.storageLabel}>Armazenamento</Text>
              <Text style={styles.storageValue}>{storageDisplay}</Text>
            </View>
          </View>

          {/* Barra de Progresso */}
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[styles.progressBar, animatedProgressStyle]}
            />
          </View>
        </Animated.View>

        {/* Botão de Upload */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(800)}
        >
          <TouchableOpacity
            style={styles.uploadButton}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="plus"
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.uploadButtonText}>Fazer Upload</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Navegação Inferior */}
      <Animated.View
        entering={FadeIn.duration(600).delay(1000)}
        style={styles.bottomNav}
      >
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="home"
            size={28}
            color="#E87722"
          />
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="history"
            size={28}
            color="#999999"
          />
          <Text style={styles.navText}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="camera"
            size={28}
            color="#999999"
          />
          <Text style={styles.navText}>Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="account"
            size={28}
            color="#999999"
          />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  welcomeContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E87722',
  },
  quickAccessContainer: {
    paddingHorizontal: 24,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
  },
  storageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  storageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  storageIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF5EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  storageInfo: {
    flex: 1,
  },
  storageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  storageValue: {
    fontSize: 12,
    fontWeight: '400',
    color: '#666666',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#E87722',
    borderRadius: 4,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E87722',
    height: 56,
    borderRadius: 16,
    shadowColor: '#E87722',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  navTextActive: {
    color: '#E87722',
    fontWeight: '600',
  },
});
