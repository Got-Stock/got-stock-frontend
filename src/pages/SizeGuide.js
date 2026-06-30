import React from 'react';
import GenericFooterPage from './GenericFooterPage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const SizeGuide = () => {
  return (
    <GenericFooterPage 
      title="Size Guide" 
      subtitle="Find your perfect fit"
    >
      <div className="space-y-8">
        <p className="text-gray-700 text-center max-w-2xl mx-auto">
          Use the charts below to determine your size. If you are between sizes, we recommend sizing up for a looser fit or sizing down for a tighter fit.
        </p>

        <Tabs defaultValue="women" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="women">Women</TabsTrigger>
            <TabsTrigger value="men">Men</TabsTrigger>
            <TabsTrigger value="kids">Kids</TabsTrigger>
          </TabsList>

          <TabsContent value="women">
            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Size</th>
                    <th className="px-6 py-3">Bust (cm)</th>
                    <th className="px-6 py-3">Waist (cm)</th>
                    <th className="px-6 py-3">Hips (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b">
                    <td className="px-6 py-4 font-medium text-gray-900">XS (6)</td>
                    <td className="px-6 py-4">78-82</td>
                    <td className="px-6 py-4">60-64</td>
                    <td className="px-6 py-4">86-90</td>
                  </tr>
                  <tr className="bg-gray-50 border-b">
                    <td className="px-6 py-4 font-medium text-gray-900">S (8)</td>
                    <td className="px-6 py-4">82-86</td>
                    <td className="px-6 py-4">64-68</td>
                    <td className="px-6 py-4">90-94</td>
                  </tr>
                  <tr className="bg-white border-b">
                    <td className="px-6 py-4 font-medium text-gray-900">M (10)</td>
                    <td className="px-6 py-4">86-90</td>
                    <td className="px-6 py-4">68-72</td>
                    <td className="px-6 py-4">94-98</td>
                  </tr>
                  <tr className="bg-gray-50 border-b">
                    <td className="px-6 py-4 font-medium text-gray-900">L (12)</td>
                    <td className="px-6 py-4">90-96</td>
                    <td className="px-6 py-4">72-78</td>
                    <td className="px-6 py-4">98-104</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-gray-900">XL (14)</td>
                    <td className="px-6 py-4">96-102</td>
                    <td className="px-6 py-4">78-84</td>
                    <td className="px-6 py-4">104-110</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="men">
            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Size</th>
                    <th className="px-6 py-3">Chest (cm)</th>
                    <th className="px-6 py-3">Waist (cm)</th>
                    <th className="px-6 py-3">Neck (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b">
                    <td className="px-6 py-4 font-medium text-gray-900">S</td>
                    <td className="px-6 py-4">91-96</td>
                    <td className="px-6 py-4">76-81</td>
                    <td className="px-6 py-4">37-38</td>
                  </tr>
                  <tr className="bg-gray-50 border-b">
                    <td className="px-6 py-4 font-medium text-gray-900">M</td>
                    <td className="px-6 py-4">96-101</td>
                    <td className="px-6 py-4">81-86</td>
                    <td className="px-6 py-4">39-40</td>
                  </tr>
                  <tr className="bg-white border-b">
                    <td className="px-6 py-4 font-medium text-gray-900">L</td>
                    <td className="px-6 py-4">101-106</td>
                    <td className="px-6 py-4">86-91</td>
                    <td className="px-6 py-4">41-42</td>
                  </tr>
                  <tr className="bg-gray-50 border-b">
                    <td className="px-6 py-4 font-medium text-gray-900">XL</td>
                    <td className="px-6 py-4">106-111</td>
                    <td className="px-6 py-4">91-96</td>
                    <td className="px-6 py-4">43-44</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="kids">
            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Age (Years)</th>
                    <th className="px-6 py-3">Height (cm)</th>
                    <th className="px-6 py-3">Chest (cm)</th>
                    <th className="px-6 py-3">Waist (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b">
                    <td className="px-6 py-4 font-medium text-gray-900">2-3</td>
                    <td className="px-6 py-4">92-98</td>
                    <td className="px-6 py-4">54-55</td>
                    <td className="px-6 py-4">51-52</td>
                  </tr>
                  <tr className="bg-gray-50 border-b">
                    <td className="px-6 py-4 font-medium text-gray-900">3-4</td>
                    <td className="px-6 py-4">98-104</td>
                    <td className="px-6 py-4">55-57</td>
                    <td className="px-6 py-4">52-53</td>
                  </tr>
                  <tr className="bg-white border-b">
                    <td className="px-6 py-4 font-medium text-gray-900">5-6</td>
                    <td className="px-6 py-4">110-116</td>
                    <td className="px-6 py-4">59-61</td>
                    <td className="px-6 py-4">55-57</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GenericFooterPage>
  );
};

export default SizeGuide;
