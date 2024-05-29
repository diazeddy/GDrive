import React from 'react';
import FileItem from './FileItem';

interface FileListProps {
    files: any[];
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
