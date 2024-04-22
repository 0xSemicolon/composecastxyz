import warpcast from "./warpcast";
import supercast from './supercast';
import yup from './yup';
import farquest from './farquest';
import herocast from './herocast';
import { ISource, IPromptCopySource, IRedirectSource, ISourceDetails } from './types';

export type { ISource, IPromptCopySource, IRedirectSource, ISourceDetails }

export const randomSources = (url: URL | string):ISource[] => {
    if (typeof url === 'string') {
        url = new URL(url);
    }
    return [
        warpcast,
        supercast,
        yup,
        farquest,
        herocast
    ].sort((a, b) => {
        if (a.preferenceCondition && a.preferenceCondition({ url })) {
            return 0 - Math.random();
        }
        return 0.5 - Math.random();
    });
};