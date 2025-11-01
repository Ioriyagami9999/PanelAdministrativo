import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Button } from "primereact/button";

const SAMPLE_PDF_URL = "/sample.pdf"; // coloca un PDF en public/sample.pdf o usa URL remota

const PDFViewer: React.FC = () => {
  return (
    <div style={{height:"100vh", padding:20}}>
      <div className="p-d-flex p-ai-center p-jc-between p-mb-2">
        <h3>Documentación</h3>
        <div>
          <a href={SAMPLE_PDF_URL} download>
            <Button icon="pi pi-download" label="Descargar" />
          </a>
        </div>
      </div>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.9.179/build/pdf.worker.min.js">
        <div style={{height:"80vh", border:'1px solid #ddd'}}>
          <Viewer fileUrl={SAMPLE_PDF_URL} />
        </div>
      </Worker>
    </div>
  );
};

export default PDFViewer;
