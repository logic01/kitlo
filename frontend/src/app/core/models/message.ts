export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  sentAt: string;
  read: boolean;
}

export interface MessageThread {
  id: string;
  participantIds: string[];
  participantName: string;
  participantAvatarUrl?: string;
  bookingId?: string;
  listingId?: string;
  lastMessagePreview: string;
  lastMessageAt: string;
  unreadCount: number;
}
