import * as Automerge from '@automerge/automerge';
import Dexie, { Table } from 'dexie';

export interface IKeyedBlobModel {
    key: string;
    value: Blob;
}

export class UserConfigDb extends Dexie {
    blobs!: Table<IKeyedBlobModel>
    constructor() {
        super('composeCastXyz');
        this.version(1).stores({
            blobs: 'key'
        });
    }

    async listBlobsWithPrefix(prefix: string): Promise<[string, Blob][]> {
        const blobs = await this.blobs.where('key').startsWith(prefix).toArray();
        return blobs.map(b => ([b.key, b.value]));
    }

    async getBlob(key: string): Promise<Blob | null> {
        return await this.blobs.get(key).then(r => r?.value || null);
    }

    async putBlob(key: string, value: Blob): Promise<void> {
        await this.blobs.put({ key, value }, key);
    }

    async listAutomergeDocsWithPrefix<TType>(prefix: string): Promise<[string, Automerge.Doc<TType>][]> {
        const blobs = await this.listBlobsWithPrefix(prefix);
        const docs: [string, Automerge.Doc<TType>][] = [];
        for (const [key, blob] of blobs) {
            const buffer = await blob.arrayBuffer();
            const array = new Uint8Array(buffer)
            const doc = Automerge.load<TType>(array);
            docs.push([key, doc]);
        }
        return docs;
    }

    async getAutomergeDoc<TType>(key: string): Promise<Automerge.Doc<TType> | null> {
        const blob = await this.getBlob(key);
        if (!blob) return null;
        const buffer = await blob.arrayBuffer();
        const array = new Uint8Array(buffer)
        return Automerge.load<TType>(array);
    }

    async putAutomergeDoc<TType>(key: string, doc: Automerge.Doc<TType>): Promise<void> {
        const array = Automerge.save(doc);
        const blob = new Blob([array]);
        await this.putBlob(key, blob);
    }

    async changeAutomergeDoc<TType>(key: string, changeFn: Automerge.ChangeFn<TType>, init: () => Automerge.Doc<TType>): Promise<void> {
        // TODO: Want to use dexie tx's just hitting issue w/ `blob.arrayBuffer` promise.
        let doc1 = await this.getAutomergeDoc<TType>(key);
        if (!doc1) doc1 = init();
        const doc2 = Automerge.change<TType>(doc1, changeFn);
        if (Automerge.getChanges(doc1, doc2).length) {
            await this.putAutomergeDoc(key, doc2);
        }
    }
}

export default new UserConfigDb();