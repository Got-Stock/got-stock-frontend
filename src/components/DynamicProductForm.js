import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DynamicProductForm = ({ categoryPath, initialValues = {}, onSubmit, onChange }) => {
  const [formSchema, setFormSchema] = useState(null);
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryPath) {
      fetchCategoryAttributes();
    }
  }, [categoryPath]);

  const fetchCategoryAttributes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API}/category/attributes/${encodeURIComponent(categoryPath)}`,
        { withCredentials: true }
      );
      setFormSchema(response.data.form_schema);
    } catch (error) {
      console.error('Error fetching category attributes:', error);
      toast.error('Failed to load form fields');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldName, value) => {
    const newFormData = { ...formData, [fieldName]: value };
    setFormData(newFormData);
    
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
    
    // Notify parent component
    if (onChange) {
      onChange(newFormData);
    }
  };

  const validateForm = async () => {
    try {
      const response = await axios.post(
        `${API}/category/validate-attributes`,
        {
          category_path: categoryPath,
          attributes: formData
        },
        { withCredentials: true }
      );
      
      if (!response.data.valid) {
        const newErrors = {};
        response.data.errors.forEach(error => {
          // Extract field name from error message
          const match = error.match(/attribute '([^']+)'/);
          if (match) {
            newErrors[match[1]] = error;
          }
        });
        setErrors(newErrors);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Validation failed');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) {
      toast.error('Please fix validation errors');
      return;
    }
    
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const renderField = (field) => {
    const { name, label, type, required, options, char_limit } = field;
    const value = formData[name] || '';
    const hasError = !!errors[name];

    switch (type) {
      case 'dropdown':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(val) => handleFieldChange(name, val)}
            >
              <SelectTrigger className={hasError ? 'border-red-500' : ''}>
                <SelectValue placeholder={`Select ${label}`} />
              </SelectTrigger>
              <SelectContent>
                {options && options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors[name]}
              </p>
            )}
          </div>
        );

      case 'multi_select':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={Array.isArray(value) ? value.join(',') : ''}
              onValueChange={(val) => {
                const selectedValues = val ? val.split(',') : [];
                handleFieldChange(name, selectedValues);
              }}
            >
              <SelectTrigger className={hasError ? 'border-red-500' : ''}>
                <SelectValue placeholder={`Select ${label}`} />
              </SelectTrigger>
              <SelectContent>
                {options && options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Select multiple by choosing values</p>
            {hasError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors[name]}
              </p>
            )}
          </div>
        );

      case 'bulleted_text':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={name}
              value={value}
              onChange={(e) => handleFieldChange(name, e.target.value)}
              placeholder={`Enter ${label.toLowerCase()}`}
              className={hasError ? 'border-red-500' : ''}
              rows={3}
            />
            {char_limit && (
              <p className="text-xs text-gray-500">
                Character limit: {char_limit} (Current: {value.length})
              </p>
            )}
            {hasError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors[name]}
              </p>
            )}
          </div>
        );

      case 'text':
      case 'numerical':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={name}
              type={type === 'numerical' ? 'number' : 'text'}
              value={value}
              onChange={(e) => handleFieldChange(name, e.target.value)}
              placeholder={`Enter ${label.toLowerCase()}`}
              className={hasError ? 'border-red-500' : ''}
            />
            {hasError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors[name]}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading form fields...</p>
      </div>
    );
  }

  if (!formSchema || !formSchema.fields || formSchema.fields.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p>No specific attributes required for this category.</p>
        <p className="text-sm mt-2">You can proceed with basic product information.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Category-Specific Attributes</h3>
        <p className="text-sm text-blue-800">
          The following fields are required for products in: <strong>{categoryPath}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formSchema.fields.map(renderField)}
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800 font-medium">
            Please fix the following errors:
          </p>
          <ul className="list-disc list-inside text-sm text-red-700 mt-2">
            {Object.values(errors).map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {onSubmit && (
        <div className="flex justify-end">
          <Button type="submit" className="w-full md:w-auto">
            Continue
          </Button>
        </div>
      )}
    </form>
  );
};

export default DynamicProductForm;
