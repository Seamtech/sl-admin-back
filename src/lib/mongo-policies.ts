import { getMongoDb } from './mongoose';

export async function ensureMongoPolicies() {
  const db = getMongoDb();
  const collections = await db.listCollections({}, { nameOnly: true }).toArray();
  const existing = collections.map((c) => c.name);

  /** USERS **/
  if (!existing.includes('users')) {
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['email', 'password', 'role', 'userType'],
          properties: {
            email: { bsonType: 'string' },
            password: { bsonType: 'string' },
            role: { enum: ['admin', 'viewer', 'user', 'developer'], bsonType: 'string' },
            userType: { enum: ['internal', 'external'], bsonType: 'string' },
            companyId: { bsonType: ['objectId', 'null'] },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    });
    console.log('[Mongo Policy] Created `users` collection with validator.');
  }

  const users = db.collection('users');
  await users.createIndex({ email: 1 }, { unique: true });
  await users.createIndex({ companyId: 1 });
  await users.createIndex({ role: 1 });
  await users.createIndex({ userType: 1 });

  /** COMPANIES **/
  if (!existing.includes('companies')) {
    await db.createCollection('companies', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'isInternal'],
          properties: {
            name: { bsonType: 'string' },
            status: {
              enum: ['active', 'inactive', 'trial', 'paused', 'contracted', 'suspended', 'archived'],
              bsonType: 'string',
            },
            isInternal: { bsonType: 'bool' },
            onboardingComplete: { bsonType: 'bool' },
            billingEnabled: { bsonType: 'bool' },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    });
    console.log('[Mongo Policy] Created `companies` collection with validator.');
  }

  const companies = db.collection('companies');
  await companies.createIndex({ name: 1 });
  await companies.createIndex({ status: 1 });
  await companies.createIndex({ isInternal: 1 });
  await companies.createIndex({ 'primaryAddress.city': 1 });

  /** LOG COLLECTIONS **/
  // Relaxed log schema: we require common fields but make the nested req object optional.
  const logCollections = ['request_logs', 'response_logs', 'error_logs'];
  for (const logCol of logCollections) {
    if (!existing.includes(logCol)) {
      await db.createCollection(logCol, {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['level', 'time', 'pid', 'hostname', 'reqId', 'msg'],
            properties: {
              level: { bsonType: ['int', 'long'] },
              time: { bsonType: ['date', 'long', 'int'] },
              pid: { bsonType: ['int', 'long'] },
              hostname: { bsonType: 'string' },
              reqId: { bsonType: 'string' },
              msg: { bsonType: 'string' },
              // Make "req" optional; if provided, its fields should be as follows:
              req: {
                bsonType: 'object',
                properties: {
                  method: { bsonType: 'string' },
                  url: { bsonType: 'string' },
                  host: { bsonType: 'string' },
                  remoteAddress: { bsonType: 'string' },
                  remotePort: { bsonType: ['int', 'long'] },
                },
              },
            },
          },
        },
      });
      console.log(`[Mongo Policy] Created \`${logCol}\` collection with validator.`);
    }

    // Create indexes for the log collections:
    const collection = db.collection(logCol);
    await collection.createIndex({ time: -1 });
    await collection.createIndex({ 'req.method': 1 });
    await collection.createIndex({ 'req.url': 1 });
    await collection.createIndex({ reqId: 1 });
  }

  console.log('[Mongo Policy] Indexes ensured for users, companies, and logs.');
}
