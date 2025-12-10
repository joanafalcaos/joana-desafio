<div align="center">
  <img src="./assets/images/logo.png" alt="Desafio Logo" width="200"/>

  # Desafio – Área do usuário

  **Aplicativo mobile completo para gerenciamento de fotos e vídeos com autenticação segura**

  [![React Native](https://img.shields.io/badge/React%20Native-0.81.4-61dafb?style=for-the-badge&logo=react)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-54.0-000020?style=for-the-badge&logo=expo)](https://expo.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Expo Router](https://img.shields.io/badge/Expo%20Router-6.0-4630eb?style=for-the-badge&logo=expo)](https://expo.github.io/router/)

</div>

---

Aplicativo mobile de armazenamento de mídia na nuvem desenvolvido com React Native e Expo, oferecendo uma solução completa para upload, visualização e gerenciamento de fotos e vídeos com limite de 5GB.

## Índice

- [Features Implementadas](#features-implementadas)
- [Stack & Ferramentas](#stack--ferramentas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Como Rodar o App](#como-rodar-o-app)
- [Gerar APK](#gerar-apk)
- [API Endpoints](#api-endpoints)
- [Scripts Disponíveis](#scripts-disponíveis)

---

## Features Implementadas

### Autenticação Segura
Sistema completo de autenticação com JWT:
- ✅ **Login** com email e senha
- ✅ **Registro** de novos usuários (nome, email, data de nascimento, senha)
- ✅ **Gerenciamento de token JWT** com auto-injeção em requisições
- ✅ **Cache local** de dados do usuário via AsyncStorage
- ✅ **Logout seguro** com confirmação
- ✅ **Proteção de rotas** autenticadas

### Dashboard/Home
Painel principal com visão geral da conta:
- ✅ **Mensagem de boas-vindas** personalizada com nome do usuário
- ✅ **Indicador de armazenamento** com barra de progresso animada (limite de 5GB)
- ✅ **Botão de acesso rápido** para upload na galeria
- ✅ **Navegação bottom tabs** entre seções principais

### Galeria de Mídia
Gerenciamento completo de fotos e vídeos:
- ✅ **Upload de imagens** (JPG, JPEG, PNG, WEBP)
- ✅ **Upload de vídeos** (MP4)
- ✅ **Validação de formato** automática
- ✅ **Grid view** com 2 colunas responsivas
- ✅ **Preview em tela cheia** de imagens e vídeos
- ✅ **Metadados** (data de upload, dimensões)
- ✅ **Exclusão de mídia** com confirmação
- ✅ **Indicadores visuais** para vídeos (ícone play)
- ✅ **Estados de loading** durante uploads
- ✅ **Empty state** quando galeria está vazia

### Histórico de Atividades
Timeline completa de ações do usuário:
- ✅ **Lista cronológica** de atividades agrupadas por data
- ✅ **Tipos de ação** rastreados:
  - Uploads de mídia
  - Exclusões de arquivos
- ✅ **Ícones contextuais** para cada tipo de ação
- ✅ **Timestamps formatados** (data e hora)
- ✅ **Pull-to-refresh** automático ao focar na página
- ✅ **Empty state** amigável

### Perfil do Usuário
Gerenciamento completo de dados pessoais:
- ✅ **Avatar do perfil** com upload e crop de imagem
- ✅ **Visualização e edição** de dados:
  - Nome completo
  - Email
  - Data de nascimento
- ✅ **Estatísticas de mídia**:
  - Total de arquivos
  - Contador de fotos
  - Contador de vídeos
- ✅ **Modo de edição** (toggle view/edit)
- ✅ **Salvamento de alterações** com feedback visual
- ✅ **Logout** com confirmação de segurança


## Stack & Ferramentas

### Core

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React Native** | 0.81.4 | Framework para desenvolvimento mobile multiplataforma |
| **Expo** | ~54.0.10 | Plataforma de desenvolvimento e build |
| **Expo Router** | ~6.0.8 | Sistema de navegação baseado em arquivos |
| **React** | 19.1.0 | Biblioteca JavaScript para interfaces |
| **TypeScript** | 5.9 | Type safety e melhor DX |

### Navegação & UI

| Tecnologia | Uso |
|------------|-----|
| **@react-navigation/native** | Navegação principal entre telas |
| **@react-navigation/bottom-tabs** | Bottom navigation bar |
| **@expo/vector-icons** | Ícones Material Community |
| **react-native-gesture-handler** | Gestos e interações touch |
| **react-native-reanimated** | Animações fluidas e performáticas |

### Dados & Storage

| Tecnologia | Uso |
|------------|-----|
| **axios** | Cliente HTTP para requisições à API |
| **@react-native-async-storage/async-storage** | Armazenamento local persistente |
| **FormData** | Upload de arquivos multipart |

### Mídia & Recursos

| Tecnologia | Uso |
|------------|-----|
| **expo-image-picker** | Seleção de imagens e vídeos da galeria/câmera |
| **expo-av** | Reprodução de áudio e vídeo |
| **expo-image** | Componente de imagem otimizado |
| **expo-haptics** | Feedback tátil |

### Outros

| Tecnologia | Uso |
|------------|-----|
| **expo-constants** | Acesso a constantes do sistema |
| **expo-linking** | Deep linking |
| **expo-splash-screen** | Tela de splash customizada |
| **expo-status-bar** | Controle da status bar |
| **expo-updates** | OTA updates via Expo |

## Estrutura do Projeto

```
joana-desafio/
├── app/                          # App Router (Expo Router)
│   ├── (auth)/                   # Grupo de rotas de autenticação
│   │   ├── login.tsx             # Tela de login
│   │   └── register.tsx          # Tela de registro
│   ├── (tabs)/                   # Grupo de rotas com bottom tabs
│   │   ├── index.tsx             # Home/Dashboard
│   │   ├── gallery.tsx           # Galeria de mídia
│   │   ├── history.tsx           # Histórico de atividades
│   │   └── profile.tsx           # Perfil do usuário
│   ├── _layout.tsx               # Layout raiz
│   └── +not-found.tsx            # Página 404
├── assets/                       # Recursos estáticos
│   └── images/                   # Imagens (logo, ícones, etc)
├── components/                   # Componentes reutilizáveis
│   ├── ui/                       # Componentes de UI primitivos
│   └── ...                       # Outros componentes
├── constants/                    # Constantes e configurações
│   └── Colors.ts                 # Paleta de cores
├── hooks/                        # Custom React Hooks
│   ├── use-auth.ts               # Hook de autenticação
│   └── ...                       # Outros hooks
├── services/                     # Camada de serviços/API
│   ├── api.ts                    # Cliente Axios configurado
│   ├── auth.ts                   # Endpoints de autenticação
│   ├── user.ts                   # Endpoints de usuário
│   ├── media.ts                  # Endpoints de mídia
│   └── logs.ts                   # Endpoints de logs
├── utils/                        # Funções utilitárias
├── app.json                      # Configuração do Expo
├── eas.json                      # Configuração do EAS Build
├── package.json                  # Dependências e scripts
└── tsconfig.json                 # Configuração TypeScript
```

## Instalação

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **npm** ou **yarn** - gerenciador de pacotes
- **Expo CLI** - será instalado automaticamente nas dependências
- **EAS CLI** - para gerar builds:
  ```bash
  npm install -g eas-cli
  ```

### Para desenvolvimento em dispositivos:

- **Android**: [Android Studio](https://developer.android.com/studio) com emulador configurado
- **iOS** (somente macOS): [Xcode](https://developer.apple.com/xcode/) com simulador
- **Dispositivo físico**: App Expo Go ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Passos de Instalação

1. **Clone o repositório**:
   ```bash
   git clone <url-do-repositorio>
   cd joana-desafio
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure a API** (opcional):
   - A API já está configurada para `http://170.81.121.86:4000/api`
   - Para mudar o endpoint, edite `services/api.ts`

## Como Rodar o App

### Método 1: Expo Go (Recomendado para Desenvolvimento)

**Mais rápido e sem necessidade de build nativo**

1. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm start
   ```
   ou
   ```bash
   npx expo start
   ```

2. **Escaneie o QR Code**:
   - **Android**: Abra o app Expo Go e escaneie o QR Code
   - **iOS**: Use a câmera nativa do iPhone para escanear

### Método 2: Emulador/Simulador Android

**Requer Android Studio instalado e configurado**

```bash
# Inicia no emulador Android
npm run android
```
ou
```bash
npx expo start --android
```

**Primeira vez?**
- Abra o Android Studio
- Vá em **Tools > Device Manager**
- Crie um dispositivo virtual (AVD)
- Inicie o emulador antes de rodar o comando

### Método 3: Simulador iOS (macOS apenas)

**Requer Xcode instalado**

```bash
# Inicia no simulador iOS
npm run ios
```
ou
```bash
npx expo start --ios
```

### Método 4: Web (Preview)

```bash
# Inicia versão web (limitada)
npm run web
```
ou
```bash
npx expo start --web
```

## Gerar APK

### Opção 1: Build de Desenvolvimento

**APK para testes internos com hot reload**

1. **Instale o EAS CLI** (se ainda não tiver):
   ```bash
   npm install -g eas-cli
   ```

2. **Faça login na sua conta Expo**:
   ```bash
   eas login
   ```

3. **Configure o projeto** (primeira vez apenas):
   ```bash
   eas build:configure
   ```

4. **Gere o APK de desenvolvimento**:
   ```bash
   eas build --platform android --profile development
   ```

5. **Aguarde o build** (5-15 minutos):
   - O progresso será exibido no terminal
   - Você receberá um link para download quando concluir

### Opção 2: Build de Preview

**APK standalone para testes em produção**

```bash
eas build --platform android --profile preview
```

### Opção 3: Build de Produção

**Build final para publicação na Play Store**

```bash
eas build --platform android --profile production
```

### Download e Instalação do APK

**Após o build ser concluído:**

1. **Acesse o link** fornecido no terminal
2. **Ou visite** o dashboard do Expo:
   ```
   https://expo.dev/accounts/joanafalcaos/projects/joana-desafio/builds
   ```
3. **Faça o download** do arquivo `.apk`
4. **Transfira para seu Android** e instale

**Importante**:
- Habilite **"Fontes Desconhecidas"** nas configurações de segurança do Android
- Em dispositivos modernos, você será solicitado a permitir a instalação quando abrir o APK

### Build Local (Avançado)

**Para build local sem EAS (requer Android SDK completo)**

```bash
# Gera APK local
npx expo run:android --variant release
```

## API Endpoints

**Base URL**: `http://170.81.121.86:4000/api`

### Autenticação

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| POST | `/auth/register` | Registrar novo usuário | `{ name, email, birthday, password }` |
| POST | `/auth/login` | Login | `{ email, password }` |
| POST | `/auth/logout` | Logout | - |

### Usuário

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| GET | `/users/me` | Obter perfil atual | - |
| PUT | `/users/me` | Atualizar perfil | `{ name?, email?, birthday? }` |
| POST | `/users/me/avatar` | Upload de avatar | `FormData` |

### Mídia

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| GET | `/media` | Listar todas as mídias | - |
| POST | `/media` | Upload de mídia | `FormData` |
| DELETE | `/media/{id}` | Deletar mídia | - |

### Logs

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| GET | `/logs` | Obter histórico de atividades | - |

### Autenticação da API

Todas as requisições (exceto `/auth/register` e `/auth/login`) requerem header de autenticação:

```
Authorization: Bearer {token}
```

O token JWT é gerenciado automaticamente pelo `services/api.ts` após o login.

## Scripts Disponíveis

### Desenvolvimento

```bash
npm start              # Inicia servidor de desenvolvimento com menu interativo
npm run android        # Abre no emulador Android
npm run ios            # Abre no simulador iOS (macOS only)
npm run web            # Abre no navegador
```

### Code Quality

```bash
npm run lint           # Executa ESLint
```

### Outras Utilidades

```bash
npm run reset-project  # Reseta o projeto para template inicial
```

## Informações Adicionais

### Configurações do App

- **Nome**: Joana Desafio
- **Slug**: joana-desafio
- **Versão**: 1.0.0
- **Bundle ID Android**: `com.joanafalcaos.joanadesafio`
- **Bundle ID iOS**: `com.joanafalcaos.joanadesafio`
- **Expo Project ID**: `030aa918-1bdf-4da9-b626-08080d554af7`
- **Owner**: joanafalcaos

### Features Habilitadas

- ✅ **New Architecture** (React Native)
- ✅ **Edge-to-Edge** (Android)
- ✅ **Typed Routes** (Expo Router)
- ✅ **React Compiler** (Experimental)
- ✅ **OTA Updates** via Expo

### Limites e Restrições

- **Formatos de imagem**: JPG, JPEG, PNG, WEBP
- **Formatos de vídeo**: MP4
- **Plataformas suportadas**: Android, iOS, Web

## Troubleshooting

### Problemas Comuns

**1. Erro ao instalar dependências**
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

**2. Erro "Unable to resolve module"**
```bash
# Limpe o cache do Expo
npx expo start -c
```

**3. Build falha no EAS**
- Verifique se está logado: `eas whoami`
- Certifique-se de que `app.json` está correto
- Consulte os logs completos na dashboard do Expo

**4. App não conecta à API**
- Verifique se a API está acessível: `curl http://170.81.121.86:4000/api/health`
- Certifique-se de que está conectado à internet
- Verifique se o backend está rodando

## Próximos Passos

- [ ] Implementar testes unitários (Jest)
- [ ] Adicionar testes E2E (Detox)
- [ ] Implementar paginação na galeria
- [ ] Adicionar filtros de mídia (fotos/vídeos)
- [ ] Implementar busca de arquivos
- [ ] Adicionar compartilhamento de mídia
- [ ] Implementar pastas/álbuns

## Suporte

- **Documentação Expo**: [https://docs.expo.dev/](https://docs.expo.dev/)
- **React Native Docs**: [https://reactnative.dev/](https://reactnative.dev/)
- **Expo Forums**: [https://forums.expo.dev/](https://forums.expo.dev/)

---

<div align="center">

**Desenvolvido com React Native e Expo**

[![Made with Expo](https://img.shields.io/badge/Made%20with-Expo-000020?style=flat-square&logo=expo)](https://expo.dev/)
[![Powered by React Native](https://img.shields.io/badge/Powered%20by-React%20Native-61dafb?style=flat-square&logo=react)](https://reactnative.dev/)
[![Built with TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

[⬆ Voltar ao topo](#joana-desafio--armazenamento-de-mídia-na-nuvem)

</div>
