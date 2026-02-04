FROM mcr.microsoft.com/playwright:v1.50.0-jammy

# Don't run as root
USER pwuser

WORKDIR /app

# Copy package files first (better layer caching)
COPY --chown=pwuser:pwuser package*.json ./
RUN npm ci --ignore-scripts

# Copy source
COPY --chown=pwuser:pwuser . .

# Default command
CMD ["npx", "playwright", "test"]
