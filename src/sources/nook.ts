import { ISource } from "./types";

const supercast: ISource = {
    imageUrl: '/images/nook.avif',
    productName: 'Nook',
    domain: 'nook.social',
    fulfilmentType: 'promptCopy',
    linkGenerator: () => {
        return new URL('https://nook.social');
    },
    preferenceCondition: ({ url }) => /^(.*\.)?nook\.social$/.test(url.hostname)
};

export default supercast;