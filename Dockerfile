FROM node:20-alpine
RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm
RUN npx pnpm install
COPY . .
RUN chmod +x /app/scripts/*.sh
EXPOSE 3000
# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Default command (override in docker-compose)
CMD ["sh", "/app/scripts/init.sh"]

# Remove the CMD since entrypoint handles it
# CMD ["npm", "run", "start:dev"]