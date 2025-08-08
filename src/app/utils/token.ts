import { jwtDecode } from "jwt-decode";
import { UserType } from "../store/user";
import { LastMessage } from "../store/chat";

interface AccessTokenPayload {
  exp: number;
  iat: number;
}

export function getTokenExpiry(accessToken: string): number | null {
  try {
    const decoded = jwtDecode<AccessTokenPayload>(accessToken);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp - now;
  } catch {
    return null;
  }
}
export function timeConverter(createdAt: Date) {

  const hours =createdAt.getHours().toString().padStart(2, "0");
  const minutes = createdAt.getMinutes().toString().padStart(2, "0");

  const time = `${hours}:${minutes}`;
  return time;
}

export function handleLastMessage(user: UserType | null,message: LastMessage | undefined) {
  if (!message) return  'no messages yet';
   let senderIsUser=message.sender?._id == user?._id;
    if (!message.content && message.files?.length) {
         if (senderIsUser) return 'you sent a file'
         return `${message.sender.username} sent you a file`
    }
    return message.content ;
}
export function handleDay(date: string | undefined): string {
  if (!date) return '';

  const dist = Math.abs(new Date().getTime() - new Date(date).getTime());
  const seconds = dist / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  if (seconds < 60) {
    return 'now';
  } else if (minutes < 60) {
    return `${Math.floor(minutes)} minute${Math.floor(minutes) !== 1 ? 's' : ''} ago`;
  } else if (hours < 24) {
    return `${Math.floor(hours)} hour${Math.floor(hours) !== 1 ? 's' : ''} ago`;
  } else if (days < 5) {
    return `${Math.floor(days)} day${Math.floor(days) !== 1 ? 's' : ''} ago`;
  } else {
      return new Date(date).toLocaleDateString("en-GB");
  }
}