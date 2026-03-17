import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { API_BASE_URL } from '../config';

interface RegisterProps {
    onRegisterSuccess: () => void;
    onNavigateToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onNavigateToLogin }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        clase: '',
        tipo_horario: 'Mañana'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('¡Registro completado! Redirigiendo...');
                setTimeout(() => {
                    onNavigateToLogin();
                }, 2000);
            } else {
                setError(data.message || 'Error en el registro');
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

                        <Text style={styles.title}>REGISTRO</Text>

                        {error ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        {success ? (
                            <View style={styles.successContainer}>
                                <Text style={styles.successText}>{success}</Text>
                            </View>
                        ) : null}

                        <View style={styles.form}>
                            <View style={styles.row}>
                                <TextInput
                                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                                    placeholder="Nombre"
                                    placeholderTextColor="#6b7280"
                                    value={formData.nombre}
                                    onChangeText={(val) => handleChange('nombre', val)}
                                    editable={!loading}
                                />
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="Apellidos"
                                    placeholderTextColor="#6b7280"
                                    value={formData.apellidos}
                                    onChangeText={(val) => handleChange('apellidos', val)}
                                    editable={!loading}
                                />
                            </View>

                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#6b7280"
                                value={formData.email}
                                onChangeText={(val) => handleChange('email', val)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!loading}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Contraseña"
                                placeholderTextColor="#6b7280"
                                value={formData.password}
                                onChangeText={(val) => handleChange('password', val)}
                                secureTextEntry
                                editable={!loading}
                            />

                            <View style={styles.row}>
                                <TextInput
                                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                                    placeholder="Clase (Ej: 2DAM)"
                                    placeholderTextColor="#6b7280"
                                    value={formData.clase}
                                    onChangeText={(val) => handleChange('clase', val)}
                                    editable={!loading}
                                />
                                <View style={[styles.input, { flex: 1, justifyContent: 'center' }]}>
                                    <View style={styles.pickerRow}>
                                        <TouchableOpacity
                                            onPress={() => handleChange('tipo_horario', 'Mañana')}
                                            style={[styles.option, formData.tipo_horario === 'Mañana' && styles.optionActive]}
                                        >
                                            <Text style={[styles.optionText, formData.tipo_horario === 'Mañana' && styles.optionTextActive]}>M</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleChange('tipo_horario', 'Tarde')}
                                            style={[styles.option, formData.tipo_horario === 'Tarde' && styles.optionActive]}
                                        >
                                            <Text style={[styles.optionText, formData.tipo_horario === 'Tarde' && styles.optionTextActive]}>T</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.buttonText}>REGISTRARSE</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
                            <TouchableOpacity onPress={onNavigateToLogin}>
                                <Text style={styles.loginLink}>Inicia sesión aquí</Text>
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
        padding: 24,
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
        marginBottom: 16,
        gap: 8,
    },
    logoBars: {
        flexDirection: 'row',
        gap: 4,
    },
    bar: {
        width: 10,
        backgroundColor: 'black',
    },
    logoTextContainer: {
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        letterSpacing: 2,
        color: 'black',
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
    successContainer: {
        backgroundColor: '#dcfce7',
        borderLeftWidth: 4,
        borderLeftColor: '#22c55e',
        padding: 8,
        marginBottom: 16,
    },
    successText: {
        color: '#15803d',
        fontSize: 14,
        fontWeight: 'bold',
    },
    form: {
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 0,
    },
    input: {
        borderWidth: 2,
        borderColor: 'black',
        padding: 10,
        fontSize: 14,
        fontWeight: '600',
        color: 'black',
    },
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    option: {
        paddingHorizontal: 12,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 4,
    },
    optionActive: {
        backgroundColor: 'black',
        borderColor: 'black',
    },
    optionText: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#6b7280',
    },
    optionTextActive: {
        color: 'white',
    },
    button: {
        backgroundColor: 'black',
        padding: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#374151',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
    footer: {
        marginTop: 20,
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
    loginLink: {
        color: '#06b6d4',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
