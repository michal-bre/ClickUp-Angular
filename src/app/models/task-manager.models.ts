import e from "express";

// פרטי משתמש שחוזרים מהתחברות או הרשמה
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// מבנה של צוות
export interface Team {
  id: string;
  _id?: string;
  name: string;
  ownerId: string;
  memberCount?: number; // מוחזר ב-GET /api/teams
  members_count?: number; // מוחזר מהשרת בשם זה
  members?: any[];
}

// מבנה של פרויקט
export interface Project {
  id: string;
  name: string;
  teamId?: string;
  team_id?: string | number; // מה שהסרבר מחזיר
}

export interface ProjectToPost {
  name: string;
  teamId: string;
  team_id?: string | number;
}

// מבנה של משימה - כפי שמופיע בלוח המשימות
export interface Task {
  id?: string;
  title: string;
  description: string;
  status: 'Backlog' | 'In Progress' | 'Done'; // הסטטוסים
  priority: 'low' | 'medium' | 'high'; // רמות עדיפות
  projectId: string;
  assignedTo?: string;
}

// מבנה של תגובה למשימה
export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
}