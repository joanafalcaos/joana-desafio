import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Dimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { MediaItem, mediaService } from '../../services/media';
import { Video, ResizeMode } from 'expo-av';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function GalleryScreen() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const items = await mediaService.getMedia();
      setMediaItems(items);
    } catch (error) {
      console.error('Erro ao buscar mídias:', error);
      Alert.alert('Erro', 'Não foi possível carregar as mídias');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedia = async () => {
    try {
      // Solicitar permissão para acessar a galeria
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permissão negada', 'É necessário permitir o acesso à galeria');
        return;
      }

      // Abrir seletor de mídia
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        await uploadMedia(asset);
      }
    } catch (error) {
      console.error('Erro ao selecionar mídia:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a mídia');
    }
  };

  const uploadMedia = async (asset: ImagePicker.ImagePickerAsset) => {
    try {
      setUploading(true);

      // Extrair nome do arquivo da URI
      const fileName = asset.uri.split('/').pop() || 'media';

      // Para vídeos, sempre usar video/mp4 independente do formato original
      // O servidor pode não aceitar video/quicktime
      let mimeType = asset.mimeType || 'image/jpeg';
      if (asset.type === 'video') {
        mimeType = 'video/mp4';
      }

      // Fazer upload
      await mediaService.uploadMedia(asset.uri, fileName, mimeType);

      // Recarregar todas as mídias do servidor
      await fetchMedia();

      Alert.alert('Sucesso', 'Mídia enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      Alert.alert('Erro', 'Não foi possível fazer o upload da mídia');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = (item: MediaItem) => {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja deletar essa mídia?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: async () => {
            try {
              await mediaService.deleteMedia(item.id);
              await fetchMedia();
              Alert.alert('Sucesso', 'Mídia deletada com sucesso!');
            } catch (error) {
              console.error('Erro ao deletar mídia:', error);
              Alert.alert('Erro', 'Não foi possível deletar a mídia');
            }
          },
        },
      ]
    );
  };

  const handleOpenMedia = (item: MediaItem) => {
    setSelectedMedia(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => {
      setSelectedMedia(null);
    }, 300);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E87722" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Galeria</Text>
      </View>

      {/* Loading overlay durante upload */}
      {uploading && (
        <View style={styles.uploadingOverlay}>
          <ActivityIndicator size="large" color="#E87722" />
          <Text style={styles.uploadingText}>Enviando mídia...</Text>
        </View>
      )}

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Seção Suas Mídias */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(100)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Suas Mídias</Text>

          {/* Botão Adicionar Mídia */}
          <TouchableOpacity
            style={styles.addMediaButton}
            onPress={handleAddMedia}
            activeOpacity={0.7}
            disabled={uploading}
          >
            <View style={styles.addMediaIconContainer}>
              <MaterialCommunityIcons
                name="plus"
                size={32}
                color="#E87722"
              />
            </View>
            <Text style={styles.addMediaText}>Adicionar Mídia</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Lista de Mídias */}
        {mediaItems.length > 0 && (
          <Animated.View
            entering={FadeInUp.duration(400).delay(200)}
            style={styles.mediaGrid}
          >
            {mediaItems.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInUp.duration(400).delay(index * 50)}
                style={styles.mediaCard}
              >
                <TouchableOpacity
                  onPress={() => handleOpenMedia(item)}
                  activeOpacity={0.9}
                  style={styles.mediaCardTouchable}
                >
                  <Image
                    source={{ uri: item.thumbnailUrl || item.url }}
                    style={styles.mediaImage}
                    resizeMode="cover"
                  />
                  {item.mimeType.startsWith('video') && (
                    <View style={styles.videoIndicator}>
                      <MaterialCommunityIcons
                        name="play-circle"
                        size={32}
                        color="#FFFFFF"
                      />
                    </View>
                  )}
                </TouchableOpacity>
                <View style={styles.mediaInfo}>
                  <View style={styles.mediaInfoContent}>
                    <View style={styles.mediaTextContainer}>
                      <Text style={styles.mediaName} numberOfLines={1}>
                        {item.originalName}
                      </Text>
                      <Text style={styles.mediaSize}>
                        {mediaService.formatBytes(item.size)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteMedia(item)}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={18}
                        color="#E87722"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            ))}
          </Animated.View>
        )}

        {/* Estado Vazio */}
        {mediaItems.length === 0 && (
          <Animated.View
            entering={FadeIn.duration(600).delay(400)}
            style={styles.emptyStateContainer}
          >
            <View style={styles.emptyStateIconContainer}>
              <MaterialCommunityIcons
                name="folder-open"
                size={64}
                color="#E87722"
              />
            </View>
            <Text style={styles.emptyStateTitle}>Nenhuma mídia</Text>
            <Text style={styles.emptyStateSubtitle}>
              Comece fazendo upload
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      {/* Modal de Visualização de Mídia */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header do Modal */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderInfo}>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {selectedMedia?.originalName}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {selectedMedia && mediaService.formatBytes(selectedMedia.size)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={handleCloseModal}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="close" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Conteúdo da Mídia */}
            <View style={styles.modalMediaContainer}>
              {selectedMedia && (
                <>
                  {selectedMedia.mimeType.startsWith('video') ? (
                    <Video
                      source={{ uri: selectedMedia.url }}
                      style={styles.modalVideo}
                      useNativeControls
                      resizeMode={ResizeMode.CONTAIN}
                      shouldPlay
                    />
                  ) : (
                    <Image
                      source={{ uri: selectedMedia.url }}
                      style={styles.modalImage}
                      resizeMode="contain"
                    />
                  )}
                </>
              )}
            </View>

            {/* Informações da Mídia */}
            <View style={styles.modalFooter}>
              <View style={styles.modalInfoRow}>
                <MaterialCommunityIcons name="calendar" size={16} color="#999999" />
                <Text style={styles.modalInfoText}>
                  {selectedMedia && new Date(selectedMedia.createdAt).toLocaleDateString('pt-BR')}
                </Text>
              </View>
              {selectedMedia?.width && selectedMedia?.height && (
                <View style={styles.modalInfoRow}>
                  <MaterialCommunityIcons name="image-size-select-large" size={16} color="#999999" />
                  <Text style={styles.modalInfoText}>
                    {selectedMedia.width} x {selectedMedia.height}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Navegação Inferior */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => router.push('/(tabs)')}
        >
          <MaterialCommunityIcons
            name="home"
            size={28}
            color="#999999"
          />
          <Text style={styles.navText}>Home</Text>
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
            name="folder-multiple-image"
            size={28}
            color="#E87722"
          />
          <Text style={[styles.navText, styles.navTextActive]}>Galeria</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="account"
            size={28}
            color="#999999"
          />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  uploadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#E87722',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
  },
  addMediaButton: {
    borderWidth: 2,
    borderColor: '#E87722',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFAF5',
  },
  addMediaIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addMediaText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIconContainer: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
  },
  mediaCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  mediaCardTouchable: {
    width: '100%',
  },
  mediaImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#F5F5F5',
  },
  videoIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaInfo: {
    padding: 12,
  },
  mediaInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mediaTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  mediaName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  mediaSize: {
    fontSize: 12,
    color: '#666666',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000000',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#1a1a1a',
  },
  modalHeaderInfo: {
    flex: 1,
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#999999',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalMediaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  modalImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 200,
  },
  modalVideo: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 200,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalInfoText: {
    fontSize: 14,
    color: '#999999',
  },
});
