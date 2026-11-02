import ListeningPractice from "../ListeningPractice.jsx";

function ListeningFillBlanks({ onBack }) {
  return (
    <ListeningPractice
      title="Fill in the Blanks"
      description="Listen to the recording and type the missing words in the blanks."
      onBack={onBack}
    />
  );
}

export default ListeningFillBlanks;
