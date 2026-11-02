import ListeningPractice from "../ListeningPractice.jsx";

function WriteFromDictation({ onBack }) {
  return (
    <ListeningPractice
      title=" Write From Dictation"
      description="Listen to the sentence and type exactly what you hear."
      onBack={onBack}
    />
  );
}

export default  WriteFromDictation;
