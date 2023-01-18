import { v4 as uuid } from 'uuid';

import { User } from 'resources/user/user.types';

const COLLECTION_CONSTANTS = {
  USERS: 'users'
} as const;

type DataBaseSchema = {
  users: User[];
};

const localDB: DataBaseSchema = {
  users: []
};

class CollectionService {
  private collectionName: keyof DataBaseSchema;

  constructor(collectionName: keyof DataBaseSchema) {
    this.collectionName = collectionName;
  }

  public get = (): any[] => {
    return localDB[this.collectionName];
  };

  public getById = (id: string): any => {
    return localDB[this.collectionName].find((item) => item.id === id);
  };

  public create = (item: any): any => {
    item.id = uuid();

    localDB[this.collectionName].push(item);

    return item;
  };

  public update = (id: string, item: any): any => {
    const index = localDB[this.collectionName].findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    localDB[this.collectionName][index] = item;

    return item;
  };

  public remove = (id: string): boolean => {
    const index = localDB[this.collectionName].findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    localDB[this.collectionName].splice(index, 1);

    return true;
  };
}

const createService = (currentCollection: string) => new CollectionService(currentCollection as keyof DataBaseSchema);

export { localDB, createService, COLLECTION_CONSTANTS };
