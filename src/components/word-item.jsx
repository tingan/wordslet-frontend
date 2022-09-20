import { useRef, useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { RiDeleteBin2Line } from "react-icons/ri";
import { MdDragHandle } from "react-icons/md";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";

export const WordItem = ({
  word,
  index,
  moveWordItem,
  updateField,
  deleteItem,
}) => {
  // useDrag - the list item is draggable
  const [{ isDragging }, dragRef] = useDrag({
    type: "item",
    item: () => {
      return { index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // useDrop - the list item is also a drop area
  const [spec, dropRef] = useDrop({
    accept: "item",
    hover: (item, monitor) => {
      const dragIndex = item.index;
      const hoverIndex = index;
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverActualY = monitor.getClientOffset().y - hoverBoundingRect.top;

      // if dragging down, continue only when hover is smaller than middle Y
      if (dragIndex < hoverIndex && hoverActualY < hoverMiddleY) return;
      // if dragging up, continue only when hover is bigger than middle Y
      if (dragIndex > hoverIndex && hoverActualY > hoverMiddleY) return;

      moveWordItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const handleTermChange = (event, index) => {
    updateField(index, "term", event.target.value);
  };
  const handleDefinitionChange = (event, index) => {
    updateField(index, "definition", event.target.value);
  };
  const [termFocused, setTermFocused] = useState(false);
  const handleFocus = () => {
    console.log("focus");
    setTermFocused(true);
  };
  // Join the 2 refs together into one (both draggable and can be dropped on)
  const ref = useRef(null);
  const dragDropRef = dragRef(dropRef(ref));
  const inputTermRef = useRef(null);
  const inputDefinitionRef = useRef(null);

  // Make items being dragged transparent, so it's easier to see where we drop them
  const opacity = isDragging ? 0 : 1;
  return (
    <fieldset
      className="border-2 flex flex-col mb-3"
      ref={dragDropRef}
      style={{ opacity }}
    >
      <legend>term {index + 1}</legend>
      <div className="word-entry-toolbar flex flex-row justify-center items-center">
        <div className="dragToggle mx-2">
          <span className="contextToggle">
            <button type="button" className="">
              <MdDragHandle />
            </button>
          </span>
        </div>
        <div className="actionableToggles mx-2">
          <span className="ContextToggle">
            <button
              type="button"
              className=""
              onClick={() => deleteItem(index)}
            >
              <RiDeleteBin2Line />
            </button>
          </span>
        </div>
      </div>
      {isBrowser && (
        <>
          <input
            type="text"
            ref={inputTermRef}
            placeholder="term"
            value={word.term}
            className="fieldset-input m-2"
            onChange={(event) => handleTermChange(event, index)}
            draggable={true}
            onDragStart={(event) => event.preventDefault()}
            required
          />
          <input
            type="text"
            ref={inputDefinitionRef}
            placeholder="definition"
            value={word.definition}
            className="fieldset-input m-2"
            onChange={(event) => handleDefinitionChange(event, index)}
            draggable={true}
            onDragStart={(event) => event.preventDefault()}
            required
          />
        </>
      )}

      {isMobile && (
        <>
          <input
            type="text"
            ref={inputTermRef}
            placeholder="term"
            value={word.term}
            className="fieldset-input m-2"
            onChange={(event) => handleTermChange(event, index)}
            draggable={false}
            onDragStart={(event) => event.preventDefault()}
            required
          />
          <input
            type="text"
            ref={inputDefinitionRef}
            placeholder="definition"
            value={word.definition}
            className="fieldset-input m-2"
            onChange={(event) => handleDefinitionChange(event, index)}
            draggable={false}
            onDragStart={(event) => event.preventDefault()}
            required
          />
        </>
      )}
    </fieldset>
  );
};
