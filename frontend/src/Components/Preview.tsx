import { useEffect, useState } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import axios from "axios";

export const Preview = () => {
  const [previewFile, setPreviewFile] = useState<File | undefined>();

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const response = await axios.get("/get_preview", { responseType: 'blob' });
        console.log(response.data)
        const blob = new Blob([response.data], { type: "application/pdf;" });
        const file = new File([blob], "temp_file.pdf", { type: "application/pdf" });
        console.log(file.stream)
        setPreviewFile(file);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPreview();
  }, []);

  return (
    <div>
      <DocViewer
        documents={[
          {
            uri: previewFile ? window.URL.createObjectURL(previewFile) : "",
            fileName: "Template Preview",
          },
        ]}
        pluginRenderers={DocViewerRenderers}
      />
    </div>
  );
};
