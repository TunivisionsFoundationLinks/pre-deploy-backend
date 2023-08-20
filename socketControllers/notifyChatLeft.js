import  {
    getServerSocketInstance,
    getActiveConnections,
} from "../socket/connectedUsers.js";

const notifyChatLeft = (socket, data) => {
    const { receiverUserId } = data;
    // const { userId } = socket.user;

    // active connections of the receiver user
    const activeConnections = getActiveConnections(receiverUserId);

    // send call response(accepted or rejected) to all the active connections of the receiver user
    const io = getServerSocketInstance();

    activeConnections.forEach((socketId) => {
        io.to(socketId).emit("notify-chat-left");
    });
};

export default notifyChatLeft;
