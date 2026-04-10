import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Linking, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

function CloudflareLogo() {
  return (
    <Svg width={64} height={64} viewBox="0 0 100 100" fill="none">
      <Path
        d="M72.8 55.6c.3-1 .2-2-.3-2.7-.5-.6-1.3-1-2.2-1.1l-34.8-.5c-.2 0-.4-.1-.5-.2-.1-.2-.1-.4 0-.5.1-.2.3-.4.5-.4l35.1-.5c3.2-.2 6.7-2.8 7.9-5.9l1.6-4c.1-.2.1-.4 0-.6C77 28.4 66.5 20 54.2 20c-11 0-20.4 7-24 16.8-2.2-1.6-5-2.4-8-2.1-5.4.6-9.7 5-10.2 10.4-.1 1.2 0 2.3.2 3.4C5.5 49 0 54.8 0 61.9c0 .6 0 1.2.1 1.8.1.4.4.7.8.7h70c.3 0 .6-.2.7-.5l1.2-8.3z"
        fill="#F6821F"
      />
      <Path
        d="M82.1 39.1c-.4 0-.8 0-1.1.1-.2 0-.4.2-.5.4l-1.1 3.8c-.3 1-.2 2 .3 2.7.5.6 1.3 1 2.2 1.1l7.4.5c.2 0 .4.1.5.2.1.2.1.4 0 .5-.1.2-.3.4-.5.4l-7.7.5c-3.2.2-6.7 2.8-7.9 5.9l-.4 1.2c-.1.3.1.6.4.6h25.5c.3 0 .6-.2.7-.5.5-2 .8-4 .8-6.2-.1-11.2-9.3-20.7-19.1-20.7z"
        fill="#FBAD41"
      />
    </Svg>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <CloudflareLogo />
      <Text style={styles.title}>You are on Cloudflare Containers</Text>
      <Text style={styles.subtitle}>Powered by ExpoBox</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => Linking.openURL('https://github.com/zuraHQ/Gauss')}
      >
        <Text style={styles.buttonText}>Star on GitHub</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#F6821F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
