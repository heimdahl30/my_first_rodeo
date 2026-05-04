/// <reference types="node" />
import { before, after, beforeEach } from 'node:test';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

const setupDB = () => {
  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  beforeEach(async () => {
    const { collections } = mongoose.connection;
    await Promise.all(
      Object.keys(collections).map((key) => {
        return collections[key].deleteMany({});
      })
    );
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
};

export default setupDB;
