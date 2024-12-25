import type { WorkPackage } from '../types/workPackage';
import type { DraftWorkPackage } from '../types/draft';

const DB_NAME = 'WRICEFEstimator';
const STORE_NAME = 'drafts';
const DB_VERSION = 1;

export class DraftStorage {
  private db: IDBDatabase | null = null;

  private async getConnection(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  private closeConnection(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  async saveDraft(workPackage: WorkPackage): Promise<void> {
    const db = await this.getConnection();

    const draft: DraftWorkPackage = {
      id: workPackage.id,
      timestamp: Date.now(),
      data: JSON.stringify(workPackage)
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(draft);

      request.onerror = () => {
        this.closeConnection();
        reject(request.error);
      };

      transaction.oncomplete = () => {
        this.closeConnection();
        resolve();
      };
    });
  }

  async getDraft(id: string): Promise<WorkPackage | null> {
    const db = await this.getConnection();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onerror = () => {
        this.closeConnection();
        reject(request.error);
      };

      request.onsuccess = () => {
        const draft = request.result as DraftWorkPackage | undefined;
        this.closeConnection();
        resolve(draft ? JSON.parse(draft.data) : null);
      };
    });
  }

  async getAllDrafts(): Promise<DraftWorkPackage[]> {
    const db = await this.getConnection();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onerror = () => {
        this.closeConnection();
        reject(request.error);
      };

      request.onsuccess = () => {
        this.closeConnection();
        resolve(request.result);
      };
    });
  }

  async deleteDraft(id: string): Promise<void> {
    const db = await this.getConnection();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onerror = () => {
        this.closeConnection();
        reject(request.error);
      };

      transaction.oncomplete = () => {
        this.closeConnection();
        resolve();
      };
    });
  }

  async clearAllDrafts(): Promise<void> {
    const db = await this.getConnection();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onerror = () => {
        this.closeConnection();
        reject(request.error);
      };

      transaction.oncomplete = () => {
        this.closeConnection();
        resolve();
      };
    });
  }
}