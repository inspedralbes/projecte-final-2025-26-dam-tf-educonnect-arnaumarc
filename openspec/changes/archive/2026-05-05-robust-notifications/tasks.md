# Tasks: Robust Notifications

- [x] **Phase 1: Backend Infrastructure**
    - [x] Create `Notification.js` model.
    - [x] Create `notificationController.js` with `getUserNotifications` and `markAsRead`.
    - [x] Add routes in `notificationRoutes.js` and register in `index.js`.
    - [x] Implement `sync_notifications` logic in `index.js` (Socket handler).

- [x] **Phase 2: Transition Emission**
    - [x] Update `notificationHelper.js` to use the new `Notification` model.
    - [x] Update `eventController`, `topicController`, and `messageController` to trigger notifications correctly.

- [x] **Phase 3: Frontend Implementation**
    - [x] Update `SocketContext.tsx` to handle `sync_notifications` and `new_notification`.
    - [x] Create `NotificationPanel.tsx` component.
    - [x] Integrate Bell Icon and Panel in `Navbar.tsx`.
    - [x] Remove old `NotificationsDropdown` from `ProfileView.tsx`.
