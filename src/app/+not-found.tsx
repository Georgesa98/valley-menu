import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'صفحة غير موجودة' }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
          404
        </Text>
        <Link href="/menu">
          <Text style={{ color: '#208AEF' }}>العودة للقائمة</Text>
        </Link>
      </View>
    </>
  );
}
