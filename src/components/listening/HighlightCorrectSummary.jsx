import ListeningPractice from "../ListeningPractice.jsx";

function HighlightCorrectSummary({ onBack }) {
  return (
    <ListeningPractice
      title="Highlight Correct Summary"
      description="Listen to the recording and choose the paragraoh that best summarizes the audio "
      onBack={onBack}
    />
  );
}

export default HighlightCorrectSummary;