export type LinkGenerator = (p: { text?: string, embeds?: string[] }) => URL;
export type URLCondition = (p: { url: URL }) => boolean;

export type FulfilmentType = 'redirect' | 'promptCopy'

export interface ISourceDetails {
    imageUrl: string;
    productName: string;
    domain: string;
    preferenceCondition?: URLCondition;
}

export interface IRedirectSource extends ISourceDetails {
    fulfilmentType: 'redirect';
    linkGenerator: LinkGenerator;
}

export interface IPromptCopySource extends ISourceDetails {
    fulfilmentType: 'promptCopy';
    linkGenerator: LinkGenerator;
}

export type ISource = IRedirectSource | IPromptCopySource;