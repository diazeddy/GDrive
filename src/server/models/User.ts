import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    password: string;
    files: Schema.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    files: [{ type: Schema.Types.ObjectId, ref: 'File' }]
});

const User = model<IUser>('User', userSchema);

export default User;
