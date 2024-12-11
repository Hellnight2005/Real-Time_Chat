res.status(200).json(message);
} catch (error) {
console.error("Error sending message:", error);
res.status(500).json({ message: "Failed to send message" });
}
