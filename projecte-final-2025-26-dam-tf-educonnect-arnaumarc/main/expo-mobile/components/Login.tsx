import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { API_BASE_URL } from '../config';
import { User } from '../types';

interface LoginProps {
    onLogin: (userData: User) => void;
    onNavigateToRegister: () => void;
}

const { width } = Dimensions.get('window');

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email || !password) {
            setError('Por favor, rellena todos los campos');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                onLogin({ ...data.user, type: data.type });
            } else {
                setError(data.message || 'Email o contraseña incorrectos');
            }
        } catch (err) {
            setError('Error al conectar con el servidor');
            console.error(err);
        } finally {
            setLoading(false);
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
                            <View style={[styles.dot, { backgroundColor: '#22d3ee' }]} />
                            <View style={[styles.dot, { backgroundColor: '#06b6d4' }]} />
                        </View>

                        {error ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <View style={styles.form}>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#6b7280"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!loading}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Contraseña"
                                placeholderTextColor="#6b7280"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                editable={!loading}
                            />
                            <TouchableOpacity
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.buttonText}>ENTRAR</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>¿No tienes cuenta?</Text>
                            <TouchableOpacity onPress={onNavigateToRegister}>
                                <Text style={styles.registerLink}>Regístrate aquí</Text>
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
        marginBottom: 8,
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
    errorContainer: {
        backgroundColor: '#fee2e2',
        borderLeftWidth: 4,
        borderLeftColor: '#ef4444',
        padding: 8,
        marginBottom: 16,
    },
    errorText: {
        color: '#b91c1c',
        fontSize: 14,
        fontWeight: 'bold',
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
    buttonDisabled: {
        backgroundColor: '#374151',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        marginTop: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        alignItems: 'center',
    },
    footerText: {
        color: '#4b5563',
        fontWeight: '500',
        marginBottom: 8,
    },
    registerLink: {
        color: '#06b6d4',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
