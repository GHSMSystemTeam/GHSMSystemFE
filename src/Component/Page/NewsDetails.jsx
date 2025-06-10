import { useParams } from 'react-router-dom';
import Article from './NewsComponent';
// Import other news components

const newsComponents = {
  'kham-suc-khoe-dinh-ky-phu-nu': Article,
  'cham-soc-suc-khoe-phu-nu': Article,
  'tu-van-suc-khoe-nam-gioi': Article,
  'suc-khoe-tam-ly-gioi-tinh': Article,
  'dinh-duong-suc-khoe-sinh-san': Article,
  'phuong-phap-tranh-thai': Article,
  // Add more mappings as needed
};

export default function NewsDetail() {
  const { slug } = useParams();
  const NewsComponent = newsComponents[slug];
  
  if (!NewsComponent) {
    return <div>Article not found</div>;
  }
  
  return <Article/>
}