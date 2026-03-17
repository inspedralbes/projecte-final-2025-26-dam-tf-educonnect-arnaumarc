import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Course } from '../types';

interface CourseCardProps {
    course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.headerText}>[{course.title}]</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: course.image }} style={styles.image} />
                </View>
                <View style={styles.info}>
                    <Text style={styles.description}>
                        {course.description}
                    </Text>
                    <Text style={styles.professor}>
                        Profesor: <Text style={styles.professorName}>{course.professor}</Text>
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: '#e5e7eb', // gray-200
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        paddingBottom: 4,
        marginBottom: 8,
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
    content: {
        flexDirection: 'row',
        gap: 16,
    },
    imageContainer: {
        width: 80,
        height: 80,
        backgroundColor: '#67e8f9', // cyan-300
        borderWidth: 2,
        borderColor: 'black',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        opacity: 0.7,
    },
    info: {
        flex: 1,
        justifyContent: 'space-between',
    },
    description: {
        fontSize: 12,
        color: '#111827',
        fontWeight: '500',
        lineHeight: 16,
    },
    professor: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 8,
    },
    professorName: {
        fontWeight: 'normal',
        color: '#1f2937',
    },
});
