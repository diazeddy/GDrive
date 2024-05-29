import React, { useState, useEffect } from "react";
import { getFiles } from "../api/api";
import FileList from "./FileList";
import { IFile } from "../types/types";
import axios from "axios";

const Dashboard: React.FC = () => {
    const [files, setFiles] = useState<IFile[]>([]);
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
        <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow-md">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <input type="file" onChange={handleFileChange} />
            <button className="inline-block mb-4 px-4 py-2 bg-green-500 text-white rounded" onClick={handleUpload}>Upload</button>
            <div className="space-y-4">
                <FileList files={files} />
            </div>
        </div>
    );
};
  
export default Dashboard;