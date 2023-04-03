
import { Box, Container } from '@mui/material';
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
     <NavBar/>
     <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
      {file && <Preview file={file}/>}
     <FileUpload onTemplateVariables={handleTemplateVariables} />
     {file && templateVariables && templateVariables.length > 0 && <DynamicForm fields={templateVariables} file={file}/>}
     </Container>
    </div>
  );
}

export default App;
