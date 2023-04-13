import { Box } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import '../App.css';
import React, { useState } from 'react';
import axios from 'axios';
import ErrorToast from "./ErrorToast";

function FileUpload(props: { onTemplateVariables: Function }) {

  const { onTemplateVariables } = props;
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const file = event.target.files?.[0];
    if (file?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {

      // Send the file to the backend for processing
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axios.post('/process_document', formData);
        const data = response.data;
        onTemplateVariables(data.variables, file);
      } catch (error) {
        console.error(error);
      }

    } else {
      setError('Please upload a valid DOCX file.');
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
      {error && <ErrorToast open={open} error={error} handleClose={handleClose} />}
    </Box>
  );
}

export default FileUpload;
