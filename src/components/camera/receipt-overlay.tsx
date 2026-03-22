import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useTheme } from '../../contexts/theme';

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Product {
  itemName?: string;
  price?: number;
  quantity?: number;
  boundingBox?: BoundingBox;
}

interface ReceiptOverlayProps {
  imageUri: string;
  products?: Product[];
  width: number;
  height: number;
}

export const ReceiptOverlay: React.FC<ReceiptOverlayProps> = ({
  imageUri,
  products,
  width,
  height
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { width, height }]}>
      <Image
        source={{ uri: imageUri }}
        style={[styles.image, { width, height }]}
        resizeMode="contain"
      />
      <Svg
        height="100%"
        width="100%"
        viewBox="0 0 1000 1000"
        style={StyleSheet.absoluteFill}
      >
        {products?.map((product, index) => {
          if (!product.boundingBox) return null;

          const { x, y, width: boxWidth, height: boxHeight } = product.boundingBox;

          return (
            <Rect
              key={index}
              x={x}
              y={y}
              width={boxWidth}
              height={boxHeight}
              stroke={theme.primary}
              strokeWidth="5"
              fill="rgba(255, 255, 255, 0.1)"
            />
          );
        })}
      </Svg>
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
