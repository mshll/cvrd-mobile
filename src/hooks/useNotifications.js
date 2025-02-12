import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { instance, IP } from '@/api';
import { saveNotificationToken } from '@/api/notifications';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useEffect, useCallback, useRef } from 'react';

// Configure how notifications should be handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Get the WebSocket URL based on environment
const getWebSocketUrl = () => {
  const PORT = '8080';
  const host = IP || 'localhost';
  return `http://${host}:${PORT}`;
};

export function useNotifications(token) {
  const stompClientRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const scheduleNotification = useCallback(async ({ title, body, data = {} }) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // null means show immediately
    });
  }, []);

  const registerForPushNotifications = useCallback(async () => {
    try {
      let token;

      if (!Device.isDevice) {
        console.log('Must use physical device for Push Notifications');
        return;
      }

      // Check if we have permission
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // If we don't have permission, ask for it
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      // Get the token
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: '961bbe01-c008-4a97-aaaa-e3b006af9865',
        })
      ).data;

      // Set up special Android channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      // Send token to backend
      if (token) {
        try {
          await saveNotificationToken(token);
          console.log('✅ Push notification token saved to backend');
        } catch (error) {
          console.log('❌ Failed to save push notification token:', error);
        }
      }

      return token;
    } catch (error) {
      console.error('Failed to register for push notifications:', error);
    }
  }, []);

  const initializeWebSocket = useCallback(() => {
    try {
      // Clear any existing reconnection timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Close existing connection if any
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
        stompClientRef.current = null;
      }

      // Get the WebSocket URL
      const wsUrl = getWebSocketUrl();
      console.log('🔌 Connecting to WebSocket:', `${wsUrl}/ws/notifications`);

      // Create SockJS instance
      const socket = new SockJS(`${wsUrl}/ws/notifications`);

      // Create Stomp client
      stompClientRef.current = Stomp.over(socket);

      // Configure STOMP client
      stompClientRef.current.configure({
        debug: (str) => {
          console.log('STOMP: ' + str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      // Connect to the WebSocket server
      stompClientRef.current.connect(
        {},
        () => {
          console.log('🔌 WebSocket connection established');

          // Subscribe to user-specific notifications
          stompClientRef.current.subscribe(`/user/queue/notifications`, async (message) => {
            try {
              const notification = JSON.parse(message.body);
              console.log('📩 Received notification:', notification);
              await scheduleNotification(notification);
            } catch (error) {
              console.error('Failed to process notification:', error);
            }
          });
        },
        (error) => {
          console.error('WebSocket error:', error);
          // Schedule reconnection attempt
          if (token) {
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log('Attempting to reconnect...');
              initializeWebSocket();
            }, 5000);
          }
        }
      );
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      // Schedule reconnection attempt
      if (token) {
        reconnectTimeoutRef.current = setTimeout(() => {
          initializeWebSocket();
        }, 5000);
      }
    }
  }, [token, scheduleNotification]);

  const closeWebSocket = useCallback(() => {
    // Clear any pending reconnection
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Close the connection if it exists
    if (stompClientRef.current) {
      try {
        stompClientRef.current.disconnect(() => {
          console.log('WebSocket disconnected');
          stompClientRef.current = null;
        });
      } catch (error) {
        console.error('Error closing WebSocket:', error);
        stompClientRef.current = null;
      }
    }
  }, []);

  const registerNotificationHandlers = useCallback((onNotification, onNotificationResponse) => {
    // Handler for when notification is received while app is foregrounded
    const notificationListener = Notifications.addNotificationReceivedListener(
      onNotification ||
        ((notification) => {
          console.log('Notification received:', notification);
        })
    );

    // Handler for when user taps on notification
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      onNotificationResponse ||
        ((response) => {
          console.log('Notification response:', response);
        })
    );

    // Return cleanup function
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  // Initialize notifications when token changes
  useEffect(() => {
    if (token) {
      const initializeNotifications = async () => {
        try {
          // Register for push notifications
          await registerForPushNotifications();

          // Initialize WebSocket connection
          initializeWebSocket();

          // Register notification handlers
          return registerNotificationHandlers();
        } catch (error) {
          console.error('Failed to initialize notifications:', error);
        }
      };

      initializeNotifications();
    } else {
      closeWebSocket();
    }

    return () => {
      closeWebSocket();
    };
  }, [token, initializeWebSocket, closeWebSocket, registerForPushNotifications, registerNotificationHandlers]);

  return {
    scheduleNotification,
    registerForPushNotifications,
    registerNotificationHandlers,
    getDeliveredNotifications: Notifications.getPresentedNotificationsAsync,
    dismissAllNotifications: Notifications.dismissAllNotificationsAsync,
    setBadgeCount: Notifications.setBadgeCountAsync,
  };
}
