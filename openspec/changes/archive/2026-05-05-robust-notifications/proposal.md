# Proposal: Robust Notifications System

## Problem Statement
The current notification system is fragile and mixed with private messages. Notifications are lost if the user is offline, and there is no clear distinction between system alerts and personal messages.

## Proposed Solution
Introduce a dedicated `Notification` model with status persistence and a real-time synchronization mechanism. A new "Notification Center" in the Navbar will provide global access and visibility.

## Scope
- Backend: New model, specialized routes, and socket synchronization.
- Frontend: Global SocketContext listener, Navbar Bell icon, and Notification Panel.

## Non-Goals
- Real-time chat (stays in Message model).
- Push notifications (browser/mobile OS level).
