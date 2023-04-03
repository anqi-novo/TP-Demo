import { useEffect, useState } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

export const Preview = (props: { file: File }) => {

  //for this to work the file can not be local because it uses the office viewer that only works with public urls.
  return (
    <DocViewer
      documents={[
        {
          uri: window.URL.createObjectURL(props.file),
          fileName: props.file.name,
        },
      ]}
      pluginRenderers={DocViewerRenderers}
    />
  );
};
