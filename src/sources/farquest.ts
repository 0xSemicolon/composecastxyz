import { ISource } from "./types";

const supercast: ISource = {
    imageUrl: '/images/farquest.svg',
    productName: 'far.quest Pro',
    domain: 'far.quest',
    fulfilmentType: 'promptCopy',
    linkGenerator: () => {
        return new URL('https://far.quest/cast');
    },
    preferenceCondition: ({ url }) => /^(.*\.)?far\.quest$/.test(url.hostname)
};

export default supercast;