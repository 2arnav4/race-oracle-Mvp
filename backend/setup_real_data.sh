#!/bin/bash

echo "🏎️  Setting up REAL F1 data from FastF1..."
echo ""

# Install dependencies
echo "📦 Installing FastF1..."
pip install fastf1 pandas

echo ""
echo "📡 Fetching real track data from FastF1 API..."
cd src
python fetch_real_data.py

echo ""
echo "✅ Setup complete!"
echo ""
echo "Now restart the backend:"
echo "  cd backend/src"
echo "  python main.py"
echo ""
echo "The simulation will use REAL F1 track coordinates! 🏁"
