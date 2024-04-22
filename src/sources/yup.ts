import { ISource } from "./types";

const yup: ISource = {
    imageUrl: '/images/yup.png',
    productName: 'Yup',
    domain: 'yup.io',
    fulfilmentType: 'promptCopy',
    linkGenerator: () => {
        return new URL('app.yup.io');
    },
    preferenceCondition: ({ url }) => /^(.*\.)?yup\.io$/.test(url.hostname)
};

export default yup;