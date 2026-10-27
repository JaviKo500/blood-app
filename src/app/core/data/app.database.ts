import { database } from '@ng-native/expo/database';

export const bloodDatabase = database( 'blood.db',
   [
      {
         to: 1,
         up: ( db ) => db.execAsync(`
            CREATE TABLE blood_type (
               code TEXT PRIMARY KEY,
               created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
            );
            INSERT INTO blood_type (code) VALUES ('A+'),('A-'),('B+'),('B-'),('AB+'),('AB-'),('O+'),('O-');
            CREATE TABLE person (
               id TEXT PRIMARY KEY,
               name TEXT NOT NULL,
               last_name TEXT NOT NULL,
               dni TEXT NOT NULL UNIQUE,
               phone TEXT,
               email TEXT COLLATE NOCASE,
               blood_type_code TEXT NOT NULL REFERENCES blood_type(code),
               created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
               updated_at TEXT
            );
            CREATE INDEX idx_person_blood_type ON person (blood_type_code);
         `),
      }
   ],
   {
      onOpen: ( db ) => db.execAsync( 'PRAGMA foreign_keys = ON;PRAGMA journal_mode = WAL;' ),
   },
);