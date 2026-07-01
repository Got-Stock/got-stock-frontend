import React from 'react';
import GenericFooterPage from './GenericFooterPage';
import { Download, Image, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';

const MediaKit = () => {
  return (
    <GenericFooterPage 
      title="Media Kit" 
      subtitle="Resources for press and media partners"
    >
      <div className="space-y-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About Got-Stock</h2>
            <p className="text-gray-700 mb-4">
              Got-Stock is Australia's fastest-growing premier marketplace, connecting verified sellers with 
              shoppers looking for quality fashion, electronics, and home goods.
            </p>
            <p className="text-gray-700 mb-6">
              Founded in 2023, we've grown to serve over 100,000 customers with a focus on trust, 
              speed, and verified quality.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold mb-2">Press Contact</h3>
              <p className="text-brand-600">press@got-stock.com</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Image className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold">Logo Pack</h3>
                  <p className="text-sm text-gray-500">PNG, SVG, EPS formats</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-bold">Brand Guidelines</h3>
                  <p className="text-sm text-gray-500">PDF Usage Guide</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center">
                  <Image className="h-6 w-6 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-bold">High-Res Imagery</h3>
                  <p className="text-sm text-gray-500">Product & Lifestyle shots</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </GenericFooterPage>
  );
};

export default MediaKit;
