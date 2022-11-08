require('dotenv').config()
const axios = require('axios')
const ethers = require('ethers')
const BigNumber = require('bignumber')
const abi = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json')
const erc20abi = require('./erc20abi.json')
const INFURA_URL = process.env.INFURA_URL
const UNISWAP_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'
const provider = new ethers.providers.JsonRpcProvider(INFURA_URL)
const poolAddress = '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8'
const poolContract = new ethers.Contract(poolAddress, abi.abi, provider)
const poolData = []

async function main() {
  const res = await axios.post(UNISWAP_SUBGRAPH_URL, { query: `
  {
    pools(orderBy: volumeUSD, orderDirection: desc, first: 3) {
      id,
      liquidity
      token0 {
        symbol
      }
      token1 {
        symbol
      }
    }
  }
  ` });
  for (const pool of res.data.data.pools) {
    const volume = await provider.getBalance(pool.id);
    const currentPool = new ethers.Contract(pool.id, abi.abi, provider);
    const token0 = await currentPool.token0();
    const token1 = await currentPool.token1();
    poolData.push({
      token0Symbol: pool.token0.symbol,
      token0,
      token1Symbol: pool.token1.symbol,
      token1,
      id: pool.id,
    });
  }
  for (const pool of poolData) {
    console.log(`Pool ${pool.id}`);
    const token0 = new ethers.Contract(pool.token0, erc20abi, provider);
    const decimals0 = await token0.decimals();
    const token0Balance = await token0.balanceOf(pool.id);
    console.log(`Balance for token0 ${pool.token0}: ${ethers.utils.formatUnits(token0Balance, decimals0)} ${pool.token0Symbol}`);

    const token1 = new ethers.Contract(pool.token1, erc20abi, provider);
    const decimals1 = await token1.decimals();
    const token1Balance = await token1.balanceOf(pool.id);
    console.log(`Balance for token1 ${pool.token1}: ${ethers.utils.formatUnits(token1Balance, decimals1)} ${pool.token1Symbol}\n`);
  }
}

main()
