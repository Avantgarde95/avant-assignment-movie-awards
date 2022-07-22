import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";

import api from "Api/Api";
import { onWideScreen } from "Styles/Mixins";

interface Category {
  id: string;
  movies: Array<Movie>;

  // Added for displaying.
  title: string;

  // Added for selection.
  selectedMovie: Movie | null;
}

interface Movie {
  title: string;
  photoUrL: string;
  id: string;
}

const Ballot = () => {
  // Key = category id, Value = category.
  const [categoryMap, setCategoryMap] = useState<Record<string, Category>>({});
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const ballotData = await api.getBallotData();

      setCategoryMap(
        Object.fromEntries(
          ballotData.items.map(categoryData => [
            categoryData.id,
            {
              id: categoryData.id,
              movies: categoryData.items,
              title: upperFirstLetter(categoryData.id.split("-").join(" ")),
              selectedMovie: null,
            },
          ])
        )
      );
    })();
  }, [setCategoryMap]);

  function handleClickSelect(categoryID: string, movie: Movie) {
    const category = categoryMap[categoryID];

    setCategoryMap({
      ...categoryMap,
      [categoryID]: {
        ...category,
        selectedMovie: category.selectedMovie?.id === movie.id ? null : movie,
      },
    });
  }

  function handleClickSubmit() {
    setModalOpen(true);
  }

  function handleClickModalClose() {
    setModalOpen(false);
  }

  return (
    <Container>
      <Content>
        {Object.values(categoryMap).map(category => (
          <CategoryView key={category.id}>
            <CategoryTitle>{category.title}</CategoryTitle>
            <MovieTable>
              {category.movies.map(movie => (
                <MovieCard key={movie.id} isSelected={movie.id === category.selectedMovie?.id}>
                  <MovieTitle>{movie.title}</MovieTitle>
                  <MovieImage src={movie.photoUrL} alt={movie.title} />
                  <MovieSelectButton
                    onClick={() => {
                      handleClickSelect(category.id, movie);
                    }}
                  >
                    Select
                  </MovieSelectButton>
                </MovieCard>
              ))}
              {category.movies.map(movie => (
                <FakeCard key={movie.id} />
              ))}
            </MovieTable>
          </CategoryView>
        ))}
      </Content>
      <SubmitButton onClick={handleClickSubmit}>Submit ballot</SubmitButton>
      {isModalOpen && (
        <Backdrop>
          <Modal>
            <ModalContent>
              Submitted!
              <br />
              <br />
              {Object.values(categoryMap).map(category => (
                <div key={category.id}>
                  {category.title}: {category.selectedMovie?.title ?? "None!"}
                </div>
              ))}
            </ModalContent>
            <ModalCloseButton onClick={handleClickModalClose}>Close</ModalCloseButton>
          </Modal>
        </Backdrop>
      )}
    </Container>
  );
};

function upperFirstLetter(value: string) {
  return value[0].toUpperCase() + value.slice(1);
}

const Container = styled.main`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  width: 1080px;
  max-width: 100%;
  height: 100%;
  flex: 1;
  padding: 0 1rem;

  // Prevent overflow.
  min-height: 0;
`;

const Content = styled.div`
  overflow-y: auto;

  width: 100%;
  height: 100%;
  flex: 1;
`;

const CategoryView = styled.div`
  width: 100%;
`;

const CategoryTitle = styled.div`
  box-sizing: border-box;

  width: 100%;
  margin-bottom: 2rem;
  padding: 1rem;
  font-size: 2rem;

  background-color: ${({ theme }) => theme.color.cardBackgroundColor};
`;

const MovieTable = styled.div`
  overflow-x: auto;
  display: flex;
  flex-direction: row;

  width: 100%;
  gap: 1rem;

  ${onWideScreen} {
    overflow-x: visible;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0;
  }
`;

const cardStyle = css`
  flex-shrink: 0;

  width: 20rem;
`;

interface MovieCardProps {
  isSelected: boolean;
}

const MovieCard = styled.div<MovieCardProps>`
  ${cardStyle}

  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 17rem;
  margin-bottom: 2rem;
  padding: 1rem;
  font-size: 1.5rem;

  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.color.selectedCardColor : theme.color.cardBackgroundColor};
`;

// Invisible card for aligning cards left.
const FakeCard = styled.div`
  ${cardStyle}

  display: none;

  ${onWideScreen} {
    display: block;
  }
`;

const MovieTitle = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 3rem;
  margin-bottom: 1rem;
`;

const MovieImage = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;

  margin-bottom: 1rem;
`;

const MovieSelectButton = styled.button`
  cursor: pointer;
  box-sizing: border-box;

  font-family: inherit;
  font-size: inherit;

  padding: 0.5rem 1rem;
  border: 2px solid ${({ theme }) => theme.color.fontColor};
  color: inherit;
  background-color: ${({ theme }) => theme.color.submitBackgroundColor};

  &:hover {
    background-color: ${({ theme }) => theme.color.hoveredSubmitBackgroundColor};
  }
`;

const SubmitButton = styled.button`
  cursor: pointer;
  box-sizing: border-box;

  font-family: inherit;
  font-size: 2rem;

  width: 100%;
  padding: 0.5rem 1rem;
  border: 0;
  border-top: 2px solid ${({ theme }) => theme.color.fontColor};
  color: inherit;
  background-color: ${({ theme }) => theme.color.submitBackgroundColor};

  &:hover {
    background-color: ${({ theme }) => theme.color.hoveredSubmitBackgroundColor};
  }
`;

const fadeInAnimation = keyframes`
  100% {
    opacity: 1;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 1rem;

  background-color: #444444cc;

  opacity: 0;
  animation: ${fadeInAnimation} 0.5s forwards;
`;

const Modal = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  width: 40rem;
  max-width: 100%;
  height: 30rem;
  padding: 1rem;

  background-color: #ffffff;
`;

const ModalContent = styled.div`
  overflow-y: auto;

  width: 100%;
  height: 100%;
  flex: 1;
  font-size: 1.5rem;

  color: #000000;
`;

const ModalCloseButton = styled.button`
  cursor: pointer;
  box-sizing: border-box;

  font-family: inherit;
  font-size: 2rem;

  width: 100%;
  margin-top: auto;
  padding: 0.5rem 1rem;
  border: 0;
  border-top: 2px solid ${({ theme }) => theme.color.fontColor};
  color: ${({ theme }) => theme.color.fontColor};
  background-color: ${({ theme }) => theme.color.submitBackgroundColor};

  &:hover {
    background-color: ${({ theme }) => theme.color.hoveredSubmitBackgroundColor};
  }
`;

export default Ballot;
