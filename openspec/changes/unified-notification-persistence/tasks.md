## 1. Frontend: Limpieza de SocketContext

- [x] 1.1 Localizar y eliminar la creación de `NotificationData` manual dentro del evento `incoming_call`.
- [x] 1.2 Asegurar que el componente `InteractiveToast` se dispare solo desde el evento `new_notification`.

## 2. Backend: Refuerzo de Atomicidad

- [x] 2.1 Revisar `index.js` para asegurar que el orden de ejecución sea: 1. DB Save -> 2. Emit `new_notification` -> 3. Emit `incoming_call`.
- [x] 2.2 Verificar que el tipo de notificación sea correctamente `MEET_CALL`.

## 3. Validación

- [x] 3.1 Iniciar una llamada y verificar que solo aparece UNA notificación en el tablón/bot.
- [x] 3.2 Refrescar la página durante una llamada entrante y verificar que la notificación persiste en el tablón.
- [x] 3.3 Comprobar que tras 24 horas la notificación desaparece (simulando tiempo en la DB).
