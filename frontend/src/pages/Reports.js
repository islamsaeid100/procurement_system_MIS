const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [reportData, setReportData] = useState([]);

const generateReport = async () => {
    // إرسال التواريخ للباك-إند
    const res = await api.get(`invoices/?start_date=${startDate}&end_date=${endDate}`);
    setReportData(res.data);
};