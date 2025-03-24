#!/bin/sh

set -e

echo "🚀 Starting initialization script..."

# Wait for database to be ready
echo "⏳ Waiting for MySQL to be ready..."
# Try to connect to MySQL with a timeout
MAX_TRIES=30
TRIES=0
# Improved connection test with ping
echo "📡 Testing network connection to MySQL..."
ping -c 2 ${DB_HOST} || echo "⚠️ Warning: Cannot ping MySQL host. This might be normal in some Docker configurations."

# Run knex migrations
echo "🔄 Running database migrations..."
npx knex migrate:latest
if [ $? -ne 0 ]; then
    echo "❌ Migration failed!"
    exit 1
fi
echo "✅ Migrations completed successfully!"

# Check if database has already been seeded by checking for specific records
if [ "$NODE_ENV" = "development" ]; then
    echo "🔍 Checking if database has already been seeded..."
    
    # Check for existence of roles (or another table that would be populated by seeds)
    SEED_CHECK=$(mysql -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} -D ${DB_NAME} -N -e "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "0")
    
    if [ "$SEED_CHECK" = "0" ] || [ "$FORCE_SEED" = "true" ]; then
        echo "🌱 Seeding database..."
        npx knex seed:run
        if [ $? -ne 0 ]; then
            echo "⚠️ Seeding failed! Continuing anyway..."
        else
            echo "✅ Database seeded successfully!"
            
            # Create a marker file to indicate successful seeding
            touch /app/.seed_complete
        fi
    else
        echo "✅ Database already seeded (found ${SEED_CHECK} roles) - skipping seed"
    fi
fi

# Start the application
echo "🚀 Starting application in ${NODE_ENV} mode..."
npm run start:dev