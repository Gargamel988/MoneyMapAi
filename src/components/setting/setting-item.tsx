import { Feather } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/theme';
import { useResponsive } from '../../hooks/useResponsive';
import { hexToRgba } from '../../utils/hextorgba';
type ItemRowProps = {
  iconName: string;
  title: string;
  subtitle?: string;
  value?: string;
  showArrow?: boolean;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: () => void;
  onPress?: () => void;
  withDivider?: boolean;
}
export const ItemRow = ({
  iconName,
  title,
  subtitle,
  value,
  showArrow,
  toggle,
  toggleValue,
  onToggle,
  onPress,
  withDivider = true,
}: ItemRowProps) => {
  const { theme } = useTheme();
  const { wp } = useResponsive();

  return (
    <View>
      <TouchableOpacity
        onPress={toggle ? onToggle : onPress}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: wp(4),
          paddingVertical: wp(4.5),
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View
            style={{
              marginRight: wp(3.5),
              height: 48,
              width: 48,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 14,
              backgroundColor: theme.primary,
            }}>
            <Feather name={iconName as any} size={22} color={theme.white} />
          </View>

          <View style={{ width: wp(56) }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: theme.text,
                letterSpacing: 0.3
              }}>
              {title}
            </Text>
            {subtitle ? (
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 14,
                  fontWeight: "600",
                  color: hexToRgba(theme.text, 0.5),
                }}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        {value ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                paddingHorizontal: wp(3),
                paddingVertical: wp(1.5),
                borderRadius: 8,
                fontSize: 14,
                fontWeight: '600',
                color: theme.white,
                backgroundColor: hexToRgba(theme.primary),
                overflow: "hidden",
              }}>
              {value}
            </Text>
          </View>
        ) : null}



        {showArrow ? (
          <Feather
            name="chevron-right"
            size={22}
            color={theme.text}
            style={{ marginLeft: 4 }}
          />
        ) : null}
      </TouchableOpacity>

      {withDivider ? (
        <View
          style={{
            height: 1.5,
            backgroundColor: theme.cardBorder,
            marginLeft: wp(17),
            marginRight: wp(4)
          }}
        />
      ) : null}
    </View>
  );
};
