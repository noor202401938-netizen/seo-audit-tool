# Contributing to SEO Intelligence

Thank you for your interest in contributing to **SEO Intelligence**! We welcome bug reports, feature ideas, documentation improvements, and code pull requests.

---

## Code of Conduct

All contributors and participants are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat everyone with respect and kindness.

---

## Getting Started

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & `npm`
- **Docker & Docker Compose** (optional, recommended for full stack testing)
- **Redis** (optional; backend automatically falls back to synchronous in-memory execution)

### 2. Fork & Clone
```bash
git clone https://github.com/your-username/seo-audit-tool.git
cd seo-audit-tool
```

### 3. Backend Setup
```bash
# Create and activate virtual environment
python -m venv venv
# On Linux/macOS:
source venv/bin/activate
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
playwright install chromium

# Generate Prisma client and migrate SQLite database
prisma generate
prisma db push

# Configure environment
cp .env.example .env
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 5. Running with Docker Compose
If you prefer running everything in containers:
```bash
docker compose up --build
```
Access the application at `http://localhost` (or backend API docs at `http://localhost:8000/docs`).

---

## Development Guidelines

### Adding a New SEO Tool / Utility
1. Add your tool logic in [`tool_runners.py`](tool_runners.py) with structured inputs and outputs.
2. If your tool relies on an external API key, make it optional or fall back to an open heuristic, and document the key in `.env.example`.
3. Add the FastAPI endpoint in [`routers/tools.py`](routers/tools.py).
4. Add the tool UI component or card in `frontend/src/pages/ToolRunner.tsx` and register its metadata in the tool catalog.

### Code Style & Standards
- **Python**: Follow PEP 8 standards. Write clear function docstrings.
- **Frontend**: Use React + TypeScript, Tailwind CSS, and Lucide icons.
- **Tests**: Write unit tests for new extractors or rules under the `tests/` directory.

---

## Testing

Run backend tests:
```bash
python -m unittest discover tests
```

---

## Submitting a Pull Request

1. Create a feature branch:
   ```bash
   git checkout -b feature/my-new-feature
   ```
2. Commit your changes with clear, descriptive messages:
   ```bash
   git commit -m "feat(tools): add canonical tag mismatch auditor"
   ```
3. Push to your fork and submit a Pull Request.
4. Fill out the PR template completely.

---

## Questions or Need Help?
Feel free to open an issue or start a discussion on GitHub. Thank you for making SEO tools accessible and open source for everyone!
