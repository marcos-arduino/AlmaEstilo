import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './ImageUploader.css';

const ImageUploader = ({ onImageUpload, initialImage = '', label = 'Subir imagen', accept = 'image/*' }) => {
  const [preview, setPreview] = useState(initialImage);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = useCallback((file) => {
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, sube un archivo de imagen válido');
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5MB');
      return;
    }

    setError('');
    
    // Crear vista previa
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      if (onImageUpload) {
        onImageUpload(file, reader.result);
      }
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('fileInput').click();
  };

  return (
    <div className="image-uploader">
      <label className="upload-label">{label}</label>
      
      <div 
        className={`dropzone ${isDragging ? 'dragging' : ''} ${preview ? 'has-preview' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          id="fileInput"
          type="file"
          accept={accept}
          onChange={handleChange}
          className="file-input"
        />
        
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Vista previa" className="preview-image" />
            <div className="overlay">
              <span className="change-text">Haz clic para cambiar la imagen</span>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <p className="upload-text">Arrastra una imagen o haz clic para seleccionar</p>
            <p className="upload-hint">Formatos soportados: JPG, PNG. Tamaño máximo: 5MB</p>
          </div>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

ImageUploader.propTypes = {
  onImageUpload: PropTypes.func,
  initialImage: PropTypes.string,
  label: PropTypes.string,
  accept: PropTypes.string
};

export default ImageUploader;
