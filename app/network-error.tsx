import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function NetworkErrorScreen() {
    const router = useRouter();

    const handleRetry = () => {
        router.replace('/');
    };

    return (
        <View className="flex-1 bg-white justify-center items-center p-6">
            <StatusBar style="dark" />

            <View className="items-center mb-8">
                <MaterialIcons name="signal-wifi-off" size={80} color="#3b82f6" />
                <Text className="text-2xl font-bold mt-4 text-gray-800">No Internet Connection</Text>
                <Text className="text-gray-600 text-center mt-2">
                    Oops! It seems you&apos;re offline. Please check your internet connection and try again.
                </Text>
            </View>

            <TouchableOpacity
                onPress={handleRetry}
                className="bg-blue-500 py-3 px-6 rounded-lg flex-row items-center"
            >
                <MaterialIcons name="refresh" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">Try Again</Text>
            </TouchableOpacity>

            <View className="absolute bottom-8">
                <Text className="text-gray-400 text-xs">Still having trouble? Contact support</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1f2937',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#4b5563',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3b82f6',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
    },
    footerText: {
        color: '#9ca3af',
        fontSize: 12,
    },
});