import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};
let usernames = {};
let mediaStates = {};

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("SOMETHING CONNECTED");

    socket.on("join-call", (path, username) => {
      if (connections[path] === undefined) {
        connections[path] = [];
      }
      connections[path].push(socket.id);
      usernames[socket.id] = username;
      mediaStates[socket.id] = {
        audio: true,
        video: true,
      };
      timeOnline[socket.id] = new Date();

      // connections[path].forEach(elem => {
      //     io.to(elem)
      // })

      for (let a = 0; a < connections[path].length; a++) {
        io.to(connections[path][a]).emit(
          "user-joined",
          socket.id,
          connections[path],
          usernames,
          mediaStates,
        );
      }

      if (messages[path] !== undefined) {
        for (let a = 0; a < messages[path].length; ++a) {
          io.to(socket.id).emit(
            "chat-message",
            messages[path][a]["data"],
            messages[path][a]["sender"],
            messages[path][a]["socket-id-sender"],
          );
        }
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("media-status", ({ audio, video }) => {
      mediaStates[socket.id] = {
        audio,
        video,
      };

      let matchingRoom = "";

      for (const room in connections) {
        if (connections[room].includes(socket.id)) {
          matchingRoom = room;
          break;
        }
      }

      if (matchingRoom !== "") {
        connections[matchingRoom].forEach((clientId) => {
          io.to(clientId).emit(
            "media-status-update",
            socket.id,
            mediaStates[socket.id],
          );
        });
      }
    });

    socket.on("chat-message", (data, sender) => {
      let matchingRoom = "";

      for (const room in connections) {
        if (connections[room].includes(socket.id)) {
          matchingRoom = room;
          break;
        }
      }

      if (matchingRoom !== "") {
        if (messages[matchingRoom] === undefined) {
          messages[matchingRoom] = [];
        }

        messages[matchingRoom].push({
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        });
        // console.log("message", matchingRoom, ":", sender, data);

        connections[matchingRoom].forEach((elem) => {
          io.to(elem).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    socket.on("disconnect", () => {
      const diffTime = Math.abs(timeOnline[socket.id] - new Date());

      let key;

      for (const [k, v] of Object.entries(connections)) {
        for (let a = 0; a < v.length; ++a) {
          if (v[a] === socket.id) {
            key = k;

            for (let a = 0; a < connections[key].length; ++a) {
              io.to(connections[key][a]).emit("user-left", socket.id);
            }

            let index = connections[key].indexOf(socket.id);

            connections[key].splice(index, 1);

            delete usernames[socket.id];
            delete mediaStates[socket.id];

            if (connections[key].length === 0) {
              delete connections[key];
            }
          }
        }
      }
    });
  });

  return io;
};
