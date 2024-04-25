import warpcast from "./warpcast";
import supercast from './supercast';
import yup from './yup';
import farquest from './farquest';
import herocast from './herocast';
import type { ISource, IPromptCopySource, IRedirectSource, ISourceDetails } from './types';

export type { ISource, IPromptCopySource, IRedirectSource, ISourceDetails }
export type IOrderedSource = ISource & { isReferred: boolean; isPreferred: boolean };

const ALL_SOURCES = [
    warpcast,
    supercast,
    yup,
    farquest,
    herocast
];

const ONCE_RANDOMIZED_SOURCES = ALL_SOURCES.sort(() => 0.5 - Math.random());

const toNormalizedUrl = (urlStringIsh: URL | string | null): URL | null => {
    if (!urlStringIsh) return null;
    if (typeof urlStringIsh === 'string') {
        try {
            if (!urlStringIsh.startsWith('http://') || !urlStringIsh.startsWith('https://')) {
                return new URL(`https://${urlStringIsh}`);
            }
            return new URL(urlStringIsh);
        } catch {
            return null;
        }
    } else {
        return urlStringIsh;
    }
}

const REFERRAL_WEIGHT = ONCE_RANDOMIZED_SOURCES.length * 2;
const PREFERRED_WEIGHT = ONCE_RANDOMIZED_SOURCES.length * 1;


export const orderedSources = (p: { referrer?: URL | string | null | undefined, preferences?: URL[] | string[] | null | undefined }): IOrderedSource[] => {

    let { referrer, preferences } = p;
    if (!referrer && !preferences?.length) {
        return ONCE_RANDOMIZED_SOURCES.map(s => ({ ...s, isReferred: false, isPreferred: false }));
    }
    if (typeof referrer === 'string') {
        referrer = toNormalizedUrl(referrer);
    }
    if (preferences?.length) {
        preferences = preferences
            .map((p: URL | string) => toNormalizedUrl(p))
            .filter(p => p) as URL[];
    }
    const matches = ONCE_RANDOMIZED_SOURCES
        .map((a, i) => {
            const isReferred = referrer
                ? !!(a.preferenceCondition && a.preferenceCondition({ url: referrer }))
                : false;
            const isPreferred = preferences?.length
                ? !!(preferences.find(p => a.preferenceCondition && a.preferenceCondition({ url: p as URL })))
                : false;
            const INDEX_WEIGHT = ONCE_RANDOMIZED_SOURCES.length - i + 1;
            const weight = (isReferred ? REFERRAL_WEIGHT : 0) + (isPreferred ? PREFERRED_WEIGHT : 0) + INDEX_WEIGHT;
            return {
                ...a,
                isReferred,
                isPreferred,
                weight
            };
        });
    const sorted = matches.sort((a, b) => b.weight - a.weight);
    console.log(sorted);
    return sorted;
};