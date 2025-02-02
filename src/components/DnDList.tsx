import { Droppable, Draggable } from "react-beautiful-dnd";

const DnDList = ({ droppableId, items, children }: any) => {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="space-y-2"
        >
          {items?.map((item: any, index: number) => (
            <Draggable
              key={item.id} // Gunakan item.id sebagai key
              draggableId={String(item.id)}
              index={index} // Gunakan index aktual dari array
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  {children(item, index)}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default DnDList;
