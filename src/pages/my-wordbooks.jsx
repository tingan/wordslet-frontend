import { useEffect, useState } from "react";
import axios from "axios";
import { get_user } from "../util/utils";
import { FcPrevious, FcNext } from "react-icons/fc";
import { BiFirstPage, BiLastPage } from "react-icons/bi";
import { AiFillEye, AiFillEdit } from "react-icons/ai";
import { GrTest } from "react-icons/gr";
import { Link } from "react-router-dom";

function MyWordbooks() {
  const [wordbooks, setWordbooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const user = get_user();
  const [searchText, setSearchText] = useState("");

  const goPrevious = () => {
    setCurrentPage(currentPage - 1);
  };

  const goNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const goFirst = () => {
    setCurrentPage(1);
  };

  const goLast = () => {
    setCurrentPage(totalPages);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value.trim());
  };

  useEffect(() => {
    if (searchText != "") {
      setCurrentPage(1);
      axios
        .get(`/api/wordbook/my/${user.id}`, {
          params: {
            currentPage: currentPage,
            perPage: perPage,
            search: searchText,
          },
        })
        .then((response) => {
          setCount(response.data.count);
          setWordbooks(response.data.docs);
          setTotalPages(Math.ceil(response.data.count / perPage));
        });
    } else {
      setCurrentPage(1);
      fetch_all_wordbooks();
    }
  }, [searchText]);

  const fetch_all_wordbooks = () => {
    axios
      .get(`/api/wordbook/my/${user.id}`, {
        params: { currentPage: currentPage, perPage: perPage, search: "" },
      })
      .then((response) => {
        setCount(response.data.count);
        setWordbooks(response.data.docs);
        setTotalPages(Math.ceil(response.data.count / perPage));
      });
  };

  useEffect(() => {
    fetch_all_wordbooks();
  }, [currentPage, perPage]);

  return (
    <div className="p-8">
      <div className="my-3 flex flex-row items-center justify-between">
        <div>
          {" "}
          Page {currentPage} / {totalPages}{" "}
        </div>
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Search icon</span>
          </div>
          <input
            type="text"
            className="block p-2 pl-10 w-60 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search..."
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="grid grid-cols-fluid gap-4 lg:gap-8">
        {wordbooks.map((book, index) => (
          <div key={book._id} className="card">
            <Link
              to={`/wordbook/${book._id}/view`}
              className="break-words hover:text-blue-500"
            >
              {book.title}
            </Link>
            <div className="text-gray-400">
              {book.words.length > 1
                ? book.words.length + " terms"
                : book.words.length + " term"}
            </div>
            <div className="flex justify-center items-center mt-5 gap-3">
              <Link
                to={`/wordbook/${book._id}/view`}
                className="hover:scale-150"
              >
                <AiFillEye />
              </Link>
              <Link
                to={`/wordbook/${book._id}/edit`}
                className="hover:scale-150"
              >
                <AiFillEdit />
              </Link>
              <Link
                to={`/wordbook/${book._id}/learn`}
                className="hover:scale-150"
              >
                <GrTest />
              </Link>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-5 flex justify-center content-center">
          <button
            type="button"
            disabled={currentPage == 1}
            className="paginate-btn disabled:opacity-25"
            onClick={goFirst}
          >
            <BiFirstPage color="#2196F3" />
          </button>
          <button
            type="button"
            disabled={currentPage == 1}
            className="paginate-btn disabled:opacity-25"
            onClick={goPrevious}
          >
            <FcPrevious />
          </button>
          <button
            type="button"
            disabled={currentPage == totalPages}
            className="paginate-btn disabled:opacity-25"
            onClick={goNext}
          >
            <FcNext />
          </button>
          <button
            type="button"
            disabled={currentPage == totalPages}
            className="paginate-btn disabled:opacity-25"
            onClick={goLast}
          >
            <BiLastPage color="#2196F3" />
          </button>
        </div>
      )}
    </div>
  );
}

export default MyWordbooks;
