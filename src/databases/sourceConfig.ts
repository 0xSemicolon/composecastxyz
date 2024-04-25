import * as Automerge from '@automerge/automerge';
import { PartialPick } from '../lib/common';
import { UserConfigDb } from './composeCastDb';

export interface ISourceConfig {
    version: number;
    isStarred: boolean;
    automaticallyContinue: boolean;
}

export const initSourceConfig = (): Automerge.Doc<ISourceConfig> => {
    const doc1 = Automerge.init<ISourceConfig>();
    return Automerge.change(doc1, (d) => {
        d.version = 1;
        d.isStarred = false;
        d.automaticallyContinue = false;
    })
};

export const patchSourceConfigFn = <T extends keyof ISourceConfig>(p: PartialPick<ISourceConfig, T>): Automerge.ChangeFn<ISourceConfig> =>
    (s: ISourceConfig) => {
        Object.keys(p).forEach(k => {
            if (p[k] !== undefined) {
                s[k] = p[k];
            }
        })
    };

export const getSourceConfig = async (db: UserConfigDb, domain: string) => {
    return await db.getAutomergeDoc<ISourceConfig>(`source:${domain}`);
}

export const patchSourceConfig = async <T extends keyof ISourceConfig>(db: UserConfigDb, domain: string, p: PartialPick<ISourceConfig, T>) => {
    await db.changeAutomergeDoc(`source:${domain}`, patchSourceConfigFn(p), initSourceConfig);
}

export const listSourceConfigs = async (db: UserConfigDb) => {
    return await db.listAutomergeDocsWithPrefix<ISourceConfig>('source:');
} 