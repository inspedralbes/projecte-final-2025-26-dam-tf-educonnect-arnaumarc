const { io } = require("socket.io-client");

async function runTest() {
    try {
        console.log("Fetching courses...");
        const coursesRes = await fetch("http://localhost:3005/api/courses");
        const courses = await coursesRes.json();
        const course = courses[1]; // Projecte
        const courseId = course._id;

        console.log("Fetching students...");
        const studentsRes = await fetch("http://localhost:3005/api/all-students");
        const students = await studentsRes.json();
        const student = students[0]; // Arnau
        const studentId = student._id;

        console.log(`Simulating Student ${student.nombre} (ID: ${studentId}) connecting to Socket.io...`);

        // Connect socket
        const socket = io("http://localhost:3005");

        socket.on("connect", () => {
            console.log("Student socket connected");
            // Register exactly as the component does
            socket.emit("register_user", studentId);

            // Wait a moment for registration to complete on the backend
            setTimeout(() => {
                console.log("Teacher sending notification to course:", course.title);
                fetch(`http://localhost:3005/api/courses/${courseId}/notify-all`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: "Test de Notificación",
                        content: "¡Hola! Esto es una prueba automatizada del bot.",
                        senderId: "65cf1234567890abcdef0009" // ID del profe (fake)
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log("Teacher API Response:", data);
                    })
                    .catch(err => console.error("API Error", err));
            }, 500); // 500ms should be enough for register_user to hit backend
        });

        socket.on("new_notification", (data) => {
            console.log("\n🔔 ===========================================");
            console.log("🔔 STUDENT RECEIVED NOTIFICATION VIA SOCKET!");
            console.log("🔔 Data:", data);
            console.log("🔔 ===========================================\n");
            console.log("✅ TEST SUCCESSFUL! El bot funciona correctamente.");
            socket.disconnect();
            process.exit(0);
        });

        // Timeout in case it fails
        setTimeout(() => {
            console.error("❌ TEST FAILED: Did not receive notification in 5 seconds");
            socket.disconnect();
            process.exit(1);
        }, 5000);

    } catch (error) {
        console.error("Caught error:", error);
        process.exit(1);
    }
}

runTest();
