import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export const uploadImage = async (file, folder = 'uploads') => {
  const filename = `${folder}/${Date.now()}_${file.name.replace(/\s/g, '_')}`;
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const uploadImages = async (files, folder = 'uploads') => {
  return Promise.all(Array.from(files).map(f => uploadImage(f, folder)));
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
};

export const STATUS_COLORS = {
  pending:      'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  in_progress:  'bg-orange-100 text-orange-800',
  solved:       'bg-green-100 text-green-800',
  active:       'bg-red-100 text-red-800',
  responding:   'bg-orange-100 text-orange-800',
  resolved:     'bg-green-100 text-green-800',
};

export const STATUS_LABELS = {
  pending:      'Pending',
  under_review: 'Under Review',
  in_progress:  'In Progress',
  solved:       'Solved',
  active:       'Active',
  responding:   'Responding',
  resolved:     'Resolved',
  false_alarm:  'False Alarm',
};

export const CATEGORY_ICONS = {
  road:        '🛣️',
  water:       '💧',
  electricity: '⚡',
  drainage:    '🚰',
  garbage:     '🗑️',
  other:       '❓',
  medical:     '🏥',
  fire:        '🔥',
  accident:    '🚗',
  flood:       '🌊',
  crime:       '🚨',
};
