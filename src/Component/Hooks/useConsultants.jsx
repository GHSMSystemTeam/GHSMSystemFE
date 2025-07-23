import React, { useEffect, useState } from 'react'
import api from '../config/axios';

export default function useConsultants() {
    const [consultants, setConsultants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConsultants = async () => {
            try {
                const res = await api.get('/api/activeconsultants');
                setConsultants(res.data || []);
            } catch {
                setConsultants([]);
            } finally {
                setLoading(false);
            }
        };
        fetchConsultants();
    }, []);

    return { consultants, loading };
}