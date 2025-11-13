import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../contexts/theme";
import { useResponsive } from "../../hooks/useRespons";

interface ColorFamily {
  name: string;
  emoji: string;
  colors: string[];
}

interface ColorSwatchProps {
  color: string;
  onPress: (color: string) => void;
  isSelected?: boolean;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  onPress,
  isSelected = false,
}) => {
  const [scaleValue] = useState(new Animated.Value(1));
  const [showCode, setShowCode] = useState(false);
  const { dimensions } = useResponsive();

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
    setShowCode(true);
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    setTimeout(() => setShowCode(false), 1000);
  };

  return (
    <Animated.View
      style={{ transform: [{ scale: scaleValue }], position: "relative" }}
    >
      <TouchableOpacity
        onPress={() => onPress(color)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        style={{
          width: dimensions.iconXL * 2,
          height: dimensions.iconXL * 2,
          borderRadius: dimensions.borderRadiusLG,
          borderWidth: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          backgroundColor: color,
          borderColor: isSelected ? "#fff" : "rgba(255,255,255,0.3)",
          ...(isSelected
            ? {
                shadowColor: "#3B82F6",
                shadowOpacity: 0.8,
                shadowRadius: 8,
              }
            : {}),
        }}
      />
      {showCode && (
        <View
          style={{
            position: "absolute",
            bottom: -32,
            left: "50%",
            transform: [{ translateX: -32 }],
            backgroundColor: "rgba(0,0,0,0.8)",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 12,
              fontFamily: "monospace",
            }}
          >
            {color}
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

interface ColorSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onColorSelect: (color: string) => void;
  selectedColor?: string;
}

export const ColorSelectionModal: React.FC<ColorSelectionModalProps> = ({
  visible,
  onClose,
  onColorSelect,
  selectedColor,
}) => {
  const { theme } = useTheme();
  const { dimensions, isTablet } = useResponsive();

  const colorFamilies: ColorFamily[] = [
    {
      name: "Uygulama Teması",
      emoji: "🎨",
      colors: [
        "#0B2240", // deep navy
        "#3F5E86", // slate blue
        "#A68868", // serene primary (warm beige)
        "#A4B5C4", // cool gray-blue
        "#D9C3A3", // soft beige
        "#12325E", // navy
        "#2B3C55", // dark slate
      ],
    },
    {
      name: "Kırmızı Tonları",
      emoji: "🔴",
      colors: [
        "#FFEBEE",
        "#FFCDD2",
        "#EF9A9A",
        "#E57373",
        "#EF5350",
        "#F44336",
        "#E53935",
        "#D32F2F",
        "#C62828",
        "#B71C1C",
      ],
    },
    {
      name: "Pembe Tonları",
      emoji: "🩷",
      colors: [
        "#FCE4EC",
        "#F8BBD9",
        "#F48FB1",
        "#F06292",
        "#EC407A",
        "#E91E63",
        "#D81B60",
        "#C2185B",
        "#AD1457",
        "#880E4F",
      ],
    },
    {
      name: "Mor Tonları",
      emoji: "🟣",
      colors: [
        "#F3E5F5",
        "#E1BEE7",
        "#CE93D8",
        "#BA68C8",
        "#AB47BC",
        "#9C27B0",
        "#8E24AA",
        "#7B1FA2",
        "#6A1B9A",
        "#4A148C",
      ],
    },
    {
      name: "Mavi Tonları",
      emoji: "🔵",
      colors: [
        "#E3F2FD",
        "#BBDEFB",
        "#90CAF9",
        "#64B5F6",
        "#42A5F5",
        "#2196F3",
        "#1E88E5",
        "#1976D2",
        "#1565C0",
        "#0D47A1",
      ],
    },
    {
      name: "Yeşil Tonları",
      emoji: "🟢",
      colors: [
        "#E8F5E8",
        "#C8E6C9",
        "#A5D6A7",
        "#81C784",
        "#66BB6A",
        "#4CAF50",
        "#43A047",
        "#388E3C",
        "#2E7D32",
        "#1B5E20",
      ],
    },
    {
      name: "Sarı Tonları",
      emoji: "🟡",
      colors: [
        "#FFFDE7",
        "#FFF9C4",
        "#FFF59D",
        "#FFF176",
        "#FFEE58",
        "#FFEB3B",
        "#FDD835",
        "#FBC02D",
        "#F9A825",
        "#F57F17",
      ],
    },
    {
      name: "Turuncu Tonları",
      emoji: "🟠",
      colors: [
        "#FFF3E0",
        "#FFE0B2",
        "#FFCC80",
        "#FFB74D",
        "#FFA726",
        "#FF9800",
        "#FB8C00",
        "#F57C00",
        "#EF6C00",
        "#E65100",
      ],
    },
    {
      name: "Kahverengi Tonları",
      emoji: "🤎",
      colors: [
        "#EFEBE9",
        "#D7CCC8",
        "#BCAAA4",
        "#A1887F",
        "#8D6E63",
        "#795548",
        "#6D4C41",
        "#5D4037",
        "#4E342E",
        "#3E2723",
      ],
    },
    {
      name: "Gri Tonları",
      emoji: "⚪",
      colors: [
        "#FAFAFA",
        "#F5F5F5",
        "#EEEEEE",
        "#E0E0E0",
        "#BDBDBD",
        "#9E9E9E",
        "#757575",
        "#616161",
        "#424242",
        "#212121",
      ],
    },
  ];

  const handleColorSelect = (color: string) => {
    onColorSelect(color);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          padding: dimensions.md,
          backgroundColor: theme.white,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: dimensions.md,
          }}
        >
          <Text
            style={{
              fontSize: isTablet ? dimensions.fontLarge : dimensions.fontTitle,
              fontWeight: "bold",
              color: theme.inputtitle,
            }}
          >
            🎨 Renk Paleti
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={{
              width: isTablet ? 48 : 40,
              height: isTablet ? 48 : 40,
              borderRadius: isTablet ? 24 : 20,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              backgroundColor: theme.white,
            }}
          >
            <Feather name="x" size={dimensions.iconLG} color={theme.inputtitle} />  
          </TouchableOpacity>
        </View>

        {/* Color Families */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        >
          {colorFamilies.map((family, familyIndex) => (
            <Animated.View
              key={family.name}
              style={{
                marginBottom: dimensions.lg,
                borderRadius: dimensions.borderRadiusXL,
                padding: isTablet ? dimensions.lg : dimensions.md,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12,
                shadowRadius: 12,
                backgroundColor: "#FFFFFF",
                opacity: 1,
                transform: [{ translateY: 0 }],
              }}
            >
              <Text
                style={{
                  fontSize: isTablet ? dimensions.fontXL : dimensions.fontLG,
                  fontWeight: "700",
                  textAlign: "center",
                  marginBottom: dimensions.md,
                  color: theme.inputtitle,
                }}
              >
                {family.emoji} {family.name}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  marginBottom: dimensions.sm,
                  columnGap: dimensions.md,
                  rowGap: dimensions.md,
                }}
              >
                {family.colors.map((color, colorIndex) => (
                  <ColorSwatch
                    key={`${familyIndex}-${colorIndex}`}
                    color={color}
                    onPress={handleColorSelect}
                    isSelected={selectedColor === color}
                  />
                ))}
              </View>

              <Text
                style={{
                  fontSize: dimensions.fontSM,
                  textAlign: "center",
                  color: theme.inputtitle,
                }}
              >
                Açık → Koyu
              </Text>
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};
