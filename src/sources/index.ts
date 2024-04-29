
import type { ISource, IPromptCopySource, IRedirectSource, ISourceDetails } from './types';
import warpcast from "./warpcast";
import supercast from './supercast';
import yup from './yup';
import farquest from './farquest';
import herocast from './herocast';
import u3 from './u3';
import sealcaster from './sealcaster';
import nook from './nook'
import s33bits from './33bits';

export type { ISource, IPromptCopySource, IRedirectSource, ISourceDetails }
export type IOrderedSource = ISource & { isReferred: boolean; isPreferred: boolean; isStarred: boolean; };

export const ALL_SOURCES = [
    warpcast,
    supercast,
    yup,
    farquest,
    herocast,
    u3,
    sealcaster,
    nook,
    s33bits
];

// Randomize once to promote all clients equally in lieu of user or session preferences
const ONCE_RANDOMIZED_SOURCES = ALL_SOURCES.sort(() => 0.5 - Math.random());

const toNormalizedUrl = (urlStringIsh: URL | string | null): URL | null => {
    if (!urlStringIsh) return null;
    if (typeof urlStringIsh === 'string') {
        try {
            if (!urlStringIsh.startsWith('http://') && !urlStringIsh.startsWith('https://')) {
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

const STARRED_WEIGHT = ONCE_RANDOMIZED_SOURCES.length * 3;
const REFERRAL_WEIGHT = ONCE_RANDOMIZED_SOURCES.length * 2;
const PREFERRED_WEIGHT = ONCE_RANDOMIZED_SOURCES.length * 1;


export const orderedSources = (p: { 
    referrer?: URL | string | null | undefined, 
    preferences?: URL[] | string[] | null | undefined,
    starred?: URL[] | string[] | null | undefined 
}): IOrderedSource[] => {

    let { referrer, preferences, starred } = p;
    if (!referrer && !preferences?.length && !starred?.length) {
        return ONCE_RANDOMIZED_SOURCES.map(s => ({ ...s, isReferred: false, isPreferred: false, isStarred: false }));
    }
    if (typeof referrer === 'string') {
        referrer = toNormalizedUrl(referrer);
    }
    if (preferences?.length) {
        preferences = preferences
            .map((p: URL | string) => toNormalizedUrl(p))
            .filter(p => p) as URL[];
    }
    if (starred?.length) {
        starred = starred
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
            const isStarred = starred?.length
                ? !!(starred.find(p => a.preferenceCondition && a.preferenceCondition({ url: p as URL })))
                : false;
            const indexWeight = ONCE_RANDOMIZED_SOURCES.length - i + 1;
            const referralWeight = isReferred ? REFERRAL_WEIGHT : 0;
            const preferredWeight = isPreferred ? PREFERRED_WEIGHT : 0;
            const starredWeight = isStarred ? STARRED_WEIGHT : 0;
            const weight = indexWeight + referralWeight + preferredWeight + starredWeight;
            return {
                ...a,
                isReferred,
                isPreferred,
                isStarred,
                weight
            };
        });
    const sorted = matches.sort((a, b) => b.weight - a.weight);
    return sorted;
};