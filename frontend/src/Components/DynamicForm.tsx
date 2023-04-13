import { useState } from 'react';
import { TextField, Button, Grid, Box, Typography, Select, MenuItem, SelectChangeEvent, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import ErrorToast from './ErrorToast';

type Props = {
  fields: string[];
  file: File;
};

function getFieldComponent(field: string, formState: { [key: string]: any }, handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void) {
  const fieldType = formState[`${field}-type`];
  if (fieldType === "Date") {
    return (
      <TextField
        size="small"
        fullWidth
        type="date"
        required
        name={field}
        value={formState[field] || ''}
        onChange={handleInputChange}
        autoFocus
      />
    );
  } else if (fieldType === "Number") {
    return (
      <TextField
        size="small"
        fullWidth
        required
        type="number"
        label={field}
        name={field}
        value={formState[field] || ''}
        onChange={handleInputChange}
        autoFocus
      />
    );
  } else {
    return (
      <TextField
        size="small"
        fullWidth
        required
        label={field}
        name={field}
        value={formState[field] || ''}
        onChange={handleInputChange}
        autoFocus
      />
    );
  }
}

const DynamicForm = ({ fields, file }: Props) => {
  const [formState, setFormState] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null); // Add error state
  const [open, setOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<any>, field: string) => {
    const { value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [`${field}-type`]: value as string,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, value);
    });
    console.log("try")
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
      setOpen(true)
      setError('Error generating template. Please try again.'); // Set error state
    }
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };


  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ m: 3 }}>
      {error && (
        <ErrorToast open={open} handleClose={handleClose} error={error} />
      )}
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <Typography component="h1" variant="overline">
            Identified variables
          </Typography>
        </Grid>
        {fields.map((field, i) => (
          <Grid item container xs={12} sm={12} spacing={1} key={i}>
            <Grid item xs={8} sm={4}>
              <Typography sx={{ mt: 1 }} variant="overline">
                {field}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControl sx={{ minWidth: 120, width: '100%' }} size="small" required>
                <InputLabel id={`${field}-label`}>Type</InputLabel>
                <Select
                  label="Choose a type..."
                  labelId={`${field}-label`}
                  id={field}
                  value={formState[`${field}-type`] || ''}
                  onChange={(e) => handleSelectChange(e, field)}
                  fullWidth
                >
                  <MenuItem value="Text">Text</MenuItem>
                  <MenuItem value="Number">Number</MenuItem>
                  <MenuItem value="Date">Date</MenuItem>
                </Select>
              </FormControl>

            </Grid>
            <Grid item xs={6} sm={5}>
              {getFieldComponent(field, formState, handleInputChange)}
            </Grid>
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
