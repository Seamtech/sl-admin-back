import split2 from 'split2';
import { Writable } from 'stream';
import { initMongoConnection, getMongoDb } from '../lib/mongoose';
import { Db } from 'mongodb';

let isMongoReady = false;
let db: Db;

/**
 * Transforms the raw log document to a simplified document.
 * It converts numeric timestamps to Date objects.
 * It leaves the natural Fastify log structure intact.
 */
function transformLog(log: any): any {
  return {
    level: log.level,
    time: typeof log.time === 'number' ? new Date(log.time) : log.time,
    pid: log.pid,
    hostname: log.hostname,
    reqId: log.reqId,
    msg: log.msg,
    // Keep the existing "req" property if present (it might be undefined)
    req: log.req,
  };
}

/**
 * Determines the collection name based on the log message prefix.
 * We rely solely on the msg field; if it doesn’t match, we skip logging.
 */
function getCollectionNameFromMsg(log: any): string | null {
  const msg: string = (log.msg || '').toLowerCase();
  if (msg.startsWith('incoming request') || msg.startsWith('request:')) {
    return 'request_logs';
  } else if (msg.startsWith('request completed') || msg.startsWith('response:')) {
    return 'response_logs';
  } else if (msg.startsWith('error:')) {
    return 'error_logs';
  }
  console.debug('[Log Transport] Skipping log due to unmatched msg prefix:', msg);
  return null;
}

function pinoMongoTransport() {
  return split2().pipe(
    new Writable({
      objectMode: true,
      async write(chunk: string, _enc, cb) {
        try {
          // Split chunk into separate JSON log lines.
          const lines = chunk
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);

          for (const line of lines) {
            try {
              let log = JSON.parse(line);
              console.log('DEBUG log.req:', log.req); // For debugging

              // Determine collection based solely on msg.
              const collectionName = getCollectionNameFromMsg(log);
              console.log('DEBUG collection name:', collectionName);

              // Skip logs with unrecognized message prefixes.
              if (!collectionName) {
                continue;
              }

              // Transform the log document.
              log = transformLog(log);

              if (!isMongoReady) {
                await initMongoConnection();
                db = getMongoDb();
                isMongoReady = true;
              }

              const targetCollection = db.collection(collectionName);
              await targetCollection.insertOne(log);
            } catch (err) {
              console.error('[Log Transport] Failed to parse log:', line, err);
            }
          }
        } catch (err) {
          console.error('[Log Transport] Unexpected error in log write:', err);
        }
        cb();
      },
    })
  );
}

export = pinoMongoTransport;
