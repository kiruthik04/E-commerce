import React from 'react';
import MilestoneStep from './MilestoneStep';

// The full sequence of expected milestones
const EXPECTED_SEQUENCE = [
  'ORDER_PLACED',
  'PACKED',
  'DISPATCHED',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED'
];

const TrackingTimeline = ({ currentStatus, history }) => {
  // Determine the current index in the sequence
  const currentIndex = EXPECTED_SEQUENCE.indexOf(currentStatus);
  
  // Merge history with expected events that haven't happened yet to show future greyed out steps
  const displayMilestones = EXPECTED_SEQUENCE.map((milestoneEnum, index) => {
    // Find if this milestone exists in history
    const historyItem = history.find(h => h.milestone === milestoneEnum);
    
    if (historyItem) return { ...historyItem, isCompleted: index < currentIndex, isCurrent: index === currentIndex };
    
    return {
       milestone: milestoneEnum,
       isCompleted: false,
       isCurrent: false,
       location: null,
       notes: null,
       timestamp: null
    };
  });

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100 p-6 sm:p-8">
      <h3 className="text-lg font-medium text-gray-900 mb-8">Tracking History</h3>
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {displayMilestones.map((milestone, idx) => (
            <li key={milestone.milestone}>
              <MilestoneStep 
                milestone={milestone}
                isLast={idx === displayMilestones.length - 1}
                isCompleted={milestone.isCompleted}
                isCurrent={milestone.isCurrent}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrackingTimeline;
