import React from 'react'
import { useWindowDimensions, View, Text } from 'react-native';


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

export default Page;