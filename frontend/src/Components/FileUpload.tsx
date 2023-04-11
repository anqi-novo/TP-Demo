import { Box, Snackbar } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import '../App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FileUpload(props: { onTemplateVariables: Function }) {

  const { onTemplateVariables } = props;


  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const file = event.target.files?.[0];
    if (file?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      console.log(file);

      // Send the file to the backend for processing
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axios.post('/process_document', formData);
        const data = response.data;
        onTemplateVariables(data.variables, file);
        console.log(data, file);
      } catch (error) {
        console.error(error);
      }

    } else {
      setMessage('Please upload a valid DOCX file.');
      setOpen(true);
    }
    setLoading(false);
  };


  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
      <input
        accept=".docx"
        id="contained-button-file"
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="contained-button-file">
        <LoadingButton loading={loading} loadingPosition="start" variant="contained" color="primary" component="span" startIcon={<CloudUploadIcon />}>
          Upload template (DOCX)
        </LoadingButton>
      </label>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default FileUpload;
