# 🔐 R3SEC

**R3SEC** is a security-first platform for auditing **Solana smart contracts**, designed to help developers, DAOs, and projects securely submit their programs, track audit progress, and download structured security reports.

![R3SEC Banner](./public/og-image.png)

---

## ✨ Features

- 🚀 **Simple Uploads**: Submit your smart contracts via ZIP, GitHub URL, or Program ID  
- 🔍 **Audit Tracking**: Real-time dashboard for audit status (Pending → In Progress → Completed)  
- 📄 **Professional Reports**: Admin-uploaded security reports with severity breakdown  
- 🔔 **Notifications**: Get notified when audits are done  
- 🔐 **Role-Based Access**: Separate dashboards for users and auditors  
- 🧠 **Structured Findings**: CVE-style entries with severity, description, and remediation  
- 📬 **Secure Authentication**: Email/password login and session handling  
- 🌘 **Dark Mode First**: Built with TailwindCSS, optimized for developers  

---

## 🏗 Tech Stack

| Layer        | Stack                        |
|--------------|------------------------------|
| Frontend     | Next.js (App Router), TailwindCSS, Framer Motion |
| Backend      | Go (Gin), PostgreSQL, JWT Auth |
| Database     | MongoDB with UUID, soft deletes, normalized schema |
| Storage      | AWS S3 for ZIPs and reports |
| Auth         | JWT (user/admin split) |
| Deployment   | Vercel |

---

## 📦 Project Structure

```
r3sec/
├── frontend/         # Next.js app
├── backend/          # Go API (Gin + GORM)
├── database/         # Migrations, schema
└── docs/             # Optional docs, diagrams, specs
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/r3sec.git
cd r3sec
```

### 2. Setup the backend

```bash
cd backend
cp .env.example .env
go run main.go
```

### 3. Setup the frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

---

## 🧪 Roadmap

- [x] Core contract upload + status tracking  
- [x] Manual audit reports (admin flow)  
- [x] Structured findings DB  
- [x] Notifications  
- [ ] Automated scan engine (static analysis)  
- [ ] CLI tool for dev upload  
- [ ] Public audit explorer  
- [ ] AI vulnerability suggestions  
- [ ] NFT badges for audited contracts  

---

## 🛡️ Security

This platform is built with **security as a core principle** — all uploads are stored securely, and audit reports are managed exclusively by verified admin users.

Please report vulnerabilities via [security@r3sec.xyz](mailto:security@r3sec.xyz).

---

## ❤️ Credits

Built by [@r0ckyr](https://github.com/r0ckyr) and contributors.  
Special thanks to the Solana, Go, and Next.js communities!

---

## 🌐 Live Demo

> Coming soon at [**https://r3sec.xyz**](https://r3sec.xyz)  
> _Secure your Solana contracts the right way.
