import { ISource } from "./types";

const supercast: ISource = {
    imageUrl: '/images/herocast.png',
    productName: 'Herocast',
    domain: 'herocast.xyz',
    fulfilmentType: 'promptCopy',
    linkGenerator: () => {
        return new URL('https://app.herocast.xyz/post');
    },
    preferenceCondition: ({ url }) => /^(.*\.)?herocast\.xyz$/.test(url.hostname)
};

export default supercast;