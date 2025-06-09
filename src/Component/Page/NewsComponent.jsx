import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function Article({
  bannerImage,
  bannerTitle,
  articleTitle,
  articleImage,
  sections,
  tips,
  lastUpdated,
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-24 mt-10">
      <Header />
      {/* Banner */}
      <div
        className="w-full text-white relative bg-cover bg-center min-h-[300px]"
        style={{ backgroundImage: `url('${bannerImage}')` }}
      >
        <div className="absolute inset-0 bg-indigo-800 bg-opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-[300px]">
          <h1
            className="text-4xl font-bold text-white text-center"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
          >
            {bannerTitle}
          </h1>
        </div>
      </div>
      <main className="flex-grow flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-50 py-16">
        <div className="container mx-auto px-4 py-12 flex-1">
          <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">
              {articleTitle}
            </h2>
            <div className="rounded-lg w-full mb-6 bg-gray-200 flex items-center justify-center h-56 transition-all duration-500 hover:scale-105">
              <img
                src={articleImage}
                alt={articleTitle}
                className="rounded-lg w-full mb-6"
              />
            </div>
            {sections.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-xl font-medium text-indigo-600 mb-2">
                  {section.heading}
                </h3>
                <p className="mb-4 text-gray-700">{section.content}</p>
              </div>
            ))}
            <h3 className="text-xl font-medium text-indigo-600 mb-2">
              Lời khuyên từ chuyên gia
            </h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
              {tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
            <p className="text-gray-700">
              Chăm sóc sức khỏe toàn diện là hành trình lâu dài và cần sự đồng hành của gia đình, cộng đồng và các chuyên gia y tế. Hãy chủ động bảo vệ sức khỏe của mình để tận hưởng cuộc sống trọn vẹn và hạnh phúc!
            </p>
          </div>
          <div className="max-w-5xl mx-auto rounded-lg shadow-md p-12 bg-gray-100 mt-8">
            <div className="flex items-center text-gray-600 mb-2 md:mb-0">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Cập nhật lần cuối: {lastUpdated}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}