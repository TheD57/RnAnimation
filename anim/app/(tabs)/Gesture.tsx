import Animated, {
    useSharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';
import {  View } from '@/components/Themed';
import {StyleSheet} from 'react-native';
import {Gesture, GestureDetector} from "react-native-gesture-handler";

function GesturePage() {
    const position = useSharedValue({x: 0, y: 0});

    const context = useSharedValue({x: 0, y: 0});

    const panGesture = Gesture.Pan().onStart(()=> {
        context.value = {x: position.value.x, y: position.value.y};
    }).onUpdate(({translationX, translationY}) => {
        position.value = {x: translationX +context.value.x , y: context.value.y + translationY};
    });

    const circleStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateX: position.value.x}, {translateY:position.value.y}]
        };
    });
    return(
        <View style={styles.container}>
            <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.box, circleStyle]}  />

            </GestureDetector>
        </View>

    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "black",
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        width: 80,
        aspectRatio: 1,
        backgroundColor: "white",
    }
});

export default GesturePage;
