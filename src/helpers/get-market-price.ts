import { ethers } from "ethers";
import { LPContract } from "../abi";
import { getAddresses, TOKEN_DECIMALS } from "../constants";
import { Networks } from "../constants/blockchain";
import { getTokenPrice } from "./token-price";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    const addresses = getAddresses(networkID);
    const pairContract = new ethers.Contract(addresses.PAIR_ADDRESS, LPContract, provider);
    const reserves = await pairContract.getReserves();
    const marketPrice = (reserves[1] / 10**18) * getTokenPrice("ETH") / (reserves[0] / 10**TOKEN_DECIMALS);
    return marketPrice;
}
