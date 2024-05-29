import React from 'react';
import { Link } from 'react-router-dom';

interface FileItemProps {
    file: any;
}

const FileItem: React.FC<FileItemProps> = ({ file }) => {
    return (
        <li>
            <Link to={`/file/${file._id}`} className="text-blue-500">{file.name}</Link>
            <span className="text-gray-600">(Owner: {file.owner.username})</span>
        </li>
    );
};

export default FileItem;