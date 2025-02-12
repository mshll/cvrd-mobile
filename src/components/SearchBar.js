import { useColors } from '@/context/ColorSchemeContext';
import { useRef } from 'react';
import { XStack, Input } from 'tamagui';
import { MagnifyingGlassIcon } from 'react-native-heroicons/solid';

function SearchBar({ onSearch, searchText, placeholder = 'Search' }) {
  const colors = useColors();
  const searchBarRef = useRef(null);

  return (
    <XStack
      backgroundColor={colors.backgroundSecondary}
      mx="$4"
      my="$2"
      br={12}
      borderWidth={1}
      borderColor={colors.border}
      h={45}
      ai="center"
      px="$4"
    >
      <MagnifyingGlassIcon size={20} color={colors.textSecondary} />
      <Input
        ref={searchBarRef}
        flex={1}
        value={searchText}
        onChangeText={onSearch}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        backgroundColor="transparent"
        borderWidth={0}
        color={colors.text}
        autoCapitalize="none"
        returnKeyType="search"
        clearButtonMode="while-editing"
        autoFocus={true}
      />
    </XStack>
  );
}

export default SearchBar;
