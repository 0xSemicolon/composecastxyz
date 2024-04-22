import { ISource } from "./types";

const supercast: ISource = {
    imageUrl: '/images/supercast.png',
    productName: 'Supercast',
    domain: 'supercast.xyz',
    fulfilmentType: 'promptCopy',
    linkGenerator: () => {
        return new URL('https://supercast.xyz');
    },
    preferenceCondition: ({ url }) => /^(.*\.)?supercast\.xyz$/.test(url.hostname)
};

export default supercast;