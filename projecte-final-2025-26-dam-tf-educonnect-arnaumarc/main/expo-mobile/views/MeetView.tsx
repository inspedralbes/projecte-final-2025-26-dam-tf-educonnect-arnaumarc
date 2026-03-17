import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MoreVertical, Users, MessageSquare } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const MeetView: React.FC = () => {
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [time, setTime] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <View style={styles.container}>
            {/* Main Content */}
            <View style={styles.mainContent}>
                {/* Main Speaker */}
                <View style={styles.mainSpeaker}>
                    <View style={styles.speakerLabel}>
                        <Text style={styles.labelText}>Dr. Roberto Martínez</Text>
                    </View>
                    <Image
                        source={{ uri: 'https://picsum.photos/800/600' }}
                        style={styles.mainImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Participants Grid (simplified for mobile) */}
                <View style={styles.participantsContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.participantsScroll}>
                        <View style={styles.participantSmall}>
                            {camOn ? (
                                <Image source={{ uri: 'https://picsum.photos/300/200?random=10' }} style={styles.smallImage} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarText}>Y</Text>
                                </View>
                            )}
                            <Text style={styles.participantName}>Tú</Text>
                        </View>
                        <View style={styles.participantSmall}>
                            <View style={[styles.avatarPlaceholder, { backgroundColor: '#eab308' }]}>
                                <Text style={[styles.avatarText, { color: 'black' }]}>AG</Text>
                            </View>
                            <Text style={styles.participantName}>Ana Gómez</Text>
                        </View>
                        <View style={styles.participantSmall}>
                            <Image source={{ uri: 'https://picsum.photos/300/200?random=11' }} style={styles.smallImage} />
                            <Text style={styles.participantName}>Carlos Ruiz</Text>
                        </View>
                    </ScrollView>
                </View>
            </View>

            {/* Footer Controls */}
            <View style={styles.footer}>
                <View style={styles.controlsRow}>
                    <TouchableOpacity
                        onPress={() => setMicOn(!micOn)}
                        style={[styles.controlButton, micOn ? styles.buttonGray : styles.buttonRed]}
                    >
                        {micOn ? <Mic size={24} color="white" /> : <MicOff size={24} color="white" />}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setCamOn(!camOn)}
                        style={[styles.controlButton, camOn ? styles.buttonGray : styles.buttonRed]}
                    >
                        {camOn ? <Video size={24} color="white" /> : <VideoOff size={24} color="white" />}
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.controlButton, styles.buttonRed, styles.buttonEnd]}>
                        <PhoneOff size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.footerTime}>{time} | Clase de Matemáticas</Text>
                    <View style={styles.actionIcons}>
                        <TouchableOpacity>
                            <Users size={24} color="#d1d5db" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <MessageSquare size={24} color="#d1d5db" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#202124',
    },
    mainContent: {
        flex: 1,
        padding: 12,
        gap: 12,
    },
    mainSpeaker: {
        flex: 1,
        backgroundColor: '#1f2937',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#374151',
    },
    speakerLabel: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        zIndex: 10,
    },
    labelText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
    mainImage: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    participantsContainer: {
        height: 120,
    },
    participantsScroll: {
        gap: 12,
        paddingRight: 12,
    },
    participantSmall: {
        width: 150,
        height: '100%',
        backgroundColor: '#1f2937',
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 1,
        borderColor: '#374151',
    },
    smallImage: {
        width: '100%',
        height: '100%',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#a855f7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    participantName: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        color: 'white',
        fontSize: 10,
        fontWeight: '500',
    },
    footer: {
        backgroundColor: '#202124',
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#374151',
    },
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 16,
    },
    controlButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonGray: {
        backgroundColor: '#374151',
    },
    buttonRed: {
        backgroundColor: '#dc2626',
    },
    buttonEnd: {
        width: 64,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    footerTime: {
        color: 'white',
        fontSize: 12,
    },
    actionIcons: {
        flexDirection: 'row',
        gap: 20,
    },
});
