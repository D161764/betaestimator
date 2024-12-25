import React from 'react';
import { FileText, X } from 'lucide-react';

interface DocumentationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Documentation({ isOpen, onClose }: DocumentationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-[#00338D] flex items-center gap-2">
            <FileText className="w-5 h-5" />
            User Guide
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 flex-1">
          <div className="prose max-w-none">
            <h2>Getting Started</h2>
            <p>
              Welcome to the KPMG SAP EMA Hub WRICEF Estimation Tool. This tool helps you estimate effort 
              for SAP WRICEF components including Workflows, Reports, Interfaces, Conversions, Enhancements, 
              Forms, Fiori apps, and Innovation & Automation initiatives.
            </p>

            <h3>Key Features</h3>
            <ul>
              <li>Create and manage work packages</li>
              <li>Estimate effort for different WRICEF components</li>
              <li>Set contingency factors and project timeline</li>
              <li>Calculate FTE requirements</li>
              <li>Export detailed reports in Excel and PDF formats</li>
            </ul>

            <h3>Creating a Work Package</h3>
            <ol>
              <li>Click the "Add Work Package" button</li>
              <li>Enter a name and optional description</li>
              <li>Set the project timeline using the slider (30-365 days)</li>
              <li>Adjust contingency factor if needed (0-50%)</li>
            </ol>

            <h3>Adding WRICEF Components</h3>
            <p>
              You can add components in two ways:
            </p>
            <ol>
              <li>
                <strong>Manual Addition:</strong>
                <ul>
                  <li>Select component type from dropdown</li>
                  <li>Click "Add Component"</li>
                  <li>Enter quantities for each complexity level</li>
                </ul>
              </li>
              <li>
                <strong>Bulk Distribution:</strong>
                <ul>
                  <li>Click the distribution icon (stacked layers)</li>
                  <li>Enter total quantities per complexity level</li>
                  <li>System will automatically distribute across components</li>
                </ul>
              </li>
            </ol>

            <h3>Effort Calculation</h3>
            <p>
              The tool calculates effort based on:
            </p>
            <ul>
              <li>Predefined base effort per complexity level</li>
              <li>Functional/Technical split ratios</li>
              <li>Role-based effort allocation:
                <ul>
                  <li>Functional: 5% Lead, 95% Consultants</li>
                  <li>Technical: 10% Architect, 90% Consultants</li>
                </ul>
              </li>
              <li>Consultant levels mapped to complexity:
                <ul>
                  <li>High → Senior Consultant</li>
                  <li>Medium → Consultant</li>
                  <li>Low → Junior Consultant</li>
                </ul>
              </li>
            </ul>

            <h3>FTE Calculation</h3>
            <p>
              FTE is calculated using the formula:
              <br />
              <code>FTE = Effort Days / Timeline Days</code>
            </p>

            <h3>Exporting Data</h3>
            <p>
              Two export options are available:
            </p>
            <ul>
              <li>
                <strong>Excel Export:</strong>
                <ul>
                  <li>Summary view with overall metrics</li>
                  <li>Detailed component breakdown</li>
                  <li>FTE analysis</li>
                </ul>
              </li>
              <li>
                <strong>PDF Report:</strong>
                <ul>
                  <li>Executive summary</li>
                  <li>Detailed effort analysis</li>
                  <li>Role-based effort allocation</li>
                  <li>FTE requirements</li>
                </ul>
              </li>
            </ul>

            <h3>Tips & Best Practices</h3>
            <ul>
              <li>Save work packages regularly using the save icon</li>
              <li>Use bulk distribution for quick initial estimates</li>
              <li>Review and adjust individual components as needed</li>
              <li>Consider project timeline impact on FTE calculations</li>
              <li>Export both Excel and PDF for different stakeholder needs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}