// Next.js Server Startup Instrumentation Hook
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { verifyProductionDatabaseConfig } = await import('./lib/db/startup.js');
    await verifyProductionDatabaseConfig();
  }
}
