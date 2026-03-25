# Stage 1: Build the React application
FROM node:22-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build args for OSS config (to be passed via --build-arg in CI/CD)
ARG REACT_APP_OSS_REGION
ARG REACT_APP_OSS_ACCESS_KEY_ID
ARG REACT_APP_OSS_ACCESS_KEY_SECRET
ARG REACT_APP_OSS_BUCKET

# Set environment variables so they are available during build
ENV REACT_APP_OSS_REGION=$REACT_APP_OSS_REGION \
    REACT_APP_OSS_ACCESS_KEY_ID=$REACT_APP_OSS_ACCESS_KEY_ID \
    REACT_APP_OSS_ACCESS_KEY_SECRET=$REACT_APP_OSS_ACCESS_KEY_SECRET \
    REACT_APP_OSS_BUCKET=$REACT_APP_OSS_BUCKET

# Build the application
# Use .env.docker for Docker build (sets PUBLIC_URL=/)
# GENERATE_SOURCEMAP=false prevents generating source maps to reduce image size
RUN cp .env.docker .env.production && GENERATE_SOURCEMAP=false npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output from the previous stage to Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
