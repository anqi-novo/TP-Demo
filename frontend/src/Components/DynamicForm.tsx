import { useState } from 'react';
import { TextField, Button, Grid, Box, Typography } from '@mui/material';
import axios from 'axios';

type Props = {
  fields: string[];
  file: File;
};

const DynamicForm = ({ fields, file }: Props) => {
  const [formState, setFormState] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await axios.post('/generate_template', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob' // tell axios to return a blob response
      });
      const data = await response.data; // convert the response to text
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=ansi;' }); // set the charset to ANSI
      const fileUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', `generated_template_${new Date().toDateString()}.docx`);
      document.body.appendChild(link);
      link.click();

      // Handle the response data here
    } catch (error) {
      console.error('Error:', error);
      // Handle the error here
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <Typography component="h1" variant="h6">
            Identified variables
          </Typography>
        </Grid>
        {fields.map((field, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <TextField
              label={field}
              fullWidth
              required
              name={field}
              value={formState[field] || ''}
              onChange={handleInputChange}
              autoFocus
            />
          </Grid>
        ))}
      </Grid>
      <Grid item xs={12}>
        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
          Generate
        </Button>
      </Grid>

    </Box>
  );
};

export default DynamicForm;
