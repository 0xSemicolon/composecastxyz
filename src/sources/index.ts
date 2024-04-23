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

export const randomSources = (url: URL | string | null | undefined) => {
    if (!url) {
        return ALL_SOURCES.sort(() => 0.5 - Math.random());
    }
    if (typeof url === 'string') {
        url = new URL(url);
    }
    return ALL_SOURCES
        .map(a => ({
            ...a,
            isPreferred: a.preferenceCondition && a.preferenceCondition({ url })
        }))
        .sort((a, b) => {
            if (a.isPreferred === b.isPreferred) return 0.5 - Math.random();
            else if (a.isPreferred) return -1;
            else return 1;
        });
};