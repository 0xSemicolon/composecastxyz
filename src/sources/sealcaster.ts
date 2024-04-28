import { ISource } from "./types";

const supercast: ISource = {
    imageUrl: '/images/sealcaster.svg',
    imageTile: true,
    productName: 'Sealcaster (Alpha)',
    domain: 'sealcaster.xyz',
    fulfilmentType: 'promptCopy',
    linkGenerator: () => {
        return new URL('https://sealcaster.xyz');
    },
    preferenceCondition: ({ url }) => /^(.*\.)?sealcaster\.xyz$/.test(url.hostname)
};

export default supercast;