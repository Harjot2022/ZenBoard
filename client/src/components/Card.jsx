import { Draggable } from '@hello-pangea/dnd';
import { AlignLeft, Clock } from 'lucide-react';

const Card = ({ card, index, onClick }) => {
  
  
  // Helper function to determine the color of the due date badge
  const getDueDateColor = (dateString) => {
    if (!dateString) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Create the due date and fix the timezone offset
    const parsedDate = new Date(dateString);
    const dueDate = new Date(parsedDate.getTime() + Math.abs(parsedDate.getTimezoneOffset() * 60000));
    dueDate.setHours(0, 0, 0, 0);

    // Calculate difference in days safely
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    // Force the CSS classes to return
    if (diffDays < 0) {
      return 'bg-red-500 text-white font-bold'; // Overdue
    } else if (diffDays === 0 || diffDays === 1) {
      return 'bg-yellow-400 text-gray-900 font-bold'; // Due Today/Tomorrow
    } else {
      return 'bg-gray-200 text-gray-700 font-medium'; // Future
    }
  };

  // Helper to format the date nicely (e.g., "Oct 12")
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const badgeColor = getDueDateColor(card.due_date);

  return (
    <Draggable draggableId={card.id.toString()} index={index}>
      {(provided) => (
        <div
          onClick={() => onClick(card)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-3 rounded shadow-sm mb-2 text-sm hover:bg-gray-50 cursor-pointer border border-transparent hover:border-blue-500 transition-colors group"
          style={{ ...provided.draggableProps.style }}
        >
          <p className="font-medium text-gray-800">{card.title}</p>
          
          {/* Card Indicators (Bottom Row) */}
          <div className="mt-2 flex items-center gap-3">
            
            {/* Due Date Badge */}
            {card.due_date && (
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors ${badgeColor}`}>
                <Clock size={12} />
                <span>{formatDate(card.due_date)}</span>
              </div>
            )}

            {/* Description Icon */}
            {card.description && (
              <div className="text-gray-400">
                <AlignLeft size={14} />
              </div>
            )}
            
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Card;