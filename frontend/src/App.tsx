import { Box, Container, Grid } from '@mui/material';
import './App.css';
import FileUpload from './Components/FileUpload';
import NavBar from './Components/Navbar';
import { useState } from 'react';
import DynamicForm from './Components/DynamicForm';
import { Preview } from './Components/Preview';

function App() {
  const [templateVariables, setTemplateVariables] = useState<string[]>([]);
  const [file, setFile] = useState<File | undefined>(undefined);

  const handleTemplateVariables = (variables: string[], file: File) => {
    setTemplateVariables(variables);
    setFile(file)
  }


  return (
    <div>
      <NavBar />
      <Container disableGutters maxWidth="md" component="main" sx={{ pt: 8, pb: 6 }}>
        {file ? <Grid container spacing={2} alignItems="stretch" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Box mb={{ xs: 2, md: 0 }} maxWidth={400} alignItems="center">
              {file && templateVariables && templateVariables.length > 0 && <DynamicForm fields={templateVariables} file={file} />}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box mb={{ xs: 2, md: 0 }}>
              {file && <Preview />}

            </Box>
          </Grid>
        </Grid> : <FileUpload onTemplateVariables={handleTemplateVariables} />
        }

      </Container>
    </div>
  );
}

export default App;
