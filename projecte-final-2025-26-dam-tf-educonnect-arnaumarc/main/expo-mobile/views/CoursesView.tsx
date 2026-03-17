import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { CourseCard } from '../components/CourseCard';
import { MOCK_COURSES } from '../constants';

export const CoursesView: React.FC = () => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.title}>Mis Cursos</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{MOCK_COURSES.length} Activos</Text>
                </View>
            </View>

            <View style={styles.list}>
                {MOCK_COURSES.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
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
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        paddingBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        textTransform: 'uppercase',
    },
    badge: {
        backgroundColor: 'black',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    list: {
        gap: 24,
    },
});
