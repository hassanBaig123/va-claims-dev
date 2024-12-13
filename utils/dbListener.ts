import { Pool } from "pg";
import eventBus from "@/utils/eventBus";

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_DB_PASSWORD
) {
  throw new Error("Missing required environment variables.");
}

const constructDatabaseUrl = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;
  
  if (!supabaseUrl || !dbPassword) {
    throw new Error('Missing Supabase URL or database password in environment variables');
  }

  const url = new URL(supabaseUrl);
  return `postgres://postgres:${dbPassword}@${url.hostname}:5432/postgres`;
};

const databaseUrl = process.env.DATABASE_URL || constructDatabaseUrl();

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});

let isListenerSetUp = false;

export async function startDbListener() {
  if (isListenerSetUp) {
    console.log('Database listener is already set up.');
    return;
  }

  console.log('Starting database listener...');
  console.log('Database URL:', databaseUrl.replace(/:[^:@]+@/, ':****@')); // Mask the password

  try {
    console.log('Attempting to connect to the database...');
    const client = await pool.connect();
    console.log('Successfully connected to the database.');

    try {
      console.log('Setting up LISTEN on new_user_channel...');
      await client.query('LISTEN new_user_channel');
      console.log('LISTEN query executed successfully.');

      const processedEvents = new Set();

      client.on('notification', async (msg) => {
        console.log('Received notification:', msg);
        if (msg.channel === 'new_user_channel') {
          const payload = JSON.parse(msg.payload!);
          const eventId = `${payload.user_id}-${payload.email}`;
          
          if (!processedEvents.has(eventId)) {
            processedEvents.add(eventId);
            console.log('Processing newUserProcessed event:', payload);
            eventBus.emit('newUserProcessed', {
              user_id: payload.user_id,
              email: payload.email
            });
            console.log('Event emitted for:', eventId);
            
            // Clear the event from the set after a delay to prevent memory leaks
            setTimeout(() => {
              processedEvents.delete(eventId);
              console.log('Cleared processed event:', eventId);
            }, 300000); // Clear after 5 minutes
          } else {
            console.log('Duplicate event received, ignoring:', eventId);
          }
        }
      });

      console.log('Notification listener set up successfully.');
      isListenerSetUp = true;

      // Keep the connection alive
      const keepAliveInterval = setInterval(async () => {
        try {
          //console.log('Sending keep-alive query...');
          await client.query('SELECT 1');
          //console.log('Keep-alive query successful.');
        } catch (error) {
          console.error('Error in keep-alive query:', error);
        }
      }, 60000); // Every 60 seconds

      // Cleanup function
      const cleanup = () => {
        console.log('Cleaning up database listener...');
        clearInterval(keepAliveInterval);
        client.removeAllListeners('notification');
        client.release();
        isListenerSetUp = false;
        console.log('Database listener cleaned up.');
      };

      // Handle process termination
      process.on('SIGINT', () => {
        console.log('Received SIGINT. Cleaning up...');
        cleanup();
        process.exit(0);
      });

      process.on('SIGTERM', () => {
        console.log('Received SIGTERM. Cleaning up...');
        cleanup();
        process.exit(0);
      });

    } catch (error) {
      console.error('Error setting up LISTEN or notification handler:', error);
      client.release();
    }
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    
    // Implement a retry mechanism
    console.log('Retrying connection in 50 seconds...');
    setTimeout(startDbListener, 50000);
  }
}