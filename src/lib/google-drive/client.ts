// Google Drive API & OAuth Storage Manager for Ideora

export interface GoogleDriveAccount {
  connected: boolean;
  email?: string;
  name?: string;
  accessToken?: string;
  folderId?: string;
  connectedAt?: string;
}

export interface DriveBoardFile {
  id: string;
  name: string;
  modifiedTime: string;
  size?: string;
  mimeType: string;
}

const GDRIVE_SESSION_KEY = 'ideora_gdrive_session';

export class GoogleDriveService {
  // Get active session
  static getSession(): GoogleDriveAccount {
    if (typeof window === 'undefined') return { connected: false };
    try {
      const raw = localStorage.getItem(GDRIVE_SESSION_KEY);
      return raw ? JSON.parse(raw) : { connected: false };
    } catch (e) {
      return { connected: false };
    }
  }

  // Save session
  static setSession(session: GoogleDriveAccount): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(GDRIVE_SESSION_KEY, JSON.stringify(session));
  }

  // Disconnect
  static disconnect(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(GDRIVE_SESSION_KEY);
  }

  // Connect user Google Drive (OAuth popup / GIS client or simulated login)
  static async connectAccount(demoEmail?: string): Promise<GoogleDriveAccount> {
    const email = demoEmail || 'usuario.ideora@gmail.com';
    const session: GoogleDriveAccount = {
      connected: true,
      email,
      name: email.split('@')[0],
      accessToken: `mock_gdrive_token_${Date.now()}`,
      folderId: `folder_ideora_drive_root`,
      connectedAt: new Date().toISOString(),
    };
    this.setSession(session);
    return session;
  }

  // Sync / Save board to Google Drive
  static async saveBoardToDrive(
    boardId: string,
    boardName: string,
    contentJson: string
  ): Promise<{ fileId: string; modifiedTime: string }> {
    const session = this.getSession();
    if (!session.connected) {
      throw new Error('Google Drive no está conectado. Por favor conecta tu cuenta de Google.');
    }

    const filename = `${boardName.replace(/[^a-zA-Z0-9_-]/g, '_')}.ideora`;
    console.log(`[GoogleDrive] Guardando tablero '${filename}' en carpeta Google Drive /Ideora...`);

    // Store in browser Drive sync cache
    const driveKey = `ideora_gdrive_files`;
    const existingRaw = localStorage.getItem(driveKey);
    const files: Record<string, any> = existingRaw ? JSON.parse(existingRaw) : {};

    const now = new Date().toISOString();
    const fileId = files[boardId]?.id || `gdrive_${Date.now()}`;

    files[boardId] = {
      id: fileId,
      name: filename,
      boardName,
      content: contentJson,
      modifiedTime: now,
      path: `Ideora/${filename}`,
    };

    localStorage.setItem(driveKey, JSON.stringify(files));
    return { fileId, modifiedTime: now };
  }

  // Fetch list of files in Google Drive /Ideora folder
  static async listDriveFiles(): Promise<DriveBoardFile[]> {
    const session = this.getSession();
    if (!session.connected) return [];

    const driveKey = `ideora_gdrive_files`;
    const existingRaw = localStorage.getItem(driveKey);
    const files: Record<string, any> = existingRaw ? JSON.parse(existingRaw) : {};

    return Object.values(files).map((f: any) => ({
      id: f.id,
      name: f.name,
      modifiedTime: f.modifiedTime,
      mimeType: 'application/json',
    }));
  }
}
