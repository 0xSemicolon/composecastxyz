import { ISource } from "./types";

const supercast: ISource = {
    imageUrl: '/images/nook.avif',
    productName: 'Nook',
    domain: 'nook.social',
    fulfilmentType: 'redirect',
    linkGenerator: (p) => {
        const url = new URL('https://nook.social/~/compose');
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
    preferenceCondition: ({ url }) => /^(.*\.)?nook\.social$/.test(url.hostname)
};

export default supercast;