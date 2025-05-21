import React from 'react'

export default function DoctorTeam() {
    const doctors = [
        {
            id: 1,
            name: "NGUYEN ANH TU",
            title: "Center Director",
            description: "là một bác sĩ giàu kinh nghiệm trong lĩnh vực Nam học và Y học Giới tính.",
            image: "/api/placeholder/200/200",
        },

        {
            id: 2,
            name: "PHAM MINH NGOC",
            title: "Center Deputy Director",
            description: "là một bác sĩ với nhiều năm kinh nghiệm trong khám và điều trị các vấn đề nam giới và giới tính.",
            image: "/api/placeholder/200/200",
        },

        {
            id: 3,
            name: "HO HUU PHUC",
            title: "",
            description: "là một bác sĩ với nhiều năm kinh nghiệm trong khám và điều trị các vấn đề nam giới và giới tính.",
            image: "/api/placeholder/200/200",
        },

        {
            id: 4,
            name: "NGUYEN TRONG HOANG HIEP",
            title: "",
            description: "là một bác sĩ giàu kinh nghiệm trong khám và điều trị các bệnh nam khoa.",
            image: "/api/placeholder/200/200",
        },

        {
            id: 5,
            name: "NGUYEN QUOC LINH",
            title: "",
            description: "là một bác sĩ giàu kinh nghiệm trong lĩnh vực tư vấn tâm lý.",
            image: "/api/placeholder/200/200",
        }


    ]
    return (
        <section className='py-16 bg-white'>
            <div className='container mx-auto px-4'>
                <h2 className='text-3xl font-bold text-center mb-4'>DOCTOR TEAM</h2>

                <div className='max-w-4xl mx-auto mb-12'>
                    <p> A team of experienced doctors in the fields of Andrology, Gender Medicine and Infertility, trained extensively and
                        continuously improving their skills in countries with advanced medicine in reproductive health, andrology, reproductive
                        support, and gender medicine in Europe, America, and Australia.</p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
                    {doctors.map((doctor) => (
                        <div key={doctor.id} className='flex flex-col items-center max-w-xs'>
                            <div>
                                <img src={doctor.image} alt={doctor.name} className='w-56 h-56 rounded-full border-4 border-purple-200 overflow-hidden mb-4' />
                            </div>

                            <div className='text-center'>
                                <p className='text-blue-600 mb-1'>Doctor</p>

                                <p className='text-blue-600 mb-1'>{doctor.title}</p>

                                <h3 className='text-lg font-semibold text-gray-800 mb-2'>{doctor.name}</h3>

                                <p className='text-gray-600'>
                                   DR.{doctor.name} {doctor.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                
            </div>

        </section>
    )
}
