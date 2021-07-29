import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    useWindowDimensions,
    Animated,
    Button,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import AppTextField from './components/AppTextField';

const data = [
    {
        id: 0,
        name: 'Customer',
    },
    { id: 1, name: 'Move' },
    {
        id: 2,
        name: 'Third',
    },
    {
        id: 3,
        name: 'Third',
    },
];

const NextPrevButton = ({ onPress, title, containerStyle, disabled }) => {
    return (
        <TouchableOpacity
            disabled={disabled}
            style={[
                containerStyle,
                {
                    backgroundColor: disabled ? '#ebeff5' : '#FFFFFF',
                    shadowColor: '#dedede',
                    shadowOffset: { width: 3, height: 7 },
                    shadowOpacity: 0.7,
                    shadowRadius: 5,
                    elevation: 8,
                    borderRadius: 20,
                    paddingHorizontal: 30,
                    paddingVertical: 10,
                },
            ]}
            onPress={onPress}
        >
            <Text style={{ textTransform: 'capitalize' }}>{title}</Text>
        </TouchableOpacity>
    );
};

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

const Step = ({ children }) => {
    return (
        <View style={{ flex: 1, width: '100%', height: '100%', padding: 10 }}>
            {children}
        </View>
    );
};

const Page = ({ index }) => {
    const { width, height } = useWindowDimensions();
    return (
        <View
            style={{
                justifyContent: 'center',
                alignContent: 'center',
                flex: 1,
                width,
                height,
            }}
        >
            {index === 0 && (
                <Step
                    style={{
                        alignItems: 'center',
                        backgroundColor: 'red',
                        flex: 1,
                        width,
                        height,
                        justifyContent: 'center',
                    }}
                >
                    <AppTextField placeholder="Customer's Full Name" />
                </Step>
            )}
            {index === 1 && (
                <Step>
                    <Text>Property Info</Text>
                </Step>
            )}
            {index === 2 && (
                <Step>
                    <Text>Comments</Text>
                    <Text>Helo Amigo</Text>
                </Step>
            )}
        </View>
    );
};

export default function App() {
    const [currentX, setCurrentX] = useState(0);

    const scrollX = useRef(new Animated.Value(0)).current;
    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 75 }).current;
    const slideRef = useRef();

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentX(viewableItems[0].index);
        }
    }).current;

    const _nextStep = () => {
        if (currentX < data.length - 1) {
            slideRef.current.scrollToIndex({ index: currentX + 1 });
        }
    };

    const _prevStep = () => {
        if (currentX !== 0) {
            slideRef.current.scrollToIndex({ index: currentX - 1 });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style='auto' />
            <View style={{ marginTop: 20 }}>
                <Paginator data={data} scrollX={scrollX} />
            </View>
            <View style={{ flex: 3 }}>
                <FlatList
                    ref={slideRef}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    horizontal
                    viewabilityConfig={viewConfig}
                    onViewableItemsChanged={viewableItemsChanged}
                    bounces={false}
                    scrollEventThrottle={32}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => <Page index={index} />}
                />
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    width: '100%',
                }}
            >
                <NextPrevButton
                    disabled={currentX === 0}
                    title='Prev'
                    onPress={_prevStep}
                    title='Prev'
                />
                <NextPrevButton
                    disabled={currentX === data.length - 1}
                    title='Next'
                    onPress={_nextStep}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
