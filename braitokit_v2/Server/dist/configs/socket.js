"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
exports.default = {
    events: {
        CONVERSATIONS_NEW_MESSAGE: "conversations/new_message",
        CONVERSATIONS_DELETE: "conversations/delete",
        CONVERSATION_DELETE_MESSAGE: (roomID) => `conversations/${roomID}/delete_message`,
        CONVERSATION_LEAVE: "conversation/leave",
        CONVERSATION_TYPING: "conversation/typing",
        CONVERSATION_JOIN: "conversation/join",
        CONVERSATION_SETTINGS: (roomID) => `conversation/${roomID}/settings`
    }
};
//# sourceMappingURL=socket.js.map