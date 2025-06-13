  {/* @ts-ignore */}
  <SafeDragDropContext onDragEnd={handleDragEnd as any}>
    {/* @ts-ignore */}
    <SafeDroppable droppableId="categories">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {categoryOrder.map((cat, idx) => 
            // @ts-ignore
            (<SafeDraggable key={cat.id} draggableId={cat.id} index={idx}>
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                  className={`category-card ${snapshot.isDragging ? 'shadow-lg scale-105' : ''}`}
                >
                  <div className="flex items-center justify-between p-3 bg-card rounded-md mb-2">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-sm text-muted-foreground">{cat.order}</span>
                  </div>
                </div>
              )}
            </SafeDraggable>)
          )}
          {provided.placeholder}
        </div>
      )}
    </SafeDroppable>
  </SafeDragDropContext> 