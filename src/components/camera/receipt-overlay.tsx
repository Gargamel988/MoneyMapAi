import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Product {
  itemName?: string;
  price?: number;
  quantity?: number;
}

interface ReceiptOverlayProps {
  imageUri: string;
  products?: Product[];
  width: number;
  height: number;
}

export const ReceiptOverlay: React.FC<ReceiptOverlayProps> = ({
  imageUri,
  width,
  height
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Image
        source={{ uri: imageUri }}
        style={[styles.image, { width, height }]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
});
