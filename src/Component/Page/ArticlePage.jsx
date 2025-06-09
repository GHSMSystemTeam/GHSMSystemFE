import Header from "../Header/Header";
import Footer from "../Footer/Footer";

// ... (articles array and Article component as before) ...
const articles = [
  {
    bannerImage: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1500&q=80",
    bannerTitle: "Chăm sóc sức khỏe toàn diện cho phụ nữ mọi lứa tuổi",
    articleTitle: "Sức khỏe phụ nữ – Nền tảng của hạnh phúc gia đình và xã hội",
    articleImage: "https://afhanoi.com/wp-content/uploads/2022/09/.jpg",
    sections: [
      {
        heading: "1. Chăm sóc sức khỏe tuổi dậy thì",
        content:
          "Tuổi dậy thì là giai đoạn cơ thể có nhiều thay đổi về thể chất và tâm sinh lý. Việc giáo dục sức khỏe sinh sản, hướng dẫn vệ sinh cá nhân, dinh dưỡng hợp lý và hỗ trợ tâm lý là rất cần thiết để các em gái phát triển toàn diện, tự tin và phòng tránh các bệnh lý phụ khoa.",
      },
      {
        heading: "2. Sức khỏe sinh sản và thai sản",
        content:
          "Ở độ tuổi sinh sản, phụ nữ cần được tư vấn về kế hoạch hóa gia đình, khám phụ khoa định kỳ, tiêm phòng các bệnh lây truyền qua đường tình dục và chăm sóc sức khỏe trước, trong và sau khi mang thai. Việc này giúp phòng ngừa các biến chứng thai kỳ, đảm bảo sức khỏe cho mẹ và bé.",
      },
      {
        heading: "3. Chăm sóc sức khỏe tiền mãn kinh và mãn kinh",
        content:
          "Giai đoạn tiền mãn kinh và mãn kinh thường đi kèm với nhiều thay đổi về nội tiết tố, ảnh hưởng đến tâm lý, giấc ngủ, xương khớp và tim mạch. Phụ nữ nên duy trì lối sống lành mạnh, tập thể dục đều đặn, bổ sung dinh dưỡng phù hợp và khám sức khỏe định kỳ để phát hiện sớm các bệnh lý thường gặp.",
      },
      {
        heading: "4. Sức khỏe tinh thần và phòng ngừa bệnh tật",
        content:
          "Ngoài sức khỏe thể chất, sức khỏe tinh thần cũng rất quan trọng. Phụ nữ cần được chia sẻ, hỗ trợ tâm lý, giảm căng thẳng và duy trì các mối quan hệ xã hội tích cực. Đồng thời, việc tầm soát ung thư vú, ung thư cổ tử cung và các bệnh mãn tính như tiểu đường, tăng huyết áp là cần thiết để bảo vệ sức khỏe lâu dài.",
      },
    ],
    tips: [
        "Khám sức khỏe phụ khoa định kỳ ít nhất 1 lần/năm.",
      "Ăn uống cân đối, bổ sung nhiều rau xanh, trái cây và uống đủ nước.",
      "Tập thể dục thường xuyên, duy trì cân nặng hợp lý.",
      "Giữ vệ sinh cá nhân sạch sẽ, đặc biệt trong kỳ kinh nguyệt.",
      "Chủ động phòng ngừa các bệnh lây truyền qua đường tình dục.",
      "Chia sẻ, tâm sự với người thân hoặc chuyên gia khi gặp vấn đề về tâm lý.",
    ],
    lastUpdated: "15/05/2023",
  },
  {
    bannerImage: "https://api.genetica.asia/storage/2086430-1651674708RMU05.jpg?width=1220",
    bannerTitle: "Tư vấn sức khỏe sinh sản cho nam giới",
    articleTitle: "Tầm quan trọng của sức khỏe sinh sản nam giới",
    articleImage: "https://afhanoi.com/wp-content/uploads/2022/09/.jpg",
    sections: [
      {
        heading: "1. Khám sức khỏe sinh sản định kỳ",
        content:
          "Nam giới nên chủ động khám sức khỏe sinh sản định kỳ để phát hiện sớm các vấn đề như rối loạn nội tiết, viêm nhiễm hoặc các bệnh lý về tinh hoàn, tuyến tiền liệt. Việc này giúp phòng ngừa vô sinh và các biến chứng nguy hiểm khác.",
      },
      {
        heading: "2. Phòng ngừa các bệnh lây truyền qua đường tình dục (STIs)",
        content:
          "Sử dụng bao cao su khi quan hệ tình dục, giữ vệ sinh cá nhân và tiêm phòng các bệnh như viêm gan B, HPV là những biện pháp hiệu quả giúp nam giới phòng tránh các bệnh lây truyền qua đường tình dục.",
      },
      {
        heading: "3. Duy trì lối sống lành mạnh",
        content:
          "Chế độ ăn uống cân đối, tập thể dục thường xuyên, hạn chế rượu bia và không hút thuốc lá giúp tăng cường sức khỏe sinh sản và nâng cao chất lượng tinh trùng.",
      },
      {
        heading: "4. Hỗ trợ tâm lý và chia sẻ với bạn đời",
        content:
          "Sức khỏe tinh thần cũng ảnh hưởng lớn đến sức khỏe sinh sản. Nam giới nên chia sẻ, tâm sự với bạn đời hoặc chuyên gia khi gặp khó khăn về tâm lý, tránh căng thẳng kéo dài.",
      },
    ],
    tips: [
      "Khám sức khỏe sinh sản định kỳ ít nhất 1 lần/năm.",
      "Quan hệ tình dục an toàn, chung thủy một vợ một chồng.",
      "Giữ vệ sinh cá nhân sạch sẽ, đặc biệt là vùng kín.",
      "Ăn uống đủ chất, bổ sung kẽm, vitamin và khoáng chất.",
      "Tập thể dục đều đặn, duy trì cân nặng hợp lý.",
      "Chủ động đi khám khi có dấu hiệu bất thường như đau, sưng, tiết dịch lạ ở bộ phận sinh dục.",
    ],
    lastUpdated: "10/05/2023",
  },
  {
    bannerImage: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80",
    bannerTitle: "Tầm quan trọng của khám sức khỏe định kỳ cho phụ nữ",
    articleTitle: "Khám sức khỏe định kỳ – Chìa khóa bảo vệ sức khỏe phụ nữ",
    articleImage: "https://images.unsplash.com/photo-1512070679279-c5a4b67c1d53?auto=format&fit=crop&w=800&q=80",
    sections: [
      {
        heading: "1. Phát hiện sớm các bệnh lý nguy hiểm",
        content:
          "Nhiều bệnh lý phụ khoa, ung thư cổ tử cung, ung thư vú hay các bệnh mãn tính như tiểu đường, tăng huyết áp thường không có triệu chứng rõ ràng ở giai đoạn đầu. Khám sức khỏe định kỳ giúp phát hiện sớm những bất thường, từ đó tăng khả năng điều trị thành công và giảm thiểu biến chứng.",
      },
      {
        heading: "2. Theo dõi và chăm sóc sức khỏe sinh sản",
        content:
          "Khám phụ khoa định kỳ giúp phụ nữ kiểm soát tốt sức khỏe sinh sản, phát hiện sớm các vấn đề như viêm nhiễm, rối loạn kinh nguyệt, u xơ tử cung, u nang buồng trứng... Đặc biệt, phụ nữ trong độ tuổi sinh sản hoặc chuẩn bị mang thai càng cần chú trọng khám định kỳ để đảm bảo sức khỏe cho mẹ và bé.",
      },
      {
        heading: "3. Tư vấn phòng ngừa và chăm sóc sức khỏe toàn diện",
        content:
          "Thông qua các buổi khám định kỳ, phụ nữ sẽ được tư vấn về chế độ dinh dưỡng, lối sống lành mạnh, cách phòng tránh các bệnh lây truyền qua đường tình dục và các biện pháp chăm sóc sức khỏe phù hợp với từng giai đoạn cuộc đời.",
      },
    ],
    tips: [
      "Khám sức khỏe tổng quát và phụ khoa định kỳ ít nhất 1 lần/năm.",
      "Chủ động tầm soát ung thư vú, ung thư cổ tử cung theo khuyến cáo của bác sĩ.",
      "Chia sẻ với bác sĩ về các dấu hiệu bất thường hoặc thay đổi trong cơ thể.",
      "Duy trì lối sống lành mạnh, ăn uống cân đối và tập thể dục thường xuyên.",
    ],
    lastUpdated: "05/05/2023",
  },
  {
    bannerImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80",
    bannerTitle: "Sức khỏe tâm lý và giới tính - Mối liên hệ quan trọng",
    articleTitle: "Sức khỏe tâm lý và giới tính: Hiểu đúng để sống khỏe mạnh và hạnh phúc",
    articleImage: "https://images.unsplash.com/photo-1512070679279-c5a4b67c1d53?auto=format&fit=crop&w=800&q=80",
    sections: [
      {
        heading: "1. Tâm lý ảnh hưởng đến nhận thức giới tính",
        content:
          "Quá trình hình thành và phát triển nhận thức về giới tính chịu tác động lớn từ môi trường gia đình, xã hội và đặc biệt là sức khỏe tâm lý. Một tâm lý vững vàng giúp cá nhân tự tin khẳng định bản thân, tôn trọng sự đa dạng giới và xây dựng các mối quan hệ lành mạnh.",
      },
      {
        heading: "2. Rối loạn tâm lý và các vấn đề về giới",
        content:
          "Những áp lực xã hội, định kiến về giới hoặc trải nghiệm tiêu cực có thể dẫn đến các rối loạn tâm lý như lo âu, trầm cảm, rối loạn nhận dạng giới. Nếu không được hỗ trợ kịp thời, những vấn đề này có thể ảnh hưởng nghiêm trọng đến sức khỏe thể chất và tinh thần.",
      },
      {
        heading: "3. Vai trò của gia đình và cộng đồng",
        content:
          "Gia đình và cộng đồng đóng vai trò quan trọng trong việc tạo dựng môi trường an toàn, tôn trọng và hỗ trợ cho mỗi cá nhân phát triển toàn diện về tâm lý và giới tính. Sự lắng nghe, chia sẻ và đồng hành sẽ giúp giảm thiểu các rối loạn tâm lý và thúc đẩy sự hòa nhập xã hội.",
      },
    ],
    tips: [
      "Chủ động tìm kiếm sự hỗ trợ tâm lý khi gặp khó khăn về cảm xúc hoặc nhận diện giới tính.",
      "Tham gia các hoạt động xã hội, nhóm hỗ trợ để tăng cường sự tự tin và kỹ năng giao tiếp.",
      "Giữ lối sống lành mạnh, cân bằng giữa công việc, học tập và nghỉ ngơi.",
      "Chia sẻ với người thân hoặc chuyên gia tâm lý khi cảm thấy áp lực hoặc bị kỳ thị.",
    ],
    lastUpdated: "28/04/2023",
  },
  {
    bannerImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80",
    bannerTitle: "Dinh dưỡng và sức khỏe sinh sản",
    articleTitle: "Vai trò của dinh dưỡng đối với sức khỏe sinh sản",
    articleImage: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=800&q=80",
    sections: [
      {
        heading: "1. Dinh dưỡng ảnh hưởng đến khả năng sinh sản",
        content:
          "Thiếu hụt các vi chất như sắt, kẽm, axit folic, vitamin D, E có thể làm giảm chất lượng trứng và tinh trùng, gây rối loạn kinh nguyệt hoặc giảm khả năng thụ thai. Ngược lại, thừa cân, béo phì cũng làm tăng nguy cơ vô sinh và các biến chứng thai kỳ.",
      },
      {
        heading: "2. Chế độ ăn uống lành mạnh cho sức khỏe sinh sản",
        content:
          "Cả nam và nữ nên duy trì chế độ ăn giàu rau xanh, trái cây, ngũ cốc nguyên hạt, protein từ cá, thịt nạc, trứng, sữa và các loại hạt. Hạn chế thực phẩm chế biến sẵn, nhiều đường, chất béo bão hòa và đồ uống có cồn để bảo vệ sức khỏe sinh sản.",
      },
      {
        heading: "3. Dinh dưỡng cho phụ nữ mang thai và cho con bú",
        content:
          "Phụ nữ mang thai cần bổ sung đầy đủ axit folic, sắt, canxi, DHA để hỗ trợ sự phát triển não bộ và hệ xương của thai nhi. Trong thời kỳ cho con bú, mẹ cũng cần duy trì chế độ ăn đa dạng, giàu dinh dưỡng để đảm bảo nguồn sữa chất lượng cho bé.",
      },
    ],
    tips: [
      "Ăn uống cân đối, đa dạng các nhóm thực phẩm mỗi ngày.",
      "Bổ sung vitamin và khoáng chất theo hướng dẫn của bác sĩ, đặc biệt là axit folic, sắt, kẽm, canxi.",
      "Uống đủ nước, hạn chế đồ uống có cồn và nước ngọt có gas.",
      "Duy trì cân nặng hợp lý, tập thể dục đều đặn.",
      "Khám sức khỏe định kỳ để phát hiện và điều chỉnh sớm các vấn đề về dinh dưỡng và sinh sản.",
    ],
    lastUpdated: "20/04/2023",
  },
  {
    bannerImage: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1500&q=80",
    bannerTitle: "Các phương pháp tránh thai hiện đại và an toàn",
    articleTitle: "Lựa chọn phương pháp tránh thai phù hợp cho sức khỏe và hạnh phúc",
    articleImage: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=800&q=80",
    sections: [
      {
        heading: "1. Bao cao su",
        content:
          "Bao cao su là phương pháp tránh thai phổ biến, dễ sử dụng và có thể phòng ngừa các bệnh lây truyền qua đường tình dục (STIs). Đây là lựa chọn an toàn cho cả nam và nữ, không ảnh hưởng đến nội tiết tố.",
      },
      {
        heading: "2. Thuốc tránh thai hàng ngày",
        content:
          "Thuốc tránh thai chứa hormone giúp ngăn rụng trứng, hiệu quả cao nếu sử dụng đúng cách. Tuy nhiên, cần uống đều đặn mỗi ngày và tham khảo ý kiến bác sĩ trước khi sử dụng, đặc biệt với người có bệnh lý nền.",
      },
      {
        heading: "3. Que cấy tránh thai",
        content:
          "Que cấy tránh thai là một thanh nhỏ chứa hormone được cấy dưới da tay, có tác dụng ngừa thai từ 3-5 năm. Phương pháp này phù hợp với phụ nữ muốn tránh thai lâu dài mà không phải nhớ uống thuốc hàng ngày.",
      },
      {
        heading: "4. Vòng tránh thai (IUD)",
        content:
          "Vòng tránh thai là dụng cụ nhỏ đặt vào tử cung, có thể ngừa thai từ 5-10 năm tùy loại. Đây là phương pháp hiệu quả, lâu dài và không ảnh hưởng đến sinh hoạt hàng ngày.",
      },
    ],
    tips: [
      "Miếng dán tránh thai, vòng âm đạo: chứa hormone, sử dụng theo chu kỳ hàng tháng.",
      "Thuốc tiêm tránh thai: tiêm mỗi 3 tháng một lần.",
      "Triệt sản nam/nữ: phương pháp vĩnh viễn, phù hợp với người không còn nhu cầu sinh con.",
      "Tham khảo ý kiến bác sĩ để chọn phương pháp phù hợp với sức khỏe và nhu cầu cá nhân.",
      "Tuân thủ hướng dẫn sử dụng để đạt hiệu quả tối ưu.",
      "Kiểm tra sức khỏe định kỳ khi sử dụng các phương pháp nội tiết hoặc dụng cụ tử cung.",
      "Luôn sử dụng bao cao su khi muốn phòng tránh các bệnh lây truyền qua đường tình dục.",
    ],
    lastUpdated: "15/04/2023",
  },
];
function Article({
  bannerImage,
  bannerTitle,
  articleTitle,
  articleImage,
  sections,
  tips,
  lastUpdated,
}) {
  // ...same as before...
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-24 mt-10">
      <Header />
      {/* ...rest of the Article component... */}
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
            <div className="rounded-lg w-full mb-6 bg-gray-200 flex items-center justify-center h-40 md:h-56 transition-all duration-500 hover:scale-105 overflow-hidden">
              <img
                src={articleImage}
                alt={articleTitle}
                className="rounded-lg w-full h-full object-contain"
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

// Export each article as a named component
export function NewsComponent1() {
  return <Article {...articles[0]} />;
}
export function NewsComponent2() {
  return <Article {...articles[1]} />;
}
export function NewsComponent3() {
  return <Article {...articles[2]} />;
}
export function NewsComponent4() {
  return <Article {...articles[3]} />;
}
export function NewsComponent5() {
  return <Article {...articles[4]} />;
}
export function NewsComponent6() {
  return <Article {...articles[5]} />;
}