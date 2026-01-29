import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export default function ImageComparer({ image1, image2, label1, label2 }) {
  const [sliderValue, setSliderValue] = useState([50]);

  return (
    <Card className="glass-effect border-white/40 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-96 overflow-hidden">
          {/* Imagem 2 (fundo) */}
          <div className="absolute inset-0">
            <img 
              src={image2} 
              alt={label2}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-semibold">
              {label2}
            </div>
          </div>

          {/* Imagem 1 (com clip) */}
          <div 
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - sliderValue[0]}% 0 0)` }}
          >
            <img 
              src={image1} 
              alt={label1}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-semibold">
              {label1}
            </div>
          </div>

          {/* Linha divisória */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
            style={{ left: `${sliderValue[0]}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
              <div className="flex gap-1">
                <div className="w-0.5 h-4 bg-gray-600"></div>
                <div className="w-0.5 h-4 bg-gray-600"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="p-4 bg-white/50">
          <Slider
            value={sliderValue}
            onValueChange={setSliderValue}
            max={100}
            step={1}
            className="cursor-pointer"
          />
          <div className="flex justify-between mt-2 text-xs text-gray-600 font-medium">
            <span>{label1}</span>
            <span>{label2}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

