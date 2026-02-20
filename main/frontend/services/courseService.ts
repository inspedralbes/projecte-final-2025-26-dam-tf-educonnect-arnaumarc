import { Course } from '../types';
import { MOCK_COURSES } from '../constants';

// This implementation currently mocks the backend API provided by the colleague.
// In the future, this will be replaced by actual fetch calls to the Node.js/MongoDB backend.

const SIMULATE_DELAY = 500; // ms to simulate network latency

export const courseService = {
    /**
     * Fetch all available courses.
     */
    getAllCourses: async (): Promise<Course[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_COURSES);
            }, SIMULATE_DELAY);
        });
    },

    /**
     * Fetch courses enrolled by a specific user.
     * Currently mocks returning all courses if the user is enrolled in everything.
     * @param userId The ID of the user.
     */
    getEnrolledCourses: async (userId: string): Promise<Course[]> => {
        // In a real app, we would fetch based on userId.
        // For now, we return courses based on the mock user behavior (which is all of them).
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_COURSES);
            }, SIMULATE_DELAY);
        });
    },

    /**
     * Fetch a specific course by ID.
     * @param courseId The ID of the course.
     */
    getCourseById: async (courseId: string): Promise<Course | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const course = MOCK_COURSES.find(c => c.id === courseId);
                resolve(course);
            }, SIMULATE_DELAY);
        });
    }
};
