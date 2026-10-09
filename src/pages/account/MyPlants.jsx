import React, { useState, useEffect } from 'react';
import plantifyApi from '../../services/plantifyApi';
import PlantImage from '../../components/PlantImage';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

export default function MyPlants({ catalogPlants = [], onNavigateCatalog, onAskAi }) {
  const [plants, setPlants] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlacement, setFilterPlacement] = useState('ALL'); // ALL, INDOOR, OUTDOOR
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, DUE, WATERED

  // Modals state
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [plantForm, setPlantForm] = useState({
    productId: '',
    customPlantName: '',
    nickname: '',
    placement: 'INDOOR',
    growingEnvironment: 'Living Room',
    approxLocationOrClimate: '',
    potType: 'Ceramic Pot',
    hasDrainage: true,
    growingMedium: 'Well-draining potting soil',
    sunlightExposure: 'Bright Indirect',
    lastWateredDate: '',
    reportedMoistureLevel: '',
    notes: '',
  });
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete confirmation
  const [plantToDelete, setPlantToDelete] = useState(null);

  // Care Plan & Details Drawer/Modal
  const [activePlanPlant, setActivePlanPlant] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [activePlanTab, setActivePlanTab] = useState('plan'); // 'plan' | 'logs'

  // Care Logs state
  const [careLogs, setCareLogs] = useState([]);
  const [careLogsLoading, setCareLogsLoading] = useState(false);
  const [newLogForm, setNewLogForm] = useState({
    careType: 'WATERING',
    loggedDate: new Date().toISOString().split('T')[0],
    soilMoisture: 'MOIST',
    notes: '',
  });
  const [logSaving, setLogSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToastMsg({ message, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [plantsData, remindersData] = await Promise.all([
        plantifyApi.getMyPlants(),
        plantifyApi.getCareReminders().catch(() => []),
      ]);
      setPlants(plantsData || []);
      setReminders(remindersData || []);
    } catch (err) {
      console.error('Failed to load My Plants data:', err);
      setError(err.message || 'Unable to connect to plant care service.');
    } finally {
      setLoading(false);
    }
  };

  // Open Add Modal
  const handleOpenAddModal = (presetProduct = null) => {
    setEditingPlant(null);
    setPlantForm({
      productId: presetProduct ? String(presetProduct.id) : '',
      customPlantName: presetProduct ? '' : '',
      nickname: presetProduct ? `My ${presetProduct.name}` : '',
      placement: presetProduct?.environment?.toLowerCase().includes('outdoor') ? 'OUTDOOR' : 'INDOOR',
      growingEnvironment: 'Living Room',
      approxLocationOrClimate: '',
      potType: 'Ceramic Pot',
      hasDrainage: true,
      growingMedium: 'Well-draining potting soil',
      sunlightExposure: presetProduct?.light || 'Bright Indirect',
      lastWateredDate: '',
      reportedMoistureLevel: '',
      notes: '',
    });
    setFormError('');
    setShowAddEditModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (plant) => {
    setEditingPlant(plant);
    setPlantForm({
      productId: plant.productId ? String(plant.productId) : '',
      customPlantName: plant.customPlantName || '',
      nickname: plant.nickname || '',
      placement: plant.placement || 'INDOOR',
      growingEnvironment: plant.growingEnvironment || '',
      approxLocationOrClimate: plant.approxLocationOrClimate || '',
      potType: plant.potType || 'Ceramic Pot',
      hasDrainage: plant.hasDrainage ?? true,
      growingMedium: plant.growingMedium || '',
      sunlightExposure: plant.sunlightExposure || '',
      lastWateredDate: plant.lastWateredDate || '',
      reportedMoistureLevel: plant.reportedMoistureLevel || '',
      notes: plant.notes || '',
    });
    setFormError('');
    setShowAddEditModal(true);
  };

  // Submit Add / Edit
  const handleSavePlant = async (e) => {
    e.preventDefault();
    if (!plantForm.nickname.trim()) {
      setFormError('Please give your plant a nickname.');
      return;
    }
    setFormSaving(true);
    setFormError('');

    try {
      const payload = {
        productId: plantForm.productId ? Number(plantForm.productId) : null,
        customPlantName: plantForm.customPlantName.trim() || null,
        nickname: plantForm.nickname.trim(),
        placement: plantForm.placement,
        growingEnvironment: plantForm.growingEnvironment.trim() || null,
        approxLocationOrClimate: plantForm.approxLocationOrClimate.trim() || null,
        potType: plantForm.potType.trim() || null,
        hasDrainage: plantForm.hasDrainage,
        growingMedium: plantForm.growingMedium.trim() || null,
        sunlightExposure: plantForm.sunlightExposure.trim() || null,
        lastWateredDate: plantForm.lastWateredDate || null,
        reportedMoistureLevel: plantForm.reportedMoistureLevel || null,
        notes: plantForm.notes.trim() || null,
      };

      if (editingPlant) {
        const updated = await plantifyApi.updatePlant(editingPlant.id, payload);
        setPlants((prev) => prev.map((p) => (p.id === editingPlant.id ? updated : p)));
        showToast(`Updated care profile for "${updated.nickname}"!`);
      } else {
        const created = await plantifyApi.createPlant(payload);
        setPlants((prev) => [created, ...prev]);
        showToast(`Added "${created.nickname}" to your plant collection!`);
      }

      setShowAddEditModal(false);
      // Refresh reminders
      plantifyApi.getCareReminders().then(setReminders).catch(() => {});
    } catch (err) {
      setFormError(err.message || 'Failed to save plant profile.');
    } finally {
      setFormSaving(false);
    }
  };

  // Delete Plant
  const handleDeletePlant = async () => {
    if (!plantToDelete) return;
    try {
      await plantifyApi.deletePlant(plantToDelete.id);
      setPlants((prev) => prev.filter((p) => p.id !== plantToDelete.id));
      showToast(`Removed "${plantToDelete.nickname}" from collection.`);
      setPlantToDelete(null);
      if (activePlanPlant?.id === plantToDelete.id) {
        setActivePlanPlant(null);
      }
    } catch (err) {
      showToast(err.message || 'Failed to remove plant.', 'error');
    }
  };

  // Quick Water Button
  const handleQuickWater = async (plant, e) => {
    e.stopPropagation();
    try {
      const today = new Date().toISOString().split('T')[0];
      await plantifyApi.addCareLog(plant.id, {
        careType: 'WATERING',
        loggedDate: today,
        soilMoisture: 'MOIST',
        notes: 'Quick logged watering',
      });

      // Update plant in local state
      const updated = await plantifyApi.getPlantById(plant.id);
      setPlants((prev) => prev.map((p) => (p.id === plant.id ? updated : p)));

      // Refresh reminders
      plantifyApi.getCareReminders().then(setReminders).catch(() => {});
      showToast(`Watering logged for "${plant.nickname}"! 💧`);
    } catch (err) {
      showToast(err.message || 'Could not record watering.', 'error');
    }
  };

  // Open Care Plan & Logs Modal
  const handleOpenCarePlan = async (plant) => {
    setActivePlanPlant(plant);
    setActivePlanTab('plan');
    setRecommendationsLoading(true);
    setCareLogsLoading(true);

    try {
      const recs = await plantifyApi.getPlantRecommendations(plant.id);
      setRecommendations(recs);
    } catch (err) {
      console.error('Failed to load care plan:', err);
    } finally {
      setRecommendationsLoading(false);
    }

    try {
      const logs = await plantifyApi.getCareLogs(plant.id);
      setCareLogs(logs || []);
    } catch (err) {
      console.error('Failed to load care logs:', err);
    } finally {
      setCareLogsLoading(false);
    }
  };

  // Add Care Log inside modal
  const handleAddCareLog = async (e) => {
    e.preventDefault();
    if (!activePlanPlant) return;
    setLogSaving(true);
    try {
      const log = await plantifyApi.addCareLog(activePlanPlant.id, newLogForm);
      setCareLogs((prev) => [log, ...prev]);

      // If watering was logged, update plant info
      if (newLogForm.careType === 'WATERING') {
        const refreshedPlant = await plantifyApi.getPlantById(activePlanPlant.id);
        setActivePlanPlant(refreshedPlant);
        setPlants((prev) => prev.map((p) => (p.id === refreshedPlant.id ? refreshedPlant : p)));
        // Refresh recommendations
        const updatedRecs = await plantifyApi.getPlantRecommendations(refreshedPlant.id);
        setRecommendations(updatedRecs);
      }

      setNewLogForm({
        careType: 'WATERING',
        loggedDate: new Date().toISOString().split('T')[0],
        soilMoisture: 'MOIST',
        notes: '',
      });
      showToast('Care event recorded successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to record care event.', 'error');
    } finally {
      setLogSaving(false);
    }
  };

  // Delete Care Log
  const handleDeleteCareLog = async (logId) => {
    if (!activePlanPlant) return;
    try {
      await plantifyApi.deleteCareLog(activePlanPlant.id, logId);
      setCareLogs((prev) => prev.filter((l) => l.id !== logId));
      showToast('Care log deleted.');
    } catch (err) {
      showToast(err.message || 'Failed to delete care log.', 'error');
    }
  };

  // Complete Reminder
  const handleCompleteReminder = async (reminderId) => {
    try {
      await plantifyApi.updateReminderStatus(reminderId, 'COMPLETED');
      setReminders((prev) => prev.filter((r) => r.id !== reminderId));
      showToast('Reminder marked as completed! ✓');
    } catch (err) {
      showToast(err.message || 'Failed to update reminder.', 'error');
    }
  };

  // Filter Plants
  const filteredPlants = plants.filter((plant) => {
    const matchesSearch =
      plant.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plant.productName && plant.productName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (plant.growingEnvironment && plant.growingEnvironment.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPlacement =
      filterPlacement === 'ALL' || plant.placement === filterPlacement;

    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'DUE' && (plant.wateringStatus === 'Check Soil' || plant.wateringStatus === 'Watering Due')) ||
      (filterStatus === 'WATERED' && (plant.wateringStatus === 'Recently Watered' || plant.wateringStatus === 'Hydrated'));

    return matchesSearch && matchesPlacement && matchesStatus;
  });

  // Watering status badge styling helper
  const renderWateringBadge = (status) => {
    switch (status) {
      case 'Recently Watered':
        return <Badge variant="green">✨ Recently Watered</Badge>;
      case 'Watering Due':
        return <Badge variant="blue">💧 Watering Due</Badge>;
      case 'Overwatering Warning':
        return <Badge variant="red">⚠️ Overwatering Warning</Badge>;
      case 'Check Soil':
        return <Badge variant="amber">🔍 Check Soil</Badge>;
      case 'Check Due Soon':
        return <Badge variant="amber">⏳ Check Due Soon</Badge>;
      default:
        return <Badge variant="neutral">🌱 {status || 'Hydrated'}</Badge>;
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-xl) var(--space-md)' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div
          role="status"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: toastMsg.type === 'error' ? '#EF4444' : 'var(--color-forest)',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
          }}
        >
          <span>{toastMsg.type === 'error' ? '⚠️' : '✓'}</span>
          <span>{toastMsg.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)',
          paddingBottom: 'var(--space-lg)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-forest)', marginBottom: '8px' }}>
            🌿 My Plants &amp; Botanical Care
          </h1>
          <p style={{ color: 'var(--color-charcoal-muted)', fontSize: 'var(--text-base)', maxWidth: '650px' }}>
            Personalized, rule-based care schedules tailored to your home environment, pot drainage, and current weather. Never guess watering again.
          </p>
        </div>

        <Button variant="accent" size="md" onClick={() => handleOpenAddModal()}>
          + Add Plant to Collection
        </Button>
      </div>

      {/* Stats Summary Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: 'var(--space-lg)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Plant Collection
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-forest)', marginTop: '4px' }}>
            {plants.length}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: 'var(--space-lg)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Soil Checks Due Today
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: '#D97706', marginTop: '4px' }}>
            {plants.filter((p) => p.wateringStatus === 'Check Soil' || p.wateringStatus === 'Watering Due').length}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: 'var(--space-lg)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Pending Care Reminders
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-sage)', marginTop: '4px' }}>
            {reminders.filter((r) => r.status === 'PENDING').length}
          </div>
        </div>
      </div>

      {/* Active Care Reminders Section */}
      {reminders.filter((r) => r.status === 'PENDING').length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--color-sage-pale)',
            border: '1px solid var(--color-sage-soft)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)',
            marginBottom: 'var(--space-xl)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-md)' }}>
            <span style={{ fontSize: '20px' }}>🔔</span>
            <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--color-forest)', margin: 0, fontWeight: 700 }}>
              Actionable Care Reminders ({reminders.filter((r) => r.status === 'PENDING').length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {reminders
              .filter((r) => r.status === 'PENDING')
              .map((rem) => (
                <div
                  key={rem.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                    border: rem.isOverdue ? '1px solid #FCA5A5' : '1px solid var(--color-border)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)' }}>{rem.title}</strong>
                      {rem.isOverdue && <Badge variant="red">Overdue</Badge>}
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-muted)' }}>
                      {rem.message} • Due: {rem.dueDate}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="accent" size="sm" onClick={() => handleCompleteReminder(rem.id)}>
                      ✓ Mark Completed
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-md)',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-xl)',
        }}
      >
        <div style={{ display: 'flex', gap: '10px', flex: '1 1 300px', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Search plants by nickname, species, room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontSize: 'var(--text-sm)',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={filterPlacement}
            onChange={(e) => setFilterPlacement(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontSize: 'var(--text-sm)',
              backgroundColor: '#FFFFFF',
            }}
          >
            <option value="ALL">All Environments</option>
            <option value="INDOOR">Indoor Plants</option>
            <option value="OUTDOOR">Outdoor Plants</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontSize: 'var(--text-sm)',
              backgroundColor: '#FFFFFF',
            }}
          >
            <option value="ALL">All Watering Statuses</option>
            <option value="DUE">Needs Soil Check / Water</option>
            <option value="WATERED">Recently Watered / Hydrated</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-charcoal-muted)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌱</div>
          <p>Loading your botanical collection and care recommendations...</p>
        </div>
      ) : error ? (
        <div
          style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            padding: 'var(--space-lg)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: 0 }}>{error}</p>
          <Button variant="outline" size="sm" style={{ marginTop: '12px' }} onClick={loadData}>
            Retry
          </Button>
        </div>
      ) : filteredPlants.length === 0 ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px dashed var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '60px 20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🪴</div>
          <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-forest)', marginBottom: '8px' }}>
            {plants.length === 0 ? 'Your plant collection is empty' : 'No plants match your search filters'}
          </h3>
          <p style={{ color: 'var(--color-charcoal-muted)', fontSize: 'var(--text-sm)', maxWidth: '450px', margin: '0 auto 24px' }}>
            {plants.length === 0
              ? 'Add plants from our curated catalog or create custom entries for your existing household plants to receive personalized watering reminders and scientific care guidance.'
              : 'Try clearing your search query or selecting a different environment filter.'}
          </p>
          {plants.length === 0 ? (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="accent" size="md" onClick={() => handleOpenAddModal()}>
                + Add Your First Plant
              </Button>
              {onNavigateCatalog && (
                <Button variant="outline" size="md" onClick={onNavigateCatalog}>
                  🌿 Browse Plant Catalog
                </Button>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setFilterPlacement('ALL');
                setFilterStatus('ALL');
              }}
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        /* Plant Cards Grid */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 'var(--space-lg)',
          }}
        >
          {filteredPlants.map((plant) => (
            <div
              key={plant.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              {/* Card Header with Image and Placement */}
              <div style={{ position: 'relative', height: '180px', backgroundColor: 'var(--color-off-white)' }}>
                {plant.productImage ? (
                  <PlantImage
                    src={plant.productImage}
                    alt={plant.nickname}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '64px',
                      background: 'linear-gradient(135deg, var(--color-sage-pale) 0%, #FFFFFF 100%)',
                    }}
                  >
                    🌿
                  </div>
                )}

                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <Badge variant={plant.placement === 'OUTDOOR' ? 'blue' : 'green'}>
                    {plant.placement === 'OUTDOOR' ? '🌿 Outdoor' : '🏠 Indoor'}
                  </Badge>
                </div>

                {!plant.hasDrainage && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <Badge variant="red" title="No drainage hole — root rot risk">
                      ⚠️ No Drainage
                    </Badge>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div style={{ padding: 'var(--space-lg)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-forest)', margin: '0 0 4px', fontWeight: 700 }}>
                    {plant.nickname}
                  </h3>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-muted)' }}>
                    {plant.productName || plant.customPlantName || 'Botanical Specimen'}
                    {plant.scientificName && <em> ({plant.scientificName})</em>}
                  </div>
                </div>

                {/* Status and Environment Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 'var(--space-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-light)' }}>Watering Status:</span>
                    {renderWateringBadge(plant.wateringStatus)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-light)' }}>Location/Room:</span>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-charcoal)' }}>
                      {plant.growingEnvironment || 'Living Space'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-light)' }}>Next Soil Check:</span>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-forest)' }}>
                      {plant.nextCheckDate || 'Today'}
                    </span>
                  </div>

                  {plant.daysSinceWatered !== null && plant.daysSinceWatered !== undefined && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-light)' }}>Last Watered:</span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal)' }}>
                        {plant.daysSinceWatered === 0 ? 'Today' : `${plant.daysSinceWatered} day(s) ago`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ marginTop: 'auto', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <Button
                      variant="primary"
                      size="sm"
                      style={{ flex: 1 }}
                      onClick={() => handleOpenCarePlan(plant)}
                    >
                      📋 Care Plan &amp; Logs
                    </Button>
                    <Button
                      variant="accent"
                      size="sm"
                      title="Quick log watering for today"
                      onClick={(e) => handleQuickWater(plant, e)}
                    >
                      💧 Water
                    </Button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(plant)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-charcoal-muted)',
                        fontSize: 'var(--text-xs)',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      ✏️ Edit Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlantToDelete(plant)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#EF4444',
                        fontSize: 'var(--text-xs)',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD / EDIT PLANT MODAL */}
      {/* ========================================================= */}
      {showAddEditModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: 'var(--space-md)',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 'var(--space-xl)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-forest)', margin: 0 }}>
                {editingPlant ? `Edit ${editingPlant.nickname}` : 'Add Plant to Collection'}
              </h2>
              <button
                type="button"
                onClick={() => setShowAddEditModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-charcoal-muted)' }}
              >
                ✕
              </button>
            </div>

            {formError && (
              <div
                style={{
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  color: '#B91C1C',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-md)',
                  fontSize: 'var(--text-xs)',
                }}
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleSavePlant}>
              {/* Plant selection: catalog or custom */}
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '6px' }}>
                  Select from Plantify Catalog (Optional)
                </label>
                <select
                  value={plantForm.productId}
                  onChange={(e) => {
                    const selId = e.target.value;
                    const matched = catalogPlants.find((p) => String(p.id) === selId);
                    setPlantForm({
                      ...plantForm,
                      productId: selId,
                      customPlantName: matched ? '' : plantForm.customPlantName,
                      nickname: plantForm.nickname || (matched ? `My ${matched.name}` : ''),
                      sunlightExposure: matched?.light || plantForm.sunlightExposure,
                    });
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  <option value="">-- Or enter custom plant name below --</option>
                  {catalogPlants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.categoryName ? `(${p.categoryName})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {!plantForm.productId && (
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '6px' }}>
                    Custom Plant / Species Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Monstera Deliciosa, Snake Plant, Ficus Lyrata"
                    value={plantForm.customPlantName}
                    onChange={(e) => setPlantForm({ ...plantForm, customPlantName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>
              )}

              {/* Plant Nickname */}
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '6px' }}>
                  Plant Nickname *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Living Room Money Plant, Balcony Fiddle"
                  value={plantForm.nickname}
                  onChange={(e) => setPlantForm({ ...plantForm, nickname: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: 'var(--text-sm)',
                  }}
                />
              </div>

              {/* Placement & Growing Environment */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '6px' }}>
                    Placement
                  </label>
                  <select
                    value={plantForm.placement}
                    onChange={(e) => setPlantForm({ ...plantForm, placement: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    <option value="INDOOR">Indoor</option>
                    <option value="OUTDOOR">Outdoor</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '6px' }}>
                    Room / Space
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Living Room, Balcony, Bedroom Window"
                    value={plantForm.growingEnvironment}
                    onChange={(e) => setPlantForm({ ...plantForm, growingEnvironment: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>
              </div>

              {/* Pot Type & Drainage */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '6px' }}>
                    Pot Material
                  </label>
                  <select
                    value={plantForm.potType}
                    onChange={(e) => setPlantForm({ ...plantForm, potType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    <option value="Ceramic Pot">Glazed Ceramic Pot</option>
                    <option value="Terracotta / Clay">Terracotta / Porous Clay</option>
                    <option value="Plastic Nursery Pot">Plastic Nursery Pot</option>
                    <option value="Grow Bag">Fabric Grow Bag</option>
                    <option value="Metal Planter">Metal Planter</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '6px' }}>
                    Drainage Holes
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <input
                      type="checkbox"
                      id="hasDrainage"
                      checked={plantForm.hasDrainage}
                      onChange={(e) => setPlantForm({ ...plantForm, hasDrainage: e.target.checked })}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <label htmlFor="hasDrainage" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal)' }}>
                      Pot has drainage hole(s)
                    </label>
                  </div>
                </div>
              </div>

              {/* Growing Medium & Sunlight */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '6px' }}>
                    Growing Medium (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Potting soil, Perlite mix, Cactus soil"
                    value={plantForm.growingMedium}
                    onChange={(e) => setPlantForm({ ...plantForm, growingMedium: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '6px' }}>
                    Sunlight Exposure (Optional)
                  </label>
                  <select
                    value={plantForm.sunlightExposure}
                    onChange={(e) => setPlantForm({ ...plantForm, sunlightExposure: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    <option value="Bright Indirect">Bright Indirect Light</option>
                    <option value="Low to Medium Light">Low to Medium Indirect Light</option>
                    <option value="Direct Sunlight 2-4 hrs">Direct Sunlight (2-4 hrs/day)</option>
                    <option value="Direct Sunlight 6+ hrs">Direct Sunlight (6+ hrs/day)</option>
                    <option value="Artificial Grow Light">Artificial Grow Light</option>
                  </select>
                </div>
              </div>

              {/* Last Watered & Location/Climate */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '6px' }}>
                    Last Watered Date (Optional)
                  </label>
                  <input
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    value={plantForm.lastWateredDate}
                    onChange={(e) => setPlantForm({ ...plantForm, lastWateredDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '6px' }}>
                    Approx. City / Climate (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Bengaluru, Delhi, Coastal"
                    value={plantForm.approxLocationOrClimate}
                    onChange={(e) => setPlantForm({ ...plantForm, approxLocationOrClimate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '6px' }}>
                  Care Notes (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Purchased in March 2026, fertilize with seaweed extract..."
                  value={plantForm.notes}
                  onChange={(e) => setPlantForm({ ...plantForm, notes: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button variant="outline" size="md" type="button" onClick={() => setShowAddEditModal(false)}>
                  Cancel
                </Button>
                <Button variant="accent" size="md" type="submit" disabled={formSaving}>
                  {formSaving ? 'Saving...' : editingPlant ? 'Save Changes' : 'Add Plant'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================= */}
      {plantToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: 'var(--space-md)',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '450px',
              width: '100%',
              padding: 'var(--space-xl)',
              boxShadow: 'var(--shadow-xl)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗑️</div>
            <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-charcoal)', marginBottom: '8px' }}>
              Remove "{plantToDelete.nickname}"?
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-muted)', marginBottom: '24px' }}>
              This will remove this plant from your collection along with its care history and scheduled reminders. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button variant="outline" size="md" onClick={() => setPlantToDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="accent"
                size="md"
                style={{ backgroundColor: '#EF4444', borderColor: '#EF4444', color: '#FFFFFF' }}
                onClick={handleDeletePlant}
              >
                Yes, Remove Plant
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CARE PLAN & HISTORY MODAL / DRAWER */}
      {/* ========================================================= */}
      {activePlanPlant && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: 'var(--space-md)',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '850px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: 'var(--space-xl)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-lg)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-forest)', margin: 0 }}>
                    {activePlanPlant.nickname}
                  </h2>
                  {renderWateringBadge(activePlanPlant.wateringStatus)}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-muted)', marginTop: '4px' }}>
                  {activePlanPlant.productName || activePlanPlant.customPlantName} • {activePlanPlant.placement} ({activePlanPlant.growingEnvironment})
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActivePlanPlant(null)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--color-charcoal-muted)' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--space-lg)' }}>
              <button
                type="button"
                onClick={() => setActivePlanTab('plan')}
                style={{
                  padding: '10px 18px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activePlanTab === 'plan' ? '3px solid var(--color-forest)' : '3px solid transparent',
                  fontWeight: activePlanTab === 'plan' ? 700 : 500,
                  color: activePlanTab === 'plan' ? 'var(--color-forest)' : 'var(--color-charcoal-muted)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                }}
              >
                🔬 Scientific Care Plan
              </button>
              <button
                type="button"
                onClick={() => setActivePlanTab('logs')}
                style={{
                  padding: '10px 18px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activePlanTab === 'logs' ? '3px solid var(--color-forest)' : '3px solid transparent',
                  fontWeight: activePlanTab === 'logs' ? 700 : 500,
                  color: activePlanTab === 'logs' ? 'var(--color-forest)' : 'var(--color-charcoal-muted)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                }}
              >
                📝 Care Activity History ({careLogs.length})
              </button>
            </div>

            {/* TAB 1: SCIENTIFIC CARE PLAN */}
            {activePlanTab === 'plan' && (
              <div>
                {recommendationsLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-charcoal-muted)' }}>
                    <p>Generating personalized botanical care plan...</p>
                  </div>
                ) : recommendations ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    {/* Drainage alert banner */}
                    {recommendations.watering?.drainageNotice && (
                      <div
                        style={{
                          backgroundColor: '#FEF2F2',
                          border: '1px solid #F87171',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px 16px',
                          color: '#991B1B',
                          fontSize: 'var(--text-xs)',
                          lineHeight: 1.5,
                        }}
                      >
                        {recommendations.watering.drainageNotice}
                      </div>
                    )}

                    {/* Section A: Watering Recommendation */}
                    <div
                      style={{
                        backgroundColor: 'var(--color-off-white)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-lg)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h4 style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--color-forest)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          💧 Watering Guidance &amp; Schedule
                        </h4>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-muted)' }}>
                          Check Interval: ~{recommendations.watering?.checkIntervalDays} days
                        </span>
                      </div>

                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)', lineHeight: 1.6, marginBottom: '12px' }}>
                        {recommendations.watering?.wateringGuidance}
                      </p>

                      <div
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px',
                          border: '1px solid var(--color-border)',
                          marginBottom: '12px',
                        }}
                      >
                        <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-forest)', display: 'block', marginBottom: '4px' }}>
                          How to Check Soil Moisture Before Watering:
                        </strong>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-muted)', margin: 0, lineHeight: 1.5 }}>
                          {recommendations.watering?.soilMoistureMethod}
                        </p>
                      </div>

                      {/* Warning signs grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ backgroundColor: '#FEF3C7', padding: '10px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
                          <strong style={{ color: '#92400E', display: 'block', marginBottom: '4px' }}>Under-watering Signs:</strong>
                          <ul style={{ margin: 0, paddingLeft: '16px', color: '#78350F' }}>
                            {recommendations.watering?.underwateringSigns?.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        <div style={{ backgroundColor: '#FEE2E2', padding: '10px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
                          <strong style={{ color: '#B91C1C', display: 'block', marginBottom: '4px' }}>Over-watering Signs:</strong>
                          <ul style={{ margin: 0, paddingLeft: '16px', color: '#991B1B' }}>
                            {recommendations.watering?.overwateringSigns?.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Section B: Sunlight & Environment */}
                    <div
                      style={{
                        backgroundColor: 'var(--color-off-white)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-lg)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <h4 style={{ margin: '0 0 10px', fontSize: 'var(--text-base)', color: 'var(--color-forest)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ☀️ Sunlight &amp; Room Placement
                      </h4>

                      <div style={{ display: 'flex', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <Badge variant="amber">Ideal: {recommendations.sunlight?.idealLight}</Badge>
                        <Badge variant="neutral">Current: {recommendations.sunlight?.currentExposure}</Badge>
                      </div>

                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)', lineHeight: 1.6, marginBottom: '10px' }}>
                        {recommendations.sunlight?.placementGuidance}
                      </p>

                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-muted)', lineHeight: 1.5, margin: 0 }}>
                        💡 <em>{recommendations.sunlight?.transitionTips}</em>
                      </p>
                    </div>

                    {/* Section C: Soil, Drainage, Humidity */}
                    <div
                      style={{
                        backgroundColor: 'var(--color-off-white)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-lg)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <h4 style={{ margin: '0 0 12px', fontSize: 'var(--text-base)', color: 'var(--color-forest)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🌱 Soil, Humidity &amp; Seasonal Nutrition
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: 'var(--text-xs)' }}>
                        <div style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                          <strong>Recommended Substrate:</strong>
                          <p style={{ margin: '4px 0 0', color: 'var(--color-charcoal-muted)' }}>{recommendations.environment?.soilType}</p>
                        </div>
                        <div style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                          <strong>Humidity Preference:</strong>
                          <p style={{ margin: '4px 0 0', color: 'var(--color-charcoal-muted)' }}>{recommendations.environment?.humidityPreference}</p>
                        </div>
                        <div style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                          <strong>Temperature Range:</strong>
                          <p style={{ margin: '4px 0 0', color: 'var(--color-charcoal-muted)' }}>{recommendations.environment?.temperatureRange}</p>
                        </div>
                        <div style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                          <strong>Fertilizer Guidance:</strong>
                          <p style={{ margin: '4px 0 0', color: 'var(--color-charcoal-muted)' }}>{recommendations.environment?.fertilizerGuidance}</p>
                        </div>
                      </div>
                    </div>

                    {/* Weather Context callout */}
                    {recommendations.weather && (
                      <div
                        style={{
                          backgroundColor: '#F0FDF4',
                          border: '1px solid #BBF7D0',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px',
                          fontSize: 'var(--text-xs)',
                          color: '#166534',
                        }}
                      >
                        <strong>🌦️ Climate &amp; Weather Integration: </strong>
                        <span>{recommendations.weather.impactOnCare}</span>
                        {recommendations.weather.temperature && (
                          <span style={{ marginLeft: '6px' }}>({recommendations.weather.temperature}, {recommendations.weather.humidity} humidity)</span>
                        )}
                      </div>
                    )}

                    {/* AI Consultation Prompt Button */}
                    {onAskAi && (
                      <div style={{ textAlign: 'center', paddingTop: 'var(--space-md)' }}>
                        <Button
                          variant="accent"
                          size="md"
                          onClick={() => {
                            setActivePlanPlant(null);
                            onAskAi(activePlanPlant.product || { name: activePlanPlant.nickname });
                          }}
                        >
                          💬 Discuss with AI Botanist in Chat →
                        </Button>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}

            {/* TAB 2: CARE ACTIVITY HISTORY & LOGGING */}
            {activePlanTab === 'logs' && (
              <div>
                {/* New Log Form */}
                <form
                  onSubmit={handleAddCareLog}
                  style={{
                    backgroundColor: 'var(--color-off-white)',
                    padding: 'var(--space-md)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                    marginBottom: 'var(--space-lg)',
                  }}
                >
                  <h4 style={{ margin: '0 0 10px', fontSize: 'var(--text-sm)', color: 'var(--color-forest)' }}>
                    + Record Care Event
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Activity Type</label>
                      <select
                        value={newLogForm.careType}
                        onChange={(e) => setNewLogForm({ ...newLogForm, careType: e.target.value })}
                        style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--text-xs)' }}
                      >
                        <option value="WATERING">💧 Watering</option>
                        <option value="FERTILIZING">🌿 Fertilizing</option>
                        <option value="REPOTTING">🪴 Repotting</option>
                        <option value="PRUNING">✂️ Pruning</option>
                        <option value="MOISTURE_CHECK">🔍 Moisture Check</option>
                        <option value="NOTE">📝 General Note</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Date</label>
                      <input
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        value={newLogForm.loggedDate}
                        onChange={(e) => setNewLogForm({ ...newLogForm, loggedDate: e.target.value })}
                        style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--text-xs)' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Soil Moisture (Optional)</label>
                      <select
                        value={newLogForm.soilMoisture}
                        onChange={(e) => setNewLogForm({ ...newLogForm, soilMoisture: e.target.value })}
                        style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--text-xs)' }}
                      >
                        <option value="MOIST">Moist / Hydrated</option>
                        <option value="PARTIALLY_DRY">Partially Dry</option>
                        <option value="DRY">Dry</option>
                        <option value="SOGGY">Soggy / Saturated</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Optional notes: e.g. Used seaweed fertilizer, deep soak..."
                      value={newLogForm.notes}
                      onChange={(e) => setNewLogForm({ ...newLogForm, notes: e.target.value })}
                      style={{ flex: 1, padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--text-xs)' }}
                    />
                    <Button variant="primary" size="sm" type="submit" disabled={logSaving}>
                      {logSaving ? 'Saving...' : 'Add Log'}
                    </Button>
                  </div>
                </form>

                {/* Timeline History */}
                {careLogsLoading ? (
                  <p style={{ textAlign: 'center', color: 'var(--color-charcoal-muted)' }}>Loading care history...</p>
                ) : careLogs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--color-charcoal-muted)', fontSize: 'var(--text-sm)' }}>
                    No care activities recorded yet. Log your first watering above!
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {careLogs.map((log) => (
                      <div
                        key={log.id}
                        style={{
                          backgroundColor: '#FFFFFF',
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-border)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '20px' }}>
                            {log.careType === 'WATERING' && '💧'}
                            {log.careType === 'FERTILIZING' && '🌿'}
                            {log.careType === 'REPOTTING' && '🪴'}
                            {log.careType === 'PRUNING' && '✂️'}
                            {log.careType === 'MOISTURE_CHECK' && '🔍'}
                            {log.careType === 'NOTE' && '📝'}
                          </span>
                          <div>
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-charcoal)' }}>
                              {log.careType} • {log.loggedDate}
                            </div>
                            {log.notes && (
                              <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-muted)' }}>
                                {log.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteCareLog(log.id)}
                          style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '14px' }}
                          title="Delete entry"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
