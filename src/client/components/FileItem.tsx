// src/components/FileItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface FileItemProps {
    file: any;
}

const FileItem: React.FC<FileItemProps> = ({ file }) => {
    return (
        <li>
            <Link to={`/file/${file._id}`}>{file.name}</Link>
        </li>
    );
};

export default FileItem;
