import React from 'react';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface QualityIndicatorProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const QualityIndicator: React.FC<QualityIndicatorProps> = ({ 
  score, 
  size = 'md',
  showLabel = true 
}) => {
  const getQualityInfo = (score: number) => {
    if (score >= 80) {
      return {
        color: 'quality-high',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-200',
        icon: CheckCircle,
        label: 'High Quality'
      };
    } else if (score >= 60) {
      return {
        color: 'quality-medium',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-200',
        icon: AlertCircle,
        label: 'Medium Quality'
      };
    } else {
      return {
        color: 'quality-low',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        icon: XCircle,
        label: 'Low Quality'
      };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-2 py-1 text-xs',
          icon: 'h-3 w-3',
          text: 'text-xs'
        };
      case 'lg':
        return {
          container: 'px-4 py-2 text-base',
          icon: 'h-5 w-5',
          text: 'text-base'
        };
      default:
        return {
          container: 'px-3 py-1.5 text-sm',
          icon: 'h-4 w-4',
          text: 'text-sm'
        };
    }
  };

  const qualityInfo = getQualityInfo(score);
  const sizeClasses = getSizeClasses(size);
  const Icon = qualityInfo.icon;

  return (
    <div className={`
      inline-flex items-center space-x-1 rounded-full border font-medium
      ${qualityInfo.bgColor} ${qualityInfo.textColor} ${qualityInfo.borderColor}
      ${sizeClasses.container}
    `}>
      <Icon className={sizeClasses.icon} />
      <span className={sizeClasses.text}>
        {score}%
      </span>
      {showLabel && size !== 'sm' && (
        <span className={sizeClasses.text}>
          {qualityInfo.label}
        </span>
      )}
    </div>
  );
};

export default QualityIndicator;