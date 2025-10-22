import { useState } from 'react'
import { Upload, Button, Card, Typography, Space, message, Row, Col } from 'antd'
import { UploadOutlined, FileExcelOutlined, DollarOutlined, BankOutlined, DownloadOutlined } from '@ant-design/icons'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const { Title, Text } = Typography

function App() {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [processedData, setProcessedData] = useState(null)

  const handleFileUpload = (info) => {
    setFile(info.file)
    message.success(`เลือกไฟล์ ${info.file.name} เรียบร้อย`)
    
    // Auto process file
    setProcessing(true)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      
      let allCashData = []
      let allCheckData = []
      
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        
        const cashData = jsonData.filter(row => 
          row['ประเภท'] === 'เงินสด' || 
          (row['ประเภท'] && row['ประเภท'].toString().toLowerCase().includes('cash')) ||
          (row['type'] && row['type'].toString().toLowerCase().includes('cash'))
        ).map(row => ({ ...row, 'ชีท': sheetName }))
        
        const checkData = jsonData.filter(row => 
          row['ประเภท'] === 'เช็ค' || 
          (row['ประเภท'] && row['ประเภท'].toString().toLowerCase().includes('check')) ||
          (row['type'] && row['type'].toString().toLowerCase().includes('check'))
        ).map(row => ({ ...row, 'ชีท': sheetName }))
        
        allCashData = [...allCashData, ...cashData]
        allCheckData = [...allCheckData, ...checkData]
      })
      
      setProcessedData({ cashData: allCashData, checkData: allCheckData })
      message.success(`จัดการเสร็จสิ้น! เงินสด: ${allCashData.length} รายการ, เช็ค: ${allCheckData.length} รายการ`)
      setProcessing(false)
    }
    
    reader.readAsArrayBuffer(info.file)
  }

  const downloadSample = () => {
    const wb = XLSX.utils.book_new()
    
    const months = [
      { name: 'มกราคม 2024', data: [
        { 'รายการ': 'ขายข้าวโพด', 'จำนวน': 5000, 'ประเภท': 'เงินสด', 'วันที่': '2024-01-15' },
        { 'รายการ': 'ขายปุ๋ยอินทรีย์', 'จำนวน': 15000, 'ประเภท': 'เช็ค', 'วันที่': '2024-01-16' },
        { 'รายการ': 'ขายผักสด', 'จำนวน': 8000, 'ประเภท': 'เงินสด', 'วันที่': '2024-01-17' }
      ]},
      { name: 'กุมภาพันธ์ 2024', data: [
        { 'รายการ': 'ขายผลไม้สด', 'จำนวน': 25000, 'ประเภท': 'เช็ค', 'วันที่': '2024-02-05' },
        { 'รายการ': 'ขายไข่ไก่', 'จำนวน': 3500, 'ประเภท': 'เงินสด', 'วันที่': '2024-02-10' },
        { 'รายการ': 'ขายหมูสด', 'จำนวน': 12000, 'ประเภท': 'เช็ค', 'วันที่': '2024-02-15' }
      ]},
      { name: 'มีนาคม 2024', data: [
        { 'รายการ': 'ขายข้าวหอมมะลิ', 'จำนวน': 45000, 'ประเภท': 'เช็ค', 'วันที่': '2024-03-08' },
        { 'รายการ': 'ขายผลไม้ตามฤดู', 'จำนวน': 7500, 'ประเภท': 'เงินสด', 'วันที่': '2024-03-12' }
      ]}
    ]
    
    months.forEach(month => {
      const ws = XLSX.utils.json_to_sheet(month.data)
      XLSX.utils.book_append_sheet(wb, ws, month.name)
    })
    
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([buffer]), 'ตัวอย่างบันทึกการเกษตร.xlsx')
    
    message.success('ดาวน์โหลดไฟล์ตัวอย่างเรียบร้อย!')
  }

  const processFile = async () => {
    if (!file) return
    
    setProcessing(true)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      
      let allCashData = []
      let allCheckData = []
      
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        
        const cashData = jsonData.filter(row => 
          row['ประเภท'] === 'เงินสด' || 
          (row['ประเภท'] && row['ประเภท'].toString().toLowerCase().includes('cash')) ||
          (row['type'] && row['type'].toString().toLowerCase().includes('cash'))
        ).map(row => ({ ...row, 'ชีท': sheetName }))
        
        const checkData = jsonData.filter(row => 
          row['ประเภท'] === 'เช็ค' || 
          (row['ประเภท'] && row['ประเภท'].toString().toLowerCase().includes('check')) ||
          (row['type'] && row['type'].toString().toLowerCase().includes('check'))
        ).map(row => ({ ...row, 'ชีท': sheetName }))
        
        allCashData = [...allCashData, ...cashData]
        allCheckData = [...allCheckData, ...checkData]
      })
      
      setProcessedData({ cashData: allCashData, checkData: allCheckData })
      message.success(`จัดการเสร็จสิ้น! เงินสด: ${allCashData.length} รายการ, เช็ค: ${allCheckData.length} รายการ`)
      setProcessing(false)
    }
    
    reader.readAsArrayBuffer(file)
  }

  const downloadCashFile = () => {
    if (!processedData?.cashData) return
    
    const cashWS = XLSX.utils.json_to_sheet(processedData.cashData)
    const cashWB = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(cashWB, cashWS, 'เงินสด')
    const cashBuffer = XLSX.write(cashWB, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([cashBuffer]), 'รายรับเงินสด.xlsx')
    message.success('ดาวน์โหลดไฟล์รายรับเงินสดเรียบร้อย!')
  }

  const downloadCheckFile = () => {
    if (!processedData?.checkData) return
    
    const checkWS = XLSX.utils.json_to_sheet(processedData.checkData)
    const checkWB = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(checkWB, checkWS, 'เช็ค')
    const checkBuffer = XLSX.write(checkWB, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([checkBuffer]), 'รายรับเช็ค.xlsx')
    message.success('ดาวน์โหลดไฟล์รายรับเช็คเรียบร้อย!')
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f8f9fa',
      padding: '1.5rem',
      fontFamily: '"Noto Sans Thai", sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card 
          style={{ 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e8e8e8'
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <Title level={1} style={{ 
                color: '#2d5016',
                marginBottom: '1rem',
                fontFamily: '"Noto Sans Thai", sans-serif',
                fontSize: '32px',
                fontWeight: '600'
              }}>
                จัดการไฟล์ Excel
              </Title>
            </div>
            
            {/* <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Button 
                onClick={downloadSample}
                style={{
                  borderRadius: '6px',
                  height: '50px',
                  fontSize: '18px',
                  fontFamily: '"Noto Sans Thai", sans-serif',
                  padding: '0 2rem',
                  background: '#4caf50',
                  color: 'white',
                  border: 'none'
                }}
              >
                ดาวน์โหลดตัวอย่าง
              </Button>
            </div> */}
            
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <Upload
                accept=".xlsx,.xls"
                beforeUpload={() => false}
                onChange={handleFileUpload}
                maxCount={1}
                showUploadList={false}
              >
                <Button
                  style={{
                    borderRadius: '8px',
                    height: '60px',
                    fontSize: '20px',
                    fontFamily: '"Noto Sans Thai", sans-serif',
                    padding: '0 3rem',
                    background: '#4caf50',
                    color: 'white',
                    border: 'none',
                    width: '100%',
                    maxWidth: '300px'
                  }}
                >
                  เลือกไฟล์ Excel
                </Button>
              </Upload>
            </div>
            
            {processing && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <Card style={{ borderRadius: '8px', padding: '2rem', background: '#f0f8f0' }}>
                  <Text style={{ fontSize: '20px', fontFamily: '"Noto Sans Thai", sans-serif', color: '#2d5016' }}>
                    กำลังประมวลผลไฟล์...
                  </Text>
                </Card>
              </div>
            )}
            
            {processedData && (
              <Row gutter={[32, 32]} style={{ marginTop: '3rem' }}>
                <Col xs={24} md={12}>
                  <Card 
                    style={{ 
                      borderRadius: '8px',
                      background: '#e8f5e8',
                      border: '2px solid #4caf50',
                      textAlign: 'center',
                      padding: '1.5rem'
                    }}
                  >
                    <Title level={3} style={{ color: '#2d5016', marginBottom: '1rem', fontFamily: '"Noto Sans Thai", sans-serif', fontSize: '24px' }}>
                      เงินสด
                    </Title>
                    <Text style={{ fontSize: '18px', color: '#666', display: 'block', marginBottom: '1rem' }}>
                      {processedData.cashData.length} รายการ
                    </Text>
                    <Button 
                      onClick={downloadCashFile}
                      style={{
                        background: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        height: '45px',
                        fontSize: '16px',
                        fontFamily: '"Noto Sans Thai", sans-serif'
                      }}
                    >
                      ดาวน์โหลด
                    </Button>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card 
                    style={{ 
                      borderRadius: '8px',
                      background: '#e8f5e8',
                      border: '2px solid #8bc34a',
                      textAlign: 'center',
                      padding: '1.5rem'
                    }}
                  >
                    <Title level={3} style={{ color: '#2d5016', marginBottom: '1rem', fontFamily: '"Noto Sans Thai", sans-serif', fontSize: '24px' }}>
                      เช็ค
                    </Title>
                    <Text style={{ fontSize: '18px', color: '#666', display: 'block', marginBottom: '1rem' }}>
                      {processedData.checkData.length} รายการ
                    </Text>
                    <Button 
                      onClick={downloadCheckFile}
                      style={{
                        background: '#8bc34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        height: '45px',
                        fontSize: '16px',
                        fontFamily: '"Noto Sans Thai", sans-serif'
                      }}
                    >
                      ดาวน์โหลด
                    </Button>
                  </Card>
                </Col>
              </Row>
            )}
          </Space>
        </Card>
      </div>
    </div>
  )
}

export default App
