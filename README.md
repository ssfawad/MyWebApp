# 🕹️ Multiplayer Tic-Tac-Toe (Dockerized)

A real-time two-player Tic-Tac-Toe game built with Node.js and WebSockets, containerized using Docker, and deployed to Azure Web Apps using GitHub Actions.

---

## 📦 Tech Stack

| Layer          | Tech Used                          |
|----------------|------------------------------------|
| Language       | JavaScript (Node.js)               |
| Web Framework  | Express                            |
| Multiplayer    | WebSockets (`socket.io`)           |
| Containerization | Docker                           |
| CI/CD          | GitHub Actions        |
| Hosting        | Azure App Service (Linux Container)|
| Version Control| Git + GitHub                       |

---

## 🚀 Features

- 🎮 Real-time 2-player gameplay
- 🔁 WebSocket-based move synchronization
- 🧠 Auto win/draw detection
- 📦 Fully Dockerized backend
- 🔄 Continuous deployment via GitHub Actions

---

## 🛠️ Local Development

### 1. Clone the repository

```bash
git clone https://github.com/ssfawad/tic-tac-toe-multiplayer.git
cd tic-tac-toe-multiplayer
```

### 2. Install dependencies and run locally

```bash
npm install
npm start
```
---

## 🐳 Docker Usage

### Build the image

```bash
docker build -t tictactoe-game .
```

### Run the container

```bash
docker run -p 3000:3000 tictactoe-game
```

Then visit: [http://localhost:3000](http://localhost:3000) to test/play locally.

---

## ⚙️ CI/CD Pipeline (GitHub Actions → Docker Hub → Azure)

### GitHub Secrets Setup

| Secret Name              | Description                            |
|--------------------------|----------------------------------------|
| `DOCKER_USERNAME`        | Docker Hub username                    |
| `DOCKER_PASSWORD`        | Docker Hub password or token           |
| `AZURE_CREDENTIALS`      | JSON from `az ad sp create-for-rbac`   |

### Azure Web App Configuration

1. Web App: Linux + Docker container
2. Container Source: Docker Hub
3. Repository: `syedsfawad/docker-web-app:latest`
4. Continuous Deployment: **On**

### Deployment Workflow

Push to `main` branch to trigger:

```bash
git add .
git commit -m "Deploy multiplayer Tic-Tac-Toe game 🎮"
git push origin main
```

CI/CD will:
- ✅ Build Docker image
- ✅ Push to Docker Hub
- ✅ Trigger Azure to pull the new image and restart

---

## 📂 Project Structure

```
.
├── public/             # Static assets (HTML, JS, CSS)
├── server.js           # Main Node.js + Socket.io server
├── Dockerfile          # Container definition
├── .github/workflows/  # GitHub Actions CI/CD
├── package.json
```

---

## 👨‍💻 Author

Built with chai and code by [Syed Fawad]

---
