
import React, { useState, useRef, useEffect } from 'react';

interface AutocompleteProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  onSelect: (val: string) => void;
  placeholder?: string;
  className?: string;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ options, value, onChange, onSelect, placeholder, className }) => {
  const [show, setShow] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length > 0) {
      const filteredOptions = options.filter(o => 
        o.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(filteredOptions);
      setShow(filteredOptions.length > 0);
    } else {
      setShow(false);
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        onFocus={() => value.length > 0 && setShow(true)}
      />
      {show && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-height-[250px] overflow-auto">
          {filtered.map((opt, i) => (
            <li
              key={i}
              onClick={() => {
                onSelect(opt);
                setShow(false);
              }}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-slate-50 last:border-0"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
