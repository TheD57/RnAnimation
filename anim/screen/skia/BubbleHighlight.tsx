import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {Canvas, Circle} from "@shopify/react-native-skia";
import {Dimensions, StyleSheet} from "react-native";
import {SharedValue, useDerivedValue, useSharedValue, withTiming} from "react-native-reanimated";

// Get the height of the window
const {height : wheight} = Dimensions.get("window");

type BubbleHighlightProps = {
    height?: number;
    colors?: string[];
}
/**
 * BubbleHighlight is a React component that creates an interactive bubble effect on the screen.
 * The bubbles respond to pan gestures, changing their size based on the proximity to the gesture.
 * Original source code (with Youtube) : https://github.com/friyiajr/SkiaAnimationShowcase/blob/main/src/YouTube/ChasingBubbles/ChasingBubbles.tsx
 * My Notes :
 */
function BubbleHighlight({height = wheight, colors}: BubbleHighlightProps) {
    //  Initialize the bubbles
    const nbDotHeight = Math.round(height / 35);
    const nbArray = Array.from(Array(nbDotHeight * 12).keys());

    // Shared values to hold the x and y position of the pan gesture
    const xPosition = useSharedValue(-1);
    const yPosition = useSharedValue(-1);

    // Pan gesture handler
    const panGesture = Gesture.Pan()
        .onBegin(({x, y}) => {
            xPosition.value = x;
            yPosition.value = y;
        }).onChange(({x, y}) => {
                xPosition.value = x;
                yPosition.value = y;
            }
        ).onEnd(() => {
            xPosition.value = -1;
            yPosition.value = -1;
        }).onFinalize(() => {
            xPosition.value = -1;
            yPosition.value = -1;
        })

    // Render the bubbles inside a Canvas, with a GestureDetector to handle the pan gesture
    return (
        <GestureDetector gesture={panGesture}>
            <Canvas style={styles.container}>
                {nbArray.map((index) => (
                        <Bubble key={index} index={index} xPosition={xPosition} yPosition={yPosition} colors={colors} size={30}/>
                    )
                )}
            </Canvas>
        </GestureDetector>);
}

// Styles for the BubbleHighlight component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: 'center',
        justifyContent: 'center',
    },
});

/**
 * Type for the Bubble component props
 */
type BubbleProps = {
    index: number;
    xPosition: SharedValue<number>;
    yPosition: SharedValue<number>;
    colors?: string[];
    size: number | number[];
}

/**
 * Bubble is a React component that represents a single bubble in the BubbleHighlight component.
 * It changes its size based on its proximity to the pan gesture.
 */
export function Bubble({index, xPosition, yPosition, colors= ["purple"], size = 30}: BubbleProps) {
    const currentColor =colors[index % colors?.length] ;
    const currentSize = Array.isArray(size) ? size[index % size.length] : size;
    const currentRow = Math.floor(index / 12) * currentSize;
    const currentColumn = Math.floor(index % 12) * currentSize + 35;

    const radius = useDerivedValue(() => {
        "worklet";
        const hypotenuse = Math.hypot(xPosition.value - currentColumn, yPosition.value - currentSize - currentRow)
        if (hypotenuse <= 55 && xPosition.value !== -1) {
            return withTiming(currentSize/2)
        } else {
            return withTiming(currentSize / 10)
        }
    })

    return (
        <Circle r={radius} cx={currentColumn} cy={currentRow + currentSize} color={currentColor}/>
    );
}

export default BubbleHighlight;
