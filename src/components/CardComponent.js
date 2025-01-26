import { Text, View, Image, XStack, YStack } from 'tamagui';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { Colors } from '@/config/colors';
import { useCards } from '@/hooks/useCards';
import { BuildingStorefrontIcon, FireIcon, MapPinIcon, TagIcon, PauseCircleIcon, XCircleIcon } from 'react-native-heroicons/solid';
import { CARD_WIDTH, CARD_HEIGHT, getCardTheme, getCardAssets } from '@/utils/cardUtils';

const getCardIcon = (type, color) => {
  if (type === 'Location') return <MapPinIcon size={20} color={color} />;
  if (type === 'Burner') return <FireIcon size={20} color={color} />;
  if (type === 'Merchant') return <BuildingStorefrontIcon size={20} color={color} />;
  if (type === 'Category') return <TagIcon size={20} color={color} />;
};

const CardComponent = ({ cardId, displayData }) => {
  const { getCardById } = useCards();
  const card = cardId ? getCardById(cardId) : null;

  // If displayData is provided, use it directly, otherwise generate from card
  const {
    type = '-',
    label = '-',
    emoji = '❌',
    lastFourDigits = '1234',
    backgroundColor = 'red',
    isPaused = card?.is_paused || false,
    isClosed = card?.is_closed || false,
  } = displayData ||
  (card
    ? {
        type: card.card_type,
        label: card.card_name,
        emoji: card.card_icon,
        lastFourDigits: card.card_number.slice(-4),
        backgroundColor: card.card_color,
        isPaused: card.is_paused,
        isClosed: card.is_closed,
      }
    : {});

  let cardColor = Colors.cards[backgroundColor] || backgroundColor;
  const cardTheme = getCardTheme(cardColor);
  const blurTint = cardTheme === 'light' ? 'systemThickMaterialDark' : 'systemThickMaterialLight';
  const textColor = cardTheme === 'light' ? 'white' : 'black';
  const { cardImg, logoImg, visaImg } = getCardAssets(type, cardTheme);

  return (
    <View width={CARD_WIDTH} height={CARD_HEIGHT} borderRadius={20} overflow="hidden" bg={cardColor}>
      {/* Background Layer */}
      <View style={StyleSheet.absoluteFill}>
        <Image source={cardImg} style={styles.cardImage} resizeMode="cover" />
        {(isPaused || isClosed) && (
          <View style={[StyleSheet.absoluteFill, styles.statusOverlay]}>
            <BlurView intensity={50} tint={blurTint} style={styles.statusBadge}>
              {isPaused && <PauseCircleIcon size={20} color={textColor} />}
              {isClosed && <XCircleIcon size={20} color={textColor} />}
              <Text fontSize={14} color={textColor} marginLeft={8} fontWeight="600">
                {isClosed ? 'Closed' : isPaused ? 'Paused' : ''}
              </Text>
            </BlurView>
          </View>
        )}
      </View>

      {/* Content Layer */}
      <YStack style={styles.contentContainer}>
        {/* Top Row */}
        <XStack style={styles.topRow}>
          <BlurView intensity={20} tint={blurTint} style={styles.badge}>
            <Text fontSize={14}>{emoji}</Text>
            <Text fontSize={12} color={textColor} marginLeft={4} fontWeight="600" maxWidth={110} numberOfLines={1}>
              {label}
            </Text>
          </BlurView>

          <View style={[styles.badge, { paddingHorizontal: 10, paddingVertical: 0, borderRadius: 10 }]}>{getCardIcon(type, textColor)}</View>
        </XStack>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={logoImg} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          <Text fontSize={16} color={textColor} fontWeight="600" pb="$1" pl="$1">
            •••• &nbsp;{lastFourDigits}
          </Text>
          <View style={styles.visaContainer}>
            <Image source={visaImg} style={styles.visaLogo} resizeMode="contain" />
          </View>
        </View>
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
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  statusOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    overflow: 'hidden',
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
});

export default CardComponent;
