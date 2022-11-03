require('dotenv').config()
const axios = require('axios')
const ethers = require('ethers')
const BigNumber = require('bignumber')
const abi = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json')
const INFURA_URL = process.env.INFURA_URL
const UNISWAP_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'
const provider = new ethers.providers.JsonRpcProvider(INFURA_URL)
const poolAddress = '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8'
const poolContract = new ethers.Contract(poolAddress, abi.abi, provider)


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
  ` })
  const pools = res.data.data.pools

  console.log(pools)

  const volume = await provider.getBalance("0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8")
  console.log(ethers.utils.formatEther(volume))

}

main()
