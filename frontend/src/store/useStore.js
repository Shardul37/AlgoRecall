import { create } from 'zustand';
import api from '../services/api';

const useStore = create((set) => ({
    // --- STATE (Data) ---
    todayRevisions: [],
    loading: false,
    error: null,
    calendarData: {}, // Format: { "2025-10-24": [ ...revisions ] }
    analyticsData: null,

    // --- ACTIONS (Functions) ---
    
    // 1. Fetch what is due today
    fetchTodayRevisions: async () => {
        set({ loading: true });
        try {
            const response = await api.get('/api/revisions/today');
            // The backend returns a list of revisions
            set({ todayRevisions: response.data, loading: false });
        } catch (err) {
            console.error("API Error:", err);
            set({ error: "Failed to fetch data", loading: false });
        }
    },

    // 2. Mark a revision as complete
    completeRevision: async (revisionId, rating) => {
        try {
            await api.post(`/api/revisions/${revisionId}/complete`, { rating });
            
            // Optimistic Update: Remove it from the UI immediately
            set((state) => ({
                todayRevisions: state.todayRevisions.filter(r => r.id !== revisionId)
            }));
            
        } catch (err) {
            console.error("Failed to complete revision:", err);
        }
    },

    // 3. Add a new problem
    addProblem: async (problemData) => {
        try {
            await api.post('/api/problems', problemData);
            // We don't need to update 'todayRevisions' because new problems appear TOMORROW.
            return true;
        } catch (err) {
            console.error("Failed to add problem:", err);
            return false;
        }
    },

    // 4. Fetch Calendar Data
    fetchCalendar: async (month, year) => {
        set({ loading: true });
        try {
            const response = await api.get(`/api/calendar?month=${month}&year=${year}`);
            set({ calendarData: response.data, loading: false });
        } catch (err) {
            console.error("Calendar Fetch Error:", err);
            set({ loading: false });
        }
    },

    // 5. Fetch Analytics
    fetchAnalytics: async () => {
        set({ loading: true });
        try {
            const response = await api.get('/api/analytics');
            set({ analyticsData: response.data, loading: false });
        } catch (err) {
            console.error("Analytics Error:", err);
            set({ loading: false });
        }
    }
}));

export default useStore;