import Dexie, { type Table } from 'dexie';
import type { StudioProject } from '@/types/studio';
import type { GangSheetResult } from '@/types/production';
import type { ProductItem, CollectionItem } from '@/types/product';
import type { SavedMockup } from '@/types/mockup';

export interface LocalProjectRecord {
  id: string;
  name: string;
  updatedAt: string;
  data: StudioProject;
  thumbnailUrl?: string;
}

export class StartTheBrandDB extends Dexie {
  projects!: Table<LocalProjectRecord, string>;
  gangSheets!: Table<{ id: string; name: string; updatedAt: string; data: GangSheetResult }, string>;
  products!: Table<ProductItem, string>;
  collections!: Table<CollectionItem, string>;
  mockups!: Table<SavedMockup, string>;

  constructor() {
    super('StartTheBrandLocalDB');
    this.version(2).stores({
      projects: 'id, name, updatedAt',
      gangSheets: 'id, name, updatedAt',
      products: 'id, title, status, updatedAt',
      collections: 'id, name, slug, updatedAt',
      mockups: 'id, projectId, title, createdAt',
    });
  }
}

export const localDb = new StartTheBrandDB();
