import React from 'react'
import { useWindowDimensions, Animated, View } from 'react-native';


const Paginator = ({ data, scrollX }) => {
    const { width } = useWindowDimensions();

    return (
        <View style={{ flexDirection: 'row', height: 20 }}>
            {data.map((_, i) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [15, 30, 15],
                    extrapolate: 'clamp',
                });

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.5, 1, 0.5],
                    extrapolate: 'clamp',
                });
                return (
                    <Animated.View
                        key={i.toString()}
                        style={{
                            height: 5,
                            width: dotWidth,
                            borderRadius: 5,
                            marginHorizontal: 8,
                            backgroundColor: '#E85B05',
                            opacity,
                        }}
                    />
                );
            })}
        </View>
    );
};

export default Paginator;