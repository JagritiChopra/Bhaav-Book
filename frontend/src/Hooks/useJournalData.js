import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config/api';

export function useJournalData(token) {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Memoize fetchJournals to prevent infinite re-renders
  const fetchJournals = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/journal`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const validJournals = (data.journals || []).filter(journal =>
          journal && (journal._id || journal.id) && typeof journal === 'object'
        );
        setJournals(validJournals);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch journals');
        setJournals([]);
      }
    } catch (error) {
      console.error('Error fetching journals:', error);
      setError('Failed to load journal entries');
      setJournals([]);
    } finally {
      setLoading(false);
    }
  }, [token]); // Add token as dependency

  const createJournal = useCallback(async (journalData) => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(journalData).forEach(key => {
        if (key === 'emotions' || key === 'tags') {
          formData.append(key, JSON.stringify(journalData[key] || []));
        } else if (key === 'photo' && journalData[key]) {
          if (typeof journalData[key] === 'string' && journalData[key].startsWith('data:image')) {
            // Convert data URL to blob
            fetch(journalData[key])
              .then(res => res.blob())
              .then(blob => {
                formData.append('photo', blob, 'photo.jpg');
              });
          } else {
            formData.append('photo', journalData[key]);
          }
        } else {
          formData.append(key, journalData[key] || '');
        }
      });

      const response = await fetch(`${API_BASE_URL}/journal`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (data.journal) {
          setJournals(prev => [data.journal, ...prev]);
          setSuccessMessage('Journal entry saved successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
          setError(null);
          return data.journal;
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create journal entry');
      }
    } catch (error) {
      setError('Failed to create journal entry: ' + error.message);
    }
  }, [token]);

  const updateJournal = useCallback(async (id, journalData) => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(journalData).forEach(key => {
        if (key === 'emotions' || key === 'tags') {
          formData.append(key, JSON.stringify(journalData[key] || []));
        } else if (key === 'photo' && journalData[key]) {
          if (typeof journalData[key] === 'string' && journalData[key].startsWith('data:image')) {
            fetch(journalData[key])
              .then(res => res.blob())
              .then(blob => {
                formData.append('photo', blob, 'photo.jpg');
              });
          } else {
            formData.append('photo', journalData[key]);
          }
        } else {
          formData.append(key, journalData[key] || '');
        }
      });

      const response = await fetch(`${API_BASE_URL}/journal/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (data.journal) {
          setJournals(prev => prev.map(journal => 
            (journal._id || journal.id) === id ? data.journal : journal
          ));
          setSuccessMessage('Journal entry updated successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
          setError(null);
          return data.journal;
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update journal entry');
      }
    } catch (error) {
      setError('Failed to update journal entry: ' + error.message);
    }
  }, [token]);

  const deleteJournals = useCallback(async (journalIds) => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    try {
      const deletePromises = journalIds.map(id =>
        fetch(`${API_BASE_URL}/journal/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      );

      await Promise.all(deletePromises);
      
      setJournals(prev => prev.filter(journal => 
        !journalIds.includes(journal._id || journal.id)
      ));
      
      setSuccessMessage(`${journalIds.length} journal(s) deleted successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Failed to delete selected journals');
    }
  }, [token]);

  // Clear success message function
  const clearSuccessMessage = useCallback(() => {
    setSuccessMessage('');
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]); // Use fetchJournals as dependency

  return {
    journals,
    setJournals,
    loading,
    error,
    setError: clearError,
    successMessage,
    setSuccessMessage: clearSuccessMessage,
    createJournal,
    updateJournal,
    deleteJournals,
    fetchJournals
  };
}

// Remove the default export since you're already using named export
