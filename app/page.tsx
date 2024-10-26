"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "../components/navbar";
import { MdOutlineFileUpload } from "react-icons/md";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [productUrl, setProductUrl] = useState<string | null>(null);


  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSearch = async () => {
    if (!image) return;

    try {
      const formData = new FormData();
      const blob = await fetch(image).then(res => res.blob());
      formData.append("file", blob, "image.png");

      const response = await fetch("http://localhost:7000/api/search", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        console.log(data)

        // Hacer la segunda solicitud a /api/product/<int:id>
        const productResponse = await fetch(`http://localhost:7000/api/product/${data}`);
        if (productResponse.ok) {
          const productData = await productResponse.json();
          setProductUrl("https://www.google.com/search?q=" + encodeURIComponent(productData.nombre) +"liverpool");
          console.log(productUrl)
          if (productUrl) {
            window.location.href = productUrl;
          }
        } else {
          const errorText = await productResponse.text();
          console.error("Error al obtener el producto: ", errorText);
        }
      } else {
        const errorText = await response.text();
        console.error("Error en la búsqueda: ", errorText);
      }
    } catch (error) {
      console.error("Error en la búsqueda", error);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex justify-center w-full h-[80%] items-center mt-20">
        <div className="shadow-2xl rounded-md h-max p-10 flex items-center justify-center flex-col space-y-5">
          <p>Encuentra tu producto ideal</p>
          <div
            className="border-2 border-dashed hover:border-gray-600 border-gray-400 rounded-lg text-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            {image ? (
              <img src={image} alt="Uploaded" className="max-h-64 mx-auto" />
            ) : (
              <div className="flex flex-col items-center">
                <div className="text-3xl text-gray-600">
                  <MdOutlineFileUpload />
                </div>
                <p className="text-sm text-gray-500">
                  Arrastra y suelta tu imagen aquí o haz clic para seleccionar
                </p>
              </div>
            )}
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept="image/*"
              onChange={handleFileInput}
            />
          </div>
          {image && (
            <button
              onClick={handleSearch}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Buscar
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
