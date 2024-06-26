import { useDispatch, useSelector } from 'react-redux';
import { Button, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { useNavigate } from 'react-router-dom';
import Header from '../../layouts/Header/Header'
import { deleteRow, clearTable } from '../../redux/slices/tableDataSlice';
import './FormResults.scss';
import PieChart from './PieChart';
import Footer from '../../layouts/Footer/Footer';
import { IFormData } from '../../interfaces/formData';
import { RootState } from '../../redux/store';

interface DataType {
    id: string;
    ad: string;
    soyad: string;
    yas: number;
    cinsiyet: string;
    kanGrubu: string;
    kanGrubuRh: string;
    gelisNedeni: string;
    gelisNedeniAciklama: string;
    odadaBulunanlar: string[];
    darpDurumu: boolean;
    organizasyon: string;
    sikayet: string;
    doktorAdi: string;
    uygunOrtamSaglandi: boolean;
  }


const FormResults: React.FC = () => {
    const tableData = useSelector((state: RootState) => state.table.tableData)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log(tableData);

    const handleClick = () => {
        navigate('/form-inputs');
    }

    const bloodTypeFilters = [
        { text: 'A+', value: 'A +' },
        { text: 'A-', value: 'A -' },
        { text: 'B+', value: 'B +' },
        { text: 'B-', value: 'B -' },
        { text: 'AB+', value: 'AB +' },
        { text: 'AB-', value: 'AB -' },
        { text: '0+', value: '0 +' },
        { text: '0-', value: '0 -' }
    ];

    const tableColumns: TableColumnsType<DataType> = [
        { title: 'Ad', dataIndex: 'ad' },
        { title: 'Soyad', dataIndex: 'soyad' },
        { title: 'Yaş', dataIndex: 'yas' },
        {
            title: 'Cinsiyet',
            dataIndex: 'cinsiyet',
            key: 'cinsiyet',
            filters: [
                { text: 'Erkek', value: 'Erkek' },
                { text: 'Kadın', value: 'Kadın' }
            ],
            onFilter: (value: unknown, record: IFormData) => record.cinsiyet === value
        },
        {
            title: 'Kan Grubu',
            dataIndex: 'kanGrubu',
            key: 'kanGrubu',
            render: (_text: string, record: IFormData) => `${record.kanGrubu || ''} ${record.kanGrubuRh || ''}`,
            filters: bloodTypeFilters,
            onFilter: (value: unknown, record: IFormData) => `${record.kanGrubu || ''} ${record.kanGrubuRh || ''}` === value
        },
        {
            title: 'Geliş Nedeni',
            dataIndex: 'gelisNedeni',
            filters: [
                { text: 'Etkili Eylem', value: 'Etkili Eylem' },
                { text: 'Trafik Kazası', value: 'Trafik Kazası' },
                { text: 'İş Kazası', value: 'İş Kazası' },
                { text: 'Diğer Kazalar', value: 'Diğer Kazalar' },
                { text: 'İnsan Hakları İhlali İddiası', value: 'İnsan Hakları İhlali İddiası' },
                { text: 'İntihar Girişimi', value: 'İntihar Girişimi' },
                { text: 'Zehirlenmeler', value: 'Zehirlenmeler' },

            ],
            onFilter: (value: unknown, record: IFormData) => record.gelisNedeni === value
        },

        { title: 'Geliş Nedeni Açıklama', dataIndex: 'gelisNedeniAciklama', key: 'gelisNedeniAciklama' },
        {
            title: 'Odada Bulunanlar',
            dataIndex: 'odadaBulunanlar',
            render: (text: string[]) => (text.join(', ')),
            filters: [
                { text: 'Tabip', value: 'Tabip' },
                { text: 'Sağlık Personeli', value: 'Sağlık Personeli' },
                { text: 'Sağlık Meslek Mensubu Personel', value: 'Sağlık Meslek Mensubu Personel' },
                { text: 'Refakatçi', value: 'Refakatçi' },
                { text: 'Güvenlik Görevlisi', value: 'Güvenlik Görevlisi' },
            ],
            onFilter: (value: unknown, record: IFormData) => record.odadaBulunanlar == value,
        },
        {
            title: 'Darp Durumu',
            dataIndex: 'darpDurumu',
            key: 'darpDurumu',
            filters: [
                { text: 'Evet', value: 'Evet' },
                { text: 'Hayır', value: 'Hayır' },
            ],
            onFilter: (value: unknown, record:IFormData) => record.darpDurumu === value
        },
        
        { title: 'Organizasyon', dataIndex: 'organizasyon' },
        { title: 'Şikayet', dataIndex: 'sikayet' },
        { title: 'Doktor Adı', dataIndex: 'doktorAdi' },
        {
            title: 'Uygun Ortam Sağlandı',
            dataIndex: 'uygunOrtamSaglandi',
            render: (text: string) => (text ? 'Evet' : 'Hayır'),
            filters: [
                { text: 'Evet', value: true },
                { text: 'Hayır', value: false }
            ],
            onFilter: (value: unknown, record: IFormData) => record.uygunOrtamSaglandi === value,
        },
        {
            title: '',
            render: (record: IFormData) => (
                <Button type="primary" danger onClick={() => handleDeleteRow(record.id)}>
                    Sil
                </Button>
            )
        }
    ];

    const handleDeleteRow = (id: string) => {
        dispatch(deleteRow(id));
    };

    const handleDeleteAll = () => {
        dispatch(clearTable());
    }

    const organizationData = tableData.reduce((acc: Record<string, number>, { organizasyon }: { organizasyon: string }) => {
        acc[organizasyon] = (acc[organizasyon] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.entries(organizationData).map(([key, value]) => ({
        organizasyon: key,
        count: Number(value)
    }));



    return (
        <>
            <Header title='Adli Vaka Rapor Tablosu' />
            <div className='tableContainer'>
                <div className='formResultsTable'>
                    <h4 className='tableTitle' >Form Sonuçları</h4>
                    <Table
                        columns={tableColumns}
                        dataSource={tableData}
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: 'max-content' }}
                        style={{ width: '100%' }}
                        rowKey="id"
                    />
                    <Button type="primary" className='green' onClick={handleClick}>Yeni Kayıt Ekle</Button>
                    <Button type="primary" onClick={handleDeleteAll} danger>Tabloyu Temizle</Button>
                </div>
                <div className="chartContainer">
                    <PieChart data={chartData} />
                </div>
            </div>
            <Footer info='React Task 2024' />
        </>
    );
};

export default FormResults;
