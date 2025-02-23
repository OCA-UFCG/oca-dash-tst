FROM node:20.18.2

# Get the environment variables
ARG NEXT_PUBLIC_POWERBI_CLIENT_ID 
ARG NEXT_PUBLIC_POWERBI_CLIENT_SECRET
ARG NEXT_PUBLIC_POWERBI_TENANT_ID
ARG NEXT_PUBLIC_POWERBI_WORKSPACE_ID
ARG NEXT_PUBLIC_POWERBI_REPORTS_ID

# Set the environment variables
ENV NEXT_PUBLIC_POWERBI_CLIENT_ID=$NEXT_PUBLIC_POWERBI_CLIENT_ID
ENV NEXT_PUBLIC_POWERBI_CLIENT_SECRET=$NEXT_PUBLIC_POWERBI_CLIENT_SECRET
ENV NEXT_PUBLIC_POWERBI_TENANT_ID=$NEXT_PUBLIC_POWERBI_TENANT_ID
ENV NEXT_PUBLIC_POWERBI_WORKSPACE_ID=$NEXT_PUBLIC_POWERBI_WORKSPACE_ID
ENV NEXT_PUBLIC_POWERBI_REPORTS_ID=$NEXT_PUBLIC_POWERBI_REPORTS_ID

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the application code
COPY . .

# Expose the port Next.js runs on (default: 3000)
EXPOSE 3000

# Build the Next.js projectdock
RUN npm run build

# Start the Next.js project in development mode
CMD ["npm", "start"]