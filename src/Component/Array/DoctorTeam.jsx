import React from 'react';
import useConsultants from '../Hooks/useConsultants';
export default function DoctorTeam() {
    const { consultants, loading } = useConsultants();

    return (
        <section className='py-16 bg-white'>
            <div className='container mx-auto px-4'>
                <h2 className='text-3xl font-bold text-center mb-4'>CONSULTANT TEAM</h2>
                <div className='max-w-4xl mx-auto mb-12'>
                    <p>
                        A team of experienced consultants in the fields of Andrology, Gender Medicine and Infertility, trained extensively and
                        continuously improving their skills in countries with advanced medicine in reproductive health, andrology, reproductive
                        support, and gender medicine in Europe, America, and Australia.
                    </p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
                    {loading ? (
                        <div className="col-span-full text-center text-gray-500">Loading...</div>
                    ) : consultants.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500">No active consultants found.</div>
                    ) : (
                        consultants.map((doctor) => (
                            <div key={doctor.id} className='flex flex-col items-center max-w-xs'>
                                <div>
                                    <img
                                        src={doctor.profilePicture || '/api/placeholder/200/200'}
                                        alt={doctor.name}
                                        className='w-56 h-56 rounded-full border-4 border-purple-200 overflow-hidden mb-4 object-cover'
                                        onError={e => e.target.src = '/api/placeholder/200/200'}
                                    />
                                </div>
                                <div className='text-center'>
                                    <p className='text-blue-600 mb-1'>Doctor</p>
                                    <p className='text-blue-600 mb-1'>{doctor.role?.name || ''}</p>
                                    <h3 className='text-lg font-semibold text-gray-800 mb-2'>{doctor.name}</h3>
                                    <p className='text-gray-600'>
                                        {doctor.description || ''}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}