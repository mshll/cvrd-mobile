import { View, Text, XStack, YStack, Button, Input } from 'tamagui';
import { useColors } from '@/config/colors';
import { useState } from 'react';
import { SORT_OPTIONS, STATUS_OPTIONS } from './TransactionList';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from 'react-native-heroicons/outline';

const FilterButton = ({ label, isActive, onPress, icon: Icon, backgroundColor }) => {
  const colors = useColors();
  const bg = backgroundColor || colors.backgroundSecondary;

  return (
    <Button
      backgroundColor={isActive ? colors.primary : bg}
      pressStyle={{ backgroundColor: isActive ? colors.primaryDark : colors.backgroundTertiary }}
      onPress={onPress}
      size="$3"
      icon={Icon ? <Icon size={16} color={isActive ? 'white' : colors.text} /> : undefined}
      borderRadius={8}
      borderWidth={1}
      borderColor={isActive ? colors.primary : colors.border}
    >
      <Text color={isActive ? 'white' : colors.text} fontSize="$3">
        {label}
      </Text>
    </Button>
  );
};

const TransactionListHeader = ({
  searchText,
  onSearch,
  showFilters,
  setShowFilters,
  sortOption,
  setSortOption,
  statusFilter,
  setStatusFilter,
  containerStyle,
  backgroundColor,
}) => {
  const colors = useColors();
  const bg = backgroundColor || colors.backgroundSecondary;

  return (
    <YStack gap="$4" style={containerStyle}>
      {/* Search and Filter Row */}
      <XStack gap="$2" px="$4">
        <XStack
          f={1}
          backgroundColor={bg}
          borderWidth={1}
          borderColor={colors.border}
          borderRadius={12}
          height={45}
          ai="center"
          px="$3"
          gap="$2"
        >
          <MagnifyingGlassIcon size={18} color={colors.textSecondary} />
          <Input
            flex={1}
            value={searchText}
            onChangeText={onSearch}
            placeholder="Search transactions"
            color={colors.text}
            placeholderTextColor={colors.textSecondary}
            fontSize="$3"
            backgroundColor="transparent"
            borderWidth={0}
          />
        </XStack>
        <Button
          size="$4"
          backgroundColor={showFilters ? colors.primary : bg}
          pressStyle={{ backgroundColor: colors.backgroundTertiary }}
          onPress={() => setShowFilters(!showFilters)}
          borderRadius={12}
          borderWidth={1}
          borderColor={showFilters ? colors.primary : colors.border}
          width={45}
          height={45}
          p={0}
        >
          <AdjustmentsHorizontalIcon size={18} color={showFilters ? 'white' : colors.text} />
        </Button>
      </XStack>

      {/* Filter Section */}
      {showFilters && (
        <YStack gap="$4" px="$4">
          {/* Status Filters */}
          <YStack gap="$2">
            <XStack jc="space-between" ai="center">
              <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                Status
              </Text>
              <Button
                size="$2"
                bg="transparent"
                pressStyle={{ opacity: 0.7 }}
                onPress={() => {
                  setSortOption('date_desc');
                  setStatusFilter('all');
                }}
              >
                <Text color={colors.primary} fontSize="$2">
                  Reset
                </Text>
              </Button>
            </XStack>
            <XStack gap="$2" flexWrap="wrap">
              {STATUS_OPTIONS.map((option) => (
                <FilterButton
                  key={option.id}
                  label={option.label}
                  isActive={statusFilter === option.id}
                  onPress={() => setStatusFilter(option.id)}
                />
              ))}
            </XStack>
          </YStack>

          {/* Sort Options */}
          <YStack gap="$2">
            <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
              Sort By
            </Text>
            <XStack gap="$2" flexWrap="wrap">
              {SORT_OPTIONS.map((option) => (
                <FilterButton
                  key={option.id}
                  label={option.label}
                  isActive={sortOption === option.id}
                  onPress={() => setSortOption(option.id)}
                  icon={option.icon}
                />
              ))}
            </XStack>
          </YStack>
        </YStack>
      )}
    </YStack>
  );
};

export default TransactionListHeader;
