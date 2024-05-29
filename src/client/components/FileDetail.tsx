import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFileDetail, deleteFile, renameFile } from '../api/api';
import { IFile, IUser } from '../types/types';
import axios from 'axios';

const FileDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [file, setFile] = useState<IFile | null>(null);
    const [newName, setNewName] = useState<string>('');
    const [users, setUsers] = useState<IUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [text, setText] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFileDetail = async () => {
            const token = localStorage.getItem('token') || '';
            try {
                const response = await getFileDetail(id!, token);
                setFile(response.data);
            } catch (error) {
                console.error('Error fetching file detail:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchFileDetail();
        fetchUsers();
    }, [id]);

    useEffect(() => {
        if (file) {
            const fetchText = (url: string) => {
                fetch(url)
                    .then(response => response.text())
                    .then(text => {
                        setText(text);
                    });
            };
            fetchText(`http://localhost:3000/uploads/${changePathName(file.path)}`);
        }
    }, [file])

    const handleDelete = async () => {
        const token = localStorage.getItem('token') || '';
        try {
            await deleteFile(id!, token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const handleRename = async () => {
        const token = localStorage.getItem('token') || '';
        try {
            await renameFile(id!, newName, token);
            setFile(prevFile => prevFile ? {...prevFile, name: newName} : null);
        } catch (error) {
            console.error('Error renaming file:', error);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard');
    };

    const handleShare = async () => {
        if(!selectedUser) {
            alert('Please select a user to share with.');
            return;
        }

        try {
            await axios.post(`/api/files/${id}/share`, { userId: selectedUser }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('File shared successfully');
        } catch (error) {
            console.error('Error sharing file:', error);
        }
    };

    if (!file) {
        return <div>Loading...</div>;
    }

    const changePathName = (path: string) => {
        const pathName = path.split('\\').pop()!;
        const newName = pathName.replace('uploads\\', '');

        return newName;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md">
            <h1 className="text-2xl font-bold mb-4">File Detail: {file.name}</h1>
            <div className="flex space-x-4 mb-4">
                <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleCopyLink}>Copy Link</button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleDelete}>Delete</button>
            </div>
            <div className="mb-4">
                <label htmlFor='share-user' className="block text-sm font-medium text-gray-700">Share with:</label>
                <select id="share-user" value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="">Select a user</option>
                    {
                        users?.map(user => (
                            <option key={user._id} value={user._id}>{user.username}</option>
                        ))
                    }
                </select>
                <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded" onClick={handleShare}>Share</button>
            </div>
            <a href={`http://localhost:3000/uploads/${changePathName(file.path)}`} download>
                <button className="px-4 py-2 bg-orange-500 text-white rounded">Download</button>
            </a>
            <div>
                <label>
                    New Name:
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </label>
                <button onClick={handleRename}>Rename</button>
            </div>
            
            {file.name.endsWith('.txt') && (
                <div>
                    <h2>File Content</h2>
                    <p>{text}</p>
                </div>
            )}
            {(file.name.endsWith('.png') || file.name.endsWith('.jpg')) && (
                <div>
                    <h2>Image</h2>
                    <img src={`http://localhost:3000/uploads/${changePathName(file.path)}`} alt={file.name} />
                </div>
            )}
        </div>
    );
};

export default FileDetail;
