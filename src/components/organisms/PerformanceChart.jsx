import { useState, useEffect, useMemo } from 'react'
import Chart from 'react-apexcharts'
import { motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'

const PerformanceChart = ({ grades, loading }) => {
  const [chartType, setChartType] = useState('line')
  
  const chartData = useMemo(() => {
    if (!grades || grades.length === 0) return { series: [], categories: [] }
    
    // Sort grades by date
    const sortedGrades = [...grades].sort((a, b) => new Date(a.date) - new Date(b.date))
    
    // Calculate performance percentages
    const performanceData = sortedGrades.map(grade => ({
      date: format(parseISO(grade.date), 'MMM d'),
      fullDate: grade.date,
      percentage: ((grade.score / grade.maxScore) * 100).toFixed(1),
      assignment: grade.assignmentName,
      category: grade.category
    }))
    
    return {
      series: [{
        name: 'Performance',
        data: performanceData.map(item => parseFloat(item.percentage))
      }],
      categories: performanceData.map(item => item.date),
      fullData: performanceData
    }
  }, [grades])
  
  const chartOptions = {
    chart: {
      type: chartType,
      height: 350,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#2563eb'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 3,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        },
        formatter: function (val) {
          return val.toFixed(0) + '%'
        }
      }
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif'
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const data = chartData.fullData[dataPointIndex]
        return `
          <div class="p-3 bg-white rounded-lg shadow-lg border">
            <div class="font-semibold text-slate-800 mb-1">${data.assignment}</div>
            <div class="text-sm text-slate-600 mb-1">${data.category}</div>
            <div class="text-lg font-bold text-primary">${data.percentage}%</div>
          </div>
        `
      }
    },
    fill: {
      type: chartType === 'line' ? 'gradient' : 'solid',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#0891b2'],
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%'
      }
    }
  }
  
  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Performance Trends</h2>
        </div>
        <div className="h-80 flex items-center justify-center">
          <Loading />
        </div>
      </Card>
    )
  }
  
  if (!grades || grades.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Performance Trends</h2>
        </div>
        <div className="h-80 flex flex-col items-center justify-center text-slate-500">
          <ApperIcon name="TrendingUp" className="w-16 h-16 mb-4 text-slate-300" />
          <p className="text-lg font-medium mb-2">No Performance Data</p>
          <p className="text-sm">Grade data is needed to display performance trends</p>
        </div>
      </Card>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <ApperIcon name="TrendingUp" className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-slate-800">Performance Trends</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={chartType === 'line' ? 'primary' : 'ghost'}
              size="small"
              onClick={() => setChartType('line')}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="TrendingUp" size={16} />
              <span>Line</span>
            </Button>
            <Button
              variant={chartType === 'bar' ? 'primary' : 'ghost'}
              size="small"
              onClick={() => setChartType('bar')}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="BarChart3" size={16} />
              <span>Bar</span>
            </Button>
          </div>
        </div>
        
        <div className="h-80">
          <Chart
            options={chartOptions}
            series={chartData.series}
            type={chartType}
            height="100%"
          />
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              <span>Performance Score</span>
            </div>
          </div>
          <div>
            {grades.length} {grades.length === 1 ? 'assignment' : 'assignments'} tracked
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default PerformanceChart