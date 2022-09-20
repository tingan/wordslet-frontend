import { useRef, useState, useEffect } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import axios from "axios";
import { Link } from "react-router-dom";
import { GrTest } from "react-icons/gr";
import { get_user, shuffle_array } from "../util/utils";
import { AiFillEdit } from "react-icons/ai";

function ViewWordbook() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showDefinition, setShowDefinition] = useState(true);
  const [delay, setDelay] = useState(2.5);
  const [autoPlay, setAutoPlay] = useState(true);
  const [authorId, setAuthorId] = useState("");
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

  const handleAutoPlayChange = (e) => {
    if (e.target.checked) {
      setAutoPlay(true);
      swiperRef.current.swiper.autoplay.start();
    } else {
      setAutoPlay(false);
      swiperRef.current.swiper.autoplay.stop();
    }
  };

  const handleShowDefinitionChange = (e) => {
    if (e.target.checked) {
      setShowDefinition(true);
    } else {
      setShowDefinition(false);
    }
  };
  const handleDelayChange = (e) => {
    setDelay(e.target.value);
  };

  const shuffle_questions = () => {
    setWords(shuffle_array(words));
  };

  useEffect(() => {
    axios.get(`/api/wordbook/${wordbook_id}`).then((response) => {
      const wordbook = response.data["docs"][0];
      setAuthorId(wordbook.uid);
      setTitle(wordbook.title);
      setDescription(wordbook.description);
      setWords(wordbook.words);
    });
  }, [wordbook_id]);

  return (
    <div>
      <div className="flex items-center">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="ml-4">
          ({words.length > 1 ? words.length + " terms" : words.length + " term"}
          )
        </span>
        <Link
          to={`/wordbook/${wordbook_id}/learn`}
          className="ml-3 hover:scale-150"
        >
          <GrTest />
        </Link>
        <Link
          hidden={id != authorId}
          to={`/wordbook/${wordbook_id}/edit`}
          className="ml-4 hover:scale-150"
        >
          <AiFillEdit />
        </Link>
      </div>

      <h3 className="text-md">{description}</h3>
      <div className="flex flex-row flex-wrap mt-2 mb-2 gap-3">
        <label
          htmlFor="autoplay-toggle"
          className="inline-flex relative items-center cursor-pointer ml-2"
        >
          <input
            type="checkbox"
            id="autoplay-toggle"
            className="sr-only peer"
            checked={autoPlay}
            onChange={handleAutoPlayChange}
          />
          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1.6 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 border" />
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-black">
            Auto Play
          </span>
        </label>
        <label
          htmlFor="showdefinition-toggle"
          className="inline-flex relative items-center cursor-pointer ml-2"
        >
          <input
            type="checkbox"
            id="showdefinition-toggle"
            className="sr-only peer"
            checked={showDefinition}
            onChange={handleShowDefinitionChange}
          />
          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1.6 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 border" />
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-black">
            Show Definition
          </span>
        </label>

        <input
          id="steps-range"
          type="range"
          min={2}
          max={10}
          defaultValue="2.5"
          step="0.5"
          className="ml-3 border w-30 bg-gray-600 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          onChange={handleDelayChange}
        />
        <label
          htmlFor="steps-range"
          className="inline-flex relative items-center cursor-pointer ml-2"
        >
          Speed ({delay} s)
        </label>
        <button
          type="button"
          onClick={shuffle_questions}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-full text-sm  text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 px-5 py-2.5 ml-2"
        >
          Shuffle
        </button>
      </div>

      <Swiper
        ref={swiperRef}
        pagination={{
          type: "progressbar",
          clickable: true,
        }}
        navigation={true}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: delay * 1000,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Navigation, Autoplay]}
        className="flex flex-col align-center justify-center gap-4 max-w-2xl h-96 border mt-4 shadow-lg"
      >
        {words.map((word, index) => (
          <SwiperSlide className="flex flex-col" key={index}>
            <span className="inline-flex justify-center items-center absolute right-1 top-1 w-4 h-4 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full p-3">
              {index + 1 + "/" + words.length}
            </span>
            <h2 className="text-6xl font-sans font-bold mb-2"> {word.term} </h2>
            {showDefinition ? (
              <h3 className="text-3xl font-semibold text-blue-500">
                {" "}
                {word.definition}{" "}
              </h3>
            ) : null}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ViewWordbook;
