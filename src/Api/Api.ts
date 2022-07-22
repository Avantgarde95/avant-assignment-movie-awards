import { generateBallotData } from "Api/Data";

const ballotData = generateBallotData();

const api = {
  async getBallotData() {
    return ballotData;
  },
};

export default api;
