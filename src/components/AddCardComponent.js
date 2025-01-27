import { Text, View, Image } from "tamagui";
import { BlurView } from "expo-blur";
import { Dimensions, StyleSheet } from "react-native";

const window = Dimensions.get("window");
const WINDOW_WIDTH = window.width;
const CARD_ASPECT_RATIO = 1.586;
const CARD_WIDTH = Math.round(WINDOW_WIDTH * 0.6);
const CARD_HEIGHT = Math.round(CARD_WIDTH * CARD_ASPECT_RATIO);

// Calculate relative luminance
const getLuminance = (hexColor) => {
  // Remove # if present
  const hex = hexColor.replace("#", "");

  // Convert hex to rgb
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // Calculate luminance using the relative luminance formula
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance;
};

const AddCardComponent = ({
  type = "Location",
  label = "Location",
  emoji = "📍",
  color = "pink",
}) => {
  let cardColor;
  let cardTheme;

  const getCardImg = (theme) => {
    if (type === "Location" && theme === "light")
      return require("../../assets/cards/location-front-light.png");
    if (type === "Location" && theme === "dark")
      return require("../../assets/cards/location-front-dark.png");
    if (type === "Burner" && theme === "light")
      return require("../../assets/cards/burner-front-light.png");
    if (type === "Burner" && theme === "dark")
      return require("../../assets/cards/burner-front-dark.png");
    if (type === "Merchant" && theme === "light")
      return require("../../assets/cards/merchant-front-light.png");
    if (type === "Merchant" && theme === "dark")
      return require("../../assets/cards/merchant-front-dark.png");
    if (type === "Category" && theme === "light")
      return require("../../assets/cards/category-front-light.png");
    if (type === "Category" && theme === "dark")
      return require("../../assets/cards/category-front-dark.png");
  };

  switch (color) {
    case "pink":
      cardColor = "#E14C81";
      break;
    case "green":
      cardColor = "#44D47D";
      break;
    case "blue":
      cardColor = "#3981A6";
      break;
    case "yellow":
      cardColor = "#EBE14B";
      break;
    default:
      cardColor = color;
  }

  // Determine theme based on color luminance
  const luminance = getLuminance(cardColor);
  cardTheme = luminance > 0.5 ? "dark" : "light";

  const cardImg = getCardImg(cardTheme);
  const textColor = cardTheme === "light" ? "white" : "black";

  return (
    <View
      width={CARD_WIDTH}
      height={CARD_HEIGHT}
      borderRadius={20}
      overflow="hidden"
      bg={cardColor}
    >
      <Image source={cardImg} style={styles.cardImage} resizeMode="cover" />

      {/* Top Left Badge */}
      <BlurView intensity={20} style={[styles.badge, styles.topLeft]}>
        <Text fontSize={14}>{emoji}</Text>
        <Text fontSize={12} color={textColor} marginLeft={4} fontWeight="600">
          {label}
        </Text>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  badge: {
    position: "absolute",
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  topLeft: {
    top: 12,
    left: 12,
  },
});

export default AddCardComponent;
