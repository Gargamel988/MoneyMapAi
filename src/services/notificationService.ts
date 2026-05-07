
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Bildirimlerin nasıl görüneceğini ayarla
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationService = {
  // İzinleri al ve kaydet
  registerForPushNotificationsAsync: async () => {
    let token;
    // @ts-ignore - isDevice might be missing in some versions of types but exists at runtime
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        return null;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  },

  // Günlük harcama hatırlatıcısı (Saat 20:00)
  scheduleDailyReminder: async () => {
    await Notifications.cancelAllScheduledNotificationsAsync(); // Temizle ve tekrar kur
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "MoneyMapAi 📝",
        body: "Bugün harcamalarını kaydettin mi? Bütçeni güncel tutmak için bir dakikanı ayır.",
        sound: true,
      },
      trigger: {
        hour: 20,
        minute: 0,
        repeats: true,
      } as Notifications.NotificationTriggerInput,
    });
  },

  // Borç hatırlatıcısı
  scheduleDebtReminder: async (debtId: string, personName: string, amount: string, dueDate: Date) => {
    // Borç gününde sabah 10:00'da hatırlat
    const trigger = new Date(dueDate);
    trigger.setHours(10, 0, 0, 0);

    // Eğer tarih geçmişse kurma
    if (trigger.getTime() < Date.now()) return;

    await Notifications.scheduleNotificationAsync({
      identifier: `debt-${debtId}`,
      content: {
        title: "Borç Ödeme Günü! 💸",
        body: `${personName} kişisine olan ${amount} tutarındaki borcunun ödeme günü geldi.`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: trigger
      } as Notifications.NotificationTriggerInput,
    });
  },

  // Bütçe uyarısı (Anlık)
  sendBudgetAlert: async (category: string, percentage: number) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Bütçe Uyarısı! ⚠️",
        body: `${category} bütçenin %${percentage} kısmına ulaştın. Harcamalarını kontrol etmek isteyebilirsin.`,
        sound: true,
      },
      trigger: null, // Hemen gönder
    });
  },

  // Haftalık özet bildirimi (Pazar 21:00)
  scheduleWeeklySummary: async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Haftalık Finansal Özet 📊",
        body: "Bu haftaki harcamalarını ve tasarruflarını incelemek için tıkla!",
        sound: true,
      },
      trigger: {
        weekday: 1, // Pazar (Sistem bazlı değişebilir, genelde 1 Pazar'dır)
        hour: 21,
        minute: 0,
        repeats: true,
      } as Notifications.NotificationTriggerInput,
    });
  },

  cancelNotification: async (id: string) => {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
};
