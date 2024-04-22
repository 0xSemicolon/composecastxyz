import { ISource } from "./types";

const isFromWarpcast = ({ url }) => /^(.*\.)?warpcast\.com$/.test(url.hostname);

const warpcast: ISource = {
    imageUrl: '/images/warpcast.webp',
    productName: 'WarpCast',
    domain: 'warpcast.com',
    fulfilmentType: 'redirect',
    linkGenerator: (p) => {
        const url = new URL('https://www.warpcast.com/~/compose');
        if (p.text) {
            url.searchParams.append('text', p.text);
        }
        if (p.embeds?.length) {
            p.embeds.forEach(e => {
                url.searchParams.append('embeds[]', e);
            });
        }
        return url;
    },
    preferenceCondition: isFromWarpcast,
    autoredirectCondition: isFromWarpcast
};

export default warpcast;