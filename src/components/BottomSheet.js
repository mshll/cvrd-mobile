import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { FullWindowOverlay } from 'react-native-screens';
import { Colors } from '@/config/colors';
import { View } from 'tamagui';

const BottomSheet = ({ isOpen, onClose, children, ...props }) => {
  const bottomSheetModalRef = useRef(null);
  const containerComponent = useCallback((props) => <FullWindowOverlay>{props.children}</FullWindowOverlay>, []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={1} style={{ backgroundColor: 'transparent' }}>
        <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
        <View f={1} bg={Colors.dark.backgroundSecondary} o={0.5} />
      </BottomSheetBackdrop>
    ),
    []
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
        backgroundColor: Colors.dark.background,
      }}
      handleIndicatorStyle={{
        backgroundColor: Colors.dark.backgroundTertiary,
      }}
      containerComponent={Platform.OS === 'ios' ? containerComponent : undefined}
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
