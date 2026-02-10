import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

interface LoginProps {
    onLogin: () => void;
}

const { width } = Dimensions.get('window');

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        if (email && password) {
            onLogin();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.card}>
                        {/* Logo Simulation */}
                        <View style={styles.logoContainer}>
                            <View style={styles.logoBars}>
                                <View style={[styles.bar, { height: 48 }]} />
                                <View style={[styles.bar, { height: 32, marginTop: 16 }]} />
                                <View style={[styles.bar, { height: 40, marginTop: 8 }]} />
                            </View>
                            <View style={styles.logoTextContainer}>
                                <Text style={[styles.logoText, { color: '#06b6d4' }]}>INS</Text>
                                <Text style={[styles.logoText, { color: '#22d3ee' }]}>PEDRALBES</Text>
                            </View>
                        </View>

                        <View style={styles.dotsContainer}>
                            <View style={[styles.dot, { backgroundColor: '#22d3ee' }]} />
                            <View style={[styles.dot, { backgroundColor: '#06b6d4' }]} />
                        </View>

                        <View style={styles.form}>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#6b7280"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Contraseña"
                                placeholderTextColor="#6b7280"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>ENTRAR</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        borderWidth: 8,
        borderColor: 'black',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: 'white',
        padding: 32,
        borderWidth: 2,
        borderColor: 'black',
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 8,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        gap: 8,
    },
    logoBars: {
        flexDirection: 'row',
        gap: 4,
    },
    bar: {
        width: 12,
        backgroundColor: 'black',
    },
    logoTextContainer: {
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        lineHeight: 28,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 4,
        marginTop: 4,
        marginBottom: 32,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    form: {
        gap: 24,
    },
    input: {
        borderWidth: 2,
        borderColor: 'black',
        padding: 12,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        color: 'black',
    },
    button: {
        backgroundColor: 'black',
        padding: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
