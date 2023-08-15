import { Timestamp } from "firebase/firestore";

export type PostMessage = {
    avatar?: string;
    username?: string;
    timestamp?: Timestamp;
    user?: string;
    description: string;
    id?: string;
    comments?: Comment[]
}

export type Comment = {
    id?: string;
    comment: string;
    avatar: string;
    username: string;
    timestamp: Timestamp;
}