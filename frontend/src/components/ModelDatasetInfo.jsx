import { useState } from 'react'
import { Brain, Database, TrendingUp, Zap, Download, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'

export default function ModelDatasetInfo() {
  const [modelExpanded, setModelExpanded] = useState(false)
  const [datasetExpanded, setDatasetExpanded] = useState(false)

  const modelInfo = {
    name: "DistilBERT for Emotion Classification",
    architecture: "DistilBERT (Distilled BERT)",
    parameters: "66,955,010",
    size: "268 MB",
    baseModel: "distilbert-base-uncased",
    optimization: "40% faster, 60% smaller than BERT",
    performance: {
      accuracy: 94.42,
      f1Score: 0.9662,
      precision: 0.9636,
      recall: 0.9688
    },
    training: {
      gpu: "NVIDIA RTX 2050 (4GB)",
      precision: "FP16 Mixed Precision",
      batchSize: "8 + Gradient Accumulation (2)",
      epochs: 4,
      learningRate: "2e-5",
      trainingTime: "~5 hours"
    }
  }

  const datasetInfo = {
    totalSamples: 359694,
    sources: [
      {
        name: "Sentiment140 (Twitter)",
        samples: 99708,
        percentage: 27.7,
        purpose: "Casual social media language patterns",
        distribution: { normal: 49956, stressed: 49752 },
        icon: "🐦"
      },
      {
        name: "Reddit - Suicide Watch",
        samples: 232043,
        percentage: 64.5,
        purpose: "Crisis & high-stress detection",
        distribution: { normal: 0, stressed: 232043 },
        icon: "🔴"
      },
      {
        name: "Mental Health - Facebook",
        samples: 27943,
        percentage: 7.8,
        purpose: "Balanced mental health discussions",
        distribution: { normal: 14115, stressed: 13828 },
        icon: "📘"
      }
    ],
    split: {
      training: { samples: 287755, percentage: 80 },
      validation: { samples: 35969, percentage: 10 },
      testing: { samples: 35970, percentage: 10 }
    },
    labelDistribution: {
      stressed: { count: 295623, percentage: 82.2 },
      normal: { count: 64071, percentage: 17.8 }
    }
  }

  return (
    <div className="space-y-8">
      {/* Model Card */}
      <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setModelExpanded(!modelExpanded)}
        >
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <span>🤖 About Our AI Model</span>
          </h2>
          {modelExpanded ? (
            <ChevronUp className="w-6 h-6 text-gray-600" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-600" />
          )}
        </div>

        {modelExpanded && (
          <div className="mt-6 space-y-6 animate-fade-in">
            {/* Architecture */}
            <div className="bg-white p-6 rounded-xl border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                <span>Model Architecture</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <InfoItem label="Model" value={modelInfo.architecture} />
                  <InfoItem label="Parameters" value={modelInfo.parameters} />
                  <InfoItem label="Model Size" value={modelInfo.size} />
                </div>
                <div className="space-y-3">
                  <InfoItem label="Base Model" value={modelInfo.baseModel} />
                  <InfoItem label="Optimization" value={modelInfo.optimization} />
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 font-medium">
                      ✅ Optimized for real-time inference on consumer hardware
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white p-6 rounded-xl border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
                <span>Performance Metrics</span>
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                <MetricCard
                  label="Accuracy"
                  value={`${modelInfo.performance.accuracy}%`}
                  status="excellent"
                  target="≥85%"
                />
                <MetricCard
                  label="F1-Score"
                  value={modelInfo.performance.f1Score.toFixed(2)}
                  status="excellent"
                  target="≥0.85"
                />
                <MetricCard
                  label="Precision"
                  value={modelInfo.performance.precision.toFixed(2)}
                  status="excellent"
                  target="≥0.85"
                />
                <MetricCard
                  label="Recall"
                  value={modelInfo.performance.recall.toFixed(2)}
                  status="excellent"
                  target="≥0.85"
                />
              </div>
            </div>

            {/* Training Configuration */}
            <div className="bg-white p-6 rounded-xl border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">⚙️ Training Configuration</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <InfoItem label="GPU" value={modelInfo.training.gpu} />
                <InfoItem label="Precision" value={modelInfo.training.precision} />
                <InfoItem label="Batch Size" value={modelInfo.training.batchSize} />
                <InfoItem label="Epochs" value={modelInfo.training.epochs} />
                <InfoItem label="Learning Rate" value={modelInfo.training.learningRate} />
                <InfoItem label="Training Time" value={modelInfo.training.trainingTime} />
              </div>
            </div>

            {/* Why DistilBERT */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Why DistilBERT?</h3>
              <p className="text-gray-700 mb-4">
                DistilBERT maintains 97% of BERT's language understanding while being significantly faster and smaller. 
                This makes real-time emotion analysis possible on consumer hardware without compromising accuracy.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="btn btn-primary flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download Model Card PDF</span>
                </button>
                <button className="btn btn-secondary flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>View on Hugging Face</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dataset Card */}
      <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setDatasetExpanded(!datasetExpanded)}
        >
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
            <Database className="w-8 h-8 text-green-600" />
            <span>📚 Training Dataset Overview</span>
          </h2>
          {datasetExpanded ? (
            <ChevronUp className="w-6 h-6 text-gray-600" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-600" />
          )}
        </div>

        {datasetExpanded && (
          <div className="mt-6 space-y-6 animate-fade-in">
            {/* Summary */}
            <div className="bg-white p-6 rounded-xl border border-green-200">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-900">{datasetInfo.totalSamples.toLocaleString()}</p>
                  <p className="text-gray-600 mt-1">Total Samples</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-900">3</p>
                  <p className="text-gray-600 mt-1">Data Sources</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-900">2</p>
                  <p className="text-gray-600 mt-1">Classifications</p>
                </div>
              </div>
            </div>

            {/* Dataset Sources */}
            <div className="space-y-4">
              {datasetInfo.sources.map((source, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-green-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-4xl">{source.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{source.name}</h3>
                        <p className="text-sm text-gray-600">{source.purpose}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{source.samples.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{source.percentage}%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                        style={{ width: `${(source.distribution.normal / source.samples) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">
                      Normal: {source.distribution.normal.toLocaleString()} | 
                      Stressed: {source.distribution.stressed.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Data Split */}
            <div className="bg-white p-6 rounded-xl border border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Data Split</h3>
              <div className="space-y-3">
                <DataSplitBar
                  label="Training"
                  samples={datasetInfo.split.training.samples}
                  percentage={datasetInfo.split.training.percentage}
                  color="blue"
                />
                <DataSplitBar
                  label="Validation"
                  samples={datasetInfo.split.validation.samples}
                  percentage={datasetInfo.split.validation.percentage}
                  color="purple"
                />
                <DataSplitBar
                  label="Testing"
                  samples={datasetInfo.split.testing.samples}
                  percentage={datasetInfo.split.testing.percentage}
                  color="green"
                />
              </div>
            </div>

            {/* Label Distribution */}
            <div className="bg-white p-6 rounded-xl border border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🏷️ Label Distribution</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-gray-600 mb-1">Stressed/Depressed</p>
                  <p className="text-3xl font-bold text-red-600">
                    {datasetInfo.labelDistribution.stressed.count.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {datasetInfo.labelDistribution.stressed.percentage}% of total
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Normal/Healthy</p>
                  <p className="text-3xl font-bold text-green-600">
                    {datasetInfo.labelDistribution.normal.count.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {datasetInfo.labelDistribution.normal.percentage}% of total
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Note:</strong> Class imbalance reflects real-world mental health data patterns. 
                  The model uses weighted loss functions to ensure fair predictions for both classes.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button className="btn btn-primary flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download Dataset Info</span>
              </button>
              <button className="btn btn-secondary flex items-center space-x-2">
                <ExternalLink className="w-4 h-4" />
                <span>View Sample Data</span>
              </button>
              <button className="btn btn-secondary flex items-center space-x-2">
                <span>📝 Generate Citation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper Components
function InfoItem({ label, value }) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  )
}

function MetricCard({ label, value, status, target }) {
  const statusColors = {
    excellent: 'bg-green-50 border-green-200 text-green-700',
    good: 'bg-blue-50 border-blue-200 text-blue-700',
    fair: 'bg-yellow-50 border-yellow-200 text-yellow-700'
  }

  return (
    <div className={`p-4 rounded-lg border-2 ${statusColors[status]}`}>
      <p className="text-sm opacity-75 mb-1">{label}</p>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-xs opacity-75">Target: {target}</p>
      <p className="text-xs font-semibold mt-2">✅ Met</p>
    </div>
  )
}

function DataSplitBar({ label, samples, percentage, color }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-600">
          {samples.toLocaleString()} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`${colorClasses[color]} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
