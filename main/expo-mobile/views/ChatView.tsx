import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { Send, Phone, Video, MoreVertical, Paperclip } from 'lucide-react-native';
import { ChatMessage } from '../types';
import { INITIAL_CHAT_MESSAGES } from '../constants';

export const ChatView: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList<ChatMessage>>(null);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: 'Yo',
            text: inputText,
            isMe: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');

        // Scroll to end after sending
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const renderMessage = React.useCallback(({ item }: { item: ChatMessage }) => {
        return (
            <View style={[styles.messageWrapper, item.isMe ? styles.myMessageWrapper : styles.theirMessageWrapper]}>
                <View style={[styles.messageBubble, item.isMe ? styles.myBubble : styles.theirBubble]}>
                    {!item.isMe && (
                        <Text style={styles.senderText}>{item.sender}</Text>
                    )}
                    <Text style={styles.messageText}>{item.text}</Text>
                    <Text style={styles.timestampText}>{item.timestamp}</Text>
                </View>
            </View>
        );
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            style={styles.container}
        >
            {/* Chat Header */}
            <View style={styles.header}>
                <View style={styles.headerInfo}>
                    <Image source={{ uri: 'https://picsum.photos/100/100' }} style={styles.avatar} />
                    <View>
                        <Text style={styles.headerTitle}>Clase 2º DAM</Text>
                        <Text style={styles.headerSubtitle}>Ana, Carlos, Tú...</Text>
                    </View>
                </View>
                <View style={styles.headerActions}>
                    <Video size={20} color="white" />
                    <Phone size={20} color="white" />
                    <MoreVertical size={20} color="white" />
                </View>
            </View>

            {/* Messages Area */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.messagesList}
                style={styles.flatList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            />

            {/* Input Area */}
            <View style={styles.inputArea}>
                <TouchableOpacity style={styles.iconButton}>
                    <Paperclip size={20} color="#6b7280" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Escribe un mensaje"
                    placeholderTextColor="#6b7280"
                    multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Send size={18} color="white" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e5ddd5',
    },
    header: {
        backgroundColor: '#075e54',
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 4,
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#cbd5e1',
    },
    headerTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    headerSubtitle: {
        color: 'white',
        opacity: 0.8,
        fontSize: 12,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 16,
    },
    flatList: {
        flex: 1,
    },
    messagesList: {
        padding: 16,
        gap: 8,
    },
    messageWrapper: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    myMessageWrapper: {
        justifyContent: 'flex-end',
    },
    theirMessageWrapper: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        elevation: 1,
    },
    myBubble: {
        backgroundColor: '#dcf8c6',
        borderTopRightRadius: 0,
    },
    theirBubble: {
        backgroundColor: 'white',
        borderTopLeftRadius: 0,
    },
    senderText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#ea580c', // orange-600
        marginBottom: 2,
    },
    messageText: {
        fontSize: 14,
        color: '#1f2937',
    },
    timestampText: {
        fontSize: 10,
        color: '#6b7280',
        textAlign: 'right',
        marginTop: 2,
    },
    inputArea: {
        backgroundColor: '#f0f0f0',
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconButton: {
        padding: 8,
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 14,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#075e54',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
