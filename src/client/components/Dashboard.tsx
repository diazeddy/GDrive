import React, { useState, useEffect } from "react";
import { getFiles, uploadFile } from "../api/api";

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

    const handleUpload = async (event: React.FormEvent) => {
        event.preventDefault();
        if (file) {
        const token = localStorage.getItem('token') || '';
        try {
            const response = await uploadFile(file, token);
            setFiles([...files, response.data]);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
        }
    };

    return (
        <div>
        <h1>Dashboard</h1>
        <form onSubmit={handleUpload}>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button type="submit">Upload</button>
        </form>
        {/* <FileList files={files} /> */}
        </div>
    );
};
  
export default Dashboard;