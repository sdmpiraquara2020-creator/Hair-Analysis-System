import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Upload, X, Camera } from "lucide-react";

function UploadBox({ 
  onFileSelect, 
  onCameraOpen,
  preview, 
  onRemove,
  accept = "image/*",
  label = "Selecionar Imagem"
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  if (preview) {
    return (
      <div className="space-y-3">
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border border-gray-200"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onRemove}
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <X className="w-4 h-4 mr-2" />
            Remover
          </Button>
          {onCameraOpen && (
            <Button
              onClick={onCameraOpen}
              className="flex-1 bg-gray-900 text-white hover:bg-gray-800"
            >
              <Camera className="w-4 h-4 mr-2" />
              Nova Foto
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer"
      >
        <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
        <p className="text-sm text-gray-600 font-medium mb-2">{label}</p>
        <p className="text-xs text-gray-500">Clique para selecionar ou arraste aqui</p>
      </div>

      {onCameraOpen && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">ou</span>
            </div>
          </div>
          <Button
            onClick={onCameraOpen}
            className="w-full bg-gray-900 text-white hover:bg-gray-800"
          >
            <Camera className="w-4 h-4 mr-2" />
            Abrir Câmera
          </Button>
        </>
      )}
    </div>
  );

UploadBox.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
  onCameraOpen: PropTypes.func,
  preview: PropTypes.string,
  onRemove: PropTypes.func,
  accept: PropTypes.string,
  label: PropTypes.string,
};

export default UploadBox;

