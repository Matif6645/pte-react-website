import ListeningPractice from "../ListeningPractice.jsx";

function HighlightIncorrectWords({ onBack }) {
  return (
    <ListeningPractice
      title="Highlight Incorrect Words"
      description="Listen to the recording and click the words in the transcript that are different from the audio."
      onBack={onBack}
    />
  );
}

export default HighlightIncorrectWords;
