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

    async getBlob(key: string): Promise<Blob | null> {
        return await this.blobs.get(key).then(r => r?.value || null);
    }

    async putBlob(key: string, value: Blob): Promise<void> {
        await this.blobs.put({ key, value }, key);
    }

    async getAutomergeDoc<TType>(key:string): Promise<Automerge.next.Doc<TType> | null> {
        const blob = await this.getBlob(key);
        if (!blob) return null;
        const array = new Uint8Array(await blob.arrayBuffer())
        return Automerge.load<TType>(array);
    }

    async putAutomergeDoc<TType>(key:string, doc:Automerge.next.Doc<TType>):Promise<void> {
        const array = Automerge.save(doc);
        const blob = new Blob([ array ]);
        await this.putBlob(key, blob);
    }
}

export default new UserConfigDb();