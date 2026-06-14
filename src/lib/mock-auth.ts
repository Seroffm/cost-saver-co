import { createContext, useContext, useEffect, useState, type ReactNode, createElement } from "react";
import type { Role } from "./mock-leads";

interface MockUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: Role;
}

const USERS: MockUser[] = [
  { id: "u1", name: "Sarah Becker", initials: "SB", email: "sarah.becker@energieclever.de", role: "admin" },
  { id: "u2", name: "Daniel Kraus", initials: "DK", email: "daniel.kraus@energieclever.de", role: "manager" },
  { id: "u3", name: "Mira Aydin", initials: "MA", email: "mira.aydin@energieclever.de", role: "mitarbeiter" },
];

interface Ctx {
  user: MockUser;
  users: MockUser[];
  switchUser: (id: string) => void;
  hasRole: (...r: Role[]) => boolean;
}

const AuthCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "mock_user_id";

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string>(USERS[0].id);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved && USERS.find((u) => u.id === saved)) setUserId(saved);
  }, []);

  const user = USERS.find((u) => u.id === userId) ?? USERS[0];
  const switchUser = (id: string) => {
    setUserId(id);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, id);
  };
  const hasRole = (...r: Role[]) => r.includes(user.role);

  return createElement(AuthCtx.Provider, { value: { user, users: USERS, switchUser, hasRole } }, children);
}

export function useMockAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useMockAuth must be used inside MockAuthProvider");
  return ctx;
}

export const roleBadgeLabel: Record<Role, string> = {
  admin: "Admin",
  manager: "Manager",
  mitarbeiter: "Mitarbeiter",
};
