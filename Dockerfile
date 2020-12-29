FROM node:alpine
ENV PORT 80
# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /app
# Installing dependencies
COPY package.json .
RUN npm install
# Copying source files
COPY . .
# Building app
RUN npm run build
# Running the app
EXPOSE 80
CMD [ "npm", "start" ]