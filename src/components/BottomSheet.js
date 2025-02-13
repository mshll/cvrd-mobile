import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { FullWindowOverlay } from 'react-native-screens';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { View } from 'tamagui';

const BottomSheet = ({ isOpen, onClose, children, aboveAll = true, ...props }) => {
  const colors = useColors();
  const bottomSheetModalRef = useRef(null);
  const containerComp = useCallback((props) => <FullWindowOverlay>{props.children}</FullWindowOverlay>, []);
  const containerComponent = Platform.OS === 'ios' ? containerComp : undefined;

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={1}
        style={{ backgroundColor: 'transparent', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
        <View f={1} bg={colors.backgroundSecondary} o={0.5} />
      </BottomSheetBackdrop>
    ),
    [colors]
  );

  // Present/dismiss handlers
  const handlePresentModal = useCallback(() => {
    if (bottomSheetModalRef.current) {
      bottomSheetModalRef.current.present();
    }
  }, []);

  const handleDismissModal = useCallback(() => {
    if (bottomSheetModalRef.current) {
      bottomSheetModalRef.current.dismiss();
    }
  }, []);

  // Effect to handle isOpen changes
  useEffect(() => {
    if (isOpen) {
      handlePresentModal();
    } else {
      handleDismissModal();
    }
  }, [isOpen]);

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: colors.background,
      }}
      handleIndicatorStyle={{
        backgroundColor: colors.backgroundTertiary,
      }}
      containerComponent={aboveAll ? containerComponent : undefined}
      onDismiss={handleDismiss}
      {...props}
    >
      <BottomSheetView style={{ flex: 1 }} enableHandlePanningGesture={false}>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default BottomSheet;
