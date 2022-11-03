import json
import os
import requests
from dotenv import load_dotenv
from web3 import Web3

load_dotenv()
UNISWAP_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'
provider = Web3(Web3.HTTPProvider(os.getenv('INFURA_URL')))
with open('abi.txt', 'r') as f:
    abi = f.read()
abi = json.loads(abi)
pools_query = '{ pools(orderBy: volumeUSD, orderDirection: desc, first: 3) { id } }'
res = requests.post(UNISWAP_SUBGRAPH_URL, json={"query": pools_query}).json()
pools = []
for pool in res['data']['pools']:
    pools.append(Web3.toChecksumAddress(pool['id']))
print(pools)
addr1 = provider.eth.contract(address=pools[0], abi=abi)
print(addr1.events.PairCreated)

