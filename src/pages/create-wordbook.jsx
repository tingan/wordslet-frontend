import { useState, useCallback, useEffect } from "react";
import useInput from "../hooks/useInput.js";
import { WordItem } from "../components/word-item";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import update from "immutability-helper";
import { get_user, get_token } from "../util/utils";
import { useNavigate } from "react-router";
import axios from "axios";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";

function CreateWordbook() {
  const title = useInput("");
  const description = useInput("");
  const user = get_user();
  const { id } = user;
  const token = get_token();
  let navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  const [words, setWords] = useState([]);

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      setWords((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        })
      );
    },
    [words]
  );

  const updateField = useCallback(
    (index, name, value) => {
      setWords((words) => {
        const updatedWords = [...words];
        updatedWords[index][name] = value;
        return updatedWords;
      });
    },
    [words]
  );

  const deleteCard = useCallback(
    (index) => {
      setWords((prevCards) =>
        update(prevCards, {
          $splice: [[index, 1]],
        })
      );
    },
    [words]
  );

  const submitForm = () => {
    const response = axios.put(
      `/api/wordbook/new`,
      {
        title: title.value,
        description: description.value,
        uid: id,
        words: words,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    navigate("/wordbook/my");
  };

  return (
    <form onSubmit={submitForm} className="flex flex-col">
      <h1 className="text-lg font-bold my-2">Create a new wordbook</h1>
      <div className="mb-6">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          type="text"
          id="title"
          className="form-input"
          placeholder=""
          required
          {...title}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <input
          type="text"
          id="description"
          className="form-input"
          {...description}
        />
      </div>
      {isBrowser && (
        <DndProvider backend={HTML5Backend}>
          {words.map((word, index) => (
            <WordItem
              key={index}
              index={index}
              word={word}
              moveWordItem={moveCard}
              updateField={updateField}
              deleteItem={deleteCard}
            />
          ))}
        </DndProvider>
      )}

      {isMobile && (
        <DndProvider backend={TouchBackend}>
          {words.map((word, index) => (
            <WordItem
              key={index}
              index={index}
              word={word}
              moveWordItem={moveCard}
              updateField={updateField}
              deleteItem={deleteCard}
            />
          ))}
        </DndProvider>
      )}
      <button
        type="button"
        className="btn-blue mt-10 mb-2"
        onClick={() =>
          setWords((prevWords) => [...prevWords, { term: "", definition: "" }])
        }
      >
        Add card
      </button>
      <button type="submit" className="btn-blue mt-2">
        Submit
      </button>
    </form>
  );
}

export default CreateWordbook;
