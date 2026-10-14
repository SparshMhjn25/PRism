## 🧠 How PRism Will Work

PRism aims to combine Large Language Models (LLMs) with Retrieval-Augmented Generation (RAG) to provide context-aware code reviews.

The planned workflow is:

1. Pull Request Analysis: Retrieve the changes introduced by a GitHub Pull Request.
2. Context Retrieval (RAG): Retrieve relevant code and supporting context from the codebase to help the reviewer understand how the changed code relates to the rest of the project.
3. AI-Powered Review:Use the retrieved context alongside the Pull Request diff to identify potential bugs, security vulnerabilities, performance issues, and architectural concerns.
4. Actionable Feedback: Present findings with explanations, severity levels, and suggestions for improvement.
5. GitHub Integration: Publish review feedback directly on the Pull Request and maintain a history of previous reviews.

RAG is intended to help PRism go beyond reviewing changed lines in isolation by grounding its analysis in relevant parts of the existing codebase.

## 🛠️ Tech Stack

Current development
- TypeScript
- Node.js
- Express.js
- PostgreSQL

Planned
- GitHub API and webhooks
- LLM integration
- Retrieval-Augmented Generation (RAG)
- Code retrieval and indexing pipeline

## 🚧 Development Status

PRism is under active development. The backend foundation and initial database-backed repository endpoints are implemented. GitHub integration, LLM-powered reviews, and the RAG pipeline are planned for subsequent development stages.
