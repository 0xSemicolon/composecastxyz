import warpcast from "./warpcast";
import supercast from './supercast';
import yup from './yup';
import farquest from './farquest';
import herocast from './herocast';
export type { ISource, IPromptCopySource, IRedirectSource, ISourceDetails } from './types';

const ALL_SOURCES = [
    warpcast,
    supercast,
    yup,
    farquest,
    herocast
];

export const orderedSources = (p: { referrer?: URL | string | null | undefined, preferences?: string[] | null | undefined }) => {
    let { referrer, preferences } = p;
    if (!referrer) {
        return ALL_SOURCES.sort(() => 0.5 - Math.random());
    }
    if (typeof referrer === 'string') {
        referrer = new URL(referrer);
    }
    return ALL_SOURCES
        .map(a => ({
            ...a,
            isPreferred: a.preferenceCondition && a.preferenceCondition({ url: referrer })
        }))
        .sort((a, b) => {
            if (a.isPreferred === b.isPreferred) return 0.5 - Math.random();
            else if (a.isPreferred) return -1;
            else return 1;
        });
};