FROM node:lts-alpine

# Set the working directory
WORKDIR /app

# Copy project specification and dependencies lock files
COPY package.json yarn.lock ./

# Deploy build
FROM node:lts-alpine
WORKDIR /app

# Copy app sources
COPY --from=build /app /app
COPY . .
RUN npx rimraf ./dist/

# Expose application port
EXPOSE 5000

# In production environment
ENV NODE_ENV production
RUN yarn build

# Run
CMD yarn start