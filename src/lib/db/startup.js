// GST CDA - Production Startup Verification
// Enforces that production environments fail closed immediately if PostgreSQL is not configured
import { getDatabaseAdapter } from './adapter.js';

export async function verifyProductionDatabaseConfig() {
  if (process.env.NODE_ENV === 'production') {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl || (!dbUrl.startsWith('postgres://') && !dbUrl.startsWith('postgresql://'))) {
      const err = new Error(
        'FATAL STARTUP ERROR: PostgreSQL DATABASE_URL is mandatory in production environment. Refusing to accept traffic.'
      );
      console.error(err.message);
      throw err;
    }
    const adapter = getDatabaseAdapter();
    await adapter.execute('SELECT 1');
  }
}
