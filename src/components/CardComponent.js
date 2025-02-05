import { Text, View, Image, XStack, YStack, Spinner } from 'tamagui';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { Colors } from '@/config/colors';
import { useCards } from '@/hooks/useCards';
import {
  BuildingStorefrontIcon,
  FireIcon,
  MapPinIcon,
  TagIcon,
  PauseCircleIcon,
  XCircleIcon,
} from 'react-native-heroicons/solid';
import { CARD_WIDTH, CARD_HEIGHT, getCardTheme, getCardAssets } from '@/utils/cardUtils';

const getCardIcon = (type, color, scale) => {
  const cleanType = type?.replace('_LOCKED', '');
  if (cleanType === 'LOCATION') return <MapPinIcon size={24 * scale} color={color} />;
  if (cleanType === 'BURNER') return <FireIcon size={24 * scale} color={color} />;
  if (cleanType === 'MERCHANT') return <BuildingStorefrontIcon size={24 * scale} color={color} />;
  if (cleanType === 'CATEGORY') return <TagIcon size={24 * scale} color={color} />;
};

const CardComponent = ({ cardId, displayData, scale = 1, isPreview = false }) => {
  const { getCardById } = useCards();
  const card = cardId ? getCardById(cardId) : null;

  // If no displayData and no card, show loading state
  if (!displayData && !card) {
    return (
      <View
        width={CARD_WIDTH * scale}
        height={CARD_HEIGHT * scale}
        borderRadius={15}
        backgroundColor="$backgroundSecondary"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="large" color="$primary" />
      </View>
    );
  }

  // If displayData is provided, use it directly, otherwise generate from card
  const data = displayData || {
    type: card.cardType,
    label: card.cardName,
    emoji: card.cardIcon,
    lastFourDigits: card.cardNumber.slice(-4),
    backgroundColor: card.cardColor,
    isPaused: card.paused,
    isClosed: card.closed,
  };

  const {
    type = '-',
    label = '-',
    emoji = '❌',
    lastFourDigits = '1234',
    backgroundColor = 'red',
    isPaused = false,
    isClosed = false,
  } = data;

  // Log the processed card data for debugging
  console.log('🎴 Rendering card:', { type, label, emoji, lastFourDigits, backgroundColor, isPaused, isClosed });

  let cardColor = backgroundColor;
  const cardTheme = getCardTheme(cardColor);
  const blurTint = cardTheme === 'light' ? 'regular' : 'regular';
  const textColor = cardTheme === 'light' ? 'white' : 'black';

  // Get card assets with proper type normalization
  const normalizedType = type?.replace('_LOCKED', '')?.toUpperCase() || 'BURNER';
  const { cardImg, logoImg, visaImg } = getCardAssets(normalizedType, cardTheme);

  // Debug log for assets
  console.log('🎨 Card assets:', {
    normalizedType,
    cardTheme,
    hasCardImg: !!cardImg,
    hasLogoImg: !!logoImg,
    hasVisaImg: !!visaImg,
  });

  return (
    <View width={CARD_WIDTH * scale} height={CARD_HEIGHT * scale} borderRadius={15} overflow="hidden" bg={cardColor}>
      {/* Background Layer */}
      <View style={StyleSheet.absoluteFill}>
        {cardImg && <Image source={cardImg} style={styles.cardImage} resizeMode="cover" />}
        {isClosed && <View style={styles.closedOverlay} />}
      </View>

      {/* Content Layer */}
      <YStack style={styles.contentContainer}>
        {/* Top Row */}
        <YStack gap={8}>
          <XStack style={styles.topRow}>
            <BlurView intensity={10} tint={blurTint} style={styles.badge}>
              <Text fontSize={14}>{emoji}</Text>
              <Text
                fontSize={12}
                color={textColor}
                marginLeft={4}
                fontWeight="600"
                numberOfLines={1}
                maxWidth={CARD_WIDTH * scale * 0.5}
              >
                {label}
              </Text>
            </BlurView>

            <View
              style={[
                {
                  paddingRight: 6,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
            >
              {getCardIcon(type, textColor, scale)}
            </View>
          </XStack>

          {/* Status Badges */}
          {(isPaused || isClosed) && (
            <BlurView intensity={10} tint={blurTint} style={[styles.badge, styles.statusBadge]}>
              {isPaused && <PauseCircleIcon size={16} color={textColor} />}
              {isClosed && <XCircleIcon size={16} color={textColor} />}
              <Text fontSize={12} color={textColor} marginLeft={4} fontWeight="600">
                {isClosed ? 'Closed' : isPaused ? 'Paused' : ''}
              </Text>
            </BlurView>
          )}
        </YStack>

        {/* Logo */}
        {logoImg && (
          <View
            w={CARD_WIDTH * scale * 0.5}
            h={100}
            jc="center"
            ai="center"
            pos="absolute"
            t={CARD_HEIGHT * scale * 0.5 - 50}
            r={30}
          >
            <Image source={logoImg} w="100%" h="100%" resizeMode="contain" />
          </View>
        )}

        {/* Bottom Row */}
        {!isPreview && (
          <View style={styles.bottomRow}>
            <Text fontSize={16} color={textColor} fontWeight="600" pb="$1" pl="$1">
              •••• &nbsp;{lastFourDigits}
            </Text>
            {visaImg && (
              <View style={styles.visaContainer}>
                <Image source={visaImg} style={styles.visaLogo} resizeMode="contain" />
              </View>
            )}
          </View>
        )}
      </YStack>
    </View>
  );
};

const styles = StyleSheet.create({
  cardImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap-reverse',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  badge: {
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    gap: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  logoContainer: {
    position: 'absolute',
    right: 30,
    top: 142,
    width: 120,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  visaContainer: {
    width: 60,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visaLogo: {
    width: '100%',
    height: '100%',
  },
  closedOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    backgroundColor: 'rgba(64, 64, 64, 0.5)',
  },
});

export default CardComponent;
