import React, { useState, useEffect } from "react";
import { getFiles, uploadFile } from "../api/api";
import FileList from "./FileList";
import axios from "axios";

const Dashboard: React.FC = () => {
    const [files, setFiles] = useState<any[]>([]);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchFiles = async () => {
            const token = localStorage.getItem('token') || '';
            try {
                const response = await getFiles(token);
                setFiles(response.data);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };

        fetchFiles();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    }

    const handleUpload = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) return;
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFiles([...files, response.data]);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <FileList files={files} />
        </div>
    );
};
  
export default Dashboard;