import { ISource } from "./types";

const s33bits: ISource = {
    imageUrl: '/images/33bits.avif',
    productName: '33bits',
    domain: '33bits.xyz',
    fulfilmentType: 'promptCopy',
    linkGenerator: () => {
        return new URL('https://33bits.xyz');
    },
    preferenceCondition: ({ url }) => /^(.*\.)?33bits\.xyz$/.test(url.hostname)
};

export default s33bits;