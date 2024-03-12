import {Button, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing, runOnUI, runOnJS,
} from 'react-native-reanimated';
import { Text, View } from '@/components/Themed';
import {useState} from "react";

export default function TabOneScreen() {
  const randomWidth = useSharedValue(1);
const [fade, setFade] = useState("rien");
  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };
  const fadIn=  useSharedValue(0);

  const style = useAnimatedStyle(() => {
    return {
      transform: [{scale: withTiming(randomWidth.value, config)}],
      opacity : fadIn.value,
    };});

  // it'sa an animation so i should run it in the UI thread
  // reanimated funciton and hooks are used to run the animation in the UI thread (marked with "worklet")
  function handleFade() {
    'worklet';
    fadIn.value = 0;
    fadIn.value = withTiming(1,{duration: 700});
    // there I want to console log so use a javascript function so i need to use runOnJS
    runOnJS(setFade)("js runOnJS");
  }
  return (
      <View style={styles.container}>
        <Animated.View style={[styles.box, style]}  />
        <Button
            title="grow"
            onPress={() => {
              randomWidth.value = Math.random() % 6;
            }}
        />
        <Button
            title="fade"
            onPress={runOnUI(handleFade)}
        />
        <Text>{fade}</Text>

      </View>
  );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    box: {
      borderRadius : 50,
      width: 100,
      aspectRatio: 1,
      backgroundColor: 'black',
      margin: 30,
    },
  });
