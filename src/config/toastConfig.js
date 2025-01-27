import React from 'react';
import { View, Text } from 'tamagui';

const toastConfig = {
  error: ({ text1, text2 }) => (
    <View
      borderWidth={1}
      borderColor="#D92D20"
      backgroundColor="#FEF3F2"
      padding="$3"
      borderRadius="$3"
      width="90%"
      height={52}
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-start"
    >
      {text1 && (
        <Text color="#D92D20" fontSize={12} fontWeight="600">
          {text1}
        </Text>
      )}
      {text2 && <Text color="white">{text2}</Text>}
    </View>
  ),
  success: ({ text1, text2 }) => (
    <View
      borderWidth={1}
      borderColor="#ABEFC6"
      backgroundColor="#ECFDF3"
      padding="$3"
      borderRadius="$3"
      width="90%"
      height={52}
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-start"
    >
      {text1 && (
        <Text color="#067647" fontSize={12} fontWeight="600">
          {text1}
        </Text>
      )}
      {text2 && <Text color="white">{text2}</Text>}
    </View>
  ),
  delete: ({ text1, text2 }) => (
    <View
      borderWidth={1}
      borderColor="#D92D20"
      backgroundColor="#FEF3F2"
      padding="$3"
      borderRadius="$3"
      width="90%"
      height={52}
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-start"
    >
      {text1 && (
        <Text color="#D92D20" fontSize={12} fontWeight="600">
          {text1}
        </Text>
      )}
      {text2 && <Text color="white">{text2}</Text>}
    </View>
  ),
};

export default toastConfig;
