import { STORAGE_KEYS } from "@constants/storage";
import { User } from "@interfaces/shared/user";

class UserSession {
  private storageKey = STORAGE_KEYS.USER_SESSION;

  public storeUserProfile(profile: User | null) {
    localStorage.setItem(this.storageKey, JSON.stringify(profile));
  }

  public getUserProfile(): User | null {
    const storedProfile = localStorage.getItem(this.storageKey);
    return storedProfile ? JSON.parse(storedProfile) : null;
  }

  public isAuthenticated(): boolean {
    return localStorage.getItem(this.storageKey) !== null;
  }

  public clearUserProfile(): void {
    localStorage.removeItem(this.storageKey);
  }
}

const userSession = new UserSession();
export default userSession;
