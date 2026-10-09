import React, { useState, useRef, useEffect } from 'react';
import plantifyApi from '../services/plantifyApi';

export default function PlantHealthAnalysis({
  plants = [],
  initialPlant = null,
  onNavigateToChat,
  onBack,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(initialPlant || null);
  const [customPlantName, setCustomPlantName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [report, setReport] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [aiConfigured, setAiConfigured] = useState(true);

  const fileInputRef = useRef(null);
  const resultsRef = useRef(null);

  // Check AI provider status on mount
  useEffect(() => {
    let isMounted = true;
    plantifyApi.getAiStatus()
      .then((res) => {
        if (isMounted && res) {
          setAiConfigured(res.configured);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Update selected plant if initialPlant prop changes
  useEffect(() => {
    if (initialPlant) {
      setSelectedPlant(initialPlant);
    }
  }, [initialPlant]);

  // Animated analysis step indicator
  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      setAnalysisStep(0);
      interval = setInterval(() => {
        setAnalysisStep((prev) => (prev + 1) % 3);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Clean up object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileSelection = (file) => {
    if (!file) return;

    setErrorMessage('');
    setReport(null);

    // 1. Format validation
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMessage('Unsupported file format. Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    // 2. Size validation (max 5 MB)
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMessage('File size exceeds 5 MB. Please upload a smaller image.');
      return;
    }

    if (file.size === 0) {
      setErrorMessage('The selected file is empty. Please select a valid photo.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    setReport(null);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || isAnalyzing) return;

    setIsAnalyzing(true);
    setErrorMessage('');

    try {
      const result = await plantifyApi.analyzePlantHealth({
        imageFile: selectedFile,
        plantId: selectedPlant ? selectedPlant.id : null,
        plantName: selectedPlant ? selectedPlant.name : (customPlantName.trim() || null),
      });

      setReport(result);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err) {
      const msg = err.message || 'Unable to complete health analysis. Please verify server connection.';
      setErrorMessage(msg);
      if (msg.toLowerCase().includes('not configured') || msg.toLowerCase().includes('api_key')) {
        setAiConfigured(false);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityBadge = (severity) => {
    const s = (severity || '').toLowerCase();
    if (s === 'low') {
      return {
        icon: '🟢',
        label: 'Low Severity',
        desc: 'Minor or cosmetic issue; plant is likely to recover with basic adjustments.',
        bg: '#E8F5E9',
        color: '#2E7D32',
        border: '#A5D6A7',
      };
    } else if (s === 'moderate') {
      return {
        icon: '🟡',
        label: 'Moderate Severity',
        desc: 'Active stress or pest presence detected; corrective treatment recommended.',
        bg: '#FEF3C7',
        color: '#92400E',
        border: '#FCD34D',
      };
    } else if (s === 'high') {
      return {
        icon: '🔴',
        label: 'High Severity',
        desc: 'Significant damage or systemic decline; urgent phytosanitary intervention required.',
        bg: '#FEE2E2',
        color: '#991B1B',
        border: '#FCA5A5',
      };
    } else {
      return {
        icon: '⚪',
        label: 'Inconclusive Severity',
        desc: 'Cannot conclusively evaluate severity from visible image area.',
        bg: '#F1F5F9',
        color: '#475569',
        border: '#CBD5E1',
      };
    }
  };

  const getOverallHealthBadge = (health) => {
    const h = (health || '').toLowerCase();
    if (h === 'healthy') {
      return { label: '✓ Apparently Healthy', bg: '#DCFCE7', color: '#166534' };
    } else if (h === 'possible_issue') {
      return { label: '⚠️ Possible Issue Detected', bg: '#FEF9C3', color: '#854D0E' };
    } else {
      return { label: '❓ Inconclusive Assessment', bg: '#F1F5F9', color: '#475569' };
    }
  };

  const analysisSteps = [
    '🔍 Inspecting foliage for chlorosis, lesions, and leaf distortion...',
    '🔬 Analyzing pest patterns, necrotic spots, and margins...',
    '🌿 Cross-referencing botanical pathology standards & generating care plan...',
  ];

  return (
    <div style={{ backgroundColor: '#F4F7F4', minHeight: 'calc(100vh - 80px)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Navigation & Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#FFFFFF',
                  border: '1px solid #D1DDD6',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '0.875rem',
                  color: 'var(--color-forest)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                ← Back to Catalog
              </button>
            )}
            <div>
              <h1 style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'var(--color-forest)',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                🔬 AI Plant Health &amp; Disease Diagnosis
              </h1>
              <p style={{ margin: '2px 0 0', fontSize: '0.875rem', color: '#556960' }}>
                Upload a clear leaf or plant photograph to detect symptoms, diseases, and recovery steps
              </p>
            </div>
          </div>

          {onNavigateToChat && (
            <button
              type="button"
              onClick={() => onNavigateToChat(selectedPlant || null)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #B7D1C2',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.85rem',
                color: 'var(--color-forest)',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>💬</span> Switch to Care Chat
            </button>
          )}
        </div>

        {/* Server Configuration Notice Banner (if unconfigured) */}
        {!aiConfigured && (
          <div style={{
            backgroundColor: '#FEF3C7',
            border: '1px solid #FCD34D',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '1.25rem',
            color: '#92400E',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
          }}>
            <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>⚙️</span>
            <div style={{ flex: 1 }}>
              <strong>AI Service Configuration Required:</strong>
              <div style={{ marginTop: '2px' }}>
                The backend server requires an <code>AI_API_KEY</code> (Google Gemini multimodal model) environment variable.
                Once configured, live visual inference and phytosanitary symptom diagnosis will run automatically.
              </div>
            </div>
          </div>
        )}

        {/* Upload Container Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E1E8E4',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          padding: '1.75rem',
          marginBottom: '1.5rem',
        }}>

          {/* Plant Hint / Context (Optional) */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '1.25rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid #EDF2EF',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                Catalog Plant Match (Optional):
              </span>
              <select
                value={selectedPlant ? selectedPlant.id : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) {
                    setSelectedPlant(null);
                  } else {
                    const found = plants.find((p) => String(p.id) === String(val));
                    setSelectedPlant(found || null);
                  }
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.85rem',
                  backgroundColor: '#F8FAFC',
                  outline: 'none',
                }}
              >
                <option value="">Auto-identify from photograph</option>
                {plants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.category ? `(${p.category})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {!selectedPlant && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Or type name:</span>
                <input
                  type="text"
                  placeholder="e.g. Fiddle Leaf Fig"
                  value={customPlantName}
                  onChange={(e) => setCustomPlantName(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    outline: 'none',
                    width: '180px',
                  }}
                />
              </div>
            )}
          </div>

          {/* Dropzone / Upload Area */}
          {!imagePreview ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Upload plant leaf photograph"
              style={{
                border: isDragging ? '2px dashed var(--color-forest)' : '2px dashed #CBD5E1',
                backgroundColor: isDragging ? '#E8F0EC' : '#FAFCFA',
                borderRadius: '12px',
                padding: '3rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#E8F5E9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
              }}>
                📷
              </div>

              <div>
                <strong style={{ fontSize: '1rem', color: 'var(--color-forest)' }}>
                  Drag &amp; drop a clear plant photo here, or click to browse
                </strong>
                <p style={{ margin: '6px 0 0', fontSize: '0.825rem', color: '#64748B' }}>
                  Supported formats: <strong>JPEG, PNG, WebP</strong> (Max file size: <strong>5 MB</strong>)
                </p>
              </div>

              <div style={{
                display: 'inline-block',
                marginTop: '6px',
                padding: '6px 16px',
                backgroundColor: 'var(--color-forest)',
                color: '#FFFFFF',
                borderRadius: '20px',
                fontSize: '0.825rem',
                fontWeight: 600,
              }}>
                Select File
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelection(e.target.files[0]);
                  }
                }}
              />
            </div>
          ) : (
            /* Image Preview Area */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              backgroundColor: '#FAFCFA',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #E1E8E4',
            }}>
              <div style={{
                position: 'relative',
                maxHeight: '360px',
                overflow: 'hidden',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}>
                <img
                  src={imagePreview}
                  alt="Selected plant specimen"
                  style={{
                    maxHeight: '360px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>

              {selectedFile && (
                <div style={{
                  fontSize: '0.85rem',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <span><strong>File:</strong> {selectedFile.name}</span>
                  <span>•</span>
                  <span><strong>Size:</strong> {(selectedFile.size / 1024).toFixed(1)} KB</span>
                </div>
              )}

              {/* Action Buttons for Preview */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: '#334155',
                    cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                  }}
                >
                  🔄 Replace Photo
                </button>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isAnalyzing}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #FCA5A5',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: '#DC2626',
                    cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                  }}
                >
                  ✕ Remove
                </button>

                  <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  style={{
                    padding: '8px 24px',
                    backgroundColor: isAnalyzing ? '#94A3B8' : 'var(--color-amber)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#FFFFFF',
                    cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 6px rgba(204, 85, 0, 0.25)',
                  }}
                >
                  <span>🔬</span>
                  <span>{isAnalyzing ? 'Analyzing Image...' : 'Analyze Plant Health Now'}</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelection(e.target.files[0]);
                  }
                }}
              />
            </div>
          )}

          {/* Loading Animation Area */}
          {isAnalyzing && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1.25rem',
              backgroundColor: '#F8FAF8',
              borderRadius: '12px',
              border: '1px solid #D1DDD6',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                border: '3px solid #5B8266',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                  Visual Diagnostic Engine Active
                </div>
                <div style={{ fontSize: '0.825rem', color: '#556960', marginTop: '2px' }}>
                  {analysisSteps[analysisStep]}
                </div>
              </div>
            </div>
          )}

          {/* Error Banner with Retry */}
          {errorMessage && (
            <div style={{
              marginTop: '1.25rem',
              padding: '12px 16px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              color: '#991B1B',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
              {selectedFile && (
                <button
                  type="button"
                  onClick={handleAnalyze}
                  style={{
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Retry Analysis
                </button>
              )}
            </div>
          )}

        </div>

        {/* Diagnostic Results Report (Appears Only After Successful Analysis) */}
        {report && (
          <div ref={resultsRef} style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E1E8E4',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            padding: '2rem',
            marginBottom: '1.5rem',
          }}>

            {/* Report Header Bar */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid #EDF2EF',
              marginBottom: '1.5rem',
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  PHYTOSANITARY ASSESSMENT REPORT
                </span>
                <h2 style={{
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  color: 'var(--color-forest)',
                  margin: '4px 0 0',
                }}>
                  {report.plantIdentification || 'Plant Specimen'}
                </h2>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {/* Overall Health Pill */}
                {(() => {
                  const h = getOverallHealthBadge(report.overallHealth);
                  return (
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      backgroundColor: h.bg,
                      color: h.color,
                      fontSize: '0.825rem',
                      fontWeight: 700,
                    }}>
                      {h.label}
                    </span>
                  );
                })()}

                {/* Severity Badge */}
                {(() => {
                  const s = getSeverityBadge(report.severity);
                  return (
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      backgroundColor: s.bg,
                      color: s.color,
                      border: `1px solid ${s.border}`,
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <span>{s.icon}</span>
                      <span>{s.label}</span>
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Severity Explanation Banner */}
            {report.severityExplanation && (
              <div style={{
                backgroundColor: '#F8FAF8',
                borderLeft: '4px solid var(--color-forest)',
                padding: '10px 14px',
                borderRadius: '0 8px 8px 0',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                color: '#334155',
              }}>
                <strong>Clinical Severity Assessment:</strong> {report.severityExplanation}
              </div>
            )}

            {/* Main Report Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>

              {/* Card 1: Observed Symptoms */}
              <div style={{
                backgroundColor: '#FAFCFA',
                borderRadius: '12px',
                padding: '1.25rem',
                border: '1px solid #E1E8E4',
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--color-forest)',
                  margin: '0 0 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span>🔍</span> Observed Visual Symptoms
                </h3>
                {report.symptoms && report.symptoms.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem', color: '#334155', lineHeight: 1.6 }}>
                    {report.symptoms.map((sym, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{sym}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B' }}>
                    No significant physical damage or foliar symptoms observed.
                  </p>
                )}
              </div>

              {/* Card 2: Likely Conditions / Diagnoses */}
              <div style={{
                backgroundColor: '#FAFCFA',
                borderRadius: '12px',
                padding: '1.25rem',
                border: '1px solid #E1E8E4',
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--color-forest)',
                  margin: '0 0 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span>🔬</span> Possible Conditions &amp; Stress Factors
                </h3>
                {report.possibleConditions && report.possibleConditions.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {report.possibleConditions.map((cond, idx) => (
                      <div key={idx} style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        padding: '10px 12px',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--color-forest)' }}>{cond.name}</strong>
                          {cond.confidence && (
                            <span style={{
                              fontSize: '0.725rem',
                              backgroundColor: '#E8F5E9',
                              color: '#2E7D32',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontWeight: 600,
                            }}>
                              {cond.confidence}
                            </span>
                          )}
                        </div>
                        <p style={{ margin: 0, fontSize: '0.825rem', color: '#475569', lineHeight: 1.45 }}>
                          {cond.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B' }}>
                    No specific pathogen or physiological disorder indicated.
                  </p>
                )}
              </div>

              {/* Card 3: Practical Treatment Steps */}
              <div style={{
                backgroundColor: '#FAFCFA',
                borderRadius: '12px',
                padding: '1.25rem',
                border: '1px solid #E1E8E4',
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--color-forest)',
                  margin: '0 0 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span>🌱</span> Recommended Treatment Steps
                </h3>
                {report.treatment && report.treatment.length > 0 ? (
                  <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem', color: '#334155', lineHeight: 1.6 }}>
                    {report.treatment.map((step, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{step}</li>
                    ))}
                  </ol>
                ) : (
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B' }}>
                    Maintain normal care routine as advised in catalog.
                  </p>
                )}
              </div>

              {/* Card 4: Long-Term Prevention */}
              <div style={{
                backgroundColor: '#FAFCFA',
                borderRadius: '12px',
                padding: '1.25rem',
                border: '1px solid #E1E8E4',
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--color-forest)',
                  margin: '0 0 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span>🛡️</span> Preventative Plant Care
                </h3>
                {report.prevention && report.prevention.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem', color: '#334155', lineHeight: 1.6 }}>
                    {report.prevention.map((prev, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{prev}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B' }}>
                    Inspect foliage periodically and verify drainage holes are unblocked.
                  </p>
                )}
              </div>

            </div>

            {/* Diagnostic Limitations & Follow-Up Questions Section */}
            <div style={{
              marginTop: '1.5rem',
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '12px',
              padding: '1.25rem',
            }}>
              <h4 style={{
                margin: '0 0 8px',
                fontSize: '0.9rem',
                color: '#92400E',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span>⚠️</span> Diagnostic Caveats &amp; Key Follow-up Questions
              </h4>

              {report.followUpQuestions && report.followUpQuestions.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#78350F', marginBottom: '4px' }}>
                    Important questions to narrow down the diagnosis:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.825rem', color: '#92400E' }}>
                    {report.followUpQuestions.map((q, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {report.limitations && report.limitations.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.8rem', color: '#B45309' }}>
                  {report.limitations.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #EDF2EF',
            }}>
              <button
                type="button"
                onClick={handleRemoveImage}
                style={{
                  padding: '10px 18px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                }}
              >
                🔄 Analyze Another Plant
              </button>

              {onNavigateToChat && (
                <button
                  type="button"
                  onClick={() => onNavigateToChat({
                    id: selectedPlant ? selectedPlant.id : null,
                    name: report.plantIdentification || selectedPlant?.name || 'Diagnosed Plant',
                  })}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'var(--color-amber)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 6px rgba(204, 85, 0, 0.25)',
                  }}
                >
                  <span>💬</span> Ask AI Botanist Follow-up Questions →
                </button>
              )}
            </div>

          </div>
        )}

        {/* Botanical Advisory Disclaimer Footer */}
        <div style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#6C757D',
          lineHeight: 1.4,
        }}>
          ⚠️ <em>Botanical Advisory Disclaimer:</em> Plantify AI Health Diagnosis provides educational guidance based on visible leaf symptoms. It does not replace certified laboratory phytosanitary or soil microbiological analysis.
        </div>

      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
