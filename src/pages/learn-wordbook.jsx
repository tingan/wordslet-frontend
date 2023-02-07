import { useRef, useState, useEffect, useCallback } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { appendObjTo } from "../util/utils";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import axios from "axios";
import { TiTick } from "react-icons/ti";
import { TbX } from "react-icons/tb";
import { Link } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";
import { get_user, shuffle_array, sleep, speech } from "../util/utils";
import { AiFillEdit } from "react-icons/ai";
import useWindowSize from "../util/useWindowSize";
import Confetti from "react-confetti";

function LearnWordbook() {
  const { width, height } = useWindowSize();
  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");
  const [showDefinition, setShowDefinition] = useState(false);
  const [authorId, setAuthorId] = useState("");
  const [answerWith, setAnswerWith] = useState("definition");
  const [answer, setAnswer] = useState([]);
  const [answerClicked, setAnswerCliked] = useState(false);
  const [countAnswered, setCountAnswered] = useState(0);
  const [countCorrect, setCountCorrect] = useState(0);
  const [errorBook, setErrorBook] = useState([]);
  const [finished, setFinished] = useState(false);
  const user = get_user();

  let id;
  if (user) {
    id = user.id;
  } else {
    id = null;
  }

  const [words, setWords] = useState([]);
  let navigate = useNavigate();
  const { wordbook_id } = useParams();
  const swiperRef = useRef(null);

  const handleAnswerWithChange = (e) => {
    setAnswerWith(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const onSlideChange = (swiper) => {
    setCountAnswered(answer.filter((obj) => obj.answered == true).length);
    setCountCorrect(answer.filter((obj) => obj.correct == true).length);
    setAnswerCliked(false);
  };

  const generate_answers = (word, mode = "definition") => {
    const arr = [];
    if (words.length >= 1) {
      if (mode == "definition") {
        arr.push({ text: word.definition, isCorrect: true });
        let definition_arr = words.map(({ definition }) => definition);
        const definition_set = new Set(definition_arr);
        definition_set.delete(word.definition);
        const set_size = definition_set.size;
        let slice_count;
        if (set_size >= 3) {
          slice_count = 3;
        } else {
          slice_count = set_size;
        }
        const arr2 = shuffle_array(definition_set);
        const arr3 = arr2.slice(0, slice_count);
        const arr4 = arr3.map((obj) => ({ text: obj, isCorrect: false }));
        const arr5 = [...arr, ...arr4];
        const arr6 = shuffle_array(arr5);
        // console.log('arr6', arr6)
        return arr6;
      } else {
        // answerWith term
        arr.push({ text: word.term, isCorrect: true });
        let term_arr = words.map(({ term }) => term);
        const term_set = new Set(term_arr);
        term_set.delete(word.term);
        const set_size = term_set.size;
        let slice_count;
        if (set_size >= 3) {
          slice_count = 3;
        } else {
          slice_count = set_size;
        }

        const arr2 = shuffle_array(term_set);
        const arr3 = arr2.slice(0, 3);
        const arr4 = arr3.map((obj) => ({ text: obj, isCorrect: false }));
        const arr5 = [...arr, ...arr4];
        const arr6 = shuffle_array(arr5);
        // console.log('arr6', arr6)
        return arr6;
      }
    }
  };

  const shuffle_questions = () => {
    if (words.length == 0) {
      alert("No terms in this wordbook.");
      return false;
    }
    let words_clone = JSON.parse(JSON.stringify(words));
    const words2 = shuffle_array(words_clone);
    words2.map((word, index) => {
      const ans = generate_answers(word, "definition");
      words2[index]["answer_definition"] = ans;
      words2[index]["answered"] = false;
      words2[index]["correct"] = false;
    });
    words2.map((word, index) => {
      const ans = generate_answers(word, "term");
      words2[index]["answer_term"] = ans;
      //words2[index]['answered']=false
    });

    setAnswer(words2.slice(0, quantity));
    swiperRef.current.swiper.slideTo(0, 1, false);
    setCountAnswered(0);
    setCountCorrect(0);
    setErrorBook([]);
    setFinished(false);
  };

  const handleAnswerClick = async (term, definition, index, ans, e) => {
    e.preventDefault();
    answer[index]["answered"] = true;
    if (ans.isCorrect) {
      answer[index]["correct"] = true;
    } else {
      answer[index]["correct"] = false;
      setErrorBook(
        appendObjTo(errorBook, {
          term: term,
          definition: definition,
          error: ans.text,
        })
      );
      /*
      setErrorBook([
        ...errorBook,
        { term: term, definition: definition, error: ans.text },
      ]);
      */
    }
    setAnswerCliked(true);
    await sleep(1500);
    if (swiperRef.current.swiper.isEnd) {
      setFinished(true);
    } else {
      swiperRef.current.swiper.slideTo(index + 1, 1, false);
    }
    return false;
  };

  useEffect(() => {
    axios.get(`/api/wordbook/${wordbook_id}`).then((response) => {
      const wordbook = response.data["docs"][0];
      setAuthorId(wordbook.uid);
      setTitle(wordbook.title);
      setDescription(wordbook.description);
      setWords(wordbook.words);
      setQuantity(wordbook.words.length);
    });
  }, [wordbook_id]);

  useEffect(() => {
    if (words.length > 0) {
      shuffle_questions();
    }
  }, [words]);

  return (
    <div>
      <div className="flex items-center">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="ml-4">
          ({words.length > 1 ? words.length + " terms" : words.length + " term"}
          )
        </span>
        <Link
          to={`/wordbook/${wordbook_id}/view`}
          className="ml-3 hover:scale-150"
        >
          <AiFillEye />
        </Link>
        <Link
          hidden={id != authorId}
          to={`/wordbook/${wordbook_id}/edit`}
          className="ml-4 hover:scale-150"
        >
          <AiFillEdit />
        </Link>
        <span className="ml-auto mr-2 font-bold">
          Correct rate:{" "}
          {countAnswered == 0
            ? 0
            : ((countCorrect / countAnswered) * 100).toFixed(1) + "%"}
        </span>
      </div>

      <h3 className="text-md">{description}</h3>
      <div className="flex flex-row flex-wrap mt-2 gap-3 content-between">
        <div className="flex ml-3">
          <div className="flex items-center mr-4 ">
            <input
              id="inline-radio"
              type="radio"
              name="inline-radio-group"
              value="definition"
              onChange={handleAnswerWithChange}
              checked={answerWith == "definition"}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="inline-radio"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Answer with definition
            </label>
          </div>
          <div className="flex items-center mr-4">
            <input
              id="inline-2-radio"
              type="radio"
              name="inline-radio-group"
              value="term"
              checked={answerWith == "term"}
              onChange={handleAnswerWithChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="inline-2-radio"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Answer with term
            </label>
          </div>
        </div>
        <div className="flex items-center mr-4">
          <label htmlFor="quantity">Quantity </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            max={words.length}
            value={quantity}
            onChange={handleQuantityChange}
          />
        </div>
        <button
          type="button"
          onClick={shuffle_questions}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Shuffle
        </button>
      </div>

      <Swiper
        ref={swiperRef}
        pagination={{
          type: "progressbar",
          clickable: false,
        }}
        navigation={false}
        centeredSlides={true}
        preventClicks={true}
        onSlideChange={onSlideChange}
        noSwipingClass="swiper-slide"
        autoplay={false}
        scrollbar={false}
        loop={false}
        modules={[Pagination]}
        className="flex flex-col align-center justify-center gap-4 max-w-2xl h-96 border mt-4 shadow-lg"
      >
        {answer.map((word, index) => (
          <SwiperSlide className="flex flex-col" key={index}>
            <span className="inline-flex justify-center items-center absolute right-1 top-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full p-3">
              {index + 1 + "/" + answer.length}
            </span>
            {answerWith == "definition" ? (
              <h2 className="text-6xl font-sans font-bold mt-10">
                {" "}
                {word.term}{" "}
              </h2>
            ) : null}
            {answerWith == "term" ? (
              <h2 className="text-6xl font-sans font-bold mt-10">
                {" "}
                {word.definition}{" "}
              </h2>
            ) : null}
            <div className="grid grid-cols-2 grid-rows-2 w-full mx-auto mt-auto">
              {answerWith == "definition" &&
                word.answer_definition.map((ans) => (
                  <button
                    type="button"
                    disabled={answerClicked}
                    className={`text-xl ${
                      answerClicked && ans.isCorrect ? "btn-outline-green" : ""
                    } ${
                      answerClicked && !ans.isCorrect ? "btn-outline-red" : ""
                    } ${!answerClicked ? "btn-light" : ""}`}
                    key={ans.text}
                    onClick={(e) =>
                      handleAnswerClick(
                        word.term,
                        word.definition,
                        index,
                        ans,
                        e
                      )
                    }
                  >
                    {answerClicked && ans.isCorrect ? (
                      <TiTick color="green" className="align-middle" />
                    ) : (
                      ""
                    )}
                    {answerClicked && !ans.isCorrect ? (
                      <TbX color="red" className="align-middle" />
                    ) : (
                      ""
                    )}
                    {ans.text}
                  </button>
                ))}

              {answerWith == "term" &&
                word.answer_term.map((ans) => (
                  <button
                    type="button"
                    disabled={answerClicked}
                    className={`${
                      answerClicked && ans.isCorrect ? "btn-outline-green" : ""
                    } ${
                      answerClicked && !ans.isCorrect ? "btn-outline-red" : ""
                    } ${!answerClicked ? "btn-light" : ""}`}
                    key={ans.text}
                    onClick={(e) =>
                      handleAnswerClick(
                        word.term,
                        word.definition,
                        index,
                        ans,
                        e
                      )
                    }
                  >
                    {answerClicked && ans.isCorrect ? (
                      <TiTick color="green" className="align-middle" />
                    ) : (
                      ""
                    )}
                    {answerClicked && !ans.isCorrect ? (
                      <TbX color="red" className="align-middle" />
                    ) : (
                      ""
                    )}{" "}
                    {ans.text}
                  </button>
                ))}
            </div>
            {finished && answerClicked ? (
              <Confetti width={width} height={height} />
            ) : (
              ""
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {errorBook.length > 0 && (
        <div className="overflow-x-auto relative mt-5">
          <table className="w-fit text-sm text-left text-gray-500 dark:text-gray-400 gap-2 mx-auto">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Term
                </th>
                <th scope="col" className="py-3 px-6">
                  Definition
                </th>
                <th scope="col" className="py-3 px-6">
                  Wrong Answer
                </th>
              </tr>
            </thead>
            <tbody>
              {errorBook.map((error, index) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  key={index}
                >
                  <td
                    scope="row"
                    className="text-lg py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {error.term}
                  </td>
                  <td className="text-lg py-4 px-6">{error.definition}</td>
                  <td className="text-lg py-4 px-6">{error.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LearnWordbook;
