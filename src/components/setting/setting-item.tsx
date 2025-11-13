import { Feather } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/theme';
import { useResponsive } from '../../hooks/useRespons';
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
            paddingVertical: wp(4),
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View
              style={{
                marginRight: wp(4),
                height: 40,
                width: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                backgroundColor: theme.buttonprimary + '20',
            
              }}>
              <Feather name={iconName as any} size={20} color={theme.textTertiary} />
            </View>

            <View style={{ width: wp(60) }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: theme.textTertiary,
                  letterSpacing: 0.5
                }}>
                {title}
              </Text>
              {subtitle ? (
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 14,
                    color: theme.textTertiary,
                    opacity: 0.8
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
                  fontWeight: '500',
                    color: theme.textTertiary,
                  backgroundColor: theme.button + '20',
                }}>
                {value}
              </Text>
            </View>
          ) : null}

      

          {showArrow ? (
            <Feather
              name="chevron-right"
              size={20}
              color={theme.textTertiary}
              style={{ marginLeft: 8 }}
            />
          ) : null}
        </TouchableOpacity>

        {withDivider ? (
          <View
            style={{
              height: 1,
              backgroundColor: theme.border,
              opacity: 0.4,
              marginLeft: wp(16),
              marginRight: wp(4)
            }}
          />
        ) : null}
      </View>
  );
};
