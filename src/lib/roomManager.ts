export interface ChatMessage {
  id: string;
  username: string;
  text: string;
  timestamp: number;
  type: 'user' | 'system';
}

export interface RoomData {
  code: string;
  users: string[];
  messages: ChatMessage[];
  createdAt: number;
}

type EventType =
  | 'room-created'
  | 'user-joined'
  | 'user-left'
  | 'new-message'
  | 'room-deleted'
  | 'room-sync-request'
  | 'room-sync-response';

interface BroadcastEvent {
  type: EventType;
  roomCode: string;
  payload: Record<string, unknown>;
  senderId: string;
}

type Listener = (event: BroadcastEvent) => void;

const STORAGE_KEY = 'campfire_rooms';
const CHANNEL_NAME = 'campfire_chat';

class RoomManager {
  private channel: BroadcastChannel;
  private tabId: string;
  private listeners: Map<string, Listener[]> = new Map();

  constructor() {
    this.tabId = Math.random().toString(36).substring(2, 10);
    this.channel = new BroadcastChannel(CHANNEL_NAME);
    this.channel.onmessage = (event: MessageEvent<BroadcastEvent>) => {
      const data = event.data;
      if (data.senderId === this.tabId) return;
      this.emit(data.type, data);
    };
  }

  getTabId(): string {
    return this.tabId;
  }

  private emit(type: string, event: BroadcastEvent) {
    const fns = this.listeners.get(type) || [];
    fns.forEach(fn => fn(event));
  }

  on(type: string, fn: Listener) {
    const fns = this.listeners.get(type) || [];
    fns.push(fn);
    this.listeners.set(type, fns);
  }

  off(type: string, fn: Listener) {
    const fns = this.listeners.get(type) || [];
    this.listeners.set(type, fns.filter(f => f !== fn));
  }

  private broadcast(type: EventType, roomCode: string, payload: Record<string, unknown> = {}) {
    const event: BroadcastEvent = { type, roomCode, payload, senderId: this.tabId };
    this.channel.postMessage(event);
  }

  private getRooms(): Record<string, RoomData> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private saveRooms(rooms: Record<string, RoomData>) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
  }

  private generateCode(): string {
    let code = '';
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private makeId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  }

  createRoom(username: string): { success: boolean; roomCode?: string; error?: string } {
    const rooms = this.getRooms();
    let code = this.generateCode();
    let attempts = 0;
    while (rooms[code] && attempts < 100) {
      code = this.generateCode();
      attempts++;
    }

    const systemMsg: ChatMessage = {
      id: this.makeId(),
      username: 'System',
      text: `${username} created the room 🎉`,
      timestamp: Date.now(),
      type: 'system',
    };

    const room: RoomData = {
      code,
      users: [username],
      messages: [systemMsg],
      createdAt: Date.now(),
    };

    rooms[code] = room;
    this.saveRooms(rooms);
    this.broadcast('room-created', code, { room, username });
    return { success: true, roomCode: code };
  }

  joinRoom(roomCode: string, username: string): { success: boolean; room?: RoomData; error?: string } {
    const rooms = this.getRooms();
    const room = rooms[roomCode];

    if (!room) {
      return { success: false, error: 'Room not found. Check the code and try again.' };
    }

    if (room.users.includes(username)) {
      return { success: false, error: 'Username already taken in this room. Pick another!' };
    }

    room.users.push(username);

    const systemMsg: ChatMessage = {
      id: this.makeId(),
      username: 'System',
      text: `${username} joined the room 👋`,
      timestamp: Date.now(),
      type: 'system',
    };
    room.messages.push(systemMsg);

    rooms[roomCode] = room;
    this.saveRooms(rooms);
    this.broadcast('user-joined', roomCode, { username, message: systemMsg });
    return { success: true, room };
  }

  leaveRoom(roomCode: string, username: string) {
    const rooms = this.getRooms();
    const room = rooms[roomCode];
    if (!room) return;

    room.users = room.users.filter(u => u !== username);

    if (room.users.length === 0) {
      delete rooms[roomCode];
      this.saveRooms(rooms);
      this.broadcast('room-deleted', roomCode, {});
      return;
    }

    const systemMsg: ChatMessage = {
      id: this.makeId(),
      username: 'System',
      text: `${username} left the room 👋`,
      timestamp: Date.now(),
      type: 'system',
    };
    room.messages.push(systemMsg);

    rooms[roomCode] = room;
    this.saveRooms(rooms);
    this.broadcast('user-left', roomCode, { username, message: systemMsg });
  }

  sendMessage(roomCode: string, username: string, text: string): ChatMessage | null {
    const rooms = this.getRooms();
    const room = rooms[roomCode];
    if (!room) return null;

    const msg: ChatMessage = {
      id: this.makeId(),
      username,
      text,
      timestamp: Date.now(),
      type: 'user',
    };

    room.messages.push(msg);
    rooms[roomCode] = room;
    this.saveRooms(rooms);
    this.broadcast('new-message', roomCode, { message: msg });
    return msg;
  }

  getRoom(roomCode: string): RoomData | null {
    const rooms = this.getRooms();
    return rooms[roomCode] || null;
  }

  destroy() {
    this.channel.close();
    this.listeners.clear();
  }
}

export const roomManager = new RoomManager();
