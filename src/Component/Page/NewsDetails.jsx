import { useParams } from 'react-router-dom';
import NewsComponent1 from './NewsComponent1';
import NewsComponent2 from './NewsComponent2';
import NewsComponent3 from './NewsComponent3';
import NewsComponent4 from './NewsComponent4';
import NewsComponent5 from './NewsComponent5';
import NewsComponent6 from './NewsComponent6';
// Import other news components

const newsComponents = {
  'cham-soc-suc-khoe-phu-nu': NewsComponent1,
  'tu-van-suc-khoe-nam-gioi': NewsComponent2,
  'kham-suc-khoe-dinh-ky-phu-nu': NewsComponent3,
  'suc-khoe-tam-ly-gioi-tinh': NewsComponent4,
  'dinh-duong-suc-khoe-sinh-san': NewsComponent5,
  'phuong-phap-tranh-thai': NewsComponent6,
  // Add other mappings
};

export default function NewsDetail() {
  const { slug } = useParams();
  const NewsComponent = newsComponents[slug];
  
  if (!NewsComponent) {
    return <div>Article not found</div>;
  }
  
  return <NewsComponent />;
}