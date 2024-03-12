import {Button, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { Text, View } from '@/components/Themed';

export default function TabTwoScreen() {
  // shared value is a value that can be shared between the UI thread and the JS thread it's like useRef it doesn't trigger a re-render
  // shared value is async on the JS thread and sync on the UI thread
  const sharedValue = useSharedValue(1);
  // observe the shared value so whenever the shared value changes the hook call the updater function to return the new value
  const newValue = useDerivedValue(() => {
    return sharedValue.value * 2;
  });
  // same behavior as useDerivedValue
    const style = useAnimatedStyle(() => {
        return {
            transform: [{scale: withTiming(sharedValue.value, {duration: 500})}],
        };
    } );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <Animated.View style={[styles.box]}  />
      <Text>Original Value : {sharedValue.value}</Text>
      <Text>DerivedValue : {newValue.value}</Text>
      <Button title={"Change Value"} onPress={() => {
        sharedValue.value = Math.random();
      } }/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  box: {
    width: 80,
    height: 100,
    backgroundColor: "black",
  }
});
