import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons/faImage";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

import SearchBar from "./components/SearchBar";
import LoadingState from "./components/LoadingState";
import FilterBar from "./components/FilterBar";
import ImageGrid from "./components/ImageGrid";
import ImageModal from "./components/ImageModal";
import LikedPanel from "./components/LikedPanel";

const App = () => {
  const [query, setQuery] = React.useState("");
  const [images, setImages] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [totalResults, setTotalResults] = React.useState(0);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [error, setError] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");

  const [likedImages, setLikedImages] = React.useState(() => {
    const savedLikes = localStorage.getItem("liked");
    return savedLikes ? JSON.parse(savedLikes) : [];
  });

  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [category, setCategory] = React.useState("All");
  const [orientation, setOrientation] = React.useState("All");
  const [showLiked, setShowLiked] = React.useState(false);
  const [viewMode, setViewMode] = React.useState("grid");

  const orientationMap = {
    Landscape: "landscape",
    Portrait: "portrait",
    Squarish: "squarish",
  };

  const sentinelRef = React.useRef(null);

  React.useEffect(() => {
    localStorage.setItem("liked", JSON.stringify(likedImages));
  }, [likedImages]);

  function handleSearch(value) {
    setSearchTerm(value);
    setImages([]);
    setPage(1);
    setError("");
    setHasMore(true);
  }

  function handleQueryChange(value) {
    setQuery(value);
  }

  function handleCategoryChange(value) {
    setCategory(value);
    setImages([]);
    setPage(1);
    setHasMore(true);
  }

  function handleOrientationChange(value) {
    setOrientation(value);
    setImages([]);
    setPage(1);
    setHasMore(true);
  }

  function handleToggleLiked() {
    setShowLiked((prev) => !prev);
  }

  async function fetchImages(searchQuery, pageNumber) {
    if (!searchQuery.trim() || searchQuery.trim().length < 3) return;

    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

      const categoryQuery =
        category === "All"
          ? searchQuery
          : `${searchQuery} ${category}`;

      let url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        categoryQuery
      )}&page=${pageNumber}&per_page=20`;

      if (orientation !== "All") {
        url += `&orientation=${orientationMap[orientation]}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Client-ID ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      const data = await response.json();

      setTotalResults(data.total);

      setImages((prev) => {
        const updated = [...prev, ...data.results];

        if (updated.length >= data.total) {
          setHasMore(false);
        }

        return updated;
      });
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (searchTerm) {
      fetchImages(searchTerm, page);
    }
  }, [searchTerm, page, category, orientation]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0 }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  function handleLikedImage(image) {
    const isLiked = likedImages.some((img) => img.id === image.id);

    if (isLiked) {
      setLikedImages(
        likedImages.filter((img) => img.id !== image.id)
      );
    } else {
      setLikedImages([...likedImages, image]);
    }
  }

  function handleRemoveLiked(id) {
    setLikedImages(
      likedImages.filter((img) => img.id !== id)
    );
  }

  function handleSelectImage(image) {
    setSelectedImage(image);
  }

  function handleCloseModal() {
    setSelectedImage(null);
  }

  function handleNextImage() {
    const index = images.findIndex(
      (img) => img.id === selectedImage.id
    );

    if (index < images.length - 1) {
      setSelectedImage(images[index + 1]);
    } else if (hasMore) {
      setPage((prev) => prev + 1);
    }
  }

  function handlePrevImage() {
    const index = images.findIndex(
      (img) => img.id === selectedImage.id
    );

    if (index > 0) {
      setSelectedImage(images[index - 1]);
    }
  }

  const likedIds = likedImages.map((img) => img.id);
  const isLiked = selectedImage
    ? likedIds.includes(selectedImage.id)
    : false;

  const currentIndex = selectedImage
    ? images.findIndex((img) => img.id === selectedImage.id)
    : -1;

  return (
    <div className="app">
      <header className="app-header">
        <div className="left-header">
          <FontAwesomeIcon icon={faImage} />
          <h1>Lens</h1>
        </div>

        <div className="right-header" onClick={handleToggleLiked}>
          <FontAwesomeIcon icon={faHeart} />
          <h3>Liked</h3>
          <span>{likedImages.length}</span>
        </div>
      </header>

      <hr style={{ margin: "0 0 1.5rem 0", opacity: 0.1 }} />

      <SearchBar
        query={query}
        onQueryChange={handleQueryChange}
        onSearch={handleSearch}
      />

      <main className="main-content">
        {images.length > 0 && (
          <FilterBar
            category={category}
            orientation={orientation}
            onCategoryChange={handleCategoryChange}
            onOrientationChange={handleOrientationChange}
          />
        )}

        {loading && images.length === 0 && <LoadingState />}

        {images.length === 0 && !loading ? (
          <div className="empty-state">
            <h2>Search for an image</h2>
            <p>Find images, view details, and build your collection.</p>
          </div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : (
          <ImageGrid
            query={query}
            images={images}
            likedIds={likedIds}
            onLike={handleLikedImage}
            onSelect={handleSelectImage}
            sentinelRef={sentinelRef}
            loading={loading}
            totalResults={totalResults}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        )}

        <LikedPanel
          images={likedImages}
          onRemove={handleRemoveLiked}
          onSelect={setSelectedImage}
        />
      </main>

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          isLiked={isLiked}
          onLike={handleLikedImage}
          onClose={handleCloseModal}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
          total={images.length}
          currentIndex={currentIndex}
        />
      )}
    </div>
  );
};

export default App;