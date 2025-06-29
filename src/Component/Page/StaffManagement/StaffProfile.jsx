import ExaminationsPanel from './ExaminationsPanel';
import ExaminationResult from './ExaminationResult';
// ...existing code...

export default function StaffProfile() {
  // ...existing state...
  const [activeTab, setActiveTab] = useState('examinations');
  const [examBookings, setExamBookings] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // ...fetch data logic...

  const updateExamBookingStatus = async (id, status) => {
    // ...API call to update status...
  };

  return (
    <div>
      {/* ...tab navigation... */}
      {activeTab === 'examinations' && (
        <ExaminationsPanel
          examBookings={examBookings}
          loading={loading}
          error={error}
          updateExamBookingStatus={updateExamBookingStatus}
          selectedAppointment={selectedAppointment}
          setSelectedAppointment={setSelectedAppointment}
        />
      )}
      {activeTab === 'examinationResults' && (
        <ExaminationResult
          examinations={examResults}
          loading={loading.examResults}
          error={error.examResults}
          onUpdateResult={async (examId, resultData) => {
            try {
              await api.put(`/api/results/${examId}`, resultData);
              setExamResults((prev) =>
                prev.map((exam) =>
                  exam.id === examId
                    ? { ...exam, status: 'completed', ...resultData }
                    : exam
                )
              );
              console.log('Kết quả xét nghiệm đã được cập nhật thành công');
            } catch (err) {
              console.error('Lỗi khi cập nhật kết quả xét nghiệm:', err);
            }
          }}
        />
      )}
      {/* ...other tab cases... */}
    </div>
  );
}