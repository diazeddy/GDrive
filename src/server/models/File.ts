import { Schema, model, Document } from 'mongoose';

interface IFile extends Document {
    name: string;
    size: number;
    path: string;
    owner: Schema.Types.ObjectId;
    sharedWith: Schema.Types.ObjectId[];
}

const fileSchema = new Schema<IFile>({
    name: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const File = model<IFile>('File', fileSchema);

export default File;
