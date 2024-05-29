import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFileDetail, deleteFile, renameFile } from '../api/api';
import axios from 'axios';

const FileDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [file, setFile] = useState<any>(null);
    const [newName, setNewName] = useState('');
    const [users, setUsers] = useState<any[]>([]);
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
            setFile({ ...file, name: newName });
        } catch (error) {
            console.error('Error renaming file:', error);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard');
    }

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
        <div>
            <h1>File Detail: {file.name}</h1>
            <button onClick={handleCopyLink}>Copy Link</button>
            <div>
                <label htmlFor='share-user'>Share with:</label>
                <select id="share-user" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                    <option value="">Select a user</option>
                    {
                        users?.map(user => (
                            <option key={user._id} value={user._id}>{user.username}</option>
                        ))
                    }
                </select>
                <button onClick={handleShare}>Share</button>
            </div>
            <a href={`http://localhost:3000/uploads/${file.path}`} download>
                <button>Download</button>
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
            <button onClick={handleDelete}>Delete</button>
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
