# GDrive

## Description
Create a simple cloud application that is similar to Google Drive
- User should be able to login
- User should be able to upload a file (maximum size: 5 MB) and see the list of files associated to the account
- Maximum storage capacity is 50 MB
- User should be able to copy link of the file and share with other guys
  Select one of the users in the list to share the file
- Visiting the link should open file detail page
  "Download" button - Should download file
  For owner of the file, "Delete" button - Should delete file
  For owner of the file, "Rename" button - Should rename file
  For *.txt file, should display its content
  For *.png or *.jpg file, should display image
- TechStack: React, Node.js, MongoDB

## Challenges
- Used the binary type in mongodb to save the file since the maximum file size is 5MB.
- Render the text and images files on the page by converting the byte data into string and image url.

## Environment
- Windows 11
- Node v16.14.0
- Npm 8.3.1

## Tech stacks
- Vite + React + Typescript
- Express
- MongoDB

## Steps to run program
1. Install node modules
   ```shell
   npm install
   ```

2. Run project
   ```shell
   npm run dev
   ```
This will host the project on http://localhost:3000. 