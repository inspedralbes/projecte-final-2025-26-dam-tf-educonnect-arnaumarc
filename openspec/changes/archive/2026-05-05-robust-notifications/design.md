# Design: Robust Notifications

## Data Model (MongoDB)
```javascript
const notificationSchema = new mongoose.Schema({
    recipient: { type: ObjectId, refPath: 'recipientModel', required: true },
    recipientModel: { type: String, enum: ['Alumno', 'Professor'], default: 'Alumno' },
    sender: { type: ObjectId, refPath: 'senderModel' },
    senderModel: { type: String, enum: ['Professor', 'Alumno'], default: 'Professor' },
    type: { 
        type: String, 
        enum: ['EXAM', 'MATERIAL', 'MESSAGE', 'ANNOUNCEMENT', 'SYSTEM'],
        default: 'SYSTEM'
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    link: String,
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});
```

## Socket Flow
1. Client connects and emits `register_user(userId)`.
2. Server handles `register_user`:
    - Retrieves all notifications where `recipient == userId` and `read == false`.
    - Emits `sync_notifications(notificationsList)` to that specific socket.
3. Server handles new events (e.g., new topic):
    - Creates `Notification` entries in DB.
    - Emits `new_notification(notificationData)` to all connected recipients.

## Frontend Architecture
- **SocketContext**: Maintains a local state `notifications[]` and `unreadCount`.
- **Navbar**: Consumes `unreadCount` for the badge.
- **NotificationPanel**: Fetches/Filters notifications and allows "Mark as Read" (API call).
