import { ISource } from "./types";

const supercast: ISource = {
    imageUrl: '/images/u3.svg',
    imageTile: true,
    productName: 'U³',
    domain: 'u3.xyz',
    fulfilmentType: 'promptCopy',
    linkGenerator: () => {
        return new URL('https://u3.xyz');
    },
    preferenceCondition: ({ url }) => /^(.*\.)?u3\.xyz$/.test(url.hostname)
};

export default supercast;