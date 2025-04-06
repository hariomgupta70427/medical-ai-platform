# MediAI Discovery Platform

A next-generation AI platform for pharmaceutical research, drug discovery, and molecular optimization.

## Overview

MediAI Discovery Platform combines modern web technologies with pharmaceutical research APIs to provide tools for:

- Drug modification suggestions
- Molecular visualization
- Property prediction
- Interactive chat interface for research queries

## Setup and Installation

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+ (for RDKit integration)
- Docker (optional, for containerized RDKit service)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/medical-ai-platform.git
cd medical-ai-platform
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the template:
```bash
cp .env.example .env
```

4. Add your API keys to the `.env` file:
```
# PubChem doesn't require an API key
IBM_RXN_API_KEY=your_ibm_rxn_key_here
# Enable RDKit if you're running the Python service
ENABLE_PYTHON_RDKIT=false
```

### Starting the Application

1. Start the Next.js development server:
```bash
npm run dev
```

2. Optional: Start the RDKit Python service (if using)
```bash
# Install Python dependencies
cd app/api/rdkit/python
pip install -r requirements.txt

# Start the Flask server
python app.py
```

3. Alternative: Run the RDKit service in Docker
```bash
cd app/api/rdkit/python
docker build -t rdkit-service .
docker run -p 3001:3001 rdkit-service
```

4. Enable RDKit integration by setting `ENABLE_PYTHON_RDKIT=true` in your `.env` file

## API Keys and Services

### Required API Keys

For full functionality, you'll need to register for the following services:

1. **PubChem** (Free, no API key required)
   - Documentation at: https://pubchemdocs.ncbi.nlm.nih.gov/pug-rest
   - Usage policy: Keep requests under 5 per second to avoid being temporarily blocked

2. **IBM RXN for Chemistry** (Free tier available)
   - Register at: https://rxn.res.ibm.com/
   - Get your API key from your account settings

### Optional Services

1. **SwissADME** (Free web service)
   - No official API, but our platform includes a wrapper

2. **RDKit Python Backend**
   - Set `ENABLE_PYTHON_RDKIT=true` in your `.env` file
   - Requires the Python service to be running

## Features

- **Chat Interface**: Ask questions about drug modifications and improvements
- **Molecule Visualization**: View molecular structures as SVG images
- **Drug Modification Suggestions**: Get AI-powered suggestions for improving drug properties
- **API Integration**: Connect with multiple pharmaceutical research APIs
- **IBM RXN Integration**: Predict reaction products and assess synthetic feasibility

## Development Configuration

Additional configuration options in `.env`:

```
# Debug mode for additional logging
ENABLE_DEBUG_MODE=true

# RDKit Python service URL (if running on a different host/port)
RDKIT_SERVICE_URL=http://localhost:3001

# Base URL override for development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.