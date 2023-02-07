import { useState, useCallback, useEffect } from "react";
import { WordItem } from "../components/word-item";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import update from "immutability-helper";
import { get_user, get_token } from "../util/utils";
import { useNavigate } from "react-router";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";
import { GrTest } from "react-icons/gr";

function EditWordbook() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const user = get_user();
  const { id } = user;
  const token = get_token();
  let navigate = useNavigate();
  const { wordbook_id } = useParams();
  const [authorId, setAuthorId] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  useEffect(() => {
    axios.get(`/api/wordbook/${wordbook_id}`).then((response) => {
      const wordbook = response.data["docs"][0];
      if (wordbook.uid != id) {
        navigate("/");
      }
      setAuthorId(wordbook.uid);
      setTitle(wordbook.title);
      setDescription(wordbook.description);
      setWords(wordbook.words);
    });
  }, [wordbook_id]);

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

  const deleteWordbook = () => {
    let text = "Are you sure to delete ?";
    if (confirm(text) == true) {
      const response = axios.delete(`/api/wordbook/${wordbook_id}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          uid: id,
        },
      });
      navigate("/wordbook/my");
    }
  };

  const submitForm = () => {
    const response = axios.post(
      `/api/wordbook/${wordbook_id}/update`,
      {
        title: title,
        description: description,
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
      <div className="flex items-center">
        <h2 className="text-lg font-bold">Edit Wordbook</h2>
        <Link
          to={`/wordbook/${wordbook_id}/learn`}
          className="ml-3 hover:scale-150"
        >
          <GrTest />
        </Link>
        <Link
          to={`/wordbook/${wordbook_id}/view`}
          className="ml-4 hover:scale-150"
        >
          <AiFillEye />
        </Link>
      </div>

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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button type="button" className="btn-red mb-2" onClick={deleteWordbook}>
        Delete Wordbook
      </button>
      <button type="submit" className="btn-blue mt-2 mb-2">
        Update Wordbook
      </button>
      <button
        type="button"
        className="btn-blue mt-2 mb-2"
        onClick={() =>
          setWords((prevWords) => [{ term: "", definition: "" }, ...prevWords])
        }
      >
        Add card
      </button>
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
    </form>
  );
}

export default EditWordbook;
