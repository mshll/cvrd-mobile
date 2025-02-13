import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { Text, XStack } from 'tamagui';
import DragList from 'react-native-draglist';
import { Bars3Icon } from 'react-native-heroicons/solid';

const ITEM_HEIGHT = 56;

const DraggableList = ({ sections, onReorder }) => {
  const colors = useColors();
  const keyExtractor = (section) => section.id;

  const renderItem = ({ item: section, onDragStart, onDragEnd, isActive }) => {
    const Icon = section.icon;

    return (
      <TouchableOpacity
        onPressIn={onDragStart}
        onPressOut={onDragEnd}
        style={[
          styles.itemContainer,
          {
            backgroundColor: isActive ? colors.backgroundTertiary : colors.backgroundSecondary,
            opacity: isActive ? 0.9 : 1,
          },
        ]}
      >
        <XStack ai="center" gap="$3">
          <Bars3Icon size={20} color={colors.textSecondary} />
          <Icon size={20} color={colors.text} />
          <Text color={colors.text} fontSize="$4" fontWeight="500">
            {section.title}
          </Text>
        </XStack>
      </TouchableOpacity>
    );
  };

  const onReordered = async (fromIndex, toIndex) => {
    const copy = [...sections];
    const [removed] = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, removed);
    onReorder(copy);
  };

  return (
    <DragList
      data={sections}
      keyExtractor={keyExtractor}
      onReordered={onReordered}
      renderItem={renderItem}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT * 4 + 24,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    marginVertical: 3,
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
  },
});

export default DraggableList;
