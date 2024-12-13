# Use the official Node.js 16 image as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the rest of your application's code to the working directory
COPY . .

# Install dependencies in the container
RUN npm install


# Expose the port that Next.js runs on
EXPOSE 3000

# Command to run the application
RUN npm install -g nodemon
CMD ["nodemon", "-L", "--watch", ".", "npm", "start", "--debug"]