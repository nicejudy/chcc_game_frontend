import { SvgIcon, Link } from "@material-ui/core";
import { DISCORD_URL, TWITTER_URL, OPENSEA_HORNET_URL, INSTAGRAM_URL, DEXSCREENER_URL } from "src/constants";
import { ReactComponent as GitHub } from "../../../assets/icons/stake.svg";
import { ReactComponent as Twitter } from "../../../assets/icons/twitter.svg";
import { ReactComponent as Telegram } from "../../../assets/icons/telegram.svg";
import { ReactComponent as Discord } from "../../../assets/icons/discord.svg";
import { ReactComponent as Instagram } from "../../../assets/icons/instagram.svg";
import { ReactComponent as CoinGecko } from "../../../assets/icons/coingecko.svg";
import { ReactComponent as CoinMarketCap } from "../../../assets/icons/coinmarketcap.svg";
import { ReactComponent as OpenSea } from "../../../assets/icons/opensea.svg";
import { ReactComponent as Chart } from "../../../assets/icons/chart.svg";
import KYCIcon from "../../../assets/icons/apekyc.png";

export default function Social() {
    return (
        <>
            <div className="social-row-1">
                <Link href={OPENSEA_HORNET_URL} target="_blank">
                    <SvgIcon color="primary" component={OpenSea} />
                </Link>

                <Link href={DEXSCREENER_URL} target="_blank">
                    <SvgIcon color="primary" component={Chart} />
                </Link>
            </div>
            <div className="social-row-2">
                <Link href={TWITTER_URL} target="_blank">
                    <SvgIcon color="primary" component={Twitter} />
                </Link>

                <Link href={INSTAGRAM_URL} target="_blank">
                    <SvgIcon viewBox="0 0 32 32" color="primary" component={Instagram} />
                </Link>

                <Link href={DISCORD_URL} target="_blank">
                    <SvgIcon color="primary" component={Discord} />
                </Link>
            </div>
        </>
    );
}
