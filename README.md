# 🖥️ ApexSys - Unified System Management Desktop App

ApexSys is a powerful, real-time, all-in-one Windows desktop application built with **Electron** that unifies system performance monitoring, security analysis, and optimization into a modern, user-friendly interface. Designed for both technical and non-technical users, ApexSys streamlines system management, automates routine tasks, and offers intelligent insights using AI/ML.

---

## 🚀 Features

* ⚡ Unified real-time system dashboard (CPU, RAM, FPS, Disk, Network)
* 📊 Interactive graphs, charts, and live-feed floating window
* 🧠 AI/ML-powered performance tips and usage pattern analysis
* 🔐 Threat detection and app behavior analysis for privacy risks
* 🧽 Orphaned file & registry cleanup after uninstallations
* 🔄 Secure software update checker with digital signature verification
* 🌐 Network activity & unauthorized access detection
* 📅 Task and process scheduling module
* 🏅 Gamification: badges, achievements, and performance ranks
* 🔍 Easy app classification: system vs third-party
* 🗣️ Accessibility support: high-contrast mode, voice commands
* 📌 Customizable dashboards for user preferences
* 📘 Analyzes 3rd-party app T\&Cs for potential misconduct
* 🪛 One-click optimization and smart cleanup

---

## 🧠 Purpose

Managing Windows systems often involves juggling multiple, disconnected tools for monitoring, security, cleanup, and updates. ApexSys consolidates all those utilities into a **single cohesive interface** to:

* Modernize and simplify the Windows system management experience
* Empower users to monitor, analyze, and control their system in real time
* Improve security by identifying threats and unethical app behavior
* Automate and streamline routine tasks for higher productivity
* Offer AI/ML-backed insights for better system health

---

## 🛠️ Tech Stack

* **Electron** (v35) – Desktop shell
* **React** (v19) + **Vite** – UI framework & bundler
* **Recharts** – Data visualization
* **systeminformation**, **os-utils**, **diskusage** – Node.js resource APIs
* **TypeScript** – Static typing

---

## 📁 Project Structure

```plaintext
apexsys/
│
├── public/                    # Static assets
│   └── index.html             # HTML shell
│
├── src/                       # Main source code
│   ├── main/                  # Electron main process
│   │   └── main.ts            # App startup logic, window creation
│   ├── renderer/              # React frontend (renderer process)
│   │   ├── App.tsx            # Main UI component
│   │   ├── components/        # Reusable React components
│   │   ├── modules/           # Feature modules (e.g., CPU, RAM, Process Manager)
│   │   ├── assets/            # Icons, images, CSS
│   │   └── styles/            # Global & module-specific styling
│   └── preload.ts             # Electron preload scripts
│
├── apx_schemas/               # Custom .apx file definitions
│   └── config.apx             # User config and saved preferences
│
├── .gitignore                 # Git ignore file
├── package.json               # Project metadata and dependencies
├── tsconfig.json              # TypeScript config
└── README.md                  # You are here
```

---

## 🛠️ Built With

* [Electron](https://www.electronjs.org/) – Cross-platform desktop app framework
* [React](https://reactjs.org/) – Frontend UI
* [Vite](https://vitejs.dev/) – Fast build tool and dev server
* [TypeScript](https://www.typescriptlang.org/) – Type-safe JavaScript
* [Recharts](https://recharts.org/) – Dynamic charts & visualizations

---

## 🧪 In Progress

✅ Current Progress: **\~40% complete**
🚧 Modules in active development:

* Security analysis (threat detection, app behavior)
* App terms & conditions scanner
* Gamified system performance badges
* AI/ML-based activity log analyzer

---

## 📜 License & Confidentiality

> © 2025 Dipanshu R. Shamkuwar. All rights reserved.
> Confidential – For evaluation purposes only.
> This repository is private/in-progress. No reuse, distribution, or commercial use without explicit permission.

---

