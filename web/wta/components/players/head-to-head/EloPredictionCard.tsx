interface EloPredictionCardProps {
  prediction: EloPrediction;
  player1Name: string;
  player2Name: string;
}

export function EloPredictionCard({
  prediction,
  player1Name,
  player2Name,
}: EloPredictionCardProps) {
  return (
    <div className="mb-6 p-4 rounded-lg shadow-sm">
      <h3 className="font-bold text-2xl mb-2 text-center">
        ELO Prediction: {player1Name} vs. {player2Name}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-center">
        <div className="p-2  rounded shadow">
          <p className="text-sm font-semibold">Overall</p>
          <p className="text-lg font-bold text-green-700">
            {(prediction.elo_win_rate * 100).toFixed(1)}%
          </p>
        </div>
        <div className="p-2  rounded shadow">
          <p className="text-sm font-semibold">Grass</p>
          <p className="text-lg font-bold text-green-700">
            {(prediction.elo_win_rate_grass * 100).toFixed(1)}%
          </p>
        </div>
        <div className="p-2  rounded shadow">
          <p className="text-sm font-semibold">Clay</p>
          <p className="text-lg font-bold text-green-700">
            {(prediction.elo_win_rate_clay * 100).toFixed(1)}%
          </p>
        </div>
        <div className="p-2  rounded shadow">
          <p className="text-sm font-semibold">Hard</p>
          <p className="text-lg font-bold text-green-700">
            {(prediction.elo_win_rate_hard * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
