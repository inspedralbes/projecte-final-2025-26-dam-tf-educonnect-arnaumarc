import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { User, Mail, Shield, Bell, Settings, CreditCard, ChevronRight } from 'lucide-react-native';

export const ProfileView: React.FC = () => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <User size={60} color="white" />
                    </View>
                    <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.editButtonText}>Editar</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.userName}>Arnau Marc</Text>
                <Text style={styles.userRole}>Estudiante Premium</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Cursos</Text>
                </View>
                <View style={[styles.statItem, styles.statBorder]}>
                    <Text style={styles.statNumber}>85%</Text>
                    <Text style={styles.statLabel}>Promedio</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>4</Text>
                    <Text style={styles.statLabel}>Certificados</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información Personal</Text>
                <View style={styles.card}>
                    <ProfileItem icon={<Mail size={20} color="#6366f1" />} label="Email" value="arnau.marc@educonnect.com" />
                    <ProfileItem icon={<Shield size={20} color="#6366f1" />} label="Seguridad" value="Verificada" />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ajustes</Text>
                <View style={styles.card}>
                    <ActionItem icon={<Bell size={20} color="#f59e0b" />} label="Notificaciones" />
                    <ActionItem icon={<CreditCard size={20} color="#10b981" />} label="Suscripción" />
                    <ActionItem icon={<Settings size={20} color="#6b7280" />} label="Preferencias" last />
                </View>
            </View>

            <TouchableOpacity style={styles.supportButton}>
                <Text style={styles.supportButtonText}>Contactar Soporte</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const ProfileItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
    <View style={styles.itemContainer}>
        <View style={styles.itemIcon}>{icon}</View>
        <View style={styles.itemContent}>
            <Text style={styles.itemLabel}>{label}</Text>
            <Text style={styles.itemValue}>{value}</Text>
        </View>
    </View>
);

const ActionItem = ({ icon, label, last }: { icon: any, label: string, last?: boolean }) => (
    <TouchableOpacity style={[styles.itemContainer, !last && styles.itemBorder]}>
        <View style={styles.itemIcon}>{icon}</View>
        <Text style={styles.actionLabel}>{label}</Text>
        <ChevronRight size={20} color="#d1d5db" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#6366f1',
        borderWidth: 4,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'black',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'white',
    },
    editButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'black',
    },
    userRole: {
        fontSize: 16,
        color: '#6366f1',
        fontWeight: '600',
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: 'black',
        paddingVertical: 20,
        marginBottom: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 0,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statBorder: {
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderColor: '#f3f4f6',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    statLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 4,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 12,
        marginLeft: 4,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: 'black',
        overflow: 'hidden',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    itemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    itemIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    itemContent: {
        flex: 1,
    },
    itemLabel: {
        fontSize: 12,
        color: '#6b7280',
    },
    itemValue: {
        fontSize: 15,
        fontWeight: '600',
        color: 'black',
        marginTop: 2,
    },
    actionLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: 'black',
    },
    supportButton: {
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 15,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    supportButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
});
