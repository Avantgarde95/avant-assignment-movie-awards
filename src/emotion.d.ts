import "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    color: {
      pageBackgroundColor: string;
      fontColor: string;
      hoveredFontColor: string;
      cardBackgroundColor: string;
      submitBackgroundColor: string;
      selectedCardColor: string;
      hoveredCardBackgroundColor: string;
      hoveredSubmitBackgroundColor: string;
    };
  }
}
