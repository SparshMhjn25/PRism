# PRism – AI-Powered GitHub Code Review App

PRism is a GitHub App that automates Pull Request (PR) code reviews using Large Language Models (LLMs). It analyzes code changes, identifies potential issues, and publishes actionable feedback directly on GitHub Pull Requests.

The long-term goal is to integrate Retrieval-Augmented Generation (RAG) to enable codebase-aware reviews, allowing PRism to understand how changed code interacts with the existing codebase rather than reviewing modifications in isolation.

## 🧠 How PRism Works

The planned workflow combines LLMs with RAG to deliver context-aware code reviews.

1. **Pull Request Analysis:** Retrieve and analyze the changes introduced by a GitHub Pull Request.
2. **Context Retrieval (RAG):** Retrieve relevant code and supporting context from the existing codebase.
3. **AI-Powered Review:** Analyze the PR diff alongside retrieved context to identify potential bugs, security vulnerabilities, performance issues, and architectural concerns.
4. **Actionable Feedback:** Generate findings with explanations, severity levels, and improvement suggestions.
5. **GitHub Integration:** Publish review feedback directly on Pull Requests and maintain review history.

RAG is planned for a future version and is intended to help PRism move beyond reviewing changed lines in isolation.

## 🛠️ Tech Stack

**Current Implementation**
- TypeScript
- Node.js
- Express.js
- PostgreSQL
- React
- GitHub Apps & Webhooks
- LLM API Integration

**Planned**
- Retrieval-Augmented Generation (RAG)
- Codebase indexing and retrieval pipeline
- Context-aware code analysis

## ⚙️ Implemented Features

- Automated PR review workflow triggered by GitHub webhooks.
- LLM-powered analysis of Pull Request changes.
- Structured review findings with severity levels and suggestions.
- PostgreSQL persistence for repositories, Pull Requests, reviews, and findings.
- Webhook signature verification and idempotent event processing.
- GitHub integration for publishing review feedback.
- React dashboard for review history, findings, and repository management.
- Light and dark theme support.

## 🚧 Development Status

PRism is actively under development.

The initial review engine, GitHub webhook integration, database-backed review pipeline, and dashboard are implemented.

Current development focuses on GitHub OAuth authentication, multi-user support, repository installation ownership, and Bring Your Own Key (BYOK) configuration.

RAG-based codebase retrieval is planned for V2.

## 🎯 Project Vision

To build an intelligent GitHub code review assistant that understands not just the code being changed, but also the broader codebase, enabling more accurate, relevant, and context-aware feedback.