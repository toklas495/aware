import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ActivityDefinition } from '../../domain/activity/activity.types';
import {
  loadUserActivities,
  addActivity,
  removeActivity,
  updateActivity,
} from '../../domain/activity/activity.storage';
import './ActivityManager.css';

export function ActivityManager() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityDefinition[]>([]);
  const [newActivityLabel, setNewActivityLabel] = useState('');
  const [newActivityType, setNewActivityType] = useState<'good' | 'bad'>('good');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');
  const [editingType, setEditingType] = useState<'good' | 'bad'>('good');

  useEffect(() => {
    setActivities(loadUserActivities());
  }, []);

  const handleAdd = () => {
    if (!newActivityLabel.trim()) return;
    addActivity(newActivityLabel, newActivityType);
    setActivities(loadUserActivities());
    setNewActivityLabel('');
    setNewActivityType('good');
  };

  const handleDelete = (id: string) => {
    if (confirm('Remove this activity? It will be removed from all future days.')) {
      removeActivity(id);
      setActivities(loadUserActivities());
    }
  };

  const handleStartEdit = (activity: ActivityDefinition) => {
    setEditingId(activity.id);
    setEditingLabel(activity.label);
    setEditingType(activity.type);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingLabel.trim()) return;
    updateActivity(id, editingLabel, editingType);
    setActivities(loadUserActivities());
    setEditingId(null);
    setEditingLabel('');
    setEditingType('good');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingLabel('');
    setEditingType('good');
  };

  const goodActivities = activities.filter(a => a.type === 'good');
  const badActivities = activities.filter(a => a.type === 'bad');

  return (
    <div className="activity-manager">
      <h2>Your Activities</h2>
      <p className="manager-description">
        Define what matters to you. You decide what nourishes you and what drains you.
      </p>

      <div className="add-activity-section">
        <div className="add-activity-input">
          <input
            type="text"
            placeholder="Activity name"
            value={newActivityLabel}
            onChange={e => setNewActivityLabel(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleAdd();
              }
            }}
          />
          <select
            value={newActivityType}
            onChange={e => setNewActivityType(e.target.value as 'good' | 'bad')}
            className="type-select"
          >
            <option value="good">Good Habit</option>
            <option value="bad">Bad Habit</option>
          </select>
          <button onClick={handleAdd} className="add-button">
            Add
          </button>
        </div>
      </div>

      <div className="activities-sections">
        <div className="activity-section">
          <h3>Good Habits</h3>
          {goodActivities.length === 0 ? (
            <p className="empty-state">No good habits yet</p>
          ) : (
            goodActivities.map(activity => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                editingId={editingId}
                editingLabel={editingLabel}
                editingType={editingType}
                onStartEdit={handleStartEdit}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onDelete={handleDelete}
                setEditingLabel={setEditingLabel}
                setEditingType={setEditingType}
              />
            ))
          )}
        </div>

        <div className="activity-section">
          <h3>Bad Habits</h3>
          {badActivities.length === 0 ? (
            <p className="empty-state">No bad habits yet</p>
          ) : (
            badActivities.map(activity => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                editingId={editingId}
                editingLabel={editingLabel}
                editingType={editingType}
                onStartEdit={handleStartEdit}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onDelete={handleDelete}
                setEditingLabel={setEditingLabel}
                setEditingType={setEditingType}
              />
            ))
          )}
        </div>
      </div>

      <div className="manager-actions">
        <button onClick={() => navigate('/')}>Back</button>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  activity: ActivityDefinition;
  editingId: string | null;
  editingLabel: string;
  editingType: 'good' | 'bad';
  onStartEdit: (activity: ActivityDefinition) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
  setEditingLabel: (label: string) => void;
  setEditingType: (type: 'good' | 'bad') => void;
}

function ActivityItem({
  activity,
  editingId,
  editingLabel,
  editingType,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  setEditingLabel,
  setEditingType,
}: ActivityItemProps) {
  if (editingId === activity.id) {
    return (
      <div className="activity-item">
        <div className="activity-edit">
          <input
            type="text"
            value={editingLabel}
            onChange={e => setEditingLabel(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                onSaveEdit(activity.id);
              } else if (e.key === 'Escape') {
                onCancelEdit();
              }
            }}
            autoFocus
          />
          <select
            value={editingType}
            onChange={e => setEditingType(e.target.value as 'good' | 'bad')}
            className="type-select-small"
          >
            <option value="good">Good</option>
            <option value="bad">Bad</option>
          </select>
          <button onClick={() => onSaveEdit(activity.id)} className="save-button">
            Save
          </button>
          <button onClick={onCancelEdit} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-item">
      <span className={`activity-label activity-${activity.type}`}>
        {activity.label}
      </span>
      <div className="activity-actions">
        <button
          onClick={() => onStartEdit(activity)}
          className="edit-button"
          aria-label="Edit"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(activity.id)}
          className="delete-button"
          aria-label="Delete"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
