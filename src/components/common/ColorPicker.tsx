import React, { useRef } from 'react';
import { PRESET_COLORS } from '../../types';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
}) => {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const isCustomColor = !PRESET_COLORS.some(color => color.value === selectedColor);

  const handleCustomColorClick = () => {
    colorInputRef.current?.click();
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange(e.target.value.toUpperCase());
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Color Tag *
      </label>
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onColorChange(color.value)}
            className={`w-10 h-10 rounded-full border-2 transition-all ${
              selectedColor === color.value
                ? 'border-gray-900 dark:border-gray-100 scale-110'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
            aria-label={`Select ${color.name} color`}
          />
        ))}

        {/* Custom Color Picker Button */}
        <div className="relative">
          <button
            type="button"
            onClick={handleCustomColorClick}
            className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
              isCustomColor
                ? 'border-gray-900 dark:border-gray-100 scale-110'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            style={{
              background: isCustomColor
                ? selectedColor
                : 'conic-gradient(from 0deg, #EF4444, #F97316, #EAB308, #10B981, #3B82F6, #6366F1, #A855F7, #EC4899, #EF4444)'
            }}
            title="Custom Color"
            aria-label="Select custom color"
          >
            {!isCustomColor && (
              <span className="text-white text-xs font-bold drop-shadow-md">+</span>
            )}
          </button>
          <input
            ref={colorInputRef}
            type="color"
            value={selectedColor}
            onChange={handleColorInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Custom color picker"
          />
        </div>
      </div>
      {isCustomColor && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Custom color: {selectedColor}
        </p>
      )}
    </div>
  );
};
