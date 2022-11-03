# Uniswap V3 Pool Data Aggregates

Starting conditions:
```bash
python -m venv env
npm install
pip install -r requirements.txt
node index.js # Stores pool data into a file using ethers.js
python main.py # Takes data and graphs in python plot
```