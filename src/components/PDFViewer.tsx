import React, { useState, useRef } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

// Importar el plugin de layout y sus estilos
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Importar componentes de PrimeReact
import { Button } from "primereact/button";
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';

// Ruta al PDF de ejemplo (debe estar en /public/)
const SAMPLE_PDF_URL = "/A_Sample_PDF__1_.pdf";

const PDFViewer: React.FC = () => {
  // Crear la instancia del plugin de layout
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // Estado para guardar la URL del PDF a mostrar
  const [pdfFileUrl, setPdfFileUrl] = useState<string>(SAMPLE_PDF_URL);
  const toast = useRef<any>(null);

  /**
   * Maneja la selección de un nuevo archivo PDF.
   */
  const handlePdfUpload = (e: FileUploadSelectEvent) => {
    const file = e.files[0];
    if (file && file.type === "application/pdf") {
      // Creamos una URL local para el archivo seleccionado
      const fileUrl = URL.createObjectURL(file);
      setPdfFileUrl(fileUrl);
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: 'PDF cargado correctamente' 
      });
    } else {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Por favor, selecciona un archivo PDF válido.' 
      });
    }
  };

  return (
    // Contenedor principal (columna flexible)
    <div style={{ height: "100vh", padding: 20, display: 'flex', flexDirection: 'column' }}>
      <Toast ref={toast} />
      

      <div className="p-d-flex p-ai-center p-jc-between p-mb-3">
        <h3>Documentación</h3>
      </div>
      
   
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div style={{ flex: 1, border: '1px solid #ddd' }}>
          <Viewer 
            fileUrl={pdfFileUrl} // Usa la URL del estado
            plugins={[defaultLayoutPluginInstance]} // Aplica el plugin de layout
          />
        </div>
      </Worker>

     
        
      <div className="p-d-flex p-jc-between p-mt-3">
        <FileUpload 
          mode="basic" 
          name="pdf" 
          accept="application/pdf" 
          chooseLabel="Subir PDF" 
          auto
          customUpload
          onSelect={handlePdfUpload}
          className="p-mr-2"
          chooseOptions={{ icon: 'pi pi-upload', className: 'p-button-secondary' }}
        />
        
        {/* Botón para descargar el PDF actual */}
        <a href={pdfFileUrl} download="documento_actual.pdf">
          <Button icon="pi pi-download" label="Descargar" />
        </a>
      </div>
    </div>
  );
};

export default PDFViewer;