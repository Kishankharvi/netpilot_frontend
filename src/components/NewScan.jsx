"use client"

import { useState } from "react"
import { Scan, Target, Settings, Info } from "lucide-react"

const NewScan = ({ onStartScan, loading }) => {
  const [scanForm, setScanForm] = useState({
    target: "",
    scanType: "basic",
    description: "",
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!scanForm.target.trim()) {
      newErrors.target = "Target is required"
    } else {
      let cleanTarget = scanForm.target.trim()
      
      // Extract domain/IP from URL if needed
      if (cleanTarget.includes('://')) {
        try {
          const url = new URL(cleanTarget)
          cleanTarget = url.hostname
        } catch (e) {
          newErrors.target = "Invalid URL format"
          setErrors(newErrors)
          return false
        }
      } else if (cleanTarget.includes('/')) {
        cleanTarget = cleanTarget.split('/')[0]
      }
      
      // Validate IP address
      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
      
      // Validate domain name (more permissive)
      const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/
      
      const isValidIP = ipRegex.test(cleanTarget)
      const isValidDomain = domainRegex.test(cleanTarget) && cleanTarget.includes('.')
      
      if (!isValidIP && !isValidDomain) {
        newErrors.target = "Please enter a valid IP address, domain name, or URL"
      }
      
      // Additional check for domain length
      if (isValidDomain && cleanTarget.length > 253) {
        newErrors.target = "Domain name is too long"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onStartScan(scanForm)
    }
  }

  const handleInputChange = (field, value) => {
    setScanForm((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const scanTypes = [
    {
      value: "basic",
      label: "Basic Scan",
      description: "Quick vulnerability assessment with essential security checks",
      duration: "2-5 minutes",
      coverage: "Common ports and services",
    },
    {
      value: "comprehensive",
      label: "Comprehensive Scan",
      description: "Thorough security evaluation with extended vulnerability detection",
      duration: "10-15 minutes",
      coverage: "All ports and advanced service enumeration",
    },
    {
      value: "stealth",
      label: "Stealth Scan",
      description: "Low-profile scanning approach with minimal network footprint",
      duration: "5-8 minutes",
      coverage: "Critical vulnerabilities only",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Target className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold">Start New Penetration Test</h2>
            <p className="text-gray-600">Configure and launch an automated vulnerability assessment</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Target Input */}
          <div className="space-y-2">
            <label htmlFor="target" className="block text-sm font-medium text-gray-700">
              Target IP Address, Domain, or URL *
            </label>
            <input
              id="target"
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.target ? "border-red-500" : "border-gray-300"}`}
              placeholder="192.168.1.1, scanme.nmap.org, or https://example.com"
              value={scanForm.target}
              onChange={(e) => handleInputChange("target", e.target.value)}
            />
            {errors.target && <p className="text-sm text-red-600">{errors.target}</p>}
            <p className="text-xs text-gray-500">
              Enter a valid IP address, domain name (like scanme.nmap.org), or full URL. The domain/IP will be extracted automatically.
            </p>
          </div>

          {/* Scan Type Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Scan Type *</label>
            <div className="grid gap-4">
              {scanTypes.map((type) => (
                <div
                  key={type.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    scanForm.scanType === type.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleInputChange("scanType", type.value)}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="scanType"
                      value={type.value}
                      checked={scanForm.scanType === type.value}
                      onChange={(e) => handleInputChange("scanType", e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{type.label}</h4>
                        <Settings className="h-4 w-4 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Duration: {type.duration}</span>
                        <span>Coverage: {type.coverage}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              id="description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Brief description of the scan purpose or additional notes..."
              value={scanForm.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <button 
              type="button" 
              disabled={loading} 
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Starting Scan...
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4" />
                  Start Penetration Test
                </>
              )}
            </button>

            {!loading && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info className="h-4 w-4" />
                <span>Scan will begin immediately after submission</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Information Panel */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Important Information</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Only scan systems you own or have explicit permission to test</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>URLs will be automatically parsed to extract the target domain or IP</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Popular test targets: scanme.nmap.org, testphp.vulnweb.com</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Scans are performed using simulated vulnerability detection for demonstration purposes</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Results will be analyzed using AI to provide intelligent recommendations</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>All scan data is automatically cleaned up after 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewScan