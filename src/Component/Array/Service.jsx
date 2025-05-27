import React from 'react'
import { ArrowRight } from 'lucide-react'


export default function Service() {
    const services = [
        {
            id: 1,
            title: "TƯ VẤN & TRỊ LIỆU TÌNH DỤC",
            subtitle: "NAM • NỮ ",
            icon: "💙",
            color: "from-blue-400 to-blue-600",
            features: [
                "Tình dục nam/nữ",
                "Suy giảm tình dục",
                "Rối loạn chức năng tình dục",
                "Rối loạn cương dương",
            ],
            image: "/api/placeholder/400/300"
        },
        {
            id: 2,
            title: "Theo dõi điều trị bệnh lây truyền qua đường tình dục (STIs)",
            subtitle: "",
            icon: "🔷",
            color: "from-indigo-400 to-indigo-600",
            features: [
                "Quản lý hồ sơ bệnh nhân STI",
                "Theo dõi kết quả xét nghiệm",
                "Quản lý điều trị và kê đơn"
            ],
            image: "/api/placeholder/400/300"
        },
        {
            id: 3,
            title: "Quản lý kế hoạch hóa gia đình, tránh thai",
            subtitle: "",
            icon: "🌈",
            color: "from-purple-400 to-pink-400",
            features: [
                "Quản lý hồ sơ kế hoạch hóa gia đình",
                "Quản lý phương pháp tránh thai",
                "Nhắc lịch dùng thuốc / tái khám",
            ],
            image: "/api/placeholder/400/300"
        },
        // {
        //     id: 4,
        //     title: "Hỗ trợ quản lý bệnh nhân",
        //     subtitle: "",
        //     icon: "🧠",
        //     color: "from-green-400 to-teal-500",
        //     features: [
        //         "Quản lý thông tin bệnh nhân (Hồ sơ sức khỏe cá nhân)",
        //         "Quản lý lịch sử y tế và khám chữa bệnh",
        //         "Quản lý lịch hẹn và theo dõi tái khám",
        //         "Quản lý điều trị và đơn thuốc"
        //     ],
        //     image: "/api/placeholder/400/300"
        // }
    ];
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    {services.map((service) => (
                        <div key={service.id} className={`relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br ${service.color}`}>
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
                            
                            <div className="relative p-8 text-white">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex-1">
                                        <div className="text-4xl mb-4">{service.icon}</div>
                                        <h3 className="text-2xl font-bold mb-2 leading-tight">{service.title}</h3>
                                        {service.subtitle && (
                                            <p className="text-lg opacity-90 font-medium">{service.subtitle}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8">
                                    {service.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start">
                                            <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span className="text-sm leading-relaxed opacity-95">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between">
                                    <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center group">
                                        <span className="text-white">Tìm hiểu thêm</span>
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
