import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

import api from "Api/Api";

interface Category {
  id: string;
  items: Array<Movie>;

  // Added for selection.
  selectedMovieID: string | null;
}

interface Movie {
  title: string;
  photoUrL: string;
  id: string;
}

const Ballot = () => {
  // Key = category id, Value = category.
  const [categoryMap, setCategoryMap] = useState<Record<string, Category>>({});

  useEffect(() => {
    (async () => {
      const ballotData = await api.getBallotData();

      setCategoryMap(
        Object.fromEntries(
          ballotData.items.map(categoryData => [
            categoryData.id,
            {
              ...categoryData,
              selectedMovieID: null,
            },
          ])
        )
      );
    })();
  }, [setCategoryMap]);

  function handleClickSelect(categoryID: string, movieID: string) {
    const category = categoryMap[categoryID];

    setCategoryMap({
      ...categoryMap,
      [categoryID]: {
        ...category,
        selectedMovieID: category.selectedMovieID === movieID ? null : movieID,
      },
    });
  }

  return (
    <Container>
      <Content>
        {Object.values(categoryMap).map(category => (
          <CategoryView key={category.id}>
            <CategoryTitle>{category.id}</CategoryTitle>
            <MovieTable>
              {category.items.map(movie => (
                <MovieCard key={movie.id} isSelected={movie.id === category.selectedMovieID}>
                  <MovieTitle>{movie.title}</MovieTitle>
                  <MovieImage src={movie.photoUrL} alt={movie.title} />
                  <MovieSelectButton
                    onClick={() => {
                      handleClickSelect(category.id, movie.id);
                    }}
                  >
                    Select
                  </MovieSelectButton>
                </MovieCard>
              ))}
              {category.items.map(movie => (
                <FakeCard key={movie.id} />
              ))}
            </MovieTable>
          </CategoryView>
        ))}
      </Content>
      <SubmitButton>Submit ballot</SubmitButton>
    </Container>
  );
};

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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  width: 100%;
`;

const cardStyle = css`
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

export default Ballot;
