import React from 'react';
import FileItem from './FileItem';
import { IFile } from '../types/types';

interface FileListProps {
    files: IFile[];
}

const FileList: React.FC<FileListProps> = ({ files }) => {
    return (
        <ul>
            {files.map((file) => (
                <FileItem key={file._id} file={file} />
            ))}
        </ul>
    );
};

export default FileList;
