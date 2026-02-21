import { Draggable } from '@hello-pangea/dnd';

const Card = ({ card, index }) => {
  return (
    <Draggable draggableId={card.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-2 rounded shadow-sm mb-2 text-sm hover:bg-gray-50 cursor-grab active:cursor-grabbing"
          style={{ ...provided.draggableProps.style }} // Essential for smooth dragging
        >
          {card.title}
        </div>
      )}
    </Draggable>
  );
};

export default Card;