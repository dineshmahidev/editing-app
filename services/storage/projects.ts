import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import type { Project, ProjectSummary, SavedProject } from '@/types/project';
import { STORAGE_KEYS, DB_NAME } from '@/config/constants';

/**
 * Project persistence: large files stay on disk (file URIs in project data),
 * only JSON metadata + a lightweight DB index are stored locally.
 */

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME).then(async (db) => {
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          createdAt INTEGER NOT NULL,
          updatedAt INTEGER NOT NULL,
          thumbnailUri TEXT
        );
      `);
      return db;
    });
  }
  return dbPromise;
}

async function indexProject(db: SQLite.SQLiteDatabase, project: Project): Promise<void> {
  await db.runAsync(
    `INSERT OR REPLACE INTO projects (id, name, createdAt, updatedAt, thumbnailUri)
     VALUES (?, ?, ?, ?, ?)`,
    project.id,
    project.name,
    project.createdAt,
    project.updatedAt,
    project.thumbnailUri ?? null,
  );
}

async function persistData(project: Project): Promise<void> {
  const key = `${STORAGE_KEYS.projectsIndex}:${project.id}`;
  const record: SavedProject = {
    id: project.id,
    name: project.name,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    thumbnailUri: project.thumbnailUri ?? null,
    data: project,
  };
  await AsyncStorage.setItem(key, JSON.stringify(record));
}

export async function saveProject(project: Project): Promise<void> {
  const db = await getDb();
  await indexProject(db, project);
  await persistData(project);
}

export async function loadProject(id: string): Promise<Project | null> {
  const raw = await AsyncStorage.getItem(`${STORAGE_KEYS.projectsIndex}:${id}`);
  if (!raw) return null;
  try {
    const record = JSON.parse(raw) as SavedProject;
    return record.data;
  } catch {
    return null;
  }
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM projects WHERE id = ?', id);
  await AsyncStorage.removeItem(`${STORAGE_KEYS.projectsIndex}:${id}`);
}

export async function listProjectSummaries(): Promise<ProjectSummary[]> {
  const db = await getDb();
  const rows = (await db.getAllAsync<{
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    thumbnailUri: string | null;
  }>('SELECT * FROM projects ORDER BY updatedAt DESC')) as {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    thumbnailUri: string | null;
  }[];

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    thumbnailUri: row.thumbnailUri ?? undefined,
    canvas: { aspectRatio: '9:16', backgroundColor: '#000000', fit: 'crop', width: 1080, height: 1920 },
  }));
}

export async function updateProjectTimestamp(id: string, updatedAt: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE projects SET updatedAt = ? WHERE id = ?', updatedAt, id);
}

export async function clearAllProjects(): Promise<void> {
  const db = await getDb();
  await db.execAsync('DELETE FROM projects');
  const keys = await AsyncStorage.getAllKeys();
  const projectKeys = keys.filter((k) => k.startsWith(`${STORAGE_KEYS.projectsIndex}:`));
  if (projectKeys.length > 0) await AsyncStorage.multiRemove(projectKeys);
}