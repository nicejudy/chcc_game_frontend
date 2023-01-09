import axios from "axios";

const cache: { [key: string]: number } = {};

export const loadEthPrice = async () => {
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
    const { data } = await axios.get(url);

    cache["ETH"] = data["ethereum"].usd;
};

export const getTokenPrice = (symbol: string): number => {
    return Number(cache[symbol]);
};
