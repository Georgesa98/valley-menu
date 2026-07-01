import React from 'react';
import { Text, View } from 'react-native';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>diagnostic plain text</Text>
    </View>
  );
}
