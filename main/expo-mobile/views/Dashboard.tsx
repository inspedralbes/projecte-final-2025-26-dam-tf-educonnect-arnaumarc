import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Bell, Calendar, Clock } from 'lucide-react-native';

export const Dashboard: React.FC = () => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>[INS PEDRALBES]</Text>
            <Text style={styles.subtitle}>Panel de Control del Estudiante</Text>

            <View style={styles.grid}>
                {/* Welcome Box */}
                <View style={[styles.box, styles.welcomeBox]}>
                    <View style={styles.boxHeader}>
                        <View style={styles.dot} />
                        <Text style={styles.boxTitle}>Bienvenido</Text>
                    </View>
                    <Text style={styles.boxText}>
                        Hola, has iniciado sesión correctamente. Tienes <Text style={styles.bold}>3 tareas pendientes</Text> para esta semana.
                    </Text>
                </View>

                {/* Next Class Box */}
                <View style={[styles.box, styles.yellowBox]}>
                    <View style={styles.boxHeader}>
                        <Clock size={20} color="black" />
                        <Text style={styles.boxTitle}>Siguiente Clase</Text>
                    </View>
                    <Text style={styles.bigText}>11:00 AM</Text>
                    <Text style={styles.semibold}>Matemáticas Avanzadas</Text>
                    <Text style={styles.smallText}>Aula Virtual 01</Text>
                </View>

                {/* Notifications Box */}
                <View style={[styles.box, styles.cyanBox]}>
                    <View style={styles.boxHeader}>
                        <Bell size={20} color="black" />
                        <Text style={styles.boxTitle}>Avisos</Text>
                    </View>
                    <View style={styles.list}>
                        <Text style={styles.listItem}>• Mantenimiento programado: Viernes 22:00h.</Text>
                        <Text style={styles.listItem}>• Nuevos talleres disponibles.</Text>
                        <Text style={styles.listItem}>• Calificaciones publicadas: Historia.</Text>
                    </View>
                </View>
            </View>

            {/* Schedule Preview */}
            <View style={[styles.box, styles.whiteBox]}>
                <View style={styles.boxHeader}>
                    <Calendar size={20} color="black" />
                    <Text style={styles.boxTitle}>Horario de hoy</Text>
                </View>
                <View style={styles.scheduleList}>
                    <View style={[styles.scheduleItem, { borderLeftColor: '#a855f7' }]}>
                        <Text style={styles.timeText}>09:00 AM</Text>
                        <Text style={styles.courseName}>Historia del Arte</Text>
                    </View>
                    <View style={[styles.scheduleItem, { borderLeftColor: '#22c55e', backgroundColor: '#f9fafb' }]}>
                        <Text style={styles.timeText}>11:00 AM</Text>
                        <Text style={styles.courseName}>Matemáticas Avanzadas</Text>
                    </View>
                    <View style={[styles.scheduleItem, { borderLeftColor: '#f97316' }]}>
                        <Text style={styles.timeText}>13:00 PM</Text>
                        <Text style={styles.courseName}>Descanso</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    content: {
        padding: 20,
        gap: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 2,
        color: 'black',
    },
    subtitle: {
        textAlign: 'center',
        color: '#374151',
        fontWeight: '500',
        marginBottom: 10,
    },
    grid: {
        gap: 16,
    },
    box: {
        borderWidth: 2,
        borderColor: 'black',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    welcomeBox: {
        backgroundColor: 'white',
    },
    yellowBox: {
        backgroundColor: '#fef9c3', // yellow-100
    },
    cyanBox: {
        backgroundColor: '#cffafe', // cyan-100
    },
    whiteBox: {
        backgroundColor: 'white',
        elevation: 0,
        shadowOpacity: 0,
    },
    boxHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#22c55e',
    },
    boxTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    boxText: {
        color: '#1f2937',
        fontSize: 16,
    },
    bold: {
        fontWeight: 'bold',
    },
    bigText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 4,
    },
    semibold: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    smallText: {
        fontSize: 14,
        color: '#4b5563',
    },
    list: {
        gap: 8,
    },
    listItem: {
        fontSize: 14,
        color: '#111827',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        paddingBottom: 4,
    },
    scheduleList: {
        gap: 12,
    },
    scheduleItem: {
        flexDirection: 'row',
        borderLeftWidth: 4,
        paddingLeft: 16,
        paddingVertical: 8,
    },
    timeText: {
        width: 80,
        fontWeight: 'bold',
        color: '#6b7280',
    },
    courseName: {
        fontSize: 16,
        fontWeight: '600',
        color: 'black',
    },
});
