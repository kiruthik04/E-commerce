import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ value, max = 5, interactive = false, onChange, size = 'md' }) => {
  const sizes = { sm: 'h-3.5 w-3.5', md: 'h-5 w-5', lg: 'h-7 w-7' };
  const cls = sizes[size] || sizes.md;

  return (
    <div className="flex items-center space-x-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map(star => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange && onChange(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
        >
          <Star
            className={`${cls} transition-colors ${
              star <= value
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 fill-gray-100'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
